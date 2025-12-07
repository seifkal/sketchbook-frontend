import { useQuery } from "@tanstack/react-query";
import PostList, { type Post } from "../../components/PostList";
import { api } from "../../api/axios";

export default function ProfileFeed({ id }: { id: string | undefined }) {

    const getPosts = async () => {
        const res = await api.get(`/posts/id/${id}`);

        if (!res.data) {
            throw new Error("Failed to fetch posts");
        }

        return res.data;
    }

    const { data: posts, isLoading, error } = useQuery<Post[]>({
        queryKey: ["posts", "user", id],
        queryFn: getPosts,
        enabled: !!id, // Only run query if id exists
    });

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return <PostList posts={posts ?? []} />
}   