import { Link, useLocation } from "react-router-dom";
import { House, Pencil, Heart, User, Settings, MessageSquare } from "lucide-react";
import { useUser } from "../context/UserContext";

export function useNavItems() {
    const { user } = useUser();

    return [
        {
            to: "/", label: "Home", icon: (
                <House />
            )
        },
        {
            to: "/create", label: "Create", icon: (
                <Pencil />
            )
        },
        {
            to: "/likes", label: "Likes", icon: (
                <Heart />
            )
        },
        {
            to: user?.id ? `/users/${user.id}` : "/auth/login", label: "Profile", icon: (
                <User />
            )
        },
        {
            to: "/messages", label: "Messages", icon: (
                <MessageSquare />
            )
        },
        {
            to: "/settings", label: "Settings", icon: (
                <Settings />
            )
        },
    ];
}

export default function Navbar() {
    const location = useLocation();
    const navItems = useNavItems();

    return (
        <nav className="hidden sm:flex sticky top-20 w-full z-30 flex-col items-center py-6 gap-4 bg-neutral-900">
            <ul className="flex flex-col gap-6 w-full items-center">
                {navItems.map(({ to, label, icon }) => (
                    <li key={to} className="w-34">
                        <Link
                            to={to}
                            className={`
                                flex items-center gap-4 w-34 px-5 py-3 h-full rounded-2xl
                                transition-all duration-150 ease-in-out
                                text-left font-extrabold text-neutral-50 hover:bg-neutral-800
                                hover:translate-x-1 hover:font-semibold
                                focus:outline-none focus:bg-neutral-700
                                ${location.pathname === to ? "bg-neutral-700 font-bold" : "text-neutral-200"}
                            `}
                        >
                            <span className="transition-colors duration-150 w-6 h-6 flex items-center justify-center flex-shrink-0">
                                {icon}
                            </span>
                            <span className="flex-1 text-left">{label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}