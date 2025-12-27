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
            <div className="bg-neutral-900 w-full h-full">
                {[...Array(3)].map((_, i) => (
                    <PostCard key={i} isLoading />
                ))}
            </div>
        );
    }

    return (
        <div className="bg-neutral-900 w-full h-full">
            {posts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}
