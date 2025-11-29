import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth, User } from "@/providers/AuthProvider";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import Bg from "@/assets/auth-bg-2.png"
import { FcGoogle } from "react-icons/fc";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { getNextRoute } from "@/lib/getNextRoute";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [walletLoading, setWalletLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refresh } = useAuth();
  const { authenticateWithWallet } = useWalletAuth();
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const navigateAfterAuth = (userData?: User | null) => {
    const destination = getNextRoute(userData);
    navigate(destination);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      await refresh();
      
      toast({
        title: "Logged in successfully",
        description: "Welcome back!",
      });
      
      navigateAfterAuth(data.user as User);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please check your credentials.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const [walletLoginRequested, setWalletLoginRequested] = useState(false);

  const handleWalletLogin = async () => {
    if (!isConnected) {
      if (openConnectModal) {
        openConnectModal();
        setWalletLoginRequested(true);
      }
      return;
    }
    // If already connected, proceed immediately
    setWalletLoginRequested(true);
  };

  // Effect: When wallet connects and login was requested, run wallet auth
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!walletLoginRequested || !isConnected || !address) return;
      setWalletLoading(true);
      try {
        const walletUser = await authenticateWithWallet();
        if (!mounted) return;
        toast({
          title: "Wallet connected",
          description: "You're signed in with your wallet.",
        });
        navigateAfterAuth(walletUser as User);
      } catch {
        // toast handled in hook
      } finally {
        setWalletLoading(false);
        setWalletLoginRequested(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [walletLoginRequested, isConnected, address]);

  return (
    <div className="bg-background">
      <div className="flex w-full">
        <div className="w-[50%] hidden lg:flex">
          <img src={Bg} alt="background image" className="w-full object-cover" />
        </div>

        <div className="pt-4 px-4 container mx-auto lg:w-[50%]">
          <Card className="border-0 h-[100vh] ">
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="jane@example.com"
                    className={`placeholder:text-gray-300 ${errors.email ? 'border-destructive' : ''}`}
                    required
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: undefined });
                      }}
                      placeholder="Enter your password"
                      className={`placeholder:text-gray-300 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <a href="/forgot-password" className="text-[12px] text-primary hover:underline">
                    Forgot Password
                  </a>
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-gradient-hero">
                  {submitting ? "Logging in..." : "Log in"}
                </Button>
              </form>
              <div className="flex gap-3 my-5">
                <span className="border-b-2 border-gray-300 w-full"></span>
                <p className="text-center text-[13px]">Or</p>
                <span className="border-b-2 border-gray-300 w-full"></span>
              </div>

              <div className="space-y-3 mt-7">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex gap-2 items-center border-2 border-[#B4D3FF] p-2.5 rounded-xl w-full justify-center text-[14px] hover:bg-gradient-hero hover:text-white transition-colors"
                >
                  <FcGoogle className="w-5 h-5" />
                  Sign in with Google
                </button>
                <button
                  type="button"
                  onClick={handleWalletLogin}
                  disabled={walletLoading}
                  className="flex gap-2 items-center border-2 border-dashed border-primary/40 p-2.5 rounded-xl w-full justify-center text-[14px] hover:bg-gradient-hero hover:text-white transition-colors disabled:opacity-70"
                >
                  {walletLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connecting wallet...
                    </>
                  ) : (
                    <>🔐 Continue with wallet</>
                  )}
                </button>
              </div>

              <p className="mt-4 text-sm text-muted-foreground text-center m-auto">
                No account?{" "}
                <a className="underline hover:text-primary" href="/signup">
                  Sign up
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
