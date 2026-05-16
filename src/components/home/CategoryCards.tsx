import React from 'react';
import { Wallet, PiggyBank, Mail, Globe, Package, Briefcase, FileText, Download, UserCheck, Microscope } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Savings', icon: Wallet, color: 'bg-blue-50 border-blue-100 text-blue-600', iconBg: 'bg-blue-500' },
  { name: 'PLI/RPLI', icon: PiggyBank, color: 'bg-rose-50 border-rose-100 text-rose-600', iconBg: 'bg-rose-500' },
  { name: 'Domestic Mails', icon: Mail, color: 'bg-orange-50 border-orange-100 text-orange-600', iconBg: 'bg-orange-500' },
  { name: 'International Mails', icon: Globe, color: 'bg-emerald-50 border-emerald-100 text-emerald-600', iconBg: 'bg-emerald-500' },
  { name: 'Parcels', icon: Package, color: 'bg-purple-50 border-purple-100 text-purple-600', iconBg: 'bg-purple-500' },
  { name: 'BD/CCS', icon: Briefcase, color: 'bg-amber-50 border-amber-100 text-amber-600', iconBg: 'bg-amber-500' },
  { name: 'PO Orders/Rules', icon: FileText, color: 'bg-indigo-50 border-indigo-100 text-indigo-600', iconBg: 'bg-indigo-500' },
  { name: 'Official Documents', icon: Download, color: 'bg-cyan-50 border-cyan-100 text-cyan-600', iconBg: 'bg-cyan-500' },
  { name: 'Philately', icon: Microscope, color: 'bg-pink-50 border-pink-100 text-pink-600', iconBg: 'bg-pink-500' },
  { name: 'Others', icon: UserCheck, color: 'bg-slate-100 border-slate-200 text-slate-600', iconBg: 'bg-slate-600' },
];

export default function CategoryCards() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex items-center gap-5 mb-14">
        <div className="section-heading-line" />
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Product Categories</h2>
          <p className="text-xs font-bold text-ip-maroon uppercase tracking-[0.3em] opacity-60">India Post Offerings</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          >
            <Link 
              to={`/category/${cat.name.toLowerCase().replace(/[\/\s]/g, '-')}`}
              className={`group ${cat.color} border h-44 md:h-52 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 active:scale-95 relative overflow-hidden`}
            >
              <div className={`${cat.iconBg} p-4 rounded-2xl text-white mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-black/5`}>
                <cat.icon size={24} />
              </div>
              <span className="font-black text-[13px] text-slate-700 uppercase tracking-tight leading-none">{cat.name}</span>
              
              <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
