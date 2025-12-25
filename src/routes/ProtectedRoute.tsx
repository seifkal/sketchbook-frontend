import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useUser } from "../context/UserContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-700 border-t-white" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
};
