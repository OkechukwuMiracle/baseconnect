// src/components/LandingNavbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

// Optional: if you have logo in public folder
// const logo = '/baseconnect-logo-1.png';

const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close menu on ESC or outside click
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu after clicking a nav link
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2" onClick={closeMenu}>
          <img
            src="/baseconnect-logo-1.png"
            alt="BaseConnect Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-gray-900">BaseConnect</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#home"
            className="text-gray-600 hover:text-blue-600 transition font-medium"
            onClick={closeMenu}
          >
            Home
          </a>
          <a
            href="#how-it-works"
            className="text-gray-600 hover:text-blue-600 transition font-medium"
            onClick={closeMenu}
          >
            How it Works
          </a>
          <a
            href="#features"
            className="text-gray-600 hover:text-blue-600 transition font-medium"
            onClick={closeMenu}
          >
            Features
          </a>
          <a
            href="#faq"
            className="text-gray-600 hover:text-blue-600 transition font-medium"
            onClick={closeMenu}
          >
            FAQ
          </a>
          <a
            href="/signup"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-600 hover:text-blue-600 p-2"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white border-t border-gray-200 px-6 py-4"
        >
          <div className="flex flex-col gap-4">
            <a
              href="#home"
              className="text-gray-600 hover:text-blue-600 transition font-medium"
              onClick={closeMenu}
            >
              Home
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-600 transition font-medium"
              onClick={closeMenu}
            >
              How it Works
            </a>
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-600 transition font-medium"
              onClick={closeMenu}
            >
              Features
            </a>
            <a
              href="#faq"
              className="text-gray-600 hover:text-blue-600 transition font-medium"
              onClick={closeMenu}
            >
              FAQ
            </a>
            <a
              href="/signup"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-center font-semibold hover:bg-blue-700 transition"
              onClick={closeMenu}
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;