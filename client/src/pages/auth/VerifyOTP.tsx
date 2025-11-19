import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
// import { Navbar } from "@/components/Navbar";
import Bg from "@/assets/auth-bg-2.png"
export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Get email from URL params
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      window.location.href = '/forgot-password';
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      toast({ 
        title: 'OTP Verified! ✅', 
        description: 'Now set your new password' 
      });

      // Navigate to reset password page
      window.location.href = `/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`;
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Invalid or expired OTP', 
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
        body: JSON.stringify({ email, purpose: 'reset-password' })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      toast({ 
        title: 'OTP Resent! ✉️', 
        description: 'Check your email for the new code' 
      });
      setCountdown(60); // 60 second cooldown
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to resend OTP', 
        variant: 'destructive' 
      });
    } finally {
      setResending(false);
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
                {submitting ? 'Verifying...' : 'Verify Code'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button
                onClick={resendOTP}
                disabled={resending || countdown > 0}
                className="w-full bg-gradient-hero"
              >
                {resending 
                  ? 'Resending...' 
                  : countdown > 0 
                    ? `Resend in ${countdown}s` 
                    : 'Resend Code'}
              </Button>

              <a 
                href="/forgot-password" 
                className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2 mt-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Use different email
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}