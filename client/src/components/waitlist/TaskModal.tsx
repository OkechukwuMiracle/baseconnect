import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { Loader2, X, Plus, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { ConnectWallet } from "./ConnectWalletModal";
import { ConnectSocialModal } from "./ConnectSocialModal";
import { InterestsModal } from "./InterestsModal";
import { FollowUsersModal } from "./FollowUsersModal";
import { ReferralModal } from "./ReferralModal";
import { CreateProfileModal } from "./CreateProfileModal";
import { Progress } from "@/components/ui/progress";

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
  const { user } = useAuth();
  const { toast } = useToast();

  const renderTaskContent = () => {
    switch (task.taskType) {
      case 'createProfile':
        return <CreateProfileModal task={task} onComplete={onComplete} />;
      case 'connectWallet':
        return <ConnectWallet task={task} onComplete={onComplete} />;
      case 'connectSocial':
        return <ConnectSocialModal task={task} onComplete={onComplete} />;
      case 'identityGraphComplete':
        return <IdentityGraphModal task={task} onComplete={onComplete} />;
      case 'interestGraphComplete':
        return <InterestsModal task={task} onComplete={onComplete} />;
      case 'followCount':
        return <FollowUsersModal task={task} onComplete={onComplete} />;
      case 'referrals':
        return <ReferralModal task={task} onComplete={onComplete} />;
      case 'badgeClaim':
        return <BadgeModal task={task} onComplete={onComplete} />;
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
function DefaultTaskContent({ task, onComplete }: { task: any; onComplete: () => void }) {
  return (
    <div className="py-4">
      <p className="text-muted-foreground">
        Complete this task through the platform, then click verify to check your progress.
      </p>
    </div>
  );
}

// Identity Graph Complete - shows wallet + social links status
function IdentityGraphModal({ task, onComplete }: { task: any; onComplete: () => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/profile/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileData(res.data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const linkCount = (profileData?.socialLinks?.length || 0) + (profileData?.walletAddress ? 1 : 0);
  const required = task.requiredValue || 3;
  const isComplete = linkCount >= required;

  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Identity Graph Status</p>
        <div className="flex items-center gap-2">
          <Badge variant={profileData?.walletAddress ? "default" : "outline"}>
            {profileData?.walletAddress ? "✓ Wallet Linked" : "Wallet Not Linked"}
          </Badge>
          <Badge variant={(profileData?.socialLinks?.length || 0) > 0 ? "default" : "outline"}>
            {profileData?.socialLinks?.length || 0} Social Link(s)
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Progress: {linkCount} / {required} links
        </p>
        <Progress value={(linkCount / required) * 100} className="h-2" />
      </div>

      {!isComplete && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Complete your identity graph:</p>
          <div className="space-y-2">
            {!profileData?.walletAddress && (
              <ConnectWallet task={{ taskType: 'connectWallet' }} onComplete={loadProfile} />
            )}
            <ConnectSocialModal task={{ taskType: 'connectSocial' }} onComplete={loadProfile} />
          </div>
        </div>
      )}

      {isComplete && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
          <p className="text-sm text-green-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Identity graph complete! You can now verify this task.
          </p>
        </div>
      )}
    </div>
  );
}

// Badge Modal - shows available badges
function BadgeModal({ task, onComplete }: { task: any; onComplete: () => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/profile/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileData(res.data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const claimBadge = async (badgeId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profile/badges/claim`,
        { badgeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Badge Claimed!",
        description: "You've successfully claimed a badge.",
      });
      await loadProfile();
      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to claim badge",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const availableBadges = [
    { id: 'early-adopter', name: 'Early Adopter', description: 'Joined during waitlist phase' },
    { id: 'profile-complete', name: 'Profile Complete', description: 'Completed your profile' },
    { id: 'first-referral', name: 'First Referral', description: 'Referred your first user' },
  ];

  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Your Badges</p>
        <div className="flex flex-wrap gap-2">
          {(profileData?.badges || []).map((badge: any) => (
            <Badge key={badge.badgeId} variant="default">
              {badge.badgeId}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Available Badges</p>
        <div className="space-y-2">
          {availableBadges.map((badge) => {
            const hasBadge = profileData?.badges?.some((b: any) => b.badgeId === badge.id);
            return (
              <div
                key={badge.id}
                className="p-3 border rounded-md flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{badge.name}</p>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
                {hasBadge ? (
                  <Badge variant="outline">Claimed</Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => claimBadge(badge.id)}
                    disabled={loading}
                  >
                    Claim
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


