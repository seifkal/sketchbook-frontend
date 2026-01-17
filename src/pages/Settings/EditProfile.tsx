import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import AvatarCustomizer, { type AvatarVariant, DEFAULT_COLORS } from "../../components/AvatarCustomizer";

export default function EditProfile() {
    const { user, login } = useUser();
    const navigate = useNavigate();

    // Form state
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");

    // Avatar state
    const [selectedVariant, setSelectedVariant] = useState<AvatarVariant>("beam");
    const [colors, setColors] = useState<string[]>(DEFAULT_COLORS);

    // Sync form state with user data when it loads
    useEffect(() => {
        if (user) {
            setUsername(user.Username || "");
            setEmail(user.email || "");
            setSelectedVariant(user.avatarVariant || "beam");
            setColors(user.avatarColors || DEFAULT_COLORS);
        }
    }, [user]);

    const updateMutation = useMutation({
        mutationFn: async () => {
            const payload: {
                username?: string;
                email?: string;
                oldPassword?: string;
                newPassword?: string;
                avatarVariant?: string;
                avatarColors?: string[];
            } = {};

            // Only include changed fields
            if (username !== user?.Username) payload.username = username;
            if (email !== user?.email) payload.email = email;
            if (newPassword) {
                payload.oldPassword = oldPassword;
                payload.newPassword = newPassword;
            }
            if (selectedVariant !== user?.avatarVariant) payload.avatarVariant = selectedVariant;
            if (JSON.stringify(colors) !== JSON.stringify(user?.avatarColors)) payload.avatarColors = colors;

            const response = await api.put("/users/me", payload);
            return response.data;
        },
        onSuccess: async () => {
            toast.success("Profile updated successfully!");
            try {
                await login();
            } catch {
                navigate("/auth/login");
                return;
            }
            navigate(-1);
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            const message = error.response?.data?.message || "Failed to update profile";
            setError(message);
            toast.error(message);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword && !oldPassword) {
            setError("Please enter your current password to change it.");
            return;
        }

        updateMutation.mutate();
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="flex items-center border-b border-neutral-800 px-4 py-3 gap-4 sticky top-0 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center hover:bg-neutral-800 p-2 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <p className="font-bold text-neutral-50">Edit Profile</p>
            </div>

            {/* Form Content */}
            <div className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
                {/* Avatar Customizer */}
                <AvatarCustomizer
                    name={username || "user"}
                    variant={selectedVariant}
                    colors={colors}
                    onVariantChange={setSelectedVariant}
                    onColorsChange={setColors}
                    size={112}
                />

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Username */}
                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none transition-all duration-200 focus:border-neutral-500 placeholder-neutral-500 text-white"
                            placeholder="Username"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none transition-all duration-200 focus:border-neutral-500 placeholder-neutral-500 text-white"
                            placeholder="Email"
                        />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-neutral-800 pt-6">
                        <p className="text-sm text-neutral-400 mb-4">Change Password</p>

                        {/* Current Password */}
                        <div className="mb-4">
                            <label className="block text-sm text-neutral-400 mb-2">Current Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none transition-all duration-200 focus:border-neutral-500 placeholder-neutral-500 text-white"
                                placeholder="Current password"
                            />
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none transition-all duration-200 focus:border-neutral-500 placeholder-neutral-500 text-white"
                                placeholder="New password"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${updateMutation.isPending
                            ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                            : 'bg-white text-neutral-900 hover:bg-neutral-200 cursor-pointer'
                            }`}
                    >
                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
