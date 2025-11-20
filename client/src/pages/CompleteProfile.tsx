import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LandingNavbar from "@/components/LandingNavbar";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface FormState {
  firstName: string;
  lastName: string;
  bio: string;
  address: string;
  walletAddress: string;
}

export default function CompleteProfile() {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormState>({
    firstName: "",
    lastName: "",
    bio: "",
    address: "",
    walletAddress: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        address: user.address || "",
        walletAddress: user.walletAddress || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && !user.role) {
      navigate("/onboarding", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Unauthorized",
        description: "Please log in first.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      await refresh();
      toast({
        title: "Profile updated",
        description: "Your identity graph looks great!",
      });

      const destination = res.data.user.role === "creator" ? "/dashboard/creator" : "/dashboard/contributor";
      navigate(destination);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <div className="pt-24 pb-12 md:px-4">
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Complete your Baseconnect profile</CardTitle>
              <CardDescription>
                Share a bit more context so partners and contributors know who they're working with.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="walletAddress">Wallet Address</Label>
                  <Input
                    id="walletAddress"
                    value={formData.walletAddress}
                    onChange={(e) => handleChange("walletAddress", e.target.value)}
                    placeholder="0x..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Used for payouts, quests, and onchain verification.
                  </p>
                </div>

                <div>
                  <Label htmlFor="address">Baseconnect Handle</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="@your-handle"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Share your mission, what you build, or how you contribute."
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Saving..." : "Save profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

