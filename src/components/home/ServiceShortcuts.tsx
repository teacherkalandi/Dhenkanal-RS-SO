import React, { useState, useEffect } from 'react';
import { Search, Calculator, MapPin, Landmark, Banknote, UserCheck, Download, Pin, LogIn, PiggyBank, Percent, FileText, X, Link, MessageCircle, Building2, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const SHORTCUTS = [
  { name: 'Track Consignment', icon: Search, url: 'https://www.indiapost.gov.in/', color: 'text-ip-red' },
  { name: 'Calculate Postage', icon: Calculator, url: 'https://www.indiapost.gov.in/calculate-postage', color: 'text-blue-600' },
  { name: 'Savings Schemes', icon: PiggyBank, url: 'https://www.indiapost.gov.in/banking-services/savings', color: 'text-pink-600' },
  { name: 'Interest Rates', icon: Percent, url: 'https://interest-rates-nine.vercel.app/', color: 'text-teal-600' },
  { name: 'Internet Banking', icon: Landmark, url: 'https://ebanking.indiapost.gov.in/corp/AuthenticationController?FORMSGROUP_ID__=AuthenticationFG&__START_TRAN_FLAG__=Y&__FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=1&BANK_ID=DOP', color: 'text-amber-600' },
  { name: 'IPPB', icon: Banknote, url: 'https://ippbonline.bank.in/en/web/ippb', color: 'text-indigo-600' },
  { name: 'Aadhaar Services', icon: UserCheck, url: 'https://uidai.gov.in/en/my-aadhaar/get-aadhaar.html', color: 'text-emerald-600' },
  { name: 'Digipin', icon: Pin, url: 'https://dac.indiapost.gov.in/mydigipin/home', color: 'text-orange-600' },
  { name: 'Branch Office Directory', icon: Building2, url: 'https://bo-directory.vercel.app/', color: 'text-cyan-600' },
  { name: 'Customer Login', icon: LogIn, url: 'https://app.indiapost.gov.in/customer-selfservice/login', color: 'text-slate-600' },
  { name: 'Schedule Fees', icon: FileText, action: 'show-fees', color: 'text-[#8B0000]' },
  { name: 'Forms', icon: Download, action: 'show-forms', color: 'text-purple-600' },
];

export default function ServiceShortcuts() {
  const [showFees, setShowFees] = useState(false);
  const [showForms, setShowForms] = useState(false);
  const [forms, setForms] = useState<any[]>([]);
  const [formSearchQuery, setFormSearchQuery] = useState('');
  const [formTypeFilter, setFormTypeFilter] = useState('All');
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    if (showForms && forms.length === 0) {
      const fetchForms = async () => {
        try {
          const q = query(collection(db, 'downloadable_forms'), orderBy('createdAt', 'desc'));
          const snap = await getDocs(q);
          setForms(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
          console.error("Error fetching forms:", err);
        }
      };
      fetchForms();
    }
  }, [showForms]);

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
          {SHORTCUTS.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.url || '#'}
              onClick={(e) => {
                if (item.action === 'show-fees') {
                  e.preventDefault();
                  setShowFees(true);
                } else if (item.action === 'show-forms') {
                  e.preventDefault();
                  setShowForms(true);
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

      <AnimatePresence>
        {showForms && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForms(false)}
              className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-md cursor-pointer"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`relative w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[90vh] flex flex-col border transition-colors duration-300 ${isDarkTheme ? 'bg-[#0f172a] border-slate-800' : 'bg-gray-50 border-gray-200'}`}
            >
              <div className="bg-[#b3262e] text-white p-5 flex justify-between items-center shrink-0 border-b border-black shadow-md z-10">
                <h3 className="text-xl font-bold tracking-wide flex items-center gap-2">
                  <Download size={22} /> Downloadable Forms
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsDarkTheme(!isDarkTheme)}
                    className="p-1.5 rounded-full hover:bg-black/20 transition-colors cursor-pointer"
                    title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
                  >
                    {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  <button 
                    onClick={() => setShowForms(false)}
                    className="p-1 rounded-full hover:bg-black/20 transition-colors cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="px-4 pt-4 md:px-6 md:pt-6 shrink-0 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} size={18} />
                    <input
                      type="text"
                      placeholder="Search forms..."
                      value={formSearchQuery}
                      onChange={(e) => setFormSearchQuery(e.target.value)}
                      className={`w-full rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-1 transition-all ${isDarkTheme ? 'bg-[#1e293b] border-[#334155] border text-white placeholder-slate-400 focus:border-[#475569] focus:ring-[#475569]' : 'bg-white border-gray-200 border text-gray-800 placeholder-gray-400 focus:border-red-400 focus:ring-red-400 shadow-sm'}`}
                    />
                  </div>
                  
                  <div className="shrink-0">
                    <select
                      value={formTypeFilter}
                      onChange={(e) => setFormTypeFilter(e.target.value)}
                      className={`w-full sm:w-48 appearance-none rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-1 transition-all ${isDarkTheme ? 'bg-[#1e293b] border border-[#334155] text-white focus:border-[#475569] focus:ring-[#475569]' : 'bg-white border border-gray-200 text-gray-800 focus:border-red-400 focus:ring-red-400 shadow-sm'}`}
                    >
                      <option value="All">All Types</option>
                      <option value="Savings">Savings</option>
                      <option value="PL/RPLI">PL/RPLI</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6 overflow-y-auto space-y-4 max-h-[550px] list-scrollbar">
                {(() => {
                  const filteredForms = forms.filter(f => {
                    const matchesSearch = f.displayName?.toLowerCase().includes(formSearchQuery.toLowerCase()) || 
                      f.description?.toLowerCase().includes(formSearchQuery.toLowerCase()) ||
                      f.type?.toLowerCase().includes(formSearchQuery.toLowerCase());
                    const matchesType = formTypeFilter === 'All' || f.type === formTypeFilter;
                    return matchesSearch && matchesType;
                  });

                  if (forms.length === 0) {
                    return (
                      <div className={`text-center p-8 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`}>
                        <Download className="mx-auto mb-4 opacity-50" size={32} />
                        <p>No forms available.</p>
                      </div>
                    );
                  }

                  if (filteredForms.length === 0) {
                    return (
                      <div className={`text-center p-8 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`}>
                        <Search className="mx-auto mb-4 opacity-50" size={32} />
                        <p>No forms found matching your criteria.</p>
                      </div>
                    );
                  }

                  return filteredForms.map(form => {
                    const dateObj = form.createdAt?.toDate ? form.createdAt.toDate() : new Date();
                    const day = dateObj.getDate().toString().padStart(2, '0');
                    const month = dateObj.toLocaleString('en-US', { month: 'short' });
                    const year = dateObj.getFullYear().toString().slice(-2);
                    const time = dateObj.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

                    return (
                      <div key={form.id} className={`flex flex-col md:flex-row rounded-xl overflow-hidden shadow-sm group transition-all duration-300 border ${isDarkTheme ? 'bg-[#1e293b] border-[#334155] hover:border-[#475569]' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'}`}>
                        {/* Left split - Date */}
                        <div className={`p-4 md:w-36 flex flex-row md:flex-col items-center justify-center gap-2 md:gap-1 shrink-0 border-b md:border-b-0 md:border-r ${isDarkTheme ? 'bg-[#5c1c24] text-white border-[#334155]' : 'bg-[#fff1f2] text-[#8B0000] border-gray-100'}`}>
                          <div className="text-center font-black">
                            <span className="text-3xl md:text-4xl block leading-none tracking-tight">{day}</span>
                            <span className="text-[13px] md:text-sm tracking-wide mt-1 block opacity-90">{month} '{year}</span>
                          </div>
                          <div className={`text-[10px] md:text-xs font-bold px-2 py-0.5 rounded mt-1.5 ${isDarkTheme ? 'bg-black/20 text-white/80' : 'bg-red-100 text-red-800'}`}>{time}</div>
                        </div>

                        {/* Middle - Content */}
                        <div className="p-4 md:p-5 flex-1 flex flex-col justify-center">
                          <div className="mb-2">
                            <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${isDarkTheme ? 'bg-[#4c1d95] text-indigo-100' : 'bg-indigo-100 text-indigo-800'}`}>
                              {form.type || 'GENERAL'}
                            </span>
                          </div>
                          <h4 className={`font-bold text-base md:text-lg leading-snug ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{form.displayName}</h4>
                          {form.description && (
                            <p className={`text-xs md:text-sm mt-1.5 leading-relaxed line-clamp-2 ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>{form.description}</p>
                          )}
                        </div>

                        {/* Right - Actions */}
                        <div className={`p-4 md:p-5 flex flex-row items-center justify-start md:justify-end gap-2.5 border-t md:border-t-0 md:border-l shrink-0 ${isDarkTheme ? 'border-[#334155] bg-[#0f172a]/30' : 'border-gray-100 bg-gray-50'}`}>
                          <a 
                            href={form.uploadLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 px-4 py-2 bg-[#fde8e8] text-[#9b1c1c] hover:bg-white transition-colors font-bold text-sm rounded-lg shadow-sm"
                          >
                            <FileText size={16} />
                            View PDF
                          </a>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              const text = `Check out this form: ${form.displayName}\nLink: ${form.uploadLink}`;
                              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="p-2.5 bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0] rounded-lg transition-colors cursor-pointer shadow-sm"
                            title="Share on WhatsApp"
                          >
                            <MessageCircle size={18} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              navigator.clipboard.writeText(form.uploadLink);
                              alert("Link copied to clipboard");
                            }}
                            className="p-2.5 bg-[#dbeafe] text-[#1e40af] hover:bg-[#bfdbfe] rounded-lg transition-colors cursor-pointer shadow-sm"
                            title="Copy Link"
                          >
                            <Link size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
