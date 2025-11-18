// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Navbar } from "@/components/Navbar";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/providers/AuthProvider";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { refresh } = useAuth();

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/auth/login`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password }),
//         }
//       );
//       if (!res.ok) throw new Error("Login failed");
//       const data = await res.json();
//       localStorage.setItem("token", data.token);
//       // Decide next step based on profile status
//       // fetch /me
//       const meRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${data.token}` },
//       });
//       const me = await meRes.json();
//       await refresh();
//       if (!me.profileCompleted) {
//         toast({
//           title: "Welcome back",
//           description: "Continue onboarding to complete your profile.",
//         });
//         navigate("/onboarding");
//       } else {
//         const next =
//           me.role === "creator"
//             ? "/dashboard/creator"
//             : "/dashboard/contributor";
//         toast({
//           title: "Logged in",
//           description: "Redirecting to your dashboard...",
//         });
//         navigate(next);
//       }
//     } catch {
//       toast({
//         title: "Error",
//         description: "Login failed",
//         variant: "destructive",
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <div className="pt-24 pb-12 px-4 container mx-auto max-w-md">
//         <Card>
//           <CardHeader className="text-center">
//             <CardTitle>Log in</CardTitle>
//             <CardDescription>Access your account</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={submit} className="space-y-4">
//               <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="jane@example.com"
//                   className="placeholder:text-gray-400"
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Password (8 or more characters)"
//                   className="placeholder:text-gray-400"
//                   required
//                 />
//               </div>
//               <div className="text-right">
//                 <a href="/forgot-password" className="text-[12px] text-primary">
//                   Forgot Password
//                 </a>
//               </div>
//               <Button type="submit" disabled={submitting} className="w-full">
//                 {submitting ? "Logging in..." : "Log in"}
//               </Button>
//             </form>
//             <p className="mt-4 text-sm text-muted-foreground">
//               No account?{" "}
//               <a className="underline" href="/signup">
//                 Sign up
//               </a>
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Navbar } from "@/components/Navbar";
import LandingNavbar from "@/components/LandingNavbar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refresh } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      localStorage.setItem("token", data.token);
      await refresh();
      
      toast({
        title: "Logged in successfully",
        description: "Welcome back!",
      });
      
      // Redirect directly to waitlist page
      navigate("/waitlist");
    } catch {
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <div className="pt-24 pb-12 px-4 container mx-auto max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Log in</CardTitle>
            <CardDescription>Access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (8 or more characters)"
                  className="placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="text-right">
                <a href="/forgot-password" className="text-[12px] text-primary">
                  Forgot Password
                </a>
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Logging in..." : "Log in"}
              </Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">
              No account?{" "}
              <a className="underline" href="/signup">
                Sign up
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
