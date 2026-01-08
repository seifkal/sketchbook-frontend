import { useState } from "react";
import RecentFeed from "../Feed/RecentFeed";
import FollowingFeed from "../Feed/FollowingFeed";

export default function Home() {
    const [feedType, setFeedType] = useState<"recent" | "following">("recent");

    return (
        <div>
            {/* Tab Switcher - Centered */}
            <div className="flex justify-center gap-4 p-4 border-b border-neutral-700">
                <button
                    onClick={() => setFeedType("recent")}
                    className={`cursor-pointer font-semibold transition-colors ${feedType === "recent"
                        ? "text-text-primary border-b-2 border-orange-600 pb-1"
                        : "text-text-secondary hover:text-text-primary"
                        }`}
                >
                    Recent
                </button>
                <button
                    onClick={() => setFeedType("following")}
                    className={`cursor-pointer font-semibold transition-colors ${feedType === "following"
                        ? "text-text-primary border-b-2 border-orange-600 pb-1"
                        : "text-text-secondary hover:text-text-primary"
                        }`}
                >
                    Following
                </button>
            </div>

            {/* Feed Content */}
            <div className="pt-4">
                {feedType === "recent" ? <RecentFeed /> : <FollowingFeed />}
            </div>
        </div>
    );
}