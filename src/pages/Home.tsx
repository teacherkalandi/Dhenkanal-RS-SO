import React from 'react';
import Hero from '../components/home/Hero';
import NewsMarquee from '../components/home/NewsMarquee';
import ServiceShortcuts from '../components/home/ServiceShortcuts';
import ServiceRequest from '../components/services/ServiceRequest';
import { motion } from 'motion/react';
import { MapPin, Mail, ArrowRight } from 'lucide-react';

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

      {/* Service Request Portal Section */}
      <section id="service-request" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-ip-red font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Official Citizen Services</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-6">
                Service <span className="text-ip-red">Request</span> Portal
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Order postal services directly from your home. Select a service below to start your application.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b-2 border-slate-100 pb-2">
              <span>Secure Government Portal</span>
              <ArrowRight size={14} className="text-ip-red" />
            </div>
          </div>
          
          <div className="bg-slate-50/50 rounded-[3.5rem] p-4 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-ip-red/5 rounded-full blur-3xl -mr-32 -mt-32" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-ip-amber/10 rounded-full blur-3xl -ml-32 -mb-32" />
             
             <ServiceRequest hideHeader />
          </div>
        </div>
      </section>

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
