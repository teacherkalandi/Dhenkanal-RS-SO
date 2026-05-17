import React from 'react';
import { Search, Calculator, MapPin, Landmark, Banknote, UserCheck, Download, Pin, LogIn, PiggyBank } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const SHORTCUTS = [
  { name: 'Calculate Postage', icon: Calculator, url: 'https://www.indiapost.gov.in/calculate-postage', color: 'text-blue-600' },
  { name: 'Savings Schemes', icon: PiggyBank, url: 'https://www.indiapost.gov.in/banking-services/savings', color: 'text-pink-600' },
  { name: 'Internet Banking', icon: Landmark, url: 'https://ebanking.indiapost.gov.in/corp/AuthenticationController?FORMSGROUP_ID__=AuthenticationFG&__START_TRAN_FLAG__=Y&__FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=1&BANK_ID=DOP', color: 'text-amber-600' },
  { name: 'IPPB', icon: Banknote, url: 'https://ippbonline.bank.in/en/web/ippb', color: 'text-indigo-600' },
  { name: 'Aadhaar Services', icon: UserCheck, url: 'https://uidai.gov.in/en/my-aadhaar/get-aadhaar.html', color: 'text-emerald-600' },
  { name: 'Forms Download', icon: Download, url: 'https://indiapost-repository.vercel.app/', color: 'text-fuchsia-600' },
  { name: 'Circulars Portal', icon: Search, url: 'https://circulars.vercel.app/', color: 'text-red-600' },
  { name: 'Digipin', icon: Pin, url: 'https://dac.indiapost.gov.in/mydigipin/home', color: 'text-orange-600' },
  { name: 'Customer Login', icon: LogIn, url: 'https://app.indiapost.gov.in/customer-selfservice/login', color: 'text-slate-600' },
];

export default function ServiceShortcuts() {
  return (
    <section className="bg-gray-50 py-12 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {SHORTCUTS.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center text-center gap-3 group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:shadow-md group-hover:border-red-100 transition-all group-hover:-translate-y-1">
                <item.icon className={cn("w-6 h-6 md:w-8 md:h-8", item.color)} />
              </div>
              <span className="text-[10px] md:text-xs font-bold text-gray-700 leading-tight group-hover:text-[#D8232A]">
                {item.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
