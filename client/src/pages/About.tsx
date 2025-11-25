import React, { useState, useEffect } from 'react';
import { Target, Eye, Rocket, Heart, Lightbulb, Sparkles, Users, Shield, Mail } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';

// Twitter/X Icon Component
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Navbar Component (simplified - import from your actual component)
import LandingNavbar from '../components/LandingNavbar';
const AboutPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mission = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Purpose",
      description: "Empowering people to connect to global onchain opportunities, enabling creative and innovative collaboration powered by instant, trustless payments."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Our Vision",
      description: "Becoming the economic engine of the base ecosystem, a global network where millions collaborate, create value, and earn globally through a trustless onchain economy."
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Our Mission",
      description: "Building the world's most seamless onchain work marketplace that empowers creators to build faster and contributors to earn globally, increasing innovation, creativity, and economic freedom."
    }
  ];

  const values = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Freedom",
      description: "Work and earn anywhere without borders or intermediaries."
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovation",
      description: "Execute ideas faster, make impact bigger, and grow the ecosystem."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Creativity",
      description: "Express skills, showcase talent, and bring ideas to life."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Empathy",
      description: "Understand challenges, meet needs, and design for people."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Transparency",
      description: "Ensure trust through onchain actions and clear reputation."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      description: "Grow together through participation, referrals, and governance."
    }
  ];

  const team = [
    {
      name: "Irapada Halleluyah",
      role: "Founder",
      image: "/team/irapada.jpeg",
      twitter: "https://x.com/DChiefBuilder"
    },
    {
      name: "Okechukwu Miracle",
      role: "Co-Founder",
      image: "/team/okechukwu.jpeg",
      twitter: "https://x.com/miracledamian15",
    },
    {
      name: "Olujola Samuel",
      role: "Product Designer",
      image: "/team/olujola.jpeg",
      twitter: "https://x.com/lexicon_uiux?s=21",

    },
    {
      name: "Qasim Rokeeb",
      role: "Frontend Developer",
      image: "/team/qasim.jpg",
      twitter: "https://x.com/qasimrokeeb"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Figtree, sans-serif' }}>
      <LandingNavbar/>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4"
      style={{
          backgroundImage: 'url(/about-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
        <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Who We Are
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We are the connection layer on Base that brings ideas, talent, and opportunity 
            together onchain. A global space where creators and contributors collaborate, 
            create value, and earn instantly by completing tasks, building projects, and 
            contributing their expertise seamlessly in a trustless, low-fee ecosystem.
          </p>
        </div>
      </section>

      {/* Mission Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mission.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all duration-500 hover:shadow-lg transform hover:-translate-y-1 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4" style={{ background: 'linear-gradient(to right, #0C13FF, #22C0FF)' }}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 text-lg">The principles that guide everything we do.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className={`bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-500 hover:shadow-md transform hover:-translate-y-1 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 text-lg">The passionate individuals behind BaseConnect success</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 text-center border border-gray-200 hover:border-blue-300 transition-all duration-500 hover:shadow-lg transform hover:-translate-y-2 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      if (img.parentElement) {
                        img.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-2xl font-bold text-white" style="background: linear-gradient(to right, #0C13FF, #22C0FF)">${member.name.split(' ').map(n => n[0]).join('')}</div>`;
                      }
                    }}
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 text-sm font-medium mb-4">{member.role}</p>
                <a 
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <TwitterIcon />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div 
            className={`rounded-3xl p-12 text-center shadow-2xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ background: 'linear-gradient(to right, #0C13FF, #22C0FF)' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto">
              Connect your wallet to access the marketplace and start earning instantly
            </p>
            <button className="bg-white text-blue-600 px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-gray-50 transition shadow-lg hover:shadow-xl">
              Get Started
            </button>
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
                   <a href="#about" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">About</a>
                   <a href="#docs" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Docs</a>
                   <a href="#privacy" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Privacy</a>
                   <a href="#contact" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Contact</a>
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
                     <a href="#privacy-policy" className="hover:text-blue-600 transition">Privacy Policy</a>
                     <a href="#terms" className="hover:text-blue-600 transition">Terms of Service</a>
                    
                   </div>
                 </div>
               </div>
             </div>
           </footer>
    </div>
  );
};

export default AboutPage;