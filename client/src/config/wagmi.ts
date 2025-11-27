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

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [mainnet, base, baseSepolia],
  connectors: connectorsForWallets(
    [
      {
        groupName: 'Recommended',
        wallets: [
          (params) => rainbowWallet({ ...params, projectId }),
          (params) => metaMaskWallet({ ...params, projectId })
        ],
      },
      {
        groupName: 'Others',
        wallets: [
          (params) => coinbaseWallet({ ...params, appName: 'BaseConnect' }),
          (params) => walletConnectWallet({ ...params, projectId })
        ],
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
