import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/baseconnect-logo-1.png";
import { Menu, X } from 'lucide-react';
import CustomConnectButton from '@/components/CustomConnectButton';

const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on the landing page
  const isLandingPage = location.pathname === '/';

  // Smart navigation handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (isLandingPage) {
      // If on landing page, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        const navHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // If on another page, navigate to landing page with hash
      navigate(`/#${sectionId}`);
      
      // After navigation, scroll to section
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const navHeight = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  // Close logo text on outside click/touch (works on mobile)
  useEffect(() => {
    const handleOutside = (e: Event) => {
      const target = e.target as Node;
      if (logoRef.current && !logoRef.current.contains(target)) {
        setTextVisible(false);
        setLogoHovered(false);
      }
    };

    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('mousedown', handleOutside);
    return () => {
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('mousedown', handleOutside);
    };
  }, []);

  return (
    <div>
      {/* Navigation */}
      <nav className="fixed w-full z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            ref={logoRef}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity overflow-hidden cursor-pointer"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            onTouchStart={() => setLogoHovered(true)}
            onTouchEnd={() => setLogoHovered(false)}
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
                  className="text-xl font-bold text-gray-900 inline-block overflow-hidden"
                  style={{ transformOrigin: 'left' }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                  <b style={{ 
                    fontFamily: 'Figtree, sans-serif', 
                    background: 'linear-gradient(to right, #0C13FF, #22C0FF)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    BaseConnect
                  </b>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <a 
              href="#home" 
              onClick={(e) => handleNavClick(e, 'home')}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Home
            </a>
           <Link 
  to="/about"
  className="text-gray-700 hover:text-blue-600 transition font-medium"
>
  About
</Link>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleNavClick(e, 'how-it-works')}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              How it works
            </a>
            <a 
              href="#features" 
              onClick={(e) => handleNavClick(e, 'features')}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Features
            </a>
          </div>
       
          <div className='hidden md:block'>
            <CustomConnectButton />
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
              <a 
                href="/" 
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                Home
              </a>
              <Link to="/about"
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                About
              </Link>
            <a
                href="#how-it-works" 
                onClick={(e) => handleNavClick(e, 'how-it-works')}
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                How it works
              </a>
              <a 
                href="#features" 
                onClick={(e) => handleNavClick(e, 'features')}
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                Features
              </a>
              <button onClick={() => setMobileMenuOpen(false)}>
                <CustomConnectButton />
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default LandingNavbar;