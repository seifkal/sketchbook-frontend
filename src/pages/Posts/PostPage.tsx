import { useParams, Link, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/axios";
import Avatar from "boring-avatars";
import ReactTimeAgo from "react-time-ago";
import { Heart, MessageCircle, ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import type { Post, AvatarVariant } from "../../components/PostList";

interface Comment {
    id: string;
    userId: string;
    username: string;
    postId: string;
    avatarVariant: AvatarVariant;
    avatarColors: string[];
    content: string;
    createdAt: string;
}

export default function PostPage() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState("");
    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
    const commentFormRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Check if we should scroll to comments (if user clicked on comment icon in PostCard)
    const shouldScrollToComments = location.state?.scrollToComments as boolean | undefined;

    const { data: post, isLoading: postLoading, error: postError } = useQuery({
        queryKey: ["post", id],
        queryFn: async () => {
            const res = await api.get(`/posts/${id}`);
            return res.data as Post;
        },
        enabled: !!id,
    });

    // Local state for optimistic like updates
    const [toggleLike, setToggleLike] = useState(post?.liked ?? false);
    const [likeCount, setLikeCount] = useState(post?.likeCount ?? 0);

    // Update local state when post data changes
    useEffect(() => {
        if (post) {
            setToggleLike(post.liked);
            setLikeCount(post.likeCount);
        }
    }, [post]);

    // Auto-scroll to comments if navigated from comment icon
    useEffect(() => {
        if (shouldScrollToComments && commentFormRef.current && textareaRef.current) {
            commentFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Focus the textarea after a short delay to ensure scroll completes
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 500);
        }
    }, [shouldScrollToComments]);

    // Fetch comments
    const { data: comments, isLoading: commentsLoading } = useQuery({
        queryKey: ["comments", id],
        queryFn: async () => {
            const res = await api.get(`/posts/${id}/comments`);
            return res.data as Comment[];
        },
        enabled: !!id,
    });

    // Like mutation
    const likeMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/posts/${id}/like`);
            return res.data;
        },
        onSuccess: () => {
            setToggleLike(!toggleLike);
            setLikeCount(toggleLike ? likeCount - 1 : likeCount + 1);
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["post", id] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    // Comment mutation
    const commentMutation = useMutation({
        mutationFn: async (content: string) => {
            const res = await api.post(`/posts/${id}/comment`, { content });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", id] });
            queryClient.invalidateQueries({ queryKey: ["post", id] });
            setCommentText("");
        },
        onError: () => {
            toast.error("Failed to post comment");
        },
    });

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            commentMutation.mutate(commentText);
        }
    };

    if (postLoading && !post) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-neutral-500">Loading post...</div>
            </div>
        );
    }

    if (postError || (!postLoading && !post)) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500">Failed to load post</div>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <div className="bg-neutral-900 min-h-screen pb-20">
            <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-4 flex items-center gap-4 z-10">
                <Link to="/" className="hover:bg-neutral-800 p-2 rounded-full transition-colors">
                    <ArrowLeft className="text-neutral-400" size={20} />
                </Link>
                <h1 className="text-lg font-semibold">Post</h1>
            </div>

            {/* Post Content */}
            <div className="max-w-2xl mx-auto p-6">
                {/* Author Info */}
                <div className="flex w-full gap-2">
                    <Link to={`/users/${post.authorId}`} className="flex gap-2 items-center">
                        <Avatar
                            name={post.authorUsername}
                            colors={post.authorAvatarColors}
                            variant={post.authorAvatarVariant}
                            size={40}
                        />
                        <div className="flex justify-center items-center">{post.authorUsername}</div>
                    </Link>
                    <ReactTimeAgo date={new Date(post.createdAt)} className="flex justify-center items-center text-neutral-500" />
                </div>

                {/* Post Title */}
                <div className="w-full flex py-4">{post.title}</div>

                {/* Post Image */}
                <img
                    src={IMAGE_BASE_URL + post.imageUrl}
                    alt={post.title}
                    className="w-full image-render-pixel rounded-3xl mb-4"
                />

                {/* Post Buttons */}
                <div className="flex items-center gap-6 mb-8 border-b border-neutral-800 pb-4">
                    <button
                        onClick={() => likeMutation.mutate()}
                        className="flex items-center gap-2 hover:text-red-500 transition-colors"
                        disabled={likeMutation.isPending}
                    >
                        <Heart
                            className={`${toggleLike ? "text-red-500 fill-red-500" : "text-neutral-500"}`}
                            size={24}
                        />
                        <span className="text-neutral-400">{likeCount}</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <MessageCircle className="text-neutral-500" size={24} />
                        <span className="text-neutral-400">{post.commentCount}</span>
                    </div>
                </div>

                {/* Comment Form */}
                <div ref={commentFormRef} className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Add a comment</h3>
                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                        <textarea
                            ref={textareaRef}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write your comment..."
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-4 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={4}
                            disabled={commentMutation.isPending}
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim() || commentMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:text-neutral-500 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                        >
                            {commentMutation.isPending ? "Posting..." : "Post Comment"}
                        </button>
                    </form>
                </div>

                {/* Comments List */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">
                        Comments {comments && comments.length > 0 && `(${comments.length})`}
                    </h3>
                    {commentsLoading ? (
                        <div className="text-neutral-500 text-center py-8">Loading comments...</div>
                    ) : comments && comments.length > 0 ? (
                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <div key={comment.id} className="border-b border-neutral-800 pb-4">
                                    <div className="flex items-start gap-3">
                                        <Link to={`/users/${comment.userId}`}>
                                            <Avatar
                                                name={comment.username}
                                                colors={comment.avatarColors}
                                                variant={comment.avatarVariant}
                                                size={40}
                                            />
                                        </Link>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Link
                                                    to={`/users/${comment.userId}`}
                                                    className="font-semibold hover:underline"
                                                >
                                                    {comment.username}
                                                </Link>
                                                <ReactTimeAgo
                                                    date={new Date(comment.createdAt)}
                                                    className="text-sm text-neutral-500"
                                                />
                                            </div>
                                            <p className="text-neutral-300">{comment.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-neutral-500 text-center py-8">
                            No comments yet. Be the first to comment!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
