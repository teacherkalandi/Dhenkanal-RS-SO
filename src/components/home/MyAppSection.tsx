import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { LayoutDashboard, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function MyAppSection() {
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    async function fetchApps() {
      try {
        const q = query(collection(db, 'custom_apps'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setApps(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching My Apps:', error);
      }
    }
    fetchApps();
  }, []);

  if (apps.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-gray-50/50 rounded-3xl mb-20" id="my-apps">
      <div className="flex items-center gap-5 mb-14">
        <div className="w-16 h-1.5 bg-[#D8232A] rounded-full" />
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">My Apps</h2>
          <p className="text-xs font-bold text-ip-maroon uppercase tracking-[0.3em] opacity-60">Custom Tools & Utilities</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {apps.map((app, i) => {
          const colors = [
            { left: 'bg-[#C62828]', right: 'bg-[#D32F2F]' }, // Red
            { left: 'bg-[#00695C]', right: 'bg-[#00796B]' }, // Teal
            { left: 'bg-[#4527A0]', right: 'bg-[#512DA8]' }, // Purple
            { left: 'bg-[#1565C0]', right: 'bg-[#1976D2]' }, // Blue
            { left: 'bg-[#E65100]', right: 'bg-[#EF6C00]' }, // Orange
            { left: 'bg-[#00838F]', right: 'bg-[#0097A7]' }, // Cyan
          ];
          
          const theme = colors[i % colors.length];

          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link 
                to={`/my-apps/${app.id}`}
                className="group flex flex-row items-stretch rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 h-[100px] md:h-[110px]"
              >
                {/* Left Side Icon Area */}
                <div className={`${theme.left} w-24 md:w-28 flex-shrink-0 flex items-center justify-center transition-colors`}>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                    <LayoutDashboard size={22} strokeWidth={2.5} />
                  </div>
                </div>
                
                {/* Right Side Content Area */}
                <div className={`${theme.right} flex-1 flex flex-col justify-center px-5 relative transition-colors`}>
                  <h3 className="text-white font-bold text-sm md:text-base pr-6 line-clamp-2 leading-tight">
                    {app.title}
                  </h3>
                  <p className="text-white/80 text-[9px] md:text-[10px] font-bold uppercase tracking-wider mt-1.5">
                    1 ITEMS IN CATEGORY
                  </p>
                  
                  <ChevronRight size={18} className="absolute right-4 text-white/40 group-hover:text-white transition-colors" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
