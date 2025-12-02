import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import PostCard from "../components/PostCard";


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

export default function Feed() {

    const getPosts = async () => {
        const res = await api.get("/posts");

        if (!res.data) {
            throw new Error("Failed to fetch posts");
        }

        return res.data;
    }

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
    });

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }


    return (
        <div className="bg-neutral-900 w-full h-full text-white">
            {posts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}