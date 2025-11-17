import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import MobileNavbar from "../components/MobileNavbar";

export default function AppLayout() {
    return (
        <div className="bg-neutral-900 text-neutral-100 min-h-screen pb-16">
            <div className="w-full px-4 h-20 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 sticky top-0 z-40">
                <Header />
            </div>
            <div className="flex min-h-[calc(100vh-80px)]">
                <div className="hidden sm:flex w-1/5 min-w-[200px] border-r border-neutral-800 flex-col items-center px-4 py-8 gap-8">
                    <Navbar />
                </div>
                <div className="w-full sm:w-3/5 py-4 overflow-auto">
                    <Outlet />
                </div>
                <div className="hidden sm:block w-1/5 min-w-[200px] border-l border-neutral-800 px-4 py-4">
                    <div className="h-full flex flex-col items-center justify-center opacity-60">
                      Sidebar
                    </div>
                </div>
            </div>
            <MobileNavbar />
        </div>
    );
}