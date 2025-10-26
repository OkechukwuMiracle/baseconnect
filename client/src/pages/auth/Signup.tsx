import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Signup(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      if(!res.ok) throw new Error('Signup failed');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      toast({ title: 'Account created', description: 'Continue to onboarding' });
      navigate('/onboarding');
    } catch {
      toast({ title: 'Error', description: 'Signup failed', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 container mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Sign up to start using BaseConnect</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Doe" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jane@example.com" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">{submitting? 'Creating...' : 'Sign up'}</Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">Already have an account? <a className="underline" href="/login">Log in</a></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
