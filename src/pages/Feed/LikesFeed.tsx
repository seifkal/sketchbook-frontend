import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../api/axios";
import type { Post } from "../../components/PostList";
import PostList from "../../components/PostList";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface PageData {
    content: Post[];
    last: boolean;
    number: number;
}

const PAGE_SIZE = 3;

export default function LikesFeed({ id }: { id: string | undefined }) {
    const { ref, inView } = useInView();

    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<PageData>({
        queryKey: ["posts", "likes", id],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await api.get(`/posts/likes/${id}?page=${pageParam}&size=${PAGE_SIZE}`);
            if (!res.data) {
                throw new Error("Failed to fetch posts");
            }
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.last ? undefined : lastPage.number + 1;
        },
        initialPageParam: 0,
        enabled: !!id,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const posts = data?.pages.flatMap((page) => page.content) ?? [];

    return (
        <>
            <PostList posts={posts} isLoading={isLoading} />
            <div ref={ref} className="h-10 flex items-center justify-center">
                {isFetchingNextPage && (
                    <div className="text-neutral-500 text-sm">Loading more...</div>
                )}
            </div>
        </>
    );
}