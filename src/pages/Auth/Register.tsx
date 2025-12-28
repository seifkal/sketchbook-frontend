import { useMutation } from "@tanstack/react-query";
import Avatar from "boring-avatars";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import { AVATAR_VARIANTS, type AvatarVariant, DEFAULT_COLORS, generateRandomPalette } from "../../components/AvatarCustomizer";

/*
*
* profile pictures are generated using the boring avatars package
* it generates unique avatars based on the name of the user
* 
*/


export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<AvatarVariant>("beam");
    const [colors, setColors] = useState<string[]>(DEFAULT_COLORS);
    const [avatarName, setAvatarName] = useState("user"); // debounced name for avatar
    const menuRef = useRef<HTMLDivElement>(null);
    const { login } = useUser();
    const navigate = useNavigate();
    const hasToasted = useRef(false);
    const initialUsername = useRef(username);

    const registerMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post("/auth/register", {
                username,
                email,
                password,
                confirmPassword,
                avatarVariant: selectedVariant,
                avatarColors: colors,
            });
            return response.data;
        },
        onSuccess: async () => {
            // Fetch user data after successful registration (cookie is now set)
            await login();
            navigate("/");
        },
    });

    // debounce avatar name update (500ms after user stops typing)
    useEffect(() => {
        const timer = setTimeout(() => {
            setAvatarName(username || "user");
            if (!hasToasted.current && username !== initialUsername.current) {
                toast.info("Your avatar is generated from your username!", { position: "top-right", type: "info" });
                hasToasted.current = true;
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [username]);


    // close menu when clicking outside of menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowAvatarMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        registerMutation.mutate();
    };

    return (
        <div className="flex flex-col h-full w-full justify-center items-center relative overflow-hidden bg-neutral-100">
            <div className="w-full max-w-md p-8 z-10 mx-4">
                <div className="text-center mb-10">
                    <img src="/logo-text-dark.svg" alt="Sketchbook" className="h-8 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-gray-500">Join the creative community</p>
                </div>

                {/* Avatar Preview with Click Menu */}
                <div className="flex justify-center mb-8 relative" ref={menuRef}>
                    {/* Avatar with tooltip wrapper */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                            className="w-24 h-24 rounded-full overflow-hidden border-2 border-neutral-700 hover:border-neutral-500 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                        >
                            <div className="transition-all duration-300 ease-out" key={avatarName}>
                                <Avatar
                                    size={96}
                                    name={avatarName}
                                    variant={selectedVariant}
                                    colors={colors}
                                />
                            </div>
                        </button>

                        {/* Click to customize hint */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-neutral-500 whitespace-nowrap">
                            Click to customize
                        </div>
                    </div>

                    {/* Avatar Customization Menu */}
                    {showAvatarMenu && (
                        <div className="absolute top-full mt-8 left-1/2 -translate-x-1/2 w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-2xl p-5 shadow-2xl z-50">
                            {/* Variant Selection - Grid Style */}
                            <div className="mb-5">
                                <p className="text-xs text-neutral-500 mb-3 uppercase tracking-wider font-medium">Style</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {AVATAR_VARIANTS.map((variant) => (
                                        <button
                                            key={variant}
                                            type="button"
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${selectedVariant === variant
                                                ? 'bg-neutral-700 ring-2 ring-white/20'
                                                : 'bg-neutral-800 hover:bg-neutral-750 border border-neutral-700'
                                                }`}
                                        >
                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                <Avatar
                                                    size={40}
                                                    name={avatarName}
                                                    variant={variant}
                                                    colors={colors}
                                                />
                                            </div>
                                            <span className={`text-xs font-medium capitalize ${selectedVariant === variant ? 'text-white' : 'text-neutral-400'}`}>
                                                {variant}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Picker Section */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Colors</p>
                                    <button
                                        type="button"
                                        onClick={() => setColors(generateRandomPalette())}
                                        className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-neutral-800"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Random
                                    </button>
                                </div>
                                <div className="flex gap-2 justify-between">
                                    {colors.map((color, index) => (
                                        <label
                                            key={index}
                                            className="relative w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-neutral-700 hover:border-neutral-500 transition-all hover:scale-110"
                                            style={{ backgroundColor: color }}
                                        >
                                            <input
                                                type="color"
                                                value={color}
                                                onChange={(e) => {
                                                    const newColors = [...colors];
                                                    newColors[index] = e.target.value;
                                                    setColors(newColors);
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <form className="space-y-5 py-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-5 py-3.5 bg-neutral-700 border border-gray-200 rounded-xl outline-none transition-all duration-200 placeholder-neutral-450 text-white caret-white"
                                placeholder="Username"
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 bg-neutral-700 border border-gray-200 rounded-xl outline-none transition-all duration-200 placeholder-neutral-450 text-white caret-white"
                                placeholder="Email address"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 bg-neutral-700 border border-gray-200 rounded-xl outline-none transition-all duration-200 placeholder-neutral-450 text-white caret-white"
                                placeholder="Password"
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-5 py-3.5 bg-neutral-700 border border-gray-200 rounded-xl outline-none transition-all duration-200 placeholder-neutral-450 text-white caret-white"
                                placeholder="Confirm password"
                                autoComplete="new-password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 bg-black border-1 text-white hover:bg-neutral-100 hover:text-black hover:border-black hover:shadow-lg hover:shadow-violet-500/25 active:scale-[0.98] cursor-pointer"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/auth/login" className="text-violet-500 hover:text-violet-400 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}