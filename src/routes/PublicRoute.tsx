import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useUser } from "../context/UserContext";

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700" />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};
