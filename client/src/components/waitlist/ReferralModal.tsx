import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, CheckCircle2, Users, Share2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/providers/AuthProvider";

interface ReferralModalProps {
  task: any;
  onComplete: () => void;
}

export function ReferralModal({ task, onComplete }: ReferralModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/profile/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileData(res.data);
      setReferralCode(res.data.referralCode || "");
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const handleApplyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply referral code",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profile/referral/apply`,
        { referralCode: inputCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Referral Code Applied!",
        description: "You've successfully applied a referral code.",
      });

      setInputCode("");
      await loadProfile();
      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to apply referral code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const required = task.requiredValue || 1;
  const referralCount = profileData?.referralCount || 0;
  const referralLevel = profileData?.referralLevel || 0;
  const isComplete = required >= 2 
    ? (referralLevel >= 2 && referralLevel <= 3)
    : referralCount >= required;

  return (
    <div className="py-4 space-y-4">
      {/* Your Referral Code */}
      {referralCode && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Referral Code
            </CardTitle>
            <CardDescription>
              Share this code with others to earn referral rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={referralCode}
                readOnly
                className="font-mono text-lg font-bold"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCode}
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCopyLink}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copy Referral Link
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Referrals</CardDescription>
            <CardTitle className="text-2xl">{referralCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Referral Level</CardDescription>
            <CardTitle className="text-2xl">{referralLevel}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {isComplete && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
          <p className="text-sm text-green-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {required >= 2 
              ? `You've reached referral level ${referralLevel}! You can now verify this task.`
              : `You've referred ${referralCount} user(s)! You can now verify this task.`
            }
          </p>
        </div>
      )}

      {/* Apply Referral Code */}
      {!profileData?.referredBy && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Apply Referral Code</CardTitle>
            <CardDescription>
              Have a referral code? Enter it here to support the person who referred you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleApplyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="referralCode">Referral Code</Label>
                <Input
                  id="referralCode"
                  type="text"
                  placeholder="Enter referral code"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="uppercase"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : (
                  "Apply Code"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {profileData?.referredBy && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-md">
          <p className="text-sm text-blue-600">
            You were referred by another user. Thank you for joining!
          </p>
        </div>
      )}
    </div>
  );
}

