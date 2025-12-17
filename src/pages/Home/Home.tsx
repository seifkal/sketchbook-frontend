import { useState } from "react";
import RecentFeed from "../Feed/RecentFeed";
import FollowingFeed from "../Feed/FollowingFeed";

export default function Home() {

    const [feedType, setFeedType] = useState<"recent" | "following">("recent");

    return (
        <div>
            <div className="flex justify-center gap-4 p-4 border-b border-neutral-800">
                <button
                    onClick={() => setFeedType("recent")}
                    className={`cursor-pointer font-semibold transition-colors ${feedType === "recent"
                        ? "text-neutral-50 border-b-2 border-purple-500 pb-1"
                        : "text-neutral-400 hover:text-neutral-200"
                        }`}
                >
                    Recent
                </button>
                <button
                    onClick={() => setFeedType("following")}
                    className={`cursor-pointer font-semibold transition-colors ${feedType === "following"
                        ? "text-neutral-50 border-b-2 border-purple-500 pb-1"
                        : "text-neutral-400 hover:text-neutral-200"
                        }`}
                >
                    Following
                </button>
            </div>
            {feedType === "recent" ? <RecentFeed /> : <FollowingFeed />}
        </div>
    );
}