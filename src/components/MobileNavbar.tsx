import { Link, useLocation } from "react-router-dom";
import { navItems } from "./Navbar";

export default function MobileNavbar() {
    // const location = useLocation(); // no longer needed since color stays the same
    return (
        <nav className="fixed bottom-0 left-0 w-full z-40 bg-neutral-900 border-t border-neutral-800 flex sm:hidden justify-between px-2 pb-safe pt-1">
            {navItems.map(({ to, icon, label }) => (
                <Link
                    key={to}
                    to={to}
                    className="flex flex-col items-center flex-1 px-1 pt-1 pb-2 text-neutral-200 transition-all"
                    aria-label={label}
                >
                    <span className="text-neutral-200">{icon}</span>
                </Link>
            ))}
        </nav>
    );
}
