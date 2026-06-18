import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit, Save, X, Loader2, Code, Upload } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export function CustomAppsManagement() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [category, setCategory] = useState('Others');
  const [saving, setSaving] = useState(false);

  const APP_CATEGORIES = ['Finacle', 'APT 2.0', 'Savings', 'PLI/RPLI', 'Business Developement', 'Others'];

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const q = query(collection(db, 'custom_apps'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setApps(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching custom apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        htmlCode,
        category,
      };

      if (editingId) {
        await updateDoc(doc(db, 'custom_apps', editingId), payload);
      } else {
        await addDoc(collection(db, 'custom_apps'), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }

      await fetchApps();
      resetForm();
    } catch (error) {
      console.error('Error saving app:', error);
      alert('Failed to save app');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this app?')) return;
    try {
      await deleteDoc(doc(db, 'custom_apps', id));
      setApps(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting app:', error);
      alert('Failed to delete app');
    }
  };

  const editApp = (app: any) => {
    setEditingId(app.id);
    setTitle(app.title);
    setHtmlCode(app.htmlCode);
    setCategory(app.category || 'Others');
    setShowAdd(true);
  };

  const resetForm = () => {
    setTitle('');
    setHtmlCode('');
    setCategory('Others');
    setEditingId(null);
    setShowAdd(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/html' && !file.name.endsWith('.html')) {
      alert('Please upload a valid HTML file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setHtmlCode(content);
      if (!title) {
         // Optionally set title from filename without extension
         setTitle(file.name.replace(/\.html$/, ''));
      }
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsText(file);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-red-600" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">My Apps</h2>
          <p className="text-gray-500 mt-1">Manage custom HTML applications</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAdd(true); }}
          className="flex items-center gap-2 bg-[#D8232A] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#8B0000] transition-colors"
        >
          <Plus size={20} />
          Add App
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 space-y-6 mb-8">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Edit App' : 'Add New App'}</h3>
                <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">App Title</label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="e.g., Target Calculator"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                >
                  {APP_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">HTML Code</label>
                  <div>
                    <input
                      type="file"
                      accept=".html"
                      id="html-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="html-upload"
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold cursor-pointer transition-colors"
                    >
                      <Upload size={14} />
                      Upload HTML File
                    </label>
                  </div>
                </div>
                <textarea
                  required
                  value={htmlCode}
                  onChange={e => setHtmlCode(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors h-64 font-mono text-sm"
                  placeholder="Paste your HTML code here or upload a file..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 bg-[#D8232A] text-white rounded-xl font-bold hover:bg-[#8B0000] disabled:opacity-50 transition-colors"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {editingId ? 'Update App' : 'Save App'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map(app => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-[#D8232A] mb-4">
              <Code size={24} />
            </div>
            
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{app.title}</h3>
            
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              {app.category || 'Others'}
            </p>

            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-6 border-b pb-4">
              Added: {formatDate(app.createdAt)}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => editApp(app)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(app.id)}
                className="flex items-center justify-center p-2 text-gray-400 border-2 border-gray-100 rounded-xl hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}

        {apps.length === 0 && !showAdd && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-[2rem]">
            <Code size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No apps found</h3>
            <p className="text-gray-400 mt-2">Click "Add App" to create your first custom app.</p>
          </div>
        )}
      </div>
    </div>
  );
}
