import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FileDown, Plus, Trash2, Loader2 } from 'lucide-react';

export function FormsManagement() {
  const [forms, setForms] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    displayName: '',
    uploadLink: '',
    description: ''
  });

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const q = query(collection(db, 'downloadable_forms'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setForms(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching forms:", err);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName.trim() || !formData.uploadLink.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'downloadable_forms'), {
        type: formData.type.trim(),
        displayName: formData.displayName.trim(),
        uploadLink: formData.uploadLink.trim(),
        description: formData.description.trim(),
        createdAt: serverTimestamp()
      });
      setFormData({ type: '', displayName: '', uploadLink: '', description: '' });
      fetchForms();
    } catch (err) {
      console.error("Error adding form:", err);
      alert("Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return;
    try {
      await deleteDoc(doc(db, 'downloadable_forms', id));
      fetchForms();
    } catch (err) {
      console.error("Error deleting form:", err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#8B0000] uppercase">Forms Management</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage downloadable forms displayed on the homepage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <form onSubmit={handleAdd} className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 h-fit space-y-5">
          <h3 className="font-black text-[#D8232A] uppercase tracking-widest text-xs">Upload New Form</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</label>
            <select 
              required 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm text-gray-800 focus:ring-2 focus:ring-red-500 appearance-none"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="" disabled>Select Type</option>
              <option value="Savings">Savings</option>
              <option value="PLI/RPLI" className="notranslate">PLI/RPLI</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Display Name</label>
            <input 
              required 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm text-gray-800 focus:ring-2 focus:ring-red-500"
              placeholder="e.g. Form 15G"
              value={formData.displayName}
              onChange={e => setFormData({...formData, displayName: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Link (URL)</label>
            <input 
              required
              type="url"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm text-gray-800 focus:ring-2 focus:ring-red-500"
              placeholder="https://drive.google.com/..."
              value={formData.uploadLink}
              onChange={e => setFormData({...formData, uploadLink: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
            <textarea 
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm text-gray-800 focus:ring-2 focus:ring-red-500"
              placeholder="Brief description of the form"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            disabled={saving}
            className="w-full bg-[#D8232A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#8B0000] disabled:opacity-50 transition-all shadow-xl shadow-red-500/10 cursor-pointer"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
            Submit
          </button>
        </form>

        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-black text-gray-400 uppercase tracking-widest text-xs">Live Forms ({forms.length})</h3>
          
          {forms.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
              <FileDown className="mx-auto mb-2 opacity-40 text-gray-300" size={32} />
              <p className="text-sm font-bold uppercase tracking-wider">No Forms Uploaded Yet</p>
              <p className="text-xs mt-1 text-gray-400">Upload a form on the left to display it on the homepage.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {forms.map(formItem => (
                <div key={formItem.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-start justify-between group">
                  <div className="flex-1 pr-4">
                    <p className="text-[10px] uppercase font-black text-[#D8232A] mb-1 notranslate">{formItem.type === 'PL/RPLI' || formItem.type === 'PL/PLI' ? 'PLI/RPLI' : formItem.type}</p>
                    <p className="text-sm font-bold text-gray-800 leading-snug">{formItem.displayName}</p>
                    {formItem.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{formItem.description}</p>
                    )}
                    <a href={formItem.uploadLink} target="_blank" rel="noreferrer" className="inline-block mt-2 text-[10px] font-black text-white bg-[#8B0000] hover:bg-[#D8232A] px-3 py-1.5 rounded-lg uppercase tracking-wider">
                      View Form
                    </a>
                  </div>
                  <button 
                    onClick={() => handleDelete(formItem.id)}
                    className="p-2.5 text-gray-350 hover:text-red-500 rounded-full hover:bg-red-50 transition-all shrink-0 cursor-pointer"
                    title="Delete form"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
