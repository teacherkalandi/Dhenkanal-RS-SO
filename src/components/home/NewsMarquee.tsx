import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Megaphone } from 'lucide-react';

export default function NewsMarquee() {
  const [news, setNews] = useState<string[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'news'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsItems = snapshot.docs.map(doc => doc.data().content as string);
      setNews(newsItems.length > 0 ? newsItems : ["Welcome to Dhenkanal RS SO Official Portal", "Check out New Savings Schemes", "Aadhaar Services available now"]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-amber-50 border-y border-amber-300 flex items-center h-10 overflow-hidden relative">
      <div className="bg-ip-maroon text-white px-6 h-full flex items-center text-[10px] md:text-[11px] font-black uppercase tracking-tighter shrink-0 z-10 shadow-[4px_0_15px_rgba(0,0,0,0.1)]">
        <Megaphone size={12} className="mr-2 animate-pulse text-ip-amber" />
        LATEST NEWS
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap animate-marquee px-8 items-center h-full">
          {news.map((item, i) => (
            <span key={i} className="text-[13px] font-bold text-slate-700 italic tracking-wide flex items-center group cursor-pointer hover:text-ip-red transition-colors">
              <span className="mr-4 text-ip-maroon opacity-20 font-black not-italic">•</span>
              {item}
            </span>
          ))}
          {/* Double for continuous scroll */}
          {news.map((item, i) => (
            <span key={`dup-${i}`} className="text-[13px] font-bold text-slate-700 italic tracking-wide flex items-center">
              <span className="mr-4 text-ip-maroon opacity-20 font-black not-italic">•</span>
              {item}
            </span>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
