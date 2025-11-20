import { createWeb3Modal, defaultConfig } from '@web3modal/ethers'

// Get your project ID from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID_HERE'

// Define the chains you want to support
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

const base = {
  chainId: 8453,
  name: 'Base',
  currency: 'ETH',
  explorerUrl: 'https://basescan.org',
  rpcUrl: 'https://mainnet.base.org'
}

const baseSepolia = {
  chainId: 84532,
  name: 'Base Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.basescan.org',
  rpcUrl: 'https://sepolia.base.org'
}

// App metadata
const metadata = {
  name: 'BaseConnect',
  description: 'BaseConnect - Connect creators with contributors',
  url: window.location.origin,
  icons: [`${window.location.origin}/logo.png`]
}

// Create the modal
export const web3Modal = createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [base, baseSepolia, mainnet],
  projectId,
  enableAnalytics: true, // Optional
  themeMode: 'light', // or 'dark'
  themeVariables: {
    '--w3m-accent': '#3b82f6', // Customize to match your brand
  }
})