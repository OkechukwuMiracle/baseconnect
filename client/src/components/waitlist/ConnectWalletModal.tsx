import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wallet, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/providers/AuthProvider";

interface ConnectWalletProps {
  task: any;
  onComplete: () => void;
}

export function ConnectWallet({ task, onComplete }: ConnectWalletProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentWallet, setCurrentWallet] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentWallet();
  }, []);

  const loadCurrentWallet = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/profile/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.walletAddress) {
        setCurrentWallet(res.data.walletAddress);
        setWalletAddress(res.data.walletAddress);
      }
    } catch (error) {
      console.error("Error loading wallet:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profile/wallet`,
        { walletAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Wallet Connected!",
        description: "Your wallet address has been saved successfully.",
      });

      setCurrentWallet(walletAddress);
      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 space-y-4">
      {currentWallet && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Wallet Connected</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            {currentWallet}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wallet">Wallet Address</Label>
          <div className="relative">
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="wallet"
              type="text"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="pl-10"
              required
              pattern="^0x[a-fA-F0-9]{40}$"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your Ethereum wallet address (0x followed by 40 hex characters)
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={loading || !!currentWallet}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : currentWallet ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Wallet Connected
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

