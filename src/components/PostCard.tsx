import Avatar from "boring-avatars";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { Link, useNavigate } from "react-router-dom";

TimeAgo.addLocale(en);

interface PostCardProps {
    post?: Post;
    isLoading?: boolean;
    index?: number;
}

// Skeleton loader
function PostCardSkeleton() {
    return (
        <div className="bg-surface-card border-2 border-surface-border rounded overflow-hidden animate-pulse">
            <div className="aspect-square bg-bg-secondary" />
            <div className="p-3 space-y-2">
                <div className="h-3 w-3/4 bg-bg-secondary rounded" />
                <div className="h-3 w-1/2 bg-bg-secondary rounded" />
            </div>
        </div>
    );
}

export default function PostCard({ post, isLoading = false, index = 0 }: PostCardProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [toggleLike, setToggleLike] = useState(post?.liked ?? false);
    const [likeCount, setLikeCount] = useState(post?.likeCount ?? 0);
    const [isHovered, setIsHovered] = useState(false);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);

    const likeMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/posts/${post?.id}/like`);
            return res.data;
        },
        onSuccess: () => {
            setToggleLike(!toggleLike);
            setLikeCount(toggleLike ? likeCount - 1 : likeCount + 1);
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
    });

    useEffect(() => {
        if (post) {
            setToggleLike(post.liked);
            setLikeCount(post.likeCount);
        }
    }, [post]);

    const handleCardClick = () => {
        if (!isLoading && post) {
            navigate(`/posts/${post.id}`);
        }
    };

    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isLoading && !likeMutation.isPending) {
            setIsLikeAnimating(true);
            setTimeout(() => setIsLikeAnimating(false), 400);
            likeMutation.mutate();
        }
    };

    if (isLoading) {
        return <PostCardSkeleton />;
    }

    if (!post) return null;

    // Staggered animation delay (max 400ms to prevent long waits)
    const animationDelay = Math.min(index * 50, 400);

    return (
        <div
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-surface-card border-2 border-surface-border rounded overflow-hidden cursor-pointer transition-all duration-200 hover:border-neutral-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 opacity-0 animate-post-fade-in"
            style={{ animationDelay: `${animationDelay}ms` }}
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-bg-secondary">
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    className={`w-full h-full object-cover image-render-pixel transition-transform duration-300 ${isHovered ? "scale-105" : "scale-100"}`}
                />

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
                    <h3 className="text-text-primary font-semibold text-sm line-clamp-2 mb-2">
                        {post.title}
                    </h3>
                    <Link
                        to={`/users/${post.authorId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                    </Link>
                </div>

                {/* Like Badge */}
                <button
                    onClick={handleLikeClick}
                    className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur-sm transition-all duration-200 ${toggleLike ? "text-neon-pink" : "text-text-secondary hover:text-text-primary"} ${isLikeAnimating ? "animate-heart-pulse" : ""}`}
                >
                    <Heart size={14} className={toggleLike ? "fill-current" : ""} />
                    <span className="text-xs font-medium">{likeCount}</span>
                </button>
            </div>

            {/* Bottom Bar */}
            <div className="px-3 py-2.5 flex items-center justify-between bg-surface-card">
                <div className="flex items-center gap-2 min-w-0">
                    <Avatar
                        name={post.authorUsername}
                        colors={post.authorAvatarColors}
                        variant={post.authorAvatarVariant}
                        size={20}
                    />
                    <span className="text-text-muted text-xs truncate">@{post.authorUsername}</span>
                </div>
                <ReactTimeAgo
                    date={new Date(post.createdAt)}
                    className="text-text-muted text-xs flex-shrink-0"
                />
            </div>
        </div>
    );
}