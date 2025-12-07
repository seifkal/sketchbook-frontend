import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/axios";
import type { Post } from "../../components/PostList";
import PostList from "../../components/PostList";


export default function LikesFeed({ id }: { id: string | undefined }) {
    const getPosts = async () => {
        const res = await api.get(`/posts/likes/${id}`);

        if (!res.data) {
            throw new Error("Failed to fetch posts");
        }

        return res.data;
    }

    const { data: posts, isLoading, error } = useQuery<Post[]>({
        queryKey: ["posts", id],
        queryFn: getPosts,
        enabled: !!id,
    });

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return <PostList posts={posts ?? []} />
}