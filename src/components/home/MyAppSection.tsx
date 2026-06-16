import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Code } from 'lucide-react';
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
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {apps.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          >
            <Link 
              to={`/my-apps/${app.id}`}
              className={`group bg-white border border-gray-100 h-44 md:h-52 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:border-red-100 relative overflow-hidden`}
            >
              <div className={`bg-red-500 p-4 rounded-2xl text-white mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-black/5`}>
                <Code size={24} />
              </div>
              <span className="font-black text-[13px] text-slate-700 uppercase tracking-tight leading-snug">{app.title}</span>
              
              <div className="absolute inset-0 bg-red-50/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
