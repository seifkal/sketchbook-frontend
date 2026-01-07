import PostCard from "./PostCard";
export type AvatarVariant = "marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus" | undefined;

export interface Post {
    id: string;
    title: string;
    imageUrl: string;
    authorId: string;
    authorUsername: string;
    createdAt: string;
    authorAvatarVariant: AvatarVariant;
    authorAvatarColors: string[];
    likeCount: number;
    liked: boolean;
    commentCount: number;
}

interface PostListProps {
    posts: Post[];
    isLoading?: boolean;
}

export default function PostList({ posts, isLoading = false }: PostListProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {[...Array(8)].map((_, i) => (
                    <PostCard key={i} isLoading />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {posts.map((post: Post, index: number) => (
                <PostCard key={post.id} post={post} index={index} />
            ))}
        </div>
    );
}
