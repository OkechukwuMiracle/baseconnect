import { useState } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/baseconnect-logo-1.png";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <motion.div className="container mx-auto px-4 h-16 flex items-center justify-between" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src={logo} alt="BaseConnect" className="h-10 w-10 " />
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            BaseConnect
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
              Home
            </Link>
          <Link to="/tasks" className="text-sm font-medium hover:text-primary transition-colors">
            View Tasks
          </Link>
          <ConnectButton />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-muted/50"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </motion.div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
            <Link to="/" className="text-xl font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link to="/tasks" className="text-xl font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
              View Tasks
            </Link>
            <div className="pt-2">
              <ConnectButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
