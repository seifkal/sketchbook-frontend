import Avatar from "boring-avatars";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";
import { Heart, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { Link, useNavigate } from "react-router-dom";

TimeAgo.addLocale(en)

export default function PostCard({ post }: { post: Post }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [toggleLike, setToggleLike] = useState(post.liked);
    const [likeCount, setLikeCount] = useState(post.likeCount);

    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

    const likeMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/posts/${post.id}/like`);
            return res.data;
        },
        onSuccess: () => {
            setToggleLike(!toggleLike);
            setLikeCount(toggleLike ? likeCount - 1 : likeCount + 1);
            // Invalidate all feed queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
    })

    // Update local state when post prop changes (after refetch)
    useEffect(() => {
        setToggleLike(post.liked);
        setLikeCount(post.likeCount);
    }, [post.liked, post.likeCount]);

    const handleCardClick = () => {
        navigate(`/posts/${post.id}`);
    };

    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        likeMutation.mutate();
    };

    const handleCommentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/posts/${post.id}`, { state: { scrollToComments: true } });
    };

    return (
        <div onClick={handleCardClick} className="flex justify-center items-center w-full hover:bg-neutral-800 cursor-pointer flex-col p-6">
            <div className="flex w-full gap-2">
                <Link to={`/users/${post.authorId}`} onClick={(e) => e.stopPropagation()} className="flex gap-2 items-center">
                    <Avatar name={post.authorUsername} colors={post.authorAvatarColors} variant={post.authorAvatarVariant} size={40} />
                    <div className="flex justify-center items-center">{post.authorUsername}</div>
                </Link>
                <ReactTimeAgo date={new Date(post.createdAt)} className="flex justify-center items-center text-neutral-500" />
            </div>
            <div className="w-full flex py-4">{post.title}</div>
            <img src={IMAGE_BASE_URL + post.imageUrl} alt={post.title} className="w-full image-render-pixel rounded-3xl" />
            <div className="flex flex-row gap-4 w-full p-6">
                <div className="flex flex-row">
                    <Heart className={`mr-2 text-neutral-500 ${toggleLike ? "text-red-500 fill-red-500" : ""}`} onClick={handleLikeClick}></Heart>
                    <p className="text-neutral-500">{likeCount}</p>
                </div>
                <div className="flex flex-row">
                    <MessageCircle className="mr-2 text-neutral-500" onClick={handleCommentClick}></MessageCircle>
                    <p className="text-neutral-500">{post.commentCount}</p>
                </div>
            </div>
        </div>
    )
}