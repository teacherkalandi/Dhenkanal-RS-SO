import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { AppWindow, ChevronRight, Loader2, Code, ArrowLeft, Home, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

export default function MyAppsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchApps() {
      try {
        const q = query(collection(db, 'custom_apps'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setApps(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching My Apps:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  const filteredApps = apps.filter(app => 
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative pb-24">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 flex flex-col gap-3 z-50">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#D8232A] hover:bg-gray-50 hover:scale-105 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <Link 
          to="/"
          className="w-12 h-12 bg-[#D8232A] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#8B0000] hover:scale-105 transition-all"
        >
          <Home size={20} />
        </Link>
      </div>
      
      <main className="flex-1 w-full pt-16 md:pt-24">
        <section className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[2rem] md:text-5xl font-black text-[#3b0909] flex items-center justify-center gap-3">
              <AppWindow className="text-[#D8232A]" size={42} />
              MY APPS
            </h2>
            <p className="text-slate-500 font-medium mt-4">Access all available tools and applications</p>
          </div>

          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-200 focus:ring-4 focus:ring-red-50 text-gray-700 font-medium transition-all shadow-sm"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="animate-spin text-[#D8232A]" size={48} />
            </div>
          ) : apps.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm mx-auto max-w-lg">
              <AppWindow size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-400">No apps available</h3>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm mx-auto max-w-lg">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-400">No matching apps found</h3>
              <p className="text-gray-400 mt-2">Try adjusting your search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredApps.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                >
                  <Link 
                    to={`/my-apps/${app.id}`}
                    className="block bg-white rounded-[1.5rem] border border-gray-200 hover:border-red-200 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="h-44 flex items-center justify-center bg-white">
                      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-red-100/50">
                        <AppWindow size={32} className="text-[#D8232A]" />
                      </div>
                    </div>
                    <div className="bg-slate-50/80 border-t border-gray-100 p-5 flex items-center justify-between">
                      <span className="font-bold text-[#1E293B] text-base truncate pr-4">{app.title}</span>
                      <ChevronRight size={20} className="text-[#94A3B8] group-hover:text-[#D8232A] transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
