// src/config/wagmi.ts
import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { walletConnect } from 'wagmi/connectors';
import { coinbaseWallet } from 'wagmi/connectors';

// WalletConnect Project ID
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'BaseConnect',
    }),
    walletConnect({
      projectId,
      metadata: {
        name: "BaseConnect",
        description: "Connect. Build. Earn.",
        url: "https://baseconnecthub.org",
        icons: ["https://baseconnecthub.org/logo.png"],
      }
    })
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http()
  }
});
