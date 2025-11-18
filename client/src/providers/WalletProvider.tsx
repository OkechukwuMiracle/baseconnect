import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 👇 Replace this with your actual Project ID from WalletConnect Cloud
const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'aec5db76a5b7dc1b2e387831bd43f6a8';

// console.log('WalletConnect Project ID:', WALLETCONNECT_PROJECT_ID);

// Optional: add your app metadata for better relay connections
const metadata = {
  name: 'BaseConnect',
  description: 'Connect. Build. Earn.',
  url: typeof window !== 'undefined'
    ? window.location.origin
    : 'https://www.baseconnecthub.org',
  icons: ['https://baseconnect.vercel.app/icon.png'],
};

const config = getDefaultConfig({
  appName: 'BaseConnect',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [base, baseSepolia],
  ssr: false,
});

const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
