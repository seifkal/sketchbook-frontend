import PostList from "../../components/PostList";
import type { Post } from "../../components/PostList";
import { api } from "../../api/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface PageData {
    content: Post[];
    last: boolean;
    number: number;
}

const PAGE_SIZE = 5;

export default function HomeFeed() {
    const { ref, inView } = useInView();

    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<PageData>({
        queryKey: ["posts"],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await api.get(`/posts?page=${pageParam}&size=${PAGE_SIZE}`);
            if (!res.data) {
                throw new Error("Failed to fetch posts");
            }
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.last ? undefined : lastPage.number + 1;
        },
        initialPageParam: 0,
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