import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { getNextRoute } from '@/lib/getNextRoute';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast({
        title: 'Authentication Failed',
        description: 'Google sign-in failed. Please try again.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (token) {
      localStorage.setItem('token', token);
      refresh().then((updatedUser) => {
        toast({
          title: 'Welcome!',
          description: 'Successfully signed in with Google',
        });
        navigate(getNextRoute(updatedUser));
      }).catch(() => {
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, refresh, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign-in...</p>
      </div>
    </div>
  );
}

