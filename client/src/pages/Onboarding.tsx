import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Briefcase, Hammer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export default function Onboarding() {
  const [step, setStep] = useState<"role" | "profile">("role");
  const [role, setRole] = useState<"creator" | "doer" | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleSelect = (selectedRole: "creator" | "doer") => {
    setRole(selectedRole);
    setStep("profile");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        role,
      };
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/profile`, payload);
      localStorage.setItem("userId", res.data._id || res.data.id);
      toast({
        title: "Profile Created!",
        description: `Welcome to BaseConnect as a Task ${role === "creator" ? "Creator" : "Doer"}!`,
      });
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome to BaseConnect</h1>
            <p className="text-muted-foreground">Let's get you set up in just a few steps</p>
          </div>
          
          {step === "role" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className="cursor-pointer hover:shadow-card transition-all hover:border-primary group"
                onClick={() => handleRoleSelect("creator")}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                    <Briefcase className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Task Creator</CardTitle>
                  <CardDescription>
                    Post tasks and hire talented individuals to complete them
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Post unlimited tasks</p>
                  <p>✓ Access to qualified task doers</p>
                  <p>✓ Secure escrow payments</p>
                  <p>✓ Rate and review workers</p>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:shadow-card transition-all hover:border-primary group"
                onClick={() => handleRoleSelect("doer")}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-gradient-accent flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                    <Hammer className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Task Doer</CardTitle>
                  <CardDescription>
                    Complete tasks and earn instant payments in crypto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Browse available tasks</p>
                  <p>✓ Get paid instantly</p>
                  <p>✓ Build your reputation</p>
                  <p>✓ Flexible work schedule</p>
                </CardContent>
              </Card>
            </div>
          )}
          
          {step === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>
                  Tell us a bit about yourself to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll send you task notifications here
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder={role === "creator" 
                        ? "Tell us about your business or projects..." 
                        : "Tell us about your skills and experience..."
                      }
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("role")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button type="submit" variant="hero" className="flex-1">
                      Complete Setup
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
