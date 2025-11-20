import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Bg from "@/assets/auth-bg-2.png"

interface FormErrors {
  email?: string;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      toast({ 
        title: 'OTP Sent! ✉️', 
        description: 'Check your email for the verification code' 
      });
      
      // Navigate to verify OTP page
      window.location.href = `/verify-otp?email=${encodeURIComponent(email)}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
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
        <Card className="border-0 h-[100vh] m-auto">
          <CardHeader className="text-center">
            <CardTitle>Forgot Password?</CardTitle>
            <CardDescription>
              Enter your email and we'll send you a verification code
            </CardDescription>
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
                  className={`placeholder:text-gray-400 ${errors.email ? 'border-destructive' : ''}`}
                  required
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={submitting} className="w-full bg-gradient-hero">
                {submitting ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a 
                href="/login" 
                className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
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



