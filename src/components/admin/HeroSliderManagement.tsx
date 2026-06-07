import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Image as ImageIcon, Save, Loader2, Trash2 } from 'lucide-react';

export function HeroSliderManagement() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '' });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'hero_slides'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSlides(data);
    } catch (err) {
      console.log('Error fetching slides', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    try {
      await deleteDoc(doc(db, 'hero_slides', id));
      setSlides(slides.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete slide.');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) return alert("Please fill all required fields");
    setSaving(true);
    
    try {
      const docRef = await addDoc(collection(db, 'hero_slides'), {
        ...form,
        createdAt: serverTimestamp()
      });
      setSlides([{ id: docRef.id, ...form, createdAt: new Date() }, ...slides]);
      setShowAdd(false);
      setForm({ title: '', subtitle: '', imageUrl: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to save slide.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#8B0000] uppercase">Hero Slider Management</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Add or manage extra slides on the homepage hero slider.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-[#D8232A] text-white py-3 px-6 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#8B0000] transition-colors shadow-lg shadow-red-500/20 shadow-sm"
        >
          <Plus size={16} />
          Add Slide Link
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-16 flex justify-center border border-gray-100 shadow-sm">
          <Loader2 className="animate-spin text-red-600" size={32} />
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200 max-w-xl mx-auto">
          <ImageIcon className="mx-auto text-gray-300 w-16 h-16 mb-6" />
          <h3 className="text-xl font-extrabold text-gray-700 uppercase tracking-tight mb-2">No Additional Slides</h3>
          <p className="text-sm text-gray-400 mb-8 max-w-sm mx-auto">
            You haven't uploaded any additional hero slides yet. The standard built-in slides will be shown.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map(slide => (
            <div key={slide.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100/80 flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all h-96">
              <div className="relative h-48 bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center">
                <img 
                  referrerPolicy="no-referrer"
                  src={slide.imageUrl} 
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 pointer-events-none"
                />
                <img 
                  referrerPolicy="no-referrer"
                  src={slide.imageUrl} 
                  alt=""
                  className="relative z-10 max-w-full max-h-full object-contain"
                />
                <button 
                  type="button"
                  onClick={() => handleDelete(slide.id)}
                  className="absolute top-4 right-4 bg-white/90 text-red-605 hover:bg-red-50 p-2.5 rounded-full shadow-md hover:scale-105 transition-all cursor-pointer z-20"
                  title="Delete Slide"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between overflow-hidden">
                <div className="space-y-2 overflow-y-auto pr-1">
                  <h4 className="font-extrabold text-gray-800 text-base lg:text-lg uppercase tracking-tight leading-snug line-clamp-2">
                    {slide.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                    {slide.subtitle || "-"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden">
               <div className="bg-[#D8232A] p-8 text-white flex justify-between items-center">
                 <h3 className="text-2xl font-black uppercase tracking-tight">Add Hero Slide</h3>
                 <button type="button" onClick={() => setShowAdd(false)} className="bg-white/20 p-2 rounded-full"><X /></button>
               </div>
               
               <form onSubmit={handleAdd} className="p-6 md:p-10 space-y-5 max-h-[70vh] overflow-y-auto">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Direct Image URL *</label>
                   <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="Paste direct image link (Unsplash, Imgur, etc.)" />
                   {form.imageUrl && (
                     <div className="mt-2 rounded-2xl overflow-hidden h-32 border bg-gray-50 relative flex items-center justify-center">
                       <img referrerPolicy="no-referrer" src={form.imageUrl} className="h-full w-full object-cover" onError={(e)=>{ (e.target as any).src='https://placehold.co/600x400?text=Invalid+Image+URL'; }} />
                     </div>
                   )}
                 </div>

                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title *</label>
                   <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Special Campaign" />
                 </div>

                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtitle (Optional)</label>
                   <textarea rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} placeholder="Brief subtitle text..." />
                 </div>

                 <button disabled={saving} className="w-full bg-[#D8232A] text-white py-4 rounded-2xl font-bold uppercase tracking-widest mt-6 shadow-xl shadow-red-500/20 flex items-center justify-center gap-2">
                   {saving ? <Loader2 className="animate-spin" /> : <Save size={16} />}
                   {saving ? 'Saving...' : 'Add Slide'}
                 </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
