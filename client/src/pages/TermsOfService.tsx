import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';

// Mock Navbar - Replace with: import { LandingNavbar } from '../components/LandingNavbar';

// Twitter Icon
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TermsOfService = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    setMounted(true);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Figtree, sans-serif' }}>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
        <div className={`max-w-4xl mx-auto transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 mb-2">Last Updated</p>
          <div className="flex items-center gap-2 text-gray-700">
            <span>Contact:</span>
            <a href="mailto:usebaseconnect@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium transition">
              usebaseconnect@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className={`max-w-4xl mx-auto transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200 space-y-8">
            
            <div>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                Welcome to BaseConnect. By signing up, connecting your wallet, or using any part of the platform, you agree to the following Terms of Service. These terms exist to protect you, protect BaseConnect, and ensure a safe, transparent environment for collaboration and onchain interaction.
              </p>
              <p className="text-gray-700 leading-relaxed">
                BaseConnect is a decentralized micro-job ecosystem built on Base. It serves as a connection layer where creators, contributors, and talent exchange value through tasks, collaborations, and instant onchain payments. Because BaseConnect is built on blockchain technology, every action taken through your connected wallet interacts with Base smart contracts, meaning transactions are transparent, permissionless, and permanent.
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                To use the platform, you must be at least 18 years old and legally allowed to use web3 services and digital wallets in your region. When you create an account or connect a wallet, you are fully responsible for maintaining the security of your device, wallet, and private keys. BaseConnect does not and will never request or store your seed phrase, private keys, or any sensitive wallet information. Any action performed through your wallet—such as task payments, approvals, or contract interactions—is final and irreversible.
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                Because transactions occur onchain, BaseConnect cannot control network congestion, gas fees, smart contract execution times, or blockchain errors. The platform may charge small fees for certain actions or transactions, and these fees will always be shown clearly before you proceed. By continuing to use the platform, you acknowledge that blockchain transactions come with inherent risks and delays outside our direct control.
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                As a user, you agree to behave responsibly. You must not post illegal content, fraudulent tasks, harmful requests, or any material intended to deceive or exploit others. You may not attempt to damage the platform, manipulate smart contracts, upload malware, or abuse other users. Your use of BaseConnect is entirely at your own risk, and we reserve the right to suspend or restrict accounts that violate these terms.
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                BaseConnect is provided "as-is" without warranties of any kind. We are not liable for losses caused by failed transactions, wallet errors, user disputes, system downtime, bugs, or issues arising from the underlying blockchain. While we are committed to improving the platform, we cannot guarantee uninterrupted service or absolute security.
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                We may update these Terms from time to time. When changes are made, we will update the date above. Your continued use of BaseConnect after any revision means you accept the updated Terms.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-10 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/baseconnect-logo-1.png" alt="BaseConnect" className="w-10 h-10" />
                <span className="text-xl font-bold" style={{ 
                  background: 'linear-gradient(to right, #0C13FF, #22C0FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  BaseConnect
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                The decentralized micro-job marketplace built on Base L2. Connect, build, and earn with instant crypto payments.
              </p>
            </div>
            <div className="flex flex-col md:items-end gap-4">
              <div className="flex flex-wrap gap-6">
                <a href="/about" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">About</a>
                <a href="/docs" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Docs</a>
                <a href="/privacy" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Privacy</a>
                <a href="/contact" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Contact</a>
              </div>
              <div className="flex items-center gap-4">
                <a href="https://x.com/useBaseConnect" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition">
                  <TwitterIcon />
                </a>
                <a href="mailto:UseBaseConnect@gmail.com" className="text-gray-600 hover:text-blue-600 transition">
                  <Mail className="w-5 h-5" />
                </a>
                 <a href="https://discord.com/invite/MQWZT4g76" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition"><FaDiscord className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-gray-600">
            <span>© 2025 BaseConnect. Built on Base L2</span>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-blue-600 transition">Privacy Policy</a>
              <a href="/terms" className="hover:text-blue-600 transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;