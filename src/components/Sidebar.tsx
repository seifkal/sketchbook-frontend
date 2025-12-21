import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import UserCard, { type SidebarUser } from "./UserCard";

export default function Sidebar() {
    // Fetch recent users
    const { data: recentUsers, isLoading: isRecentLoading, error: recentError } = useQuery<SidebarUser[]>({
        queryKey: ["users", "recent"],
        queryFn: async () => {
            const res = await api.get("/users?sort=recent");
            if (!res.data?.content) {
                throw new Error("Failed to fetch recent users");
            }
            return res.data.content;
        },
    });

    // Fetch popular users (most followed)
    const { data: popularUsers, isLoading: isPopularLoading, error: popularError } = useQuery<SidebarUser[]>({
        queryKey: ["users", "popular"],
        queryFn: async () => {
            const res = await api.get("/users?sort=popular");
            if (!res.data?.content) {
                throw new Error("Failed to fetch popular users");
            }
            return res.data.content;
        },
    });

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Latest Users Block */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <h3 className="text-lg font-bold text-neutral-100 mb-4 border-b border-neutral-800 pb-2">
                    Latest users
                </h3>
                <div className="flex flex-col gap-1">
                    {isRecentLoading ? (
                        <div className="text-neutral-500 text-sm py-2">Loading...</div>
                    ) : recentError ? (
                        <div className="text-red-400 text-sm py-2">Failed to load users</div>
                    ) : recentUsers && recentUsers.length > 0 ? (
                        recentUsers.slice(0, 5).map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))
                    ) : (
                        <div className="text-neutral-500 text-sm py-2">No users found</div>
                    )}
                </div>
            </div>

            {/* Most Followed Users Block */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <h3 className="text-lg font-bold text-neutral-100 mb-4 border-b border-neutral-800 pb-2">
                    Most followed
                </h3>
                <div className="flex flex-col gap-1">
                    {isPopularLoading ? (
                        <div className="text-neutral-500 text-sm py-2">Loading...</div>
                    ) : popularError ? (
                        <div className="text-red-400 text-sm py-2">Failed to load users</div>
                    ) : popularUsers && popularUsers.length > 0 ? (
                        popularUsers.slice(0, 5).map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))
                    ) : (
                        <div className="text-neutral-500 text-sm py-2">No users found</div>
                    )}
                </div>
            </div>
        </div>
    );
}