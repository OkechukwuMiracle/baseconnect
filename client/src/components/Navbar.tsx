import { Link } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import logo from "@/assets/baseconnect-logo-1.png";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src={logo} alt="BaseConnect" className="h-10 w-10 " />
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            BaseConnect
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/tasks" className="text-sm font-medium hover:text-primary transition-colors">
            Browse Tasks
          </Link>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
