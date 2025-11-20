// import { useState } from "react";
// import { Navbar } from "@/components/Navbar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { useNavigate } from "react-router-dom";
// import { Briefcase, Hammer } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";
// import { useAuth } from "@/providers/AuthProvider";

// export default function Onboarding() {
//   const [step, setStep] = useState<"role" | "profile">("role");
//   const [role, setRole] = useState<"creator" | "contributor" | null>(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     bio: "",
//     address: "",
//   });
//   const [submitting, setSubmitting] = useState(false);
  
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { refresh } = useAuth();

//   const handleRoleSelect = (selectedRole: "creator" | "contributor") => {
//     setRole(selectedRole);
//     setStep("profile");
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast({ title: "Unauthorized", description: "Please log in first.", variant: "destructive" });
//       navigate("/");
//       return;
//     }
//     try {
//       setSubmitting(true);
//       const payload = {
//         ...formData,
//         role,
//       };
      
//       // API returns { token: newToken, user: {...} }
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/auth/profile`, 
//         payload, 
//         { headers: { Authorization: `Bearer ${token}` }}
//       );
      
//       const { token: newToken, user } = res.data;
      
//       // 🔥 SAVE THE NEW TOKEN
//       if (newToken) {
//         localStorage.setItem("token", newToken);
//       }
      
//       // Save user ID
//       const userId = user?.id || user?._id;
//       if (userId) {
//         localStorage.setItem("userId", userId);
//       }
      
//       // Refresh auth context
//       await refresh();
      
//       toast({
//         title: "Profile Created!",
//         description: `Welcome to BaseConnect as a Task ${user.role === "creator" ? "Creator" : "Contributor"}!`,
//       });
      
//       const next = user.role === 'creator' ? '/dashboard/creator' : '/dashboard/contributor';
//       navigate(next);
//     } catch (err) {
//       console.error('Profile creation error:', err);
//       toast({
//         title: "Error",
//         description: "Failed to create profile. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
      
//       <div className="pt-24 pb-12 md:px-4">
//         <div className="container mx-auto max-w-4xl">
//           <div className="mb-8 text-center">
//             <h1 className="text-4xl font-bold mb-2">Welcome to BaseConnect</h1>
//             <p className="text-muted-foreground">Let's get you set up in just a few steps</p>
//           </div>
          
//           {step === "role" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card 
//                 className="cursor-pointer hover:shadow-card transition-all hover:border-primary group"
//                 onClick={() => handleRoleSelect("creator")}
//               >
//                 <CardHeader className="text-center">
//                   <div className="mx-auto h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
//                     <Briefcase className="h-8 w-8 text-primary-foreground" />
//                   </div>
//                   <CardTitle className="text-2xl">Task Creator</CardTitle>
//                   <CardDescription>
//                     Post tasks and hire talented individuals to complete them
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-2 text-sm text-muted-foreground">
//                   <p>✓ Post unlimited tasks</p>
//                   <p>✓ Access to qualified task doers</p>
//                   <p>✓ Secure escrow payments</p>
//                   <p>✓ Rate and review workers</p>
//                 </CardContent>
//               </Card>
              
//               <Card 
//                 className="cursor-pointer hover:shadow-card transition-all hover:border-primary group"
//                 onClick={() => handleRoleSelect("contributor")}
//               >
//                 <CardHeader className="text-center">
//                   <div className="mx-auto h-16 w-16 rounded-full bg-gradient-accent flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
//                     <Hammer className="h-8 w-8 text-accent-foreground" />
//                   </div>
//                   <CardTitle className="text-2xl">Task Contributor</CardTitle>
//                   <CardDescription>
//                     Complete tasks and earn instant payments in crypto
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-2 text-sm text-muted-foreground">
//                   <p>✓ Browse available tasks</p>
//                   <p>✓ Get paid instantly</p>
//                   <p>✓ Build your reputation</p>
//                   <p>✓ Flexible work schedule</p>
//                 </CardContent>
//               </Card>
//             </div>
//           )}
          
//           {step === "profile" && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Complete Your Profile</CardTitle>
//                 <CardDescription>
//                   Tell us a bit about yourself to get started
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Full Name</Label>
//                     <Input
//                       id="name"
//                       placeholder="John Doe"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       required
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email Address</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="john@example.com"
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                       required
//                     />
//                     <p className="text-xs text-muted-foreground">
//                       We'll send you task notifications here
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="address">Wallet Address</Label>
//                     <Input
//                       id="address"
//                       placeholder="0x..."
//                       value={formData.address}
//                       onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                       required
//                     />
//                     <p className="text-xs text-muted-foreground">
//                       Your Base wallet address for receiving payments
//                     </p>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="bio">Bio</Label>
//                     <Textarea
//                       id="bio"
//                       placeholder={role === "creator" 
//                         ? "Tell us about your business or projects..." 
//                         : "Tell us about your skills and experience..."
//                       }
//                       value={formData.bio}
//                       onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
//                       rows={4}
//                     />
//                   </div>
                  
//                   <div className="flex gap-4">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => setStep("role")}
//                       className="flex-1"
//                     >
//                       Back
//                     </Button>
//                     <Button type="submit" variant="hero" className="flex-1" disabled={submitting}>
//                       {submitting ? "Completing..." : "Complete Setup"}
//                     </Button>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Hammer, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAuth } from "@/providers/AuthProvider";
import LandingNavbar from "@/components/LandingNavbar";

export default function Onboarding() {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectingRole, setSelectingRole] = useState<"creator" | "contributor" | null>(null);

  useEffect(() => {
    if (user?.role) {
      const destination = user.role === "creator" ? "/dashboard/creator" : "/dashboard/contributor";
      navigate(destination, { replace: true });
    }
  }, [user, navigate]);

  const handleRoleSelect = async (selectedRole: "creator" | "contributor") => {
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
      setSelectingRole(selectedRole);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/select-role`,
        { role: selectedRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      await refresh();

      toast({
        title: "Role Selected",
        description: `You're now exploring Baseconnect as a ${selectedRole}.`,
      });

      const dashboardPath = selectedRole === "creator" ? "/dashboard/creator" : "/dashboard/contributor";
      navigate(dashboardPath);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update role";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSelectingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <div className="pt-24 pb-12 md:px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Choose how you want to build</h1>
            <p className="text-muted-foreground">Pick a role to jump into the right dashboard. You can complete your profile later.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className="cursor-pointer hover:shadow-card transition-all hover:border-primary group"
              onClick={() => selectingRole ? null : handleRoleSelect("creator")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                  <Briefcase className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Task Creator</CardTitle>
                <CardDescription>
                  Post missions, activate your community, and manage contributors.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Launch campaigns in minutes</p>
                <p>✓ Track contributor progress</p>
                <p>✓ Unlock partner & referral tooling</p>
                <p>✓ Automate rewards</p>
                <Button 
                  type="button"
                  className="w-full mt-4 text-white bg-gradient-hero" 
                  disabled={selectingRole === "creator"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!selectingRole) handleRoleSelect("creator");
                  }}
                >
                  {selectingRole === "creator" ? "Redirecting..." : "Build as Creator"}
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-card transition-all hover:border-primary group"
              onClick={() => selectingRole ? null : handleRoleSelect("contributor")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-accent flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                  <Hammer className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl">Task Contributor</CardTitle>
                <CardDescription>
                  Join quests, earn rewards, and grow your identity graph.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Access curated missions</p>
                <p>✓ Earn onchain badges</p>
                <p>✓ Grow your referral graph</p>
                <p>✓ Unlock staking boosts</p>
                <Button 
                  type="button"
                  className="w-full mt-4 text-white bg-gradient-hero" 
                  disabled={selectingRole === "contributor"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!selectingRole) handleRoleSelect("contributor");
                  }}
                >
                  {selectingRole === "contributor" ? "Redirecting..." : "Build as Contributor"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              You can finish your profile anytime from the Complete Profile page.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}