import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth/login" replace />;
};
