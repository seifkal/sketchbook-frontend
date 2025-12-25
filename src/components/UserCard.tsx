import { useState, useRef, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";
import Avatar from "boring-avatars";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export interface SidebarUser {
    id: string;
    Username: string;
    avatarVariant: string;
    avatarColors: string[];
    isFollowing: boolean;
}

interface UserCardProps {
    user: SidebarUser;
}

export default function UserCard({ user }: UserCardProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const userContext = useContext(UserContext);
    const currentUserId = userContext?.user?.id;

    const [isFollowing, setIsFollowing] = useState(user.isFollowing);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isOwnProfile = String(user.id) === String(currentUserId);

    const followMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/follow/${user.id}`);
            return res.data;
        },
        onSuccess: () => {
            // Invalidate user queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    const unfollowMutation = useMutation({
        mutationFn: async () => {
            const res = await api.delete(`/follow/${user.id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    const handleFollow = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation when clicking the button

        // Toggle UI immediately (optimistic update)
        const newState = !isFollowing;
        setIsFollowing(newState);

        // Clear existing debounce timer
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Debounce API call to handle spam clicking
        debounceRef.current = setTimeout(() => {
            if (newState) {
                followMutation.mutate();
            } else {
                unfollowMutation.mutate();
            }
        }, 300);
    };

    const handleCardClick = () => {
        navigate(`/users/${user.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
        >
            <Avatar
                name={user.Username}
                colors={user.avatarColors}
                variant={user.avatarVariant as "marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus"}
                size={40}
            />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-100 truncate">
                    @{user.Username}
                </p>
            </div>
            {!isOwnProfile ? (
                <button
                    onClick={handleFollow}
                    className={`w-20 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${isFollowing
                        ? "border border-neutral-600 text-neutral-200 hover:bg-neutral-700"
                        : "bg-neutral-100 text-neutral-900 hover:bg-neutral-300"
                        }`}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </button>
            ) : (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400">
                    You
                </span>
            )}
        </div>
    );
}
