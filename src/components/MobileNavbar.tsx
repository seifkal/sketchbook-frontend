import { Link, useLocation } from "react-router-dom";
import { House, Pencil, Heart, User } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function MobileNavbar() {
    const location = useLocation();
    const { user } = useUser();

    const mobileItems = [
        { to: "/", icon: House, label: "Home" },
        { to: "/create", icon: Pencil, label: "Create" },
        { to: "/likes", icon: Heart, label: "Likes" },
        { to: user?.id ? `/users/${user.id}` : "/auth/login", icon: User, label: "Profile" },
    ];

    return (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-primary/95 backdrop-blur border-t border-neutral-700 flex justify-around px-2 py-2 pb-safe">
            {mobileItems.map(({ to, icon: Icon, label }) => {
                const isActive = location.pathname === to;
                return (
                    <Link
                        key={to}
                        to={to}
                        className={`p-3 rounded-lg transition-colors ${isActive ? "text-white" : "text-text-muted"}`}
                        aria-label={label}
                    >
                        <Icon size={22} />
                    </Link>
                );
            })}
        </nav>
    );
}
