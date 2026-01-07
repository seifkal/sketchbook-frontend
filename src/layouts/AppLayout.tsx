import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import MobileNavbar from "../components/MobileNavbar";

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-bg-primary text-text-primary pb-16 sm:pb-0">
            <Header />
            <main className="max-w-6xl mx-auto px-4 pb-4">
                <Outlet />
            </main>
            <MobileNavbar />
        </div>
    );
}