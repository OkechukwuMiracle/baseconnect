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




// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/providers/AuthProvider";
// import { useAccount, useSignMessage } from "wagmi";

// export const useWalletAuth = () => {
// const { toast } = useToast();
// const { refresh } = useAuth();
// const { address, isConnected } = useAccount();
// const { signMessageAsync } = useSignMessage();

// const authenticateWithWallet = async () => {
// try {
// if (!isConnected || !address) {
// throw new Error("Please connect your wallet before continuing");
// }

//   const walletAddress = address.toLowerCase();

//   // 1️⃣ Request nonce from backend
//   const nonceRes = await fetch(
//     `${import.meta.env.VITE_API_URL}/api/auth/wallet/request`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ walletAddress }),
//     }
//   );

//   const nonceData = await nonceRes.json();
//   if (!nonceRes.ok) {
//     throw new Error(nonceData.message || "Failed to request nonce");
//   }

//   const message = `BaseConnect authentication nonce: ${nonceData.nonce}`;

//   // 2️⃣ Sign the message using Wagmi (do NOT pass account)
//   const signature = await signMessageAsync({ message });

//   // 3️⃣ Verify signed message with backend
//   const verifyRes = await fetch(
//     `${import.meta.env.VITE_API_URL}/api/auth/wallet/verify`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ walletAddress, signature }),
//     }
//   );

//   const verifyData = await verifyRes.json();
//   if (!verifyRes.ok) {
//     throw new Error(verifyData.message || "Wallet authentication failed");
//   }

//   // Store JWT
//   localStorage.setItem("token", verifyData.token);

//   await refresh();

//   // 4️⃣ Non-blocking: Kickoff task verification
//   try {
//     const KICKOFF_SLUG =
//       import.meta.env.VITE_KICKOFF_SLUG || "baseconnect";
//     const KICKOFF_API_KEY =
//       import.meta.env.VITE_KICKOFF_API_KEY ||
//       "694de713-bfb1-4e96-b8a1-a99db6595a0e";

//     await fetch(
//       `https://www.kickoff.fun/api/projects/${KICKOFF_SLUG}/verify-task`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-API-Key": KICKOFF_API_KEY,
//         },
//         body: JSON.stringify({
//           walletAddress,
//           taskType: "connect_wallet",
//         }),
//       }
//     );
//   } catch (err) {
//     console.warn("Kickoff verification error:", err);
//   }

//   // Return authenticated user object
//   return verifyData.user;
// } catch (error) {
//   console.error("Wallet authentication error:", error);
//   toast({
//     title: "Wallet Authentication Failed",
//     description: error instanceof Error ? error.message : "Please try again",
//     variant: "destructive",
//   });
//   throw error;
// }
// };
// return { authenticateWithWallet };
// };




// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/providers/AuthProvider";
// import { useAccount, useSignMessage } from "wagmi";
// import { useRef } from "react";

// export const useWalletAuth = () => {
//   const { toast } = useToast();
//   const { refresh } = useAuth();
//   const { address, isConnected } = useAccount();
//   const { signMessageAsync } = useSignMessage();
  
//   // Prevent multiple simultaneous auth attempts
//   const authInProgress = useRef(false);
//   const lastAuthAddress = useRef<string | null>(null);

//   const authenticateWithWallet = async () => {
//     try {
//       if (!isConnected || !address) {
//         throw new Error("Please connect your wallet before continuing");
//       }

//       const walletAddress = address.toLowerCase();

//       // Prevent duplicate authentication for same address
//       if (authInProgress.current && lastAuthAddress.current === walletAddress) {
//         console.log("Authentication already in progress for this wallet");
//         return null;
//       }

//       // Check if already authenticated
//       const existingToken = localStorage.getItem("token");
//       if (existingToken) {
//         try {
//           const userRes = await fetch(
//             `${import.meta.env.VITE_API_URL}/api/auth/me`,
//             {
//               headers: { Authorization: `Bearer ${existingToken}` },
//             }
//           );
//           if (userRes.ok) {
//             const userData = await userRes.json();
//             if (userData.walletAddress?.toLowerCase() === walletAddress) {
//               console.log("Already authenticated with this wallet");
//               await refresh();
//               return userData;
//             }
//           }
//         } catch (err) {
//           console.log("Token invalid, re-authenticating");
//           localStorage.removeItem("token");
//         }
//       }

//       authInProgress.current = true;
//       lastAuthAddress.current = walletAddress;

//       // 1️⃣ Request nonce from backend
//       const nonceRes = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/auth/wallet/request`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ walletAddress }),
//         }
//       );

//       const nonceData = await nonceRes.json();
//       if (!nonceRes.ok) {
//         throw new Error(nonceData.message || "Failed to request nonce");
//       }

//       const message = `BaseConnect authentication nonce: ${nonceData.nonce}`;

//       // 2️⃣ Sign the message using Wagmi
//       const signature = await signMessageAsync({ message });

//       // 3️⃣ Verify signed message with backend
//       const verifyRes = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/auth/wallet/verify`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ walletAddress, signature }),
//         }
//       );

//       const verifyData = await verifyRes.json();
//       if (!verifyRes.ok) {
//         throw new Error(verifyData.message || "Wallet authentication failed");
//       }

//       // Store JWT
//       localStorage.setItem("token", verifyData.token);

//       await refresh();

//       // 4️⃣ Non-blocking: Kickoff task verification
//       kickoffVerification(walletAddress);

//       return verifyData.user;
//     } catch (error) {
//       console.error("Wallet authentication error:", error);
//       toast({
//         title: "Wallet Authentication Failed",
//         description: error instanceof Error ? error.message : "Please try again",
//         variant: "destructive",
//       });
//       throw error;
//     } finally {
//       authInProgress.current = false;
//     }
//   };

//   // Separate function for Kickoff verification
//   const kickoffVerification = async (walletAddress: string) => {
//     try {
//       const KICKOFF_SLUG = import.meta.env.VITE_KICKOFF_SLUG || "baseconnect";
//       const KICKOFF_API_KEY =
//         import.meta.env.VITE_KICKOFF_API_KEY ||
//         "694de713-bfb1-4e96-b8a1-a99db6595a0e";

//       const response = await fetch(
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

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         console.warn("Kickoff verification failed:", errorData);
//       } else {
//         const data = await response.json();
//         console.log("Kickoff verification successful:", data);
//       }
//     } catch (err) {
//       console.warn("Kickoff verification error:", err);
//     }
//   };

//   return { authenticateWithWallet };
// };


import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { useAccount, useSignMessage } from "wagmi";
import { useRef } from "react";

export const useWalletAuth = () => {
  const { toast } = useToast();
  const { refresh } = useAuth();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  
  // Prevent multiple simultaneous auth attempts
  const authInProgress = useRef(false);
  const lastAuthAddress = useRef<string | null>(null);

  const authenticateWithWallet = async () => {
    try {
      if (!isConnected || !address) {
        throw new Error("Please connect your wallet before continuing");
      }

      const walletAddress = address.toLowerCase();

      // Prevent duplicate authentication for same address
      if (authInProgress.current && lastAuthAddress.current === walletAddress) {
        console.log("Authentication already in progress for this wallet");
        return null;
      }

      // Check if already authenticated with this wallet
      const existingToken = localStorage.getItem("token");
      if (existingToken) {
        try {
          const userRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/me`,
            {
              headers: { Authorization: `Bearer ${existingToken}` },
            }
          );
          if (userRes.ok) {
            const userData = await userRes.json();
            if (userData.walletAddress?.toLowerCase() === walletAddress) {
              console.log("Already authenticated with this wallet");
              await refresh();
              return userData;
            }
          }
        } catch (err) {
          console.log("Token invalid, re-authenticating");
          localStorage.removeItem("token");
        }
      }

      authInProgress.current = true;
      lastAuthAddress.current = walletAddress;

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

      // 2️⃣ Sign the message using Wagmi
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

      // Refresh auth context to get latest user data
      await refresh();

      // 4️⃣ Non-blocking: Kickoff task verification
      kickoffVerification(walletAddress);

      // Return the user object from verify response
      return verifyData.user;
    } catch (error) {
      console.error("Wallet authentication error:", error);
      toast({
        title: "Wallet Authentication Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      authInProgress.current = false;
    }
  };

  // Separate function for Kickoff verification
  const kickoffVerification = async (walletAddress: string) => {
    try {
      const KICKOFF_SLUG = import.meta.env.VITE_KICKOFF_SLUG || "baseconnect";
      const KICKOFF_API_KEY =
        import.meta.env.VITE_KICKOFF_API_KEY ||
        "694de713-bfb1-4e96-b8a1-a99db6595a0e";

      const response = await fetch(
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn("Kickoff verification failed:", errorData);
      } else {
        const data = await response.json();
        console.log("Kickoff verification successful:", data);
      }
    } catch (err) {
      console.warn("Kickoff verification error:", err);
    }
  };

  return { authenticateWithWallet };
};