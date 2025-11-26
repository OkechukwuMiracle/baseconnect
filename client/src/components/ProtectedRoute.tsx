import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface ProtectedRouteProps {
  requireProfile?: boolean;
  roles?: ("creator" | "contributor")[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requireProfile = true, 
  roles,
  children 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Ensure role is selected before accessing role-restricted views
  if (roles && !user.role) {
    return <Navigate to="/onboarding" replace />;
  }

  // Role still not selected but route requires profile
  if (requireProfile && !user.role) {
    return <Navigate to="/onboarding" replace />;
  }

  // Profile not completed
  if (requireProfile && user.role && !user.profileCompleted) {
    return <Navigate to="/complete-profile" replace />;
  }

  // Profile not completed
  if (requireProfile && user.role && !user.profileCompleted) {
    return <Navigate to="/creator-profile" replace />;
  }

  // Role check
  if (roles && user.role && !roles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === "creator" 
      ? "/dashboard/creator" 
      : "/dashboard/contributor";
    return <Navigate to={redirectPath} replace />;
  }

  // If children are provided, render them (for wrapping individual routes)
  // Otherwise, render Outlet (for nested route groups)
  return children ? <>{children}</> : <Outlet />;
};