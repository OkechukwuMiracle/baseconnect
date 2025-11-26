import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface CreateProfileModalProps {
  task: any;
  onComplete: () => void;
}

export function CreateProfileModal({ task, onComplete }: CreateProfileModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoToOnboarding = () => {
    if (user?.profileCompleted) {
      toast({
        title: "Profile Already Complete",
        description: "Your profile is already set up.",
      });
      onComplete();
    } else {
      // Route creators to the creator dashboard profile view so they can edit in-context.
      const taskParam = task?.taskId ? `&taskId=${encodeURIComponent(task.taskId)}` : '';
      if (user?.role === 'creator') {
        navigate(`/dashboard/creator?view=profile&returnTo=waitlist${taskParam}`);
      } else {
        // Contributors go to the contributor profile page
        navigate(`/dashboard/contributor/complete-profile?returnTo=waitlist${taskParam}`);
      }
      onComplete();
    }
  };

  return (
    <div className="py-4 space-y-4">
      {user?.profileCompleted ? (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
          <p className="text-sm text-green-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Your profile is already complete! You can verify this task.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Complete your profile by providing your role, bio, and other details. 
            This will help us personalize your experience on Baseconnect.
          </p>
          <Button onClick={handleGoToOnboarding} className="w-full">
            Complete Profile
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

