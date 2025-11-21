import { User } from "@/providers/AuthProvider";

export const getNextRoute = (user?: User | null) => {
  if (!user?.role) return "/onboarding";
  // if (!user.profileCompleted) return "/complete-profile";
  if (user.role === "creator") return "/dashboard/creator";
  if (user.role === "contributor") return "/dashboard/contributor";
  return "/waitlist";
};

