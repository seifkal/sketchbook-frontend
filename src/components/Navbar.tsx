import { Link, useLocation } from "react-router-dom";
import { House, Pencil, Heart, User, Settings, MessageSquare } from "lucide-react";
import { useUser } from "../context/UserContext";

export function useNavItems() {
    const { user } = useUser();

    return [
        { to: "/", label: "Home", icon: (<House />) },
        { to: "/create", label: "Create", icon: (<Pencil />) },
        { to: "/likes", label: "Likes", icon: (<Heart />) },
        { to: user?.id ? `/users/${user.id}` : "/auth/login", label: "Profile", icon: (<User />) },
        { to: "/messages", label: "Messages", icon: (<MessageSquare />) },
        { to: "/settings", label: "Settings", icon: (<Settings />) },
    ];
}

export default function Navbar() {
    const location = useLocation();
    const navItems = useNavItems();

    return (
        <nav className="hidden sm:flex sticky top-16 w-full z-30 flex-col items-center py-8 bg-bg-primary">
            <ul className="flex flex-col gap-3 w-full">
                {navItems.map(({ to, label, icon }) => (
                    <li key={to}>
                        <Link
                            to={to}
                            className={`
                                flex items-center gap-4 px-4 py-3 rounded-lg
                                transition-all duration-150 ease-in-out
                                font-medium
                                ${location.pathname === to
                                    ? "bg-neutral-800 text-text-primary"
                                    : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                                }
                            `}
                        >
                            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                {icon}
                            </span>
                            <span>{label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}