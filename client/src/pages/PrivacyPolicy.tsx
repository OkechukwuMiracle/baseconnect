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

const PrivacyPolicy = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    setMounted(true);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Figtree, sans-serif' }}>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
        <div className={`max-w-4xl mx-auto transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
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
              <p className="text-gray-700 leading-relaxed text-lg">
                Your privacy is important to us. BaseConnect is designed as an onchain ecosystem, which means we collect only the minimum information necessary to operate effectively, while giving you full control over your identity and wallet.
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                When you use BaseConnect, the primary piece of information we collect is your wallet address. This is required for authentication, payments, and blockchain interactions. Any additional information you choose to provide, such as your username, email address, bio, skills, or uploaded content—is optional and exists solely to help you personalize your profile and participate more effectively in the ecosystem.
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                We also gather basic non-personal usage data such as your device type, browser type, and general activity patterns. This information helps us improve performance, secure the platform, and understand how users interact with BaseConnect. None of this data includes sensitive personal information, and none of it is used for advertising or sold to third parties.
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                We do not and will never collect private keys, seed phrases, biometric data, or bank card details. You retain full control of your wallet at all times. Since BaseConnect operates onchain, certain activities—such as task payments and contract interactions—become part of the public blockchain and cannot be modified or deleted by us or anyone else. This is a core property of decentralized systems and ensures transparency and trust.
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                Your off-chain data, such as your email or profile details, is stored securely using standard industry practices. However, perfect security cannot be guaranteed, and you are responsible for the protection of your devices and wallet credentials. If you ever decide to remove your off-chain data from our systems, you can contact us at usebaseconnect@gmail.com and we will process your request. While we can delete your off-chain information, we cannot remove anything that already exists on the blockchain.
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy periodically to reflect changes in our practices, technology, or regulatory requirements. Whenever updates occur, the revised date at the top will change. Continued use of BaseConnect signifies your acceptance of the updated Policy.
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

export default PrivacyPolicy;