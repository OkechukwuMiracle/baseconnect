// // src/config/web3modal.ts
// import { createWeb3Modal } from '@web3modal/wagmi/react';
// import { wagmiConfig } from './wagmi';

// const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// if (!projectId) {
//   console.error('VITE_WALLETCONNECT_PROJECT_ID is not set');
// }

// createWeb3Modal({
//   wagmiConfig,
//   projectId,
//   themeMode: 'light',
// });


import { createWeb3Modal } from '@web3modal/wagmi/react';
import { wagmiConfig } from './wagmi';

let initialized = false;

export const initializeWeb3Modal = () => {
  if (initialized) {
    return;
  }

  const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string;

  if (!projectId) {
    throw new Error(
      'VITE_WALLETCONNECT_PROJECT_ID is required but not set in your environment variables. Please add it to your .env file.'
    );
  }

  try {
    createWeb3Modal({
      wagmiConfig,
      projectId,
      enableAnalytics: true, // Optional: helps with debugging
      themeMode: 'light',
    });

    initialized = true;
    console.log('Web3Modal successfully initialized');
  } catch (error) {
    console.error('Failed to initialize Web3Modal:', error);
    throw error;
  }
};