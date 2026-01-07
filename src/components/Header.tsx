import { Link, useLocation } from "react-router-dom";
import { House, Pencil, Heart, Settings, MessageSquare } from "lucide-react";
import { useUser } from "../context/UserContext";
import Avatar from "boring-avatars";

const navItems = [
    { to: "/", icon: House, label: "Home" },
    { to: "/create", icon: Pencil, label: "Create" },
    { to: "/likes", icon: Heart, label: "Likes" },
    { to: "/messages", icon: MessageSquare, label: "Messages" },
    { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Header() {
    const location = useLocation();
    const { user } = useUser();

    return (
        <header className="sticky top-0 z-40 bg-bg-primary border-b border-neutral-700">
            <div className="px-6 h-16 flex items-center">
                {/* Logo */}
                <div className="flex-1">
                    <Link to="/" className="flex items-center w-fit">
                        <img src="/logo-text.svg" alt="Sketchbook" className="h-8" />
                    </Link>
                </div>

                {/* Center Nav - Desktop */}
                <nav className="hidden sm:flex items-center gap-2">
                    {navItems.map(({ to, icon: Icon, label }) => {
                        const isActive = location.pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`p-3 rounded-lg transition-colors ${isActive ? "bg-neutral-800 text-white" : "text-text-muted hover:text-text-primary hover:bg-bg-hover"}`}
                                title={label}
                            >
                                <Icon size={24} />
                            </Link>
                        );
                    })}
                </nav>

                {/* Profile */}
                <div className="flex-1 flex justify-end">
                    {user && (
                        <Link to={`/users/${user.id}`} className="flex items-center">
                            <Avatar
                                name={user.Username}
                                colors={user.avatarColors}
                                variant={user.avatarVariant}
                                size={44}
                            />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}