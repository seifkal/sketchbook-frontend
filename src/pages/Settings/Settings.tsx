import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function Settings() {
    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/auth");
    }

    return (
        <div className="p-0">
            <div className="w-full border-b border-neutral-800 h-12 flex flex-row pl-8 gap-8 items-center pb-4">
                <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-2xl hover:bg-neutral-700 flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-arrow-left"><path d="M5 12l14 0"></path><path d="M5 12l6 6"></path><path d="M5 12l6 -6"></path></svg>
                </button>
                <p className="font-bold text-neutral-50">Settings</p>
            </div>
            <div className="py-8 px-8 bg-neutral-900 ">
                <p className="ml-2 mb-4 text-neutral-300">Account</p>
                <button onClick={handleLogout} className="w-full flex flex-row bg-neutral-800 h-12 items-center py-6 px-4 rounded-xl cursor-pointer text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-neutral-400"
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <p className="ml-2">Logout</p>
                </button>
            </div>
        </div>
    )
}