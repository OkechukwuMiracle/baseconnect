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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import Bg from "@/assets/auth-bg-2.png"
import { FcGoogle } from "react-icons/fc";
import { User } from "@/providers/AuthProvider";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from "wagmi";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  accepted?: string;
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletSignupRequested, setWalletSignupRequested] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { authenticateWithWallet } = useWalletAuth();
  const { address: connectedAddress } = useAccount();
  const { openConnectModal } = useConnectModal() || {};
  

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last name validation
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

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
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms acceptance
    if (!accepted) {
      newErrors.accepted = "You must accept the Terms and Privacy Policy";
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
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, confirmPassword, firstName, lastName }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      toast({
        title: "Verification Code Sent! ✉️",
        description: "Please check your email to verify your account",
      });

      // Navigate to OTP verification page
      navigate(`/verify-signup-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Signup failed. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const handleWalletSignup = async () => {
    // Open the RainbowKit modal (if available) and wait for the user to connect.
    // Once connected we will run the wallet auth flow (nonce -> sign -> verify)
    console.log("Wallet signup button clicked");
    if (openConnectModal) {
      openConnectModal();
      setWalletSignupRequested(true);
    } else {
      toast({
        title: "Wallet Connect Unavailable",
        description: "Wallet connection modal could not be opened. Please check your wallet setup.",
        variant: "destructive",
      });
    }
  };

  // When the wallet connects (via RainbowKit's ConnectButton) and the user
  // requested signup, run the authenticate flow which performs the server
  // nonce/sign/verify and refreshes auth state.
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!walletSignupRequested || !connectedAddress) return;
      setWalletLoading(true);
      try {
        const user = await authenticateWithWallet();
        if (!mounted) return;
        toast({ title: "Wallet connected", description: "You're signed in with your wallet." });
  // close/connect modal handled by RainbowKit; just reset our flag
        setWalletSignupRequested(false);
        navigate('/onboarding');
      } catch (err) {
        // Error toasts are raised inside authenticateWithWallet
        setWalletSignupRequested(false);
      } finally {
        setWalletLoading(false);
      }
    };

    run();
    return () => { mounted = false; };
  }, [walletSignupRequested, connectedAddress]);

  return (
    <div className="bg-background ">
      <div className="flex w-full ">
        <div className="w-[50%] hidden lg:flex ">
          <img src={Bg} alt="background image" className="w-full object-cover" />
        </div>

        <div className="pt-4 px-4 container mx-auto lg:w-[50%]">
          <Card className="border-0  ">
            <CardHeader className="text-center">
              <CardTitle>Create your account</CardTitle>
              <CardDescription>
                Sign up to start using BaseConnect
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                      }}
                      placeholder="Jane"
                      className={`placeholder:text-gray-300 ${errors.firstName ? 'border-destructive' : ''}`}
                      required
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                      }}
                      placeholder="Doe"
                      className={`placeholder:text-gray-300 ${errors.lastName ? 'border-destructive' : ''}`}
                      required
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

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
                      placeholder="Password (8 or more characters)"
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

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                      }}
                      placeholder="Confirm your password"
                      className={`placeholder:text-gray-300 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex items-start">
                  <Checkbox
                    checked={accepted}
                    onCheckedChange={(value) => {
                      setAccepted(value === true);
                      if (errors.accepted) setErrors({ ...errors, accepted: undefined });
                    }}
                    className={errors.accepted ? 'border-destructive' : ''}
                  />
                  <span className="ml-2 text-[12px] text-muted-foreground">
                    Yes, I understand and agree to the
                    <a
                      href="/terms"
                      className="underline text-primary hover:text-blue-600"
                    >
                      {" "}
                      Terms of Service{" "}
                    </a>
                    and
                    <a
                      href="/privacy"
                      className="underline text-primary hover:text-blue-600"
                    >
                      {" "}
                      Privacy Policy
                    </a>
                  </span>
                </div>
                {errors.accepted && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.accepted}
                  </p>
                )}

                <Button type="submit" disabled={submitting} className="w-full mt-4 bg-gradient-hero">
                  {submitting ? "Creating..." : "Create an account"}
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
                  onClick={handleGoogleSignup}
                  className="flex gap-2 items-center border-2 border-[#B4D3FF] p-2.5 rounded-xl w-full justify-center text-[14px] font-semibold hover:text-white hover:bg-gradient-hero transition-colors"
                >
                  <FcGoogle className="w-5 h-5" />
                  Sign up with Google
                </button>
                <button
                  type="button"
                  onClick={handleWalletSignup}
                  disabled={walletLoading}
                  className="flex gap-2 items-center border-2 border-dashed border-primary/40 p-2.5 rounded-xl w-full justify-center text-[14px] font-semibold hover:text-white hover:bg-gradient-hero  transition-colors disabled:opacity-70"
                >
                  {walletLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connecting wallet...
                    </>
                  ) : (
                    <>🔐 Sign up with wallet</>
                  )}
                </button>
              </div>

              <p className="mt-4 text-sm text-muted-foreground text-center m-auto">
                Already have an account?{" "}
                <a className="underline hover:text-primary" href="/login">
                  Log in
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
