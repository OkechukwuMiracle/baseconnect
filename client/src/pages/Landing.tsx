import React, { useState } from 'react';
import { Menu, X, Wallet, FileText, DollarSign, CheckCircle, Search, FileCheck, Zap, Shield, Globe, Layers, Users, Star } from 'lucide-react';

// Reusable Crypto Background Component
const CryptoBackground = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(240, 249, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        for (let j = index + 1; j < particles.length; j++) {
          const dx = particle.x - particles[j].x;
          const dy = particle.y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
      style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)' }}
    />
  );
};

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  // Load fonts
  React.useEffect(() => {
    const link1 = document.createElement('link');
    link1.href = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap';
    link1.rel = 'stylesheet';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link2.rel = 'stylesheet';
    document.head.appendChild(link2);

    const link3 = document.createElement('link');
    link3.href = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap';
    link3.rel = 'stylesheet';
    document.head.appendChild(link3);

    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
      document.head.removeChild(link3);
    };
  }, []);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Payouts",
      description: "Receive payments instantly upon task completion. No waiting, no delays."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Escrow",
      description: "Smart contracts hold funds until work is complete and verified to guarantee trust."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Access",
      description: "Work with users from anywhere in the world without borders or transaction limits."
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Low Fees",
      description: "Built on Base L2 for lightning-fast transactions at minimal cost."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Decentralized Network",
      description: "No middlemen - an entirely trustless, peer-to-peer transaction system."
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Reputation System",
      description: "Build your on-chain reputation with verified work history and user approval."
    }
  ];

  const taskCreatorSteps = [
    { 
      icon: <Wallet className="w-6 h-6" />,
      title: "Connect Wallet", 
      description: "Link your wallet to access the marketplace securely." 
    },
    { 
      icon: <FileText className="w-6 h-6" />,
      title: "Create a Task", 
      description: "Define your task and set the reward." 
    },
    { 
      icon: <DollarSign className="w-6 h-6" />,
      title: "Fund Escrow", 
      description: "Lock funds in a smart contract." 
    },
    { 
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Approve & Pay", 
      description: "Review work and release payment instantly." 
    }
  ];

  const taskContributorSteps = [
    { 
      icon: <Wallet className="w-6 h-6" />,
      title: "Connect Wallet", 
      description: "Link your wallet to access the marketplace securely." 
    },
    { 
      icon: <Search className="w-6 h-6" />,
      title: "Find Jobs", 
      description: "Browse available micro jobs plus listing." 
    },
    { 
      icon: <FileCheck className="w-6 h-6" />,
      title: "Complete Work", 
      description: "Deliver quality work and submit for review." 
    },
    { 
      icon: <DollarSign className="w-6 h-6" />,
      title: "Get Paid Instantly", 
      description: "Receive payments directly to your wallet upon approval." 
    }
  ];

  const faqs = [
    { 
      question: "What is BaseConnect?", 
      answer: "BaseConnect is an on-chain micro-job marketplace on Base, enabling users to post tasks and get paid instantly through smart contract escrow." 
    },
    { 
      question: "How is BaseConnect different from traditional gig platforms?", 
      answer: "BaseConnect eliminates high fees, slow payouts, and centralized control by offering instant on-chain payments, low fees, and full transparency." 
    },
    { 
      question: "Who can use BaseConnect?", 
      answer: "Creators who want to post and fund tasks. Contributors who want to complete tasks and earn instantly. Anyone with a crypto wallet can use the platform." 
    },
    { 
      question: "What happens if a task submission is rejected?", 
      answer: "Creators can request changes or reject the work. A community dispute system through the BaseConnect DAO will soon help handle escalations fairly." 
    },
    { 
      question: "Can I withdraw my earnings instantly?", 
      answer: "Yes. Once a task is approved, the smart contract sends the payment directly to your wallet. There is no waiting or manual withdrawal process." 
    },
    { 
      question: "Can businesses use BaseConnect?", 
      answer: "Yes. Once a task is approved, the smart contract sends the payment directly to your wallet. There is no waiting or manual withdrawal process." 
    }
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      <CryptoBackground />
      
      {/* Navigation */}
      <nav className="relative z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/baseconnect-logo-1.png" alt="BaseConnect Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-900">BaseConnect</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600 transition font-medium">Home</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition font-medium">About</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition font-medium">How it works</a>
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition font-medium">Features</a>
          </div>

          <button className="hidden lg:block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium">
            Learn more
          </button>

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
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium">
                Learn more
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative z-10 text-center px-6 py-16 md:py-24 max-w-5xl mx-auto">
        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          Built on Base ⚡
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-[#010131]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
          Connect. Build. <span className="text-blue-600">Earn.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          The first decentralized micro-job marketplace on Base. Get paid instantly for simple online tasks — fully on-chain, trustless, and low fee.
        </p>
        <button className="text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition shadow-lg hover:shadow-xl" style={{ fontFamily: 'Figtree, sans-serif', background: 'linear-gradient(to right, #0C13FF, #22C0FF)' }}>
          Claim your spot
        </button>

        {/* Hero Preview Image - Hidden on mobile */}
        <div className="mt-16 hidden md:block">
          <img 
            src="/hero-preview.png" 
            alt="BaseConnect Dashboard Preview" 
            className="w-full rounded-2xl shadow-2xl border border-gray-200"
          />
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 px-6 py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              How it <span className="text-blue-600">Works</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Get started in minutes with our streamlined Web3 workflow
            </p>
          </div>

          {/* For Task Creators */}
          <div className="mb-16">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
              For Task Creators
            </h3>
            <div className="relative">
              {/* Curved Line SVG */}
              <svg className="absolute left-6 top-0 h-full w-20 hidden md:block" viewBox="0 0 80 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 0 }}>
                <path d="M40 0 Q10 150 40 300 T40 600" stroke="#D97706" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative" style={{ zIndex: 1 }}>
                {taskCreatorSteps.map((step, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base md:text-lg text-gray-900 mb-1">{step.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* For Task Contributors */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
              For Task Contributors
            </h3>
            <div className="relative">
              {/* Curved Line SVG */}
              <svg className="absolute left-6 top-0 h-full w-20 hidden md:block" viewBox="0 0 80 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 0 }}>
                <path d="M40 0 Q10 150 40 300 T40 600" stroke="#D97706" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative" style={{ zIndex: 1 }}>
                {taskContributorSteps.map((step, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base md:text-lg text-gray-900 mb-1">{step.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              <span className="text-blue-600">Features</span> for Reliable On-Chain Operations
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Experience the power of decentralized work with cutting-edge<br className="hidden md:block" /> blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 px-6 py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="text-gray-600 text-base">Everything you need to know about BaseConnect</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-900 text-sm md:text-base">{faq.question}</span>
                  <span className="text-gray-400 text-xl font-light ml-4">{openFaq === index ? '−' : '+'}</span>
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl p-10 md:p-14 text-center shadow-xl" style={{ background: 'linear-gradient(to right, #0C13FF, #22C0FF)' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Ready to Get Started?
            </h2>
            <p className="text-blue-50 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Connect your wallet to access the marketplace and start<br className="hidden md:block" /> earning instantly
            </p>
            <button className="bg-white text-blue-600 px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-gray-50 transition shadow-lg hover:shadow-xl" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Claim your spot
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-gray-200 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <img src="/baseconnect-logo-1.png" alt="BaseConnect Logo" className="w-10 h-10" />
              <span className="text-xl font-bold text-gray-900">BaseConnect</span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">About</a>
              <a href="#docs" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Docs</a>
              <a href="#privacy" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Privacy</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Contact</a>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              The decentralized job marketplace built with React, Node.js, and Solidity. Enabling secure,<br className="hidden md:block" /> transparent on-chain task management and instant crypto payments.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-gray-500">
            <span>© 2025 BaseConnect - Built on Base L2</span>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#privacy-policy" className="hover:text-blue-600 transition">Privacy Policy</a>
              <a href="#terms" className="hover:text-blue-600 transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;