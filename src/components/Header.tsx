import Avatar from "boring-avatars";
import UserContext from "../context/UserContext";
import { useContext } from "react";

export default function Header() {
    const userContext = useContext(UserContext);
    const userClaims = userContext?.user;

    return (
        <div className="flex items-center h-full w-full justify-between ">
            <img src="/logo-text.svg" alt="Sketchbook" className="h-7" />
            <div className="flex items-center gap-2 px-4">
                <Avatar name={userClaims?.username} colors={userClaims?.avatarColors} variant={userClaims?.avatarVariant} size={40} />
            </div>
        </div>
    )
}