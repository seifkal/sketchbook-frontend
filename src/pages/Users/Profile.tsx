import { useContext, useState, useEffect, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../api/axios";
import ProfileFeed from "../Feed/ProfileFeed";
import Avatar from "boring-avatars";
import LikesFeed from "../Feed/LikesFeed";

interface User {
    id: string;
    Username: string;
    avatarVariant: string;
    avatarColors: string[];
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
    description: string;
    createdAt: string;
}

export default function Profile() {
    const { id } = useParams<{ id: string }>();
    const userContext = useContext(UserContext);
    const navigate = useNavigate();
    const [isProfileFeed, setIsProfileFeed] = useState(true);
    const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
    const [followerCount, setFollowerCount] = useState<number>(0);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // extract jwt claims 
    const userClaims = userContext?.user;
    const isContextLoading = userContext?.isLoading;

    const getUser = async () => {
        const res = await api.get(`/users/${id}`);

        if (!res.data) {
            throw new Error("Failed to fetch user");
        }

        return res.data;
    };

    const { data: user, isLoading: isProfileLoading, error } = useQuery<User>({
        queryKey: ["user", id],
        queryFn: getUser,
        enabled: !!id, // Only run query if id exists
    });

    // Sync local state with server data
    useEffect(() => {
        if (user?.isFollowing !== undefined) {
            setIsFollowing(user.isFollowing);
        }
        if (user?.followersCount !== undefined) {
            setFollowerCount(user.followersCount);
        }
    }, [user?.isFollowing, user?.followersCount]);

    const followMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/follow/${id}`);
            return res.data;
        },
    });

    const unfollowMutation = useMutation({
        mutationFn: async () => {
            const res = await api.delete(`/follow/${id}`);
            return res.data;
        },
    });

    const handleFollow = () => {
        // Toggle UI immediately
        const newState = !isFollowing;
        setIsFollowing(newState);
        setFollowerCount(prev => newState ? prev + 1 : prev - 1);

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

    if (isContextLoading || isProfileLoading) {
        return <div>Loading...</div>;
    }

    if (!userClaims) {
        return <Navigate to="/auth/login" />;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // compare logged in user id with url param id
    const isOwnProfile = id === String(userClaims.userId);
    console.log(isOwnProfile);
    console.log(user);
    // Format the join date
    const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    console.log("Full API response:", user);

    console.log("user.isFollowing", user.isFollowing);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="flex items-center border-b border-neutral-800 px-4 py-3 gap-4 sticky top-0 bg-neutral-900">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center hover:bg-neutral-800 p-2 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col">
                    <p className="font-bold text-neutral-50">Profile</p>
                </div>
            </div>

            {/* Profile Info Section */}
            <div className="border-b border-neutral-800 px-4 py-4">
                {/* Avatar & Action Button Row */}
                <div className="flex justify-between items-start mb-3">
                    <Avatar name={user.Username} colors={user.avatarColors} variant={user.avatarVariant} size={180} />

                    {isOwnProfile ? (
                        <button className="px-4 py-1.5 rounded-full border border-neutral-600 text-neutral-200 text-sm font-semibold hover:bg-neutral-800 transition-colors cursor-pointer">
                            Edit profile
                        </button>
                    ) : (
                        <button
                            onClick={handleFollow}
                            className={`w-28 py-1.5 rounded-full text-sm font-bold transition-colors cursor-pointer ${isFollowing
                                ? 'border border-neutral-600 text-neutral-200 hover:bg-neutral-800'
                                : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-300'
                                }`}
                        >
                            {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                    )}
                </div>

                {/* Username */}
                <h1 className="font-bold text-neutral-50 text-xl">
                    @{user.Username}
                </h1>

                <p className="text-neutral-300 text-sm mt-3 whitespace-pre-wrap">
                    {user.description ? user.description : "No bio yet..."}
                </p>

                <p className="text-neutral-500 text-sm mt-3">
                    Joined {joinDate}
                </p>

                {/* Stats Row */}
                <div className="flex items-center gap-4 mt-3">
                    <button className="flex items-center gap-1 hover:underline text-sm">
                        <span className="font-bold text-neutral-50">{user.followingCount}</span>
                        <span className="text-neutral-500">Following</span>
                    </button>
                    <button className="flex items-center gap-1 hover:underline text-sm">
                        <span className="font-bold text-neutral-50">{followerCount}</span>
                        <span className="text-neutral-500">Followers</span>
                    </button>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex border-b border-neutral-800">
                <button onClick={() => setIsProfileFeed(true)} className={`flex-1 py-4 text-sm font-semibold text-neutral-50 border-b-2 ${isProfileFeed ? 'border-violet-500' : 'border-transparent'} hover:bg-neutral-900 transition-colors cursor-pointer`}>
                    Posts
                </button>
                <button onClick={() => setIsProfileFeed(false)} className={`flex-1 py-4 text-sm font-semibold text-neutral-50 border-b-2 ${isProfileFeed ? 'border-transparent' : 'border-violet-500'} hover:bg-neutral-900 transition-colors cursor-pointer`}>
                    Likes
                </button>
            </div>

            {/* Feed */}
            {isProfileFeed ? <ProfileFeed id={id} /> : <LikesFeed id={id} />}
        </div>
    );
}   