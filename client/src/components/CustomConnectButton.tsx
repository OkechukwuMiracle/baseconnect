import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract } from 'wagmi';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletAuth } from '@/hooks/useWalletAuth';

// Minimal ERC20 ABI for balanceOf
const ERC20_ABI = [{
  constant: true,
  inputs: [{ name: 'account', type: 'address' }],
  name: 'balanceOf',
  outputs: [{ name: '', type: 'uint256' }],
  type: 'function',
}];

// USDC address used across the app (Base Sepolia / test value)
const USDC_ADDRESS = (import.meta.env.VITE_USDC_ADDRESS as `0x${string}`) || '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
const USDC_DECIMALS = 6;

const CustomConnectButton = () => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const { authenticateWithWallet } = useWalletAuth();
  const authedFor = useRef<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);

  // Read USDC balance when connected
  const { data: rawBalance } = useReadContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address as `0x${string}`] : undefined,
    // `enabled` and `refetchInterval` are provided inside `query` to satisfy wagmi/react-query types
    query: { enabled: !!address && isConnected, refetchInterval: 10000 },
  });

  useEffect(() => {
    if (!rawBalance) {
      setUsdcBalance(null);
      return;
    }
    try {
      const asNumber = Number(rawBalance.toString());
      setUsdcBalance(asNumber / 10 ** USDC_DECIMALS);
    } catch (e) {
      setUsdcBalance(null);
    }
  }, [rawBalance]);

  // When the wallet connects, attempt server wallet auth once per address
  useEffect(() => {
    if (!isConnected || !address) return;
    const lower = address.toLowerCase();
    if (authedFor.current === lower) return;
    // If user already has a token, skip
    const token = localStorage.getItem('token');
    if (token) {
      authedFor.current = lower;
      return;
    }

    (async () => {
      try {
        const user = await authenticateWithWallet();
        authedFor.current = lower;
        // Navigate based on profile completion / role
        if (!user) return;
        if (!user.profileCompleted) {
          navigate('/onboarding');
        } else if (user.role === 'creator') {
          navigate('/dashboard/creator');
        } else {
          navigate('/dashboard/contributor');
        }
      } catch (err) {
        // authentication handled withToast inside hook
      }
    })();
  }, [isConnected, address, authenticateWithWallet, navigate]);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openChainModal, openAccountModal, mounted }) => {
        const connected = mounted && account && chain && isConnected;

        return (
          <div
            {...(!mounted && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {!connected ? (
              <button
                onClick={openConnectModal}
                className="px-4 py-2 rounded-md text-white font-semibold"
                style={{ background: 'linear-gradient(to right, #0C13FF, #22C0FF)' }}
                type="button"
              >
                Connect Wallet
              </button>
            ) : chain?.unsupported ? (
              <button onClick={openChainModal} type="button" className="px-3 py-2 rounded-md border">Wrong network</button>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={openChainModal} type="button" className="px-2 py-1 rounded-md border flex items-center gap-2">
                  {chain?.hasIcon && (
                    <div style={{ background: chain.iconBackground, width: 16, height: 16, borderRadius: 999, overflow: 'hidden' }}>
                      {chain.iconUrl && <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} style={{ width: 16, height: 16 }} />}
                    </div>
                  )}
                  <span className="text-sm">{chain?.name}</span>
                </button>

                <button onClick={openAccountModal} type="button" className="px-3 py-1 rounded-md border flex items-center gap-2">
                  <span className="text-sm">{account?.displayName}</span>
                  <span className="text-xs text-muted-foreground">
  {usdcBalance != null ? `${usdcBalance.toFixed(4)} USDC` : '0 USDC'}
</span>

                </button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
