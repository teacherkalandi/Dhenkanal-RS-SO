import React from 'react';
import Hero from '../components/home/Hero';
import NewsMarquee from '../components/home/NewsMarquee';
import ServiceShortcuts from '../components/home/ServiceShortcuts';
import { motion } from 'motion/react';
import { MapPin, Mail } from 'lucide-react';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <Hero />
      <NewsMarquee />
      <ServiceShortcuts />

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-white rounded-[3rem] shadow-sm border border-gray-50 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-1 space-y-4">
            <h3 className="text-2xl font-black text-[#8B0000] uppercase">Dhenkanal RS SO</h3>
            <p className="text-gray-600 leading-relaxed">
              Serving the community of Dhenkanal with dedication and technological advancement. We provide more than just letters; we provide connections.
            </p>
            <div className="pt-4 flex flex-col gap-4">
               <div className="flex items-center gap-3 text-sm text-gray-600">
                 <MapPin size={18} className="text-[#D8232A]" />
                 <span>Near Dhenkanal Railway Station, 759013</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                 <Mail size={18} className="text-[#D8232A]" />
                 <span>dhenkanalrsso@indiapost.gov.in</span>
               </div>
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-all">
              <h4 className="font-bold text-[#8B0000] mb-3 uppercase tracking-wider">Mission</h4>
              <p className="text-sm text-gray-600">To provide high-quality and reliable postal, financial, and retail services to the doorstep of every citizen.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-all">
              <h4 className="font-bold text-[#8B0000] mb-3 uppercase tracking-wider">Vision</h4>
              <p className="text-sm text-gray-600">To be the most preferred and reliable logistics and financial service provider in the region.</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
