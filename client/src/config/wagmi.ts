// src/config/wagmi.ts
import { http, createConfig } from 'wagmi';
import { mainnet, base, baseSepolia } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

// WalletConnect Project ID
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [mainnet, base, baseSepolia],
  connectors: connectorsForWallets(
    [
      {
        groupName: 'Recommended',
        wallets: [rainbowWallet({ projectId, chains: [mainnet, base, baseSepolia] }), metaMaskWallet({ projectId, chains: [mainnet, base, baseSepolia] })],
      },
      {
        groupName: 'Others',
        wallets: [coinbaseWallet({ appName: 'BaseConnect', chains: [mainnet, base, baseSepolia] }), walletConnectWallet({ projectId, chains: [mainnet, base, baseSepolia] })],
      },
    ],
    {
      appName: 'BaseConnect',
      projectId,
    }
  ),
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  }
});
