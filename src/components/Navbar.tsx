import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { House } from "lucide-react";
import UserContext from "../context/UserContext";

export function useNavItems() {
    const userContext = useContext(UserContext);
    const user = userContext?.user;

    return [
        {
            to: "/", label: "Home", icon: (
                <House />
            )
        },
        {
            to: "/create", label: "Create", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm17.71-10.04c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71l-2.34-2.34a1.003 1.003 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
            )
        },
        {
            to: "/likes", label: "Likes", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            )
        },
        {
            to: user ? `/users/${user.userId}` : "/login", label: "Profile", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 8 1.29 8 3.84V20H4v-4.16C4 13.29 9.3 12 12 12zm0-2a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" /></svg>
            )
        },
        {
            to: "/settings", label: "Settings", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14,12.94a7.07,7.07,0,0,0,.05-1,7.07,7.07,0,0,0-.05-1l2.11-1.65a.5.5,0,0,0,.12-.66l-2-3.46a.5.5,0,0,0-.61-.22l-2.49,1a7,7,0,0,0-1.7-.98l-.38-2.65A.5.5,0,0,0,13.5,2h-4a.5.5,0,0,0-.5.42l-.38,2.65a7,7,0,0,0-1.7.98l-2.49-1a.5.5,0,0,0-.61.22l-2,3.46a.5.5,0,0,0,.12.66l2.11,1.65a7.07,7.07,0,0,0-.05,1,7.07,7.07,0,0,0,.05,1L2.27,14.6a.5.5,0,0,0-.12.66l2,3.46a.5.5,0,0,0,.61.22l2.49-1a7,7,0,0,0,1.7.98l.38,2.65a.5.5,0,0,0,.5.42h4a.5.5,0,0,0,.5-.42l.38-2.65a7,7,0,0,0,1.7-.98l2.49,1a.5.5,0,0,0,.61-.22l2-3.46a.5.5,0,0,0-.12-.66ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
            )
        },
    ];
}

export default function Navbar() {
    const location = useLocation();
    const navItems = useNavItems();

    return (
        <nav className="hidden sm:flex sticky top-20 w-full z-30 flex-col items-center px-4 py-8 gap-4 bg-neutral-900">
            <ul className="flex flex-col gap-3 w-full items-center">
                {navItems.map(({ to, label, icon }) => (
                    <li key={to} className="w-44">
                        <Link
                            to={to}
                            className={`
                                flex items-center gap-3 w-44 px-5 py-4 rounded-full 
                                transition-all duration-150 ease-in-out
                                text-left font-extrabold text-neutral-50 hover:bg-neutral-800
                                hover:translate-x-1 hover:font-semibold
                                focus:outline-none focus:bg-neutral-800
                                ${location.pathname === to ? "bg-neutral-800 font-bold" : "text-neutral-200"}
                            `}
                        >
                            <span className="transition-colors duration-150">
                                {icon}
                            </span>
                            <span className="flex-1 text-base text-left">{label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}