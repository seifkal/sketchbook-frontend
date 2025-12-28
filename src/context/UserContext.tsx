import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api/axios";

export interface User {
    id: string;
    Username: string;
    email?: string;
    avatarColors?: string[];
    avatarVariant?: "marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus";
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCurrentUser = useCallback(async () => {
        try {
            const response = await api.get("/users/me");
            setUser(response.data);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch user on initial load
    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    const login = useCallback(async () => {
        setIsLoading(true);
        await fetchCurrentUser();
    }, [fetchCurrentUser]);

    const logout = useCallback(async () => {
        try {
            await api.post("/auth/logout");
        } catch {
            // Ignore logout errors
        } finally {
            setUser(null);
        }
    }, []);

    const isAuthenticated = user !== null;

    return (
        <UserContext.Provider value={{ user, setUser, isLoading, isAuthenticated, login, logout }}>
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
