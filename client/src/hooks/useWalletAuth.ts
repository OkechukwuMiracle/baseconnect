import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

export const useWalletAuth = () => {
  const { toast } = useToast();
  const { refresh } = useAuth();

  const authenticateWithWallet = async () => {
    if (!window.ethereum) {
      throw new Error("No wallet provider detected. Please install MetaMask.");
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (!accounts || accounts.length === 0) {
      throw new Error("No wallet accounts found");
    }

    const walletAddress = accounts[0].toLowerCase();

    // Request nonce
    const nonceRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/wallet/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress }),
    });

    const nonceData = await nonceRes.json();
    if (!nonceRes.ok) {
      throw new Error(nonceData.message || "Failed to initiate wallet authentication");
    }

    const message = `BaseConnect authentication nonce: ${nonceData.nonce}`;
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [message, walletAddress],
    });

    const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/wallet/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, signature }),
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok) {
      throw new Error(verifyData.message || "Wallet authentication failed");
    }

    localStorage.setItem("token", verifyData.token);
    await refresh();

    return verifyData.user;
  };

  const withToast = async () => {
    try {
      return await authenticateWithWallet();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Wallet authentication failed";
      toast({
        title: "Wallet Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return { authenticateWithWallet: withToast };
};

