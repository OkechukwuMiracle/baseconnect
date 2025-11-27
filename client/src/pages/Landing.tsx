import React, { useState, useEffect, useRef } from 'react';
import LandingNavbar from '@/components/LandingNavbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { getNextRoute } from '@/lib/getNextRoute';
import {
  Wallet, FileText, DollarSign, CheckCircle, Search, FileCheck,
  Zap, Shield, Globe, Layers, Users, Star, Mail, Menu, X
} from 'lucide-react';
import { FaDiscord } from "react-icons/fa";

/* ----------  Smooth Scroll Styles  ---------- */
const smoothScrollStyles = `
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 80px;
  }
  
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-up {
    animation: fadeUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
  
  * {
    scroll-behavior: smooth;
  }
`;

/* ----------  SVG Icon  ---------- */
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

/* ----------  Navbar  ---------- */

/* ----------  Animated Background  ---------- */
const CryptoBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const particles: Particle[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
      size = Math.random() * 3 + 1;
      speedX = Math.random() * 0.5 - 0.25;
      speedY = Math.random() * 0.5 - 0.25;
      opacity = Math.random() * 0.5 + 0.2;
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.fillStyle = `rgba(59,130,246,${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    const animate = () => {
      ctx.fillStyle = 'rgba(240,249,255,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(59,130,246,${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 50%,#bae6fd 100%)' }}
    />
  );
};

/* ----------  Page  ---------- */
const Landing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { user, loading, refresh } = useAuth();

  useEffect(() => {
    setMounted(true);
    
    // Inject smooth scroll styles
    const styleEl = document.createElement('style');
    styleEl.textContent = smoothScrollStyles;
    document.head.appendChild(styleEl);
    
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap',
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap'
    ];
    fonts.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    });
    
    return () => {
      styleEl.remove();
    };
  }, []);

  /* scroll-triggered fade-ins */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (ents) =>
        ents.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('animate-fade-up');
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => obs.observe(el));
    
    // Also observe individual cards with data-animate-card
    document.querySelectorAll('[data-animate-card]').forEach((el) => obs.observe(el));
    
    return () => obs.disconnect();
  }, []);

  const features = [
    { icon: <Zap />, title: 'Instant Payouts', desc: 'Receive payments instantly upon task completion. No waiting, no delays.' },
    { icon: <Shield />, title: 'Secure Escrow', desc: 'Smart contracts hold funds until work is complete and verified to guarantee trust.' },
    { icon: <Globe />, title: 'Global Access', desc: 'Work with users from anywhere in the world without borders or transaction limits.' },
    { icon: <Layers />, title: 'Low Fees', desc: 'Built on Base L2 for lightning-fast transactions at minimal cost.' },
    { icon: <Users />, title: 'Decentralized Network', desc: 'No middlemen - an entirely trustless, peer-to-peer transaction system.' },
    { icon: <Star />, title: 'Reputation System', desc: 'Build your on-chain reputation with verified work history and user approval.' }
  ];

  const creatorSteps = [
    { icon: <Wallet />, title: 'Connect Wallet', desc: 'Link your wallet to access the marketplace securely.' },
    { icon: <FileText />, title: 'Create a Task', desc: 'Define your task and set the reward.' },
    { icon: <DollarSign />, title: 'Fund Escrow', desc: 'Lock funds in a smart contract.' },
    { icon: <CheckCircle />, title: 'Approve & Pay', desc: 'Review work and release payment instantly.' }
  ];

  const contributorSteps = [
    { icon: <Wallet />, title: 'Connect Wallet', desc: 'Link your wallet to access the marketplace securely.' },
    { icon: <Search />, title: 'Find Jobs', desc: 'Browse available micro jobs plus listing.' },
    { icon: <FileCheck />, title: 'Complete Work', desc: 'Deliver quality work and submit for review.' },
    { icon: <DollarSign />, title: 'Get Paid Instantly', desc: 'Receive payments directly to your wallet upon approval.' }
  ];

  const faqs = [
    { q: 'What is BaseConnect?', a: 'BaseConnect is an on-chain micro-job marketplace on Base, enabling users to post tasks and get paid instantly through smart contract escrow.' },
    { q: 'How is BaseConnect different from traditional gig platforms?', a: 'BaseConnect eliminates high fees, slow payouts, and centralized control by offering instant on-chain payments, low fees, and full transparency.' },
    { q: 'Who can use BaseConnect?', a: 'Creators who want to post and fund tasks. Contributors who want to complete tasks and earn instantly. Anyone with a crypto wallet can use the platform.' },
    { q: 'What happens if a task submission is rejected?', a: 'Creators can request changes or reject the work. A community dispute system through the BaseConnect DAO will soon help handle escalations fairly.' },
    { q: 'Can I withdraw my earnings instantly?', a: 'Yes. Once a task is approved, the smart contract sends the payment directly to your wallet. There is no waiting or manual withdrawal process.' },
    { q: 'Can businesses use BaseConnect?', a: 'Yes. Businesses can use BaseConnect for content tasks, research, testing, micro-campaigns and other small jobs that need fast and scalable execution onchain.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      <CryptoBackground />
      <LandingNavbar />

      {/* Hero */}
      <section
        id="home"
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 h-screen md:pt-28"
        style={{
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className={`inline-block bg-blue-100 md:mt-40 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${mounted ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: '120ms' }}>
          Built on Base ⚡
        </div>
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-[#010131] ${mounted ? 'animate-fade-up' : 'opacity-0'}`} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', animationDelay: '180ms' }}>
          Connect. Build. <span className="text-blue-600">Earn.</span>
        </h1>
        <p className={`${mounted ? 'animate-fade-up' : 'opacity-0'} text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed`} style={{ animationDelay: '260ms' }}>
         The global space where people meet real onchain opportunities. Built for creators to move ideas forward and contributors to earn instantly in a trustless flow.
        </p>
        <button
          onClick={async () => {
            try {
              // If auth is still loading, refresh to ensure we have the latest user
              if (loading) await refresh();
              if (user) {
                const dest = getNextRoute(user);
                navigate(dest);
              } else {
                navigate('/signup');
              }
            } catch (e) {
              // fallback to signup
              navigate('/signup');
            }
          }}
          className="text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition shadow-lg hover:shadow-xl"
          style={{ fontFamily: 'Figtree, sans-serif', background: 'linear-gradient(to right, #0C13FF, #22C0FF)' }}
        >
          Get started
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
      <section id="how-it-works" data-animate className="relative z-10 px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              How it <span className="text-blue-600">Works</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg">Get started in minutes with our streamlined Web3 workflow</p>
          </div>

          <div className="mb-16">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">For Creators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creatorSteps.map((s, i) => (
                <div key={i} data-animate-card className={`bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition transform-gpu hover:scale-105 opacity-0`} style={{ animationDelay: `${220 + i * 80}ms` }}>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ background: 'linear-gradient(to right, #0C13FF, #22C0FF)' }}>{s.icon}</div>
                    <div>
                      <h4 className="font-semibold text-base md:text-lg text-gray-900 mb-1">{s.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">For Contributors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contributorSteps.map((s, i) => (
                <div key={i} data-animate-card className={`bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition transform-gpu hover:scale-105 opacity-0`} style={{ animationDelay: `${220 + i * 80}ms` }}>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ background: 'linear-gradient(to right, #0C13FF, #22C0FF)' }}>{s.icon}</div>
                    <div>
                      <h4 className="font-semibold text-base md:text-lg text-gray-900 mb-1">{s.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" data-animate className="relative z-10 px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              <span className="text-blue-600">Features</span> for Reliable On-Chain Operations
            </h2>
            <p className="text-gray-600 text-base md:text-lg">Experience the power of decentralized work with cutting-edge blockchain technology</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} data-animate-card className={`bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition transform-gpu hover:scale-105 opacity-0`} style={{ animationDelay: `${300 + i * 80}ms` }}>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">{f.icon}</div>
                <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" data-animate className="relative z-10 px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="text-gray-600 text-base">Everything you need to know about BaseConnect</p>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition">
                  <span className="font-medium text-gray-900 text-sm md:text-base">{f.q}</span>
                  <span className="text-gray-400 text-xl font-light ml-4">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-animate className="relative z-10 px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl p-10 md:p-14 text-center shadow-xl" style={{ background: 'linear-gradient(to right, #0C13FF, #22C0FF)' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Ready to Get Started?
            </h2>
            <p className="text-blue-50 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Connect your wallet to access the marketplace and start<br className="hidden md:block" /> earning instantly
            </p>
            <a href="/signup"><button className="bg-white text-blue-600 px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-gray-50 transition shadow-lg hover:shadow-xl" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Get started
            </button></a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-gray-200 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <img src="/baseconnect-logo-1.png" alt="BaseConnect" className="w-10 h-10" />
              <span className="text-xl font-bold" style={{ 
                      fontFamily: 'Figtree, sans-serif', 
                      background: 'linear-gradient(to right, #0C13FF, #22C0FF)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>BaseConnect</span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <a href="/about" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">About</a>
              <a href="/docs" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Docs</a>
              <a href="/privacy" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Privacy</a>
              <a href="/contact" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Contact</a>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm leading-relaxed mb-6">Supporting creators to build faster, rewarding contributors instantly. <br /><b>Connect. Build. Earn. </b></p>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-gray-500">
            <span>© 2025 BaseConnect - Built on Base L2</span>
            <div className=" sm:flex-row items-start sm:items-center gap-4">
              <div className="md:ml-36 flex items-center gap-3">
                <a href="https://x.com/useBaseConnect" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition"> < TwitterIcon /></a>
                <a href="mailto:UseBaseConnect@gmail.com" className="text-gray-600 hover:text-blue-600 transition"><Mail className="w-5 h-5" /></a>
                <a href="https://discord.com/invite/MQWZT4g76" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition"><FaDiscord className="w-5 h-5" /></a>
              </div><div></div>
              <div className="flex flex-wrap items-center gap-4">
                <a href="/privacy" className="hover:text-blue-600 transition">Privacy Policy</a>
                <a href="/terms" className="hover:text-blue-600 transition">Terms of Service</a>
               
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;