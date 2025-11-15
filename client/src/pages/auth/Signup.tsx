import { useState } from "react";
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
import { Navbar } from "@/components/Navbar";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const submit = async (e) => {
    e.preventDefault();

    // Prevent signup if terms not accepted
    if (!accepted) {
      toast({ title: 'Error:', description: 'You must accept the Terms and Privacy Policy to continue.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, firstName, lastName }),
        }
      );

      if (!res.ok) throw new Error("Signup failed");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      toast({ title: 'Account created 🎉', description: 'Continue to onboarding' });
      // Navigate to onboarding
      window.location.href = "/onboarding";
    } catch {
      toast({ title: 'Error:', description: 'Signup failed', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 container mx-auto max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Sign up to start using BaseConnect
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    className="placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="placeholder:text-gray-400"
                  />
                </div>
              </div>

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

              <div className="flex items-start">
                <Checkbox
                  checked={accepted}
                  onCheckedChange={(value) => setAccepted(value === true)}
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

              <Button onClick={submit} disabled={submitting} className="w-full">
                {submitting ? "Creating..." : "Sign up"}
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account?{" "}
              <a className="underline hover:text-primary" href="/login">
                Log in
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
