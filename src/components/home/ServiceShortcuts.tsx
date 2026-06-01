import React, { useState } from 'react';
import { Search, Calculator, MapPin, Landmark, Banknote, UserCheck, Download, Pin, LogIn, PiggyBank, Percent, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const SHORTCUTS = [
  { name: 'Track Consignment', icon: Search, url: 'https://www.indiapost.gov.in/', color: 'text-ip-red' },
  { name: 'Calculate Postage', icon: Calculator, url: 'https://www.indiapost.gov.in/calculate-postage', color: 'text-blue-600' },
  { name: 'Savings Schemes', icon: PiggyBank, url: 'https://www.indiapost.gov.in/banking-services/savings', color: 'text-pink-600' },
  { name: 'Interest Rates', icon: Percent, url: 'https://interest-rates-nine.vercel.app/', color: 'text-teal-600' },
  { name: 'Internet Banking', icon: Landmark, url: 'https://ebanking.indiapost.gov.in/corp/AuthenticationController?FORMSGROUP_ID__=AuthenticationFG&__START_TRAN_FLAG__=Y&__FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=1&BANK_ID=DOP', color: 'text-amber-600' },
  { name: 'IPPB', icon: Banknote, url: 'https://ippbonline.bank.in/en/web/ippb', color: 'text-indigo-600' },
  { name: 'Aadhaar Services', icon: UserCheck, url: 'https://uidai.gov.in/en/my-aadhaar/get-aadhaar.html', color: 'text-emerald-600' },
  { name: 'Digipin', icon: Pin, url: 'https://dac.indiapost.gov.in/mydigipin/home', color: 'text-orange-600' },
  { name: 'Customer Login', icon: LogIn, url: 'https://app.indiapost.gov.in/customer-selfservice/login', color: 'text-slate-600' },
  { name: 'Schedule Fees', icon: FileText, action: 'show-fees', color: 'text-[#8B0000]' },
];

export default function ServiceShortcuts() {
  const [showFees, setShowFees] = useState(false);

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-10 gap-4">
          {SHORTCUTS.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.url || '#'}
              onClick={(e) => {
                if (item.action === 'show-fees') {
                  e.preventDefault();
                  setShowFees(true);
                }
              }}
              target={item.url ? "_blank" : undefined}
              rel={item.url ? "noopener noreferrer" : undefined}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center text-center gap-3 group cursor-pointer"
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

      <AnimatePresence>
        {showFees && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFees(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden z-50 max-h-[90vh] flex flex-col"
            >
              <div className="bg-[#8B0000] text-white p-5 flex justify-between items-center shrink-0">
                <h3 className="text-xl font-bold tracking-wide">Schedule of Fee</h3>
                <button 
                  onClick={() => setShowFees(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto w-full text-slate-800 space-y-6 flex-1">
                <ul className="space-y-3 list-disc pl-5 font-medium leading-relaxed marker:text-[#8B0000]">
                  <li>Issue of duplicate pass book - <span className="font-semibold px-1">₹ 50.</span></li>
                  <li>Issue of statement of account or deposit receipt - <span className="font-semibold px-1">₹ 20</span> (per case).</li>
                  <li>Issue of pass book in lieu of lost or mutilated certificate – <span className="font-semibold px-1">₹ 10</span> (per registration).</li>
                  <li>Cancellation or change of nomination – No fee applicable</li>
                </ul>

                <div>
                  <h4 className="text-[#D8232A] font-semibold mb-3 border-l-4 border-[#D8232A] pl-3">SB Order No. 05/2025</h4>
                  <ul className="space-y-3 list-disc pl-5 font-medium leading-relaxed marker:text-[#D8232A]">
                    <li>Transfer of account – <span className="font-semibold px-1">₹ 100</span></li>
                    <li>Pledging of account – <span className="font-semibold px-1">₹ 100</span></li>
                    <li>Issue of cheque book in Savings Bank Account – No fee for up to 10 leaves/year, then <span className="font-semibold px-1">₹ 2</span> per cheque leaf.</li>
                    <li>Charges on dishonour of cheque– <span className="font-semibold px-1">₹ 100</span></li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-start gap-3 mt-4 text-sm text-slate-500 italic font-medium">
                  <span className="font-bold text-[#8B0000] not-italic">*</span>
                  <p>Tax as applicable on the above service charges shall also be payable</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
