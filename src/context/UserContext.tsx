import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    userId: number;
    username: string;
}

interface UserContextType {
    user: JwtPayload | null;
    setUser: React.Dispatch<React.SetStateAction<JwtPayload | null>>;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<JwtPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === null) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export default UserContext;

