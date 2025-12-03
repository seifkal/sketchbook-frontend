import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    userId: number;
    username: string;
}

interface UserContextType {
    user: JwtPayload | null;
    setUser: React.Dispatch<React.SetStateAction<JwtPayload | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<JwtPayload | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: JwtPayload = jwtDecode(token);
                setUser(decoded);
            } catch (err) {
                console.error("Failed to decode JWT", err);
                setUser(null);
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
