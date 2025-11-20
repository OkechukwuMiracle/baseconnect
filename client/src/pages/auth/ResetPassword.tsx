import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import Bg from "@/assets/auth-bg-2.png"

interface FormErrors {
  newPassword?: string;
  confirmPassword?: string;
}

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { toast } = useToast();

  useEffect(() => {
    // Get email and OTP from URL params
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const otpParam = params.get('otp');
    
    if (emailParam && otpParam) {
      setEmail(emailParam);
      setOtp(otpParam);
    } else {
      window.location.href = '/forgot-password';
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      toast({ 
        title: 'Success! 🎉', 
        description: 'Your password has been reset' 
      });

      // Navigate to login
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className=" bg-background flex items-center justify-center">
        {/* <Navbar /> */}
        <div className="flex w-full">
      <div className="w-[50%] hidden lg:flex">
          <img src={Bg} alt="background image" className="w-full object-cover" />
        </div>

        <div className="pt-4 px-4 container m-auto lg:w-[50%] ">
        <Card className="border-0 h-[100vh]">
          <CardHeader className="text-center">
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              Enter your new password
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errors.newPassword) setErrors({ ...errors, newPassword: undefined });
                    }}
                    placeholder="Enter new password (min 8 characters)"
                    className={`placeholder:text-gray-400 pr-10 ${errors.newPassword ? 'border-destructive' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.newPassword}
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
                    placeholder="Confirm new password"
                    className={`placeholder:text-gray-400 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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

              <Button type="submit" disabled={submitting} className="w-full bg-gradient-hero">
                {submitting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a 
                href="/login" 
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Back to Login
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}