import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Droplets, Fingerprint, BookOpen, Mail, Search, PiggyBank, HelpCircle, Loader2, Send, Shield } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import confetti from 'canvas-confetti';

const SERVICES = [
  { id: 'gangajal', name: 'Gangajal Order', icon: Droplets, collection: 'gangajal_orders' },
  { id: 'aadhaar', name: 'Aadhaar Enrollment', icon: Fingerprint, collection: 'aadhaar_bookings' },
  { id: 'passport', name: 'Passport Services', icon: BookOpen, collection: 'passport_requests' },
  { id: 'article', name: 'Booking of Articles', icon: Mail, collection: 'article_booking_requests' },
  { id: 'account', name: 'Account Opening', icon: PiggyBank, collection: 'account_opening_requests' },
  { id: 'pli', name: 'PLI/RPLI Services', icon: Shield, collection: 'plirpli_requests' },
  { id: 'other', name: 'Any Other Help', icon: HelpCircle, collection: 'other_help_requests' },
];

export default function ServiceRequest({ hideHeader = false }: { hideHeader?: boolean }) {
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', address: '', mobile: '', quantity: '1', bookingDate: '', message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    setLoading(true);

    try {
      const payload: any = {
        name: formData.name,
        address: formData.address,
        mobile: formData.mobile,
        submittedAt: serverTimestamp(),
      };

      if (selectedService.id === 'gangajal') payload.quantity = parseInt(formData.quantity);
      if (selectedService.id === 'aadhaar') {
        payload.bookingDate = formData.bookingDate;
        payload.officeName = 'Dhenkanal RS SO';
      }
      if (['passport', 'article', 'account', 'pli', 'other'].includes(selectedService.id)) {
        payload.message = formData.message;
      }

      await addDoc(collection(db, selectedService.collection), payload);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D8232A', '#FFCB05', '#8B0000']
      });

      setSelectedService(null);
      setFormData({ name: '', address: '', mobile: '', quantity: '1', bookingDate: '', message: '' });
      alert('Request submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={hideHeader ? "" : "max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 pb-32 md:pb-20"}>
      {!hideHeader && (
        <div className="text-center mb-10 md:mb-16">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="section-heading-line" />
            <h2 className="text-2xl md:text-4xl font-black text-slate-800 uppercase tracking-tighter">Service Request Portal</h2>
          </div>
          <p className="text-slate-500 max-w-xl mx-auto font-medium text-xs md:text-base leading-relaxed">
            Select a citizen-centric service below to initiate a request. Our dedicated postal staff will process your application promptly.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {SERVICES.map((service) => (
          <motion.button
            key={service.id}
            whileHover={{ y: -8, shadow: "0 20px 40px -12px rgba(0,0,0,0.12)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedService(service)}
            className="flex flex-col items-center p-6 md:p-10 bg-white rounded-3xl md:rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-ip-red transition-all group"
          >
            <div className="w-12 h-12 md:w-24 md:h-24 bg-slate-50 rounded-2xl md:rounded-3xl flex items-center justify-center text-ip-maroon mb-4 md:mb-8 group-hover:bg-ip-red group-hover:text-white transition-all shadow-sm">
              <service.icon size={24} className="md:w-[44px] md:h-[44px]" />
            </div>
            <h3 className="font-black text-center text-slate-800 uppercase tracking-tight text-[10px] md:text-sm leading-tight flex-grow notranslate">{service.name}</h3>
            <div className="mt-4 md:mt-6 flex items-center gap-2 md:gap-3 text-[8px] md:text-[11px] font-black text-ip-red uppercase tracking-widest border-t border-slate-50 pt-3 md:pt-4 w-full justify-center">
              <span>Request</span>
              <Send size={10} className="md:w-[14px] md:h-[14px] group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setSelectedService(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden border border-white/20"
            >
              <div className="bg-ip-red p-8 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12 scale-150">
                  <selectedService.icon size={120} />
                </div>
                <div className="flex items-center gap-5 relative z-10">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-xl">
                    <selectedService.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">{selectedService.name}</h3>
                    <p className="text-[10px] font-black text-ip-amber uppercase tracking-widest opacity-80">Official Form Submission</p>
                  </div>
                </div>
                <button onClick={() => setSelectedService(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors relative z-10 backdrop-blur-sm">
                  <X size={28} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Applicant Full Name</label>
                    <input 
                      required 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:border-ip-red focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Contact Number</label>
                    <input 
                      required 
                      type="tel"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:border-ip-red focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                      placeholder="10-digit mobile number"
                      value={formData.mobile}
                      onChange={e => setFormData({...formData, mobile: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Residencial Address</label>
                  <textarea 
                    required 
                    rows={3}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:border-ip-red focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                    placeholder="Enter complete address for verification"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                {selectedService.id === 'gangajal' && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Quantity Selection</label>
                    <select 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:border-ip-red focus:bg-white outline-none font-bold text-slate-700 cursor-pointer shadow-sm appearance-none"
                      value={formData.quantity}
                      onChange={e => setFormData({...formData, quantity: e.target.value})}
                    >
                      {[1,2,3,4,5,10].map(n => <option key={n} value={n}>{n} Bottle{n > 1 ? 's' : ''} of Gangajal</option>)}
                    </select>
                  </div>
                )}

                {selectedService.id === 'aadhaar' && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Preferred Appointment Date</label>
                    <input 
                      required 
                      type="date"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:border-ip-red focus:bg-white outline-none font-bold text-slate-700 shadow-sm"
                      value={formData.bookingDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setFormData({...formData, bookingDate: e.target.value})}
                    />
                    <div className="flex items-center gap-2 pl-2">
                      <Shield size={10} className="text-green-500" />
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Assigned: Dhenkanal RS SO Main Counter</p>
                    </div>
                  </div>
                )}

                {!['gangajal', 'aadhaar'].includes(selectedService.id) && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Request Details</label>
                    <textarea 
                      required 
                      rows={3}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:border-ip-red focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                      placeholder="Detail your requirement for better assistance..."
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ip-red text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-red-500/30 hover:bg-ip-maroon disabled:opacity-50 flex items-center justify-center gap-3 transition-all mt-8 group"
                >
                  {loading ? <Loader2 className="animate-spin" /> : (
                    <>
                      CONFIRM REQUEST
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
