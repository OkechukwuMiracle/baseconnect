// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/providers/AuthProvider";
// import { useAccount, useSignMessage } from 'wagmi';

// export const useWalletAuth = () => {
//   const { toast } = useToast();
//   const { refresh } = useAuth();
//   const { address, isConnected } = useAccount();
//   const { signMessageAsync } = useSignMessage();

//   const authenticateWithWallet = async () => {
//     if (!isConnected || !address) {
//       throw new Error('Please connect your wallet before continuing');
//     }

//     const walletAddress = address.toLowerCase();

//     // Request nonce from server
//     const nonceRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/wallet/request`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ walletAddress }),
//     });

//     const nonceData = await nonceRes.json();
//     if (!nonceRes.ok) {
//       throw new Error(nonceData.message || 'Failed to initiate wallet authentication');
//     }

//     const message = `BaseConnect authentication nonce: ${nonceData.nonce}`;

//     // Use wagmi to sign the message instead of window.ethereum
//     const signature = await signMessageAsync({ account: address, message });

//     // Verify signature with server
//     const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/wallet/verify`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ walletAddress, signature }),
//     });

//     const verifyData = await verifyRes.json();
//     if (!verifyRes.ok) {
//       throw new Error(verifyData.message || 'Wallet authentication failed');
//     }

//     localStorage.setItem('token', verifyData.token);
//     await refresh();

//     // Notify external verification endpoint (non-blocking)
//     try {
//       const KICKOFF_SLUG = import.meta.env.VITE_KICKOFF_SLUG || 'baseconnect';
//       const KICKOFF_API_KEY = import.meta.env.VITE_KICKOFF_API_KEY || '694de713-bfb1-4e96-b8a1-a99db6595a0e';
//       const kickoffRes = await fetch(`https://www.kickoff.fun/api/projects/${KICKOFF_SLUG}/verify-task`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-API-Key': KICKOFF_API_KEY,
//         },
//         body: JSON.stringify({ walletAddress, taskType: 'connect_wallet' }),
//       });
//       if (!kickoffRes.ok) {
//         console.warn('Kickoff verification failed', await kickoffRes.text());
//       }
//     } catch (e) {
//       console.warn('Kickoff verification error', e);
//     }

//     return verifyData.user;
//   };

//   const withToast = async () => {
//     try {
//       return await authenticateWithWallet();
//     } catch (error) {
//       const message = error instanceof Error ? error.message : 'Wallet authentication failed';
//       toast({
//         title: 'Wallet Error',
//         description: message,
//         variant: 'destructive',
//       });
//       throw error;
//     }
//   };

//   return { authenticateWithWallet: withToast };
// };





// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/providers/AuthProvider";
// import { useAccount, useSignMessage } from "wagmi";

// export const useWalletAuth = () => {
//   const { toast } = useToast();
//   const { refresh } = useAuth();
//   const { address, isConnected } = useAccount();
//   const { signMessageAsync } = useSignMessage();

//   const authenticateWithWallet = async () => {
//     if (!isConnected || !address) {
//       throw new Error("Please connect your wallet before continuing");
//     }

//     const walletAddress = address.toLowerCase();

//     // 1️⃣ Request a nonce from your backend
//     const nonceRes = await fetch(
//       `${import.meta.env.VITE_API_URL}/api/auth/wallet/request`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ walletAddress }),
//       }
//     );

//     const nonceData = await nonceRes.json();

//     if (!nonceRes.ok) {
//       throw new Error(
//         nonceData.message || "Failed to initiate wallet authentication"
//       );
//     }

//     const message = `BaseConnect authentication nonce: ${nonceData.nonce}`;

//     // 2️⃣ Sign message using wagmi (updated)
//     const signature = await signMessageAsync({
//   account: address as `0x${string}`,
//   message,
// });


//     // 3️⃣ Verify signed message with your backend
//     const verifyRes = await fetch(
//       `${import.meta.env.VITE_API_URL}/api/auth/wallet/verify`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           walletAddress,
//           signature,
//         }),
//       }
//     );

//     const verifyData = await verifyRes.json();

//     if (!verifyRes.ok) {
//       throw new Error(
//         verifyData.message || "Wallet authentication failed"
//       );
//     }

//     // Store JWT from backend
//     localStorage.setItem("token", verifyData.token);

//     await refresh();

//     // 4️⃣ (Non-blocking) Kickoff task verification
//     try {
//       const KICKOFF_SLUG =
//         import.meta.env.VITE_KICKOFF_SLUG || "baseconnect";
//       const KICKOFF_API_KEY =
//         import.meta.env.VITE_KICKOFF_API_KEY ||
//         "694de713-bfb1-4e96-b8a1-a99db6595a0e";

//       await fetch(
//         `https://www.kickoff.fun/api/projects/${KICKOFF_SLUG}/verify-task`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "X-API-Key": KICKOFF_API_KEY,
//           },
//           body: JSON.stringify({
//             walletAddress,
//             taskType: "connect_wallet",
//           }),
//         }
//       );
//     } catch (err) {
//       console.warn("Kickoff verification error:", err);
//     }

//     // return { walletAddress };
//     return verifyData.user;

//   };

//   return { authenticateWithWallet };
// };




import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { useAccount, useSignMessage } from "wagmi";

export const useWalletAuth = () => {
const { toast } = useToast();
const { refresh } = useAuth();
const { address, isConnected } = useAccount();
const { signMessageAsync } = useSignMessage();

const authenticateWithWallet = async () => {
try {
if (!isConnected || !address) {
throw new Error("Please connect your wallet before continuing");
}

  const walletAddress = address.toLowerCase();

  // 1️⃣ Request nonce from backend
  const nonceRes = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/wallet/request`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress }),
    }
  );

  const nonceData = await nonceRes.json();
  if (!nonceRes.ok) {
    throw new Error(nonceData.message || "Failed to request nonce");
  }

  const message = `BaseConnect authentication nonce: ${nonceData.nonce}`;

  // 2️⃣ Sign the message using Wagmi (do NOT pass account)
  const signature = await signMessageAsync({ message });

  // 3️⃣ Verify signed message with backend
  const verifyRes = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/wallet/verify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, signature }),
    }
  );

  const verifyData = await verifyRes.json();
  if (!verifyRes.ok) {
    throw new Error(verifyData.message || "Wallet authentication failed");
  }

  // Store JWT
  localStorage.setItem("token", verifyData.token);

  await refresh();

  // 4️⃣ Non-blocking: Kickoff task verification
  try {
    const KICKOFF_SLUG =
      import.meta.env.VITE_KICKOFF_SLUG || "baseconnect";
    const KICKOFF_API_KEY =
      import.meta.env.VITE_KICKOFF_API_KEY ||
      "694de713-bfb1-4e96-b8a1-a99db6595a0e";

    await fetch(
      `https://www.kickoff.fun/api/projects/${KICKOFF_SLUG}/verify-task`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": KICKOFF_API_KEY,
        },
        body: JSON.stringify({
          walletAddress,
          taskType: "connect_wallet",
        }),
      }
    );
  } catch (err) {
    console.warn("Kickoff verification error:", err);
  }

  // Return authenticated user object
  return verifyData.user;
} catch (error) {
  console.error("Wallet authentication error:", error);
  toast({
    title: "Wallet Authentication Failed",
    description: error instanceof Error ? error.message : "Please try again",
    variant: "destructive",
  });
  throw error;
}
};
return { authenticateWithWallet };
};
