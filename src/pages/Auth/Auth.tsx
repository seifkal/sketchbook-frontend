import { Outlet, useLocation } from "react-router-dom";
import PixelArtSlider from "../../components/PixelArtSlider";

export default function Auth() {
    const location = useLocation();
    const isRegisterPage = location.pathname === "/auth/register";

    return (
        <div className="w-screen h-screen bg-white flex flex-col md:flex-row">
            <div className={`w-full ${isRegisterPage ? '' : 'md:w-2/5'} h-full bg-neutral-100 flex flex-col items-center justify-center font-bold transition-all duration-500 ease-in-out`}>
                <Outlet></Outlet>
            </div>

            <div className={`hidden md:block md:flex-1 bg-neutral-900 overflow-hidden transition-all duration-500 ease-in-out ${isRegisterPage ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
                <PixelArtSlider />
            </div>
        </div>
    );
} 