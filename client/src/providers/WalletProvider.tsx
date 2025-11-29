// // src/providers/WalletProvider.tsx
// import { wagmiConfig } from "@/config/wagmi";
// import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { base, baseSepolia } from "wagmi/chains";
// import { WagmiProvider } from "wagmi";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const queryClient = new QueryClient();

// export function WalletProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <WagmiProvider config={wagmiConfig}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider chains={[base, baseSepolia]} modalSize="compact">
//           {children}
//         </RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }

// src/providers/WalletProvider.tsx
// import '@rainbow-me/rainbowkit/styles.css';
// import { WagmiProvider } from 'wagmi';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
// import { wagmiConfig } from '@/config/wagmi';

// const queryClient = new QueryClient();

// export function WalletProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <WagmiProvider config={wagmiConfig}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider modalSize="compact">
//           {children}
//         </RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }


import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '@/config/wagmi';

const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}