import Avatar from "boring-avatars";
import UserContext from "../context/UserContext";
import { useContext } from "react";
import { Navigate, Link } from "react-router-dom";

export default function Header() {
    const userContext = useContext(UserContext);
    const userClaims = userContext?.user;

    if (!userClaims) {
        return <Navigate to="/auth/login" />;
    }

    return (
        <div className="flex items-center h-full w-full justify-between ">
            <img src="/logo-text.svg" alt="Sketchbook" className="h-7" />
            <div className="flex items-center gap-2 px-4">
                <Link to={`/users/${userClaims.id}`}>
                    <Avatar name={userClaims.Username} colors={userClaims.avatarColors} variant={userClaims.avatarVariant} size={40} />
                </Link>
            </div>
        </div>
    )
}