import React, {useState} from 'react'
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/baseconnect-logo-1.png";
import { Menu, X } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const LandingNavbar = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [logoHovered, setLogoHovered] = useState(false);
    const [textVisible, setTextVisible] = useState(false);

  return (
    <div>
      {/* Navigation */}
      <nav className="fixed w-full z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200 ">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
                    to="/" 
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity overflow-hidden cursor-pointer"
                    onMouseEnter={() => setLogoHovered(true)}
                    onMouseLeave={() => setLogoHovered(false)}
                  >
                    <img 
                      src={logo} 
                      alt="BaseConnect Logo" 
                      className="h-10 w-10 cursor-pointer md:cursor-auto" 
                      onClick={(e) => {
                        e.preventDefault();
                        setTextVisible(!textVisible);
                      }}
                    />
                    <AnimatePresence>
                      {(logoHovered || textVisible) && (
                        <motion.span 
                          className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent whitespace-nowrap"
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: "auto", opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                        >
                          BaseConnect
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600 transition font-medium">Home</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition font-medium">About</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition font-medium">How it works</a>
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition font-medium">Features</a>
          </div>
          <div className=" hidden lg:flex pt-2 mt-8">
              <ConnectButton />
            </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex flex-col gap-4">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition font-medium">Home</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition font-medium">About</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition font-medium">How it works</a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition font-medium">Features</a>
              
              <div className="pt-2 mt-8">
              <ConnectButton />
            </div>
            
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default LandingNavbar
