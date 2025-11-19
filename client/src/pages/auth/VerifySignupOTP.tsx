import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Bg from "@/assets/auth-bg-2.png"

export default function VerifySignupOTP() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const { refresh } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from URL params
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      navigate('/signup');
    }
  }, [navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a 6-digit verification code',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-signup-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      // Store token
      localStorage.setItem("token", data.token);
      await refresh();

      toast({
        title: 'Account Verified! 🎉',
        description: 'Welcome to BaseConnect!'
      });

      // Navigate to onboarding
      navigate("/onboarding");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid or expired OTP';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resendOTP = async () => {
    setResending(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'signup' })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      toast({
        title: 'Code Resent! ✉️',
        description: 'Check your email for the new code'
      });
      setCountdown(60); // 60 second cooldown
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend OTP';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className=" bg-background flex items-center justify-center">
      <div className="flex w-full">
        <div className="w-[50%] hidden lg:flex">
          <img src={Bg} alt="background image" className="w-full object-cover" />
        </div>

        <div className="pt-4 px-4 container m-auto lg:w-[50%]">
          <Card className="border-0 h-[100vh]">
            <CardHeader className="text-center">
              <CardTitle>Verify Your Email</CardTitle>
              <CardDescription>
                Enter the 6-digit code sent to {email}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="placeholder:text-gray-400 text-center text-2xl tracking-widest font-mono"
                    maxLength={6}
                    required
                  />
                </div>

                <Button type="submit" disabled={submitting || otp.length !== 6} className="w-full bg-gradient-hero">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                <Button
                  type="button"
                  onClick={resendOTP}
                  disabled={resending || countdown > 0}
                  variant="outline"
                  className="w-full"
                >
                  {resending
                    ? 'Resending...'
                    : countdown > 0
                      ? `Resend in ${countdown}s`
                      : 'Resend Code'}
                </Button>

                <a
                  href="/signup"
                  className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2 mt-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Signup
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

