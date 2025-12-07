import PostCard from "./PostCard";


export interface Post {
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

export default function PostList({ posts }: { posts: Post[] }) {

    return (
        <div className="bg-neutral-900 w-full h-full">
            {posts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}
