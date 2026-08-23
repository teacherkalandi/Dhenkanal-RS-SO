import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { AppWindow, Loader2, Search, LayoutDashboard, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Finacle', 'APT 2.0', 'Savings', 'PLI/RPLI', 'Business Developement', 'Others'];

export default function MyAppsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function fetchApps() {
      try {
        const q = query(collection(db, 'custom_apps'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        
        const fetchedApps = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
        
        // Auto-migrate legacy categories to PLI/RPLI
        fetchedApps.forEach(async (app) => {
          if (app.category === 'More' || app.category === 'More/More') {
            try {
              const { updateDoc, doc } = await import('firebase/firestore');
              await updateDoc(doc(db, 'custom_apps', app.id), { category: 'PLI/RPLI' });
              app.category = 'PLI/RPLI';
            } catch (e) {
              console.error(e);
            }
          }
        });

        setApps(fetchedApps);
      } catch (error) {
        console.error('Error fetching My Apps:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase());
    const appCategory = app.category || 'Others';
    const matchesCategory = selectedCategory === 'All' || appCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col relative pb-24">
      <main className="flex-1 w-full pt-12 md:pt-16">
        <section className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                Explore Apps
              </h2>
              <p className="text-slate-500 font-medium mt-2">Discover and launch web applications uploaded by the community.</p>
            </div>
            
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search apps by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10 border-b border-gray-100 pb-6">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`py-1.5 px-4 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="animate-spin text-[#D8232A]" size={48} />
            </div>
          ) : apps.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[2rem] border border-gray-100 shadow-sm mx-auto max-w-lg">
              <AppWindow size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-400">No apps available</h3>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[2rem] border border-gray-100 shadow-sm mx-auto max-w-lg">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-400">No matching apps found</h3>
              <p className="text-gray-400 mt-2">Try adjusting your search query or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredApps.map((app, i) => {
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
                    initial={{ opacity: 0, y: 20 }}
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
          )}
        </section>
      </main>
    </div>
  );
}
