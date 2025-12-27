import PostList from "../../components/PostList";
import type { Post } from "../../components/PostList";
import { api } from "../../api/axios";
import { useQuery } from "@tanstack/react-query";

export default function HomeFeed() {

    const getPosts = async () => {
        const res = await api.get("/posts");

        if (!res.data) {
            throw new Error("Failed to fetch posts");
        }

        return res.data;
    }

    const { data: posts, isLoading, error } = useQuery<Post[]>({
        queryKey: ["posts"],
        queryFn: getPosts,
    });

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return <PostList posts={posts ?? []} isLoading={isLoading} />
}