import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConnectWallet } from "./ConnectWalletModal";
import { ReferralModal } from "./ReferralModal";
import { CreateProfileModal } from "./CreateProfileModal";

interface TaskModalProps {
  task: {
    _id: string;
    taskId: string;
    title: string;
    description: string;
    taskType: string;
    requiredValue: number | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export function TaskModal({ task, open, onOpenChange, onComplete }: TaskModalProps) {
  // const { user } = useAuth();
  // const { toast } = useToast();

  const renderTaskContent = () => {
    switch (task.taskType) {
      case 'createProfile':
        return <CreateProfileModal task={task} onComplete={onComplete} />;
      case 'connectWallet':
        return <ConnectWallet task={task} onComplete={onComplete} />;
      case 'referrals':
        return <ReferralModal task={task} onComplete={onComplete} />;
      
      default:
        return <DefaultTaskContent task={task} onComplete={onComplete} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>{task.description}</DialogDescription>
        </DialogHeader>
        {renderTaskContent()}
      </DialogContent>
    </Dialog>
  );
}

// Default content for tasks without specific UI
function DefaultTaskContent({ task, onComplete }: { task: TaskModalProps['task']; onComplete: () => void }) {
  return (
    <div className="py-4">
      <p className="text-muted-foreground">
        Complete this task through the platform, then click verify to check your progress.
      </p>
    </div>
  );
}

// (Removed task UIs not used by the trimmed waitlist: social linking, identity graph details, badges, follow-count, etc.)


