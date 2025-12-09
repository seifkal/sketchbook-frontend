import PostCard from "./PostCard";
type AvatarVariant = "marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus" | undefined;

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

export default function PostList({ posts }: { posts: Post[] }) {
    console.log(posts);
    return (
        <div className="bg-neutral-900 w-full h-full">
            {posts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}
