import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

export const ProtectedRoute: React.FC<{ requireProfile?: boolean; roles?: ("creator"|"contributor")[] }>= ({ requireProfile = true, roles, }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (!user) return <Navigate to="/" replace />;

  if (requireProfile && !user.profileCompleted) return <Navigate to="/onboarding" replace />;

  if (roles && user.role && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
};
