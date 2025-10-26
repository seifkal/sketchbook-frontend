import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
};
