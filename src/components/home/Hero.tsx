import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    title: 'Postal Life Insurance',
    subtitle: 'Safety for you and your family with high returns.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1920',
    color: 'bg-red-900/40'
  },
  {
    title: 'Savings Schemes',
    subtitle: 'Invest in your future with government-backed security.',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1920',
    color: 'bg-yellow-900/40'
  },
  {
    title: 'Speed Post',
    subtitle: 'Fast and reliable delivery across the globe.',
    image: 'https://images.unsplash.com/photo-1594832284157-fb3286f7779d?auto=format&fit=crop&q=80&w=1920',
    color: 'bg-maroon-900/40'
  },
  {
    title: 'Parcel Services',
    subtitle: 'Safe and secure delivery for your commercial and personal goods.',
    image: 'https://images.unsplash.com/photo-1612630741022-b29ec17d013d?auto=format&fit=crop&q=80&w=1920',
    color: 'bg-blue-900/40'
  },
  {
    title: 'International Mails',
    subtitle: 'Connecting you to over 200 countries with ease and speed.',
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1920',
    color: 'bg-indigo-900/40'
  },
  {
    title: 'Citizen Services',
    subtitle: 'Bringing governance and community services closer to every citizen.',
    image: 'https://images.unsplash.com/photo-1577962914165-d0693a4667ca?auto=format&fit=crop&q=80&w=1920',
    color: 'bg-emerald-900/40'
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prev = () => setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));

  return (
    <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img 
            src={SLIDES[current].image} 
            alt={SLIDES[current].title}
            className="w-full h-full object-cover scale-105 transition-transform duration-[10000ms] ease-linear group-hover:scale-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/80 via-red-900/40 to-transparent flex flex-col items-start justify-center p-8 md:p-16 lg:p-24">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-1 w-12 bg-ip-amber rounded-full" />
                <span className="text-xs font-black text-ip-amber uppercase tracking-[0.4em]">Government of India • India Post</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                {SLIDES[current].title.split(' ').map((word, i) => (
                  <span key={i} className={i === 0 ? "block" : "text-ip-amber block lg:-mt-2"}>
                    {word}
                  </span>
                ))}
              </h2>
              <p className="text-base md:text-xl text-white/80 font-medium max-w-lg mb-10 leading-relaxed">
                {SLIDES[current].subtitle}
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => document.getElementById('service-request')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-ip-red hover:bg-red-600 px-10 py-4 rounded-lg text-[11px] font-black text-white uppercase tracking-[0.2em] transition-all shadow-2xl hover:scale-105 active:scale-95"
                >
                  Explore Services
                </button>
                <a 
                  href="https://www.indiapost.gov.in/banking-services/savings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-10 py-4 rounded-lg text-[11px] font-black text-white uppercase tracking-[0.2em] transition-all border border-white/20 flex items-center"
                >
                  Savings Schemes
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Dots */}
      <div className="absolute bottom-12 left-8 md:left-24 flex gap-4 z-30">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${current === i ? 'bg-ip-amber w-16 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-white/30 w-6 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
