// src/config/web3modal.ts
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { wagmiConfig } from './wagmi';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

createWeb3Modal({
  wagmiConfig,
  projectId,
  themeMode: 'light',
});
