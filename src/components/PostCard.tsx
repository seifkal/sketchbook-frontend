import Avatar from "boring-avatars";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";
import { Heart, MessageCircle } from "lucide-react"
import { useState } from "react";
import { api } from "../api/axios";
import { useMutation } from "@tanstack/react-query";

interface Post {
    id: string;
    title: string;
    imageUrl: string;
    authorId: string;
    authorUsername: string;
    createdAt: string;
    likeCount: number;
    liked: boolean;
    commentCount: number;
}

TimeAgo.addLocale(en)

export default function PostCard({ post }: { post: Post }) {

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
        }
    })

    return (
        <button className="flex justify-center items-center w-full hover:bg-neutral-800 cursor-pointer flex-col p-6">
            <div className="flex w-full gap-2">
                <Avatar name="Mary Edwards" colors={["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"]} variant="beam" size={40} />
                <div className="flex justify-center items-center">{post.authorUsername}</div>
                <ReactTimeAgo date={new Date(post.createdAt)} className="flex justify-center items-center text-neutral-500" />
            </div>
            <div className="w-full flex py-4">{post.title}</div>
            <img src={IMAGE_BASE_URL + post.imageUrl} alt={post.title} className="w-full image-render-pixel rounded-3xl" />
            <div className="flex flex-row gap-4 w-full p-6">
                <div className="flex flex-row">
                    <Heart className={`mr-2 text-neutral-300 ${toggleLike ? "text-red-500 fill-red-500" : ""}`} onClick={() => likeMutation.mutate()}></Heart>
                    <p className="text-neutral-300">{likeCount}</p>
                </div>
                <div className="flex flex-row">
                    <MessageCircle className="mr-2 text-neutral-300"></MessageCircle>
                    <p className="text-neutral-300">{post.commentCount}</p>
                </div>
            </div>
        </button>
    )
}