import { useQuery } from "@tanstack/react-query";
import type { Post } from "../../components/PostList";
import { api } from "../../api/axios";
import PostList from "../../components/PostList";

export default function FollowingFeed() {

    const getPosts = async () => {
        const res = await api.get("/posts/following/me");

        if (!res.data) {
            throw new Error("Failed to fetch posts");
        }

        return res.data;
    }

    const { data: posts, isLoading, error } = useQuery<Post[]>({
        queryKey: ["posts"],
        queryFn: getPosts,
    });

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return <PostList posts={posts ?? []} />
}   