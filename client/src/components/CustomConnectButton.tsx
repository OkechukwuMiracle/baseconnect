import { 
  useAccount, 
  useReadContract, 
  useChainId, 
  useSwitchChain 
} from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletAuth } from '@/hooks/useWalletAuth';

type AuthUser = {
  walletAddress: string;
  profileCompleted: boolean;
  role: "creator" | "contributor";
};


// Minimal ERC20 ABI
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
];

// USDC Config
const USDC_ADDRESS =
  (import.meta.env.VITE_USDC_ADDRESS as `0x${string}`) ||
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
const USDC_DECIMALS = 6;

// Better chain icons - using reliable CDN sources
const CHAIN_ICONS: Record<number, string> = {
  8453: "https://icons.llamao.fi/icons/chains/rsz_base.jpg", // Base Mainnet
  84532: "https://icons.llamao.fi/icons/chains/rsz_base.jpg", // Base Sepolia (same logo)
};

// Fallback: You could also use these alternatives:
// Base64 encoded SVG or a local asset
const BASE_LOGO_SVG = "data:image/svg+xml,%3Csvg width='111' height='111' viewBox='0 0 111 111' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H3.9565e-07C2.35281 87.8625 26.0432 110.034 54.921 110.034Z' fill='%230052FF'/%3E%3C/svg%3E";

export default function CustomConnectButton() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { open } = useWeb3Modal();

  const navigate = useNavigate();
  const { authenticateWithWallet } = useWalletAuth();
  const authedFor = useRef<string | null>(null);

  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  // Read USDC Balance
  const { data: rawBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && isConnected, refetchInterval: 10000 },
  });

  useEffect(() => {
    if (!rawBalance) return setUsdcBalance(null);

    try {
      const asNumber = Number(rawBalance.toString());
      setUsdcBalance(asNumber / 10 ** USDC_DECIMALS);
    } catch {
      setUsdcBalance(null);
    }
  }, [rawBalance]);

  // Backend wallet authentication flow
  useEffect(() => {
    if (!address || !isConnected) return;

    const lower = address.toLowerCase();
    if (authedFor.current === lower) return;

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      authedFor.current = lower;
      return;
    }

    (async () => {
      try {
        const user: AuthUser = await authenticateWithWallet();
        authedFor.current = lower;

        if (!user) return;

        if (!user.profileCompleted) navigate("/onboarding");
        else if (user.role === "creator") navigate("/dashboard/creator");
        else navigate("/dashboard/contributor");
      } catch (err) {
        console.warn('Wallet authentication failed', err);
      }
    })();
  }, [address, isConnected, authenticateWithWallet, navigate]);

  // Determine correct chain info
  const chainInfo =
    chainId === base.id
      ? base
      : chainId === baseSepolia.id
      ? baseSepolia
      : null;

  const chainLogo = CHAIN_ICONS[chainId];
  const chainName = chainInfo?.name ?? "Unknown";

  const isWrongNetwork =
    isConnected && chainId !== base.id && chainId !== baseSepolia.id;

  // Handle image load error
  const handleImageError = () => {
    setImageError(prev => ({ ...prev, [chainId]: true }));
  };

  // Determine which logo to show
  const logoToShow = imageError[chainId] ? BASE_LOGO_SVG : chainLogo;

  return (
    <div className="flex items-center">
      {!isConnected ? (
        <button
          onClick={() => open({ view: "Connect" })}
          className="px-4 py-2 rounded-md text-white font-semibold"
          style={{
            background: "linear-gradient(to right, #0C13FF, #22C0FF)",
          }}
        >
          Connect Wallet
        </button>
      ) : isWrongNetwork ? (
        <button
          onClick={() => switchChain({ chainId: baseSepolia.id })}
          className="px-3 py-2 rounded-md border text-red-500"
        >
          Wrong Network – Switch
        </button>
      ) : (
        <div className="flex items-center gap-3">
          {/* NETWORK BUTTON WITH LOGO */}
          <button
            onClick={() => open({ view: "Networks" })}
            className="hidden  px-3 py-2 rounded-md border md:flex items-center gap-2 hover:bg-gradient-hero hover:text-white"
          >
            {logoToShow && (
              <img
                src={logoToShow}
                alt={chainName}
                className="w-5 h-5 rounded-full object-cover"
                onError={handleImageError}
              />
            )}
            <span className="text-sm">{chainName}</span>
          </button>

          {/* ACCOUNT BUTTON */}
          <button
            onClick={() => open({ view: "Account" })}
            className="mt-[3px] px-3 py-2 rounded-md border flex items-center gap-2 hover:bg-gradient-hero hover:text-white"
          >
            <span className="text-sm">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            <span className="text-xs text-muted-foreground hover:text-white">
              {usdcBalance != null
                ? `${usdcBalance.toFixed(4)} USDC`
                : "0 USDC"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}