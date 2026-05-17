import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Calendar, Clock, ChevronDown, User, LogOut, Home, Briefcase, PlusCircle, LayoutDashboard, Search, FileText, HelpCircle, Phone, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { auth, signInWithGoogle } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const NAVIGATION = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Service Request', path: '/services', icon: Briefcase },
  { name: 'Internal Site', path: '/internal-site', icon: FileText },
  { name: 'Others', path: '/others', icon: PlusCircle, isDropdown: true },
  { name: 'Admin Portal', path: '/admin', icon: LayoutDashboard },
];

const OTHERS_LINKS = [
  { name: 'India Post Official', url: 'https://www.indiapost.gov.in/' },
  { name: 'Dhenkanal Postal Division', url: 'https://dhenkanalpostaldivision.org/' },
  { name: 'Office Directory', url: 'https://office-directory.vercel.app/' },
  { name: 'Circulars', url: 'https://circulars.vercel.app/' },
  { name: 'Staff Site', url: 'https://staffsite-dklrs.vercel.app/' },
  { name: 'Forms and Downloads', url: 'https://indiapost-repository.vercel.app/' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [user, setUser] = useState(auth.currentUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  return (
    <header className="w-full relative z-50">
      {/* 1. Utility Bar */}
      <div className="bg-[#1a0204] border-b border-white/5 text-red-100/70 py-1.5 px-6 text-[11px] flex justify-between items-center overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <Globe size={12} />
            <span className="font-medium">🌐 English / हिन्दी</span>
          </div>
          <div className="flex items-center gap-4 border-l border-white/10 pl-4">
             <span className="flex items-center gap-1.5 text-white/90">
               <Calendar size={12} />
               {dateTime.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
             </span>
             <span className="flex items-center gap-1.5 text-red-200">
               <Clock size={12} />
               {dateTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
             </span>
          </div>
        </div>
        <div className="hidden md:flex gap-4 items-center uppercase font-black tracking-widest text-[9px]">
          <span className="cursor-pointer hover:text-white transition-colors">A-</span>
          <span className="cursor-pointer hover:text-white transition-colors">A</span>
          <span className="cursor-pointer hover:text-white transition-colors">A+</span>
          <span className="border-l border-white/10 pl-4 cursor-pointer hover:text-white transition-colors">Screen Reader</span>
        </div>
      </div>

      {/* Branded Bar */}
      <div className="bg-[#5D1016] px-4 md:px-12 flex justify-between items-center h-24 md:h-20 shadow-inner">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="bg-white p-1.5 rounded-xl hidden sm:block">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="Emblem" 
              className="h-8 md:h-10 w-auto"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="border-l border-white/20 pl-3 md:pl-5">
            <h1 className="text-lg md:text-2xl font-black text-white leading-none uppercase tracking-tight">Dhenkanal RS SO</h1>
            <p className="text-[9px] md:text-[11px] text-red-200 font-bold uppercase tracking-wider mt-1 opacity-90">Dhenkanal Postal Division | Odisha</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          <div className="text-right">
            <p className="text-[8px] md:text-[10px] text-red-300/60 uppercase font-bold tracking-widest leading-none">Dept. of Posts</p>
            <p className="text-[10px] md:text-sm font-black text-white uppercase tracking-tight">Govt. of India</p>
          </div>
          <div className="bg-white p-1 md:p-1.5 rounded-xl">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/3/32/India_Post.svg" 
              alt="India Post" 
              className="h-6 md:h-10 w-auto"
              referrerPolicy="no-referrer"
            />
          </div>
          <button 
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Navigation Bar (Desktop & Tablet) */}
      <nav className="bg-[#D8232A] shadow-lg sticky top-0 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center">
            {NAVIGATION.map((item) => (
              <div key={item.name} className="relative group">
                {item.isDropdown ? (
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={cn(
                      "px-6 h-12 text-[12px] font-bold text-white flex items-center gap-2 transition-all hover:bg-black/10",
                      dropdownOpen && "bg-black/20"
                    )}
                  >
                    {item.name.toUpperCase()}
                    <ChevronDown size={14} className={cn("transition-transform opacity-60", dropdownOpen && "rotate-180")} />
                  </button>
                ) : (
                  <Link 
                    to={item.path}
                    className={cn(
                      "px-6 h-12 text-[12px] font-bold text-white flex items-center transition-all hover:bg-black/10 border-b-2 border-transparent",
                      location.pathname === item.path && "bg-white/10 border-ip-amber",
                      item.name === 'Internal Site' && "bg-ip-amber/20 hover:bg-ip-amber/30 text-ip-amber"
                    )}
                  >
                    {item.name.toUpperCase()}
                  </Link>
                )}
                
                {item.isDropdown && (
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-0 w-72 bg-white shadow-2xl border-t-2 border-ip-amber rounded-b-xl"
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        {OTHERS_LINKS.map(link => (
                          <a 
                            key={link.name} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block px-6 py-4 text-[11px] font-bold text-slate-700 hover:bg-slate-50 hover:text-ip-red border-b border-slate-100 last:border-0 uppercase tracking-wide transition-colors"
                          >
                            {link.name}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-white z-[60] p-6 pt-20 overflow-y-auto"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-800"
            >
              <X size={32} />
            </button>
            <div className="flex flex-col gap-8 pb-20">
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Navigation</p>
                {NAVIGATION.map(item => (
                  <Link 
                    key={item.name} 
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-black flex items-center gap-4 text-[#D8232A] uppercase tracking-tight"
                  >
                    <item.icon size={24} />
                    {item.name}
                  </Link>
                ))}
              </div>
              
              <div className="space-y-4">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">External Links</p>
                 <div className="grid grid-cols-1 gap-3">
                  {OTHERS_LINKS.map(link => (
                    <a 
                      key={link.name} 
                      href={link.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-slate-700 hover:text-[#D8232A] flex items-center gap-2"
                    >
                      <Globe size={14} className="text-slate-300" />
                      {link.name}
                    </a>
                  ))}
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Sticky Nav (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-2 z-50">
        {NAVIGATION.map(item => (
          <Link 
            key={item.name} 
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 p-2 text-xs transition-colors",
              location.pathname === item.path ? "text-[#D8232A]" : "text-gray-500"
            )}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </header>
  );
}
