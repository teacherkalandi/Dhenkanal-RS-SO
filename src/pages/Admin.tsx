import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, LogIn, LogOut, FilePlus, Megaphone, ClipboardList, ShieldCheck, User, Trash2, Edit, Search, Plus, Filter, Loader2, Save, X, Eye, FileDown, FileText, ExternalLink } from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { formatDate, cn } from '../lib/utils';

const ADMIN_EMAIL = 'teacherkalandi@gmail.com';

const TABS = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'documents', name: 'Documents', icon: FilePlus },
  { id: 'news', name: 'Latest News', icon: Megaphone },
  { id: 'requests', name: 'Service Requests', icon: ClipboardList },
];

const CATEGORIES = [
  'Savings', 'PLI/RPLI', 'Domestic Mails', 'International Mails', 'Parcels', 'BD/CCS', 'PO Orders/Rules', 'Official Documents', 'Others', 'Philately'
];

export default function Admin() {
  const [user, setUser] = useState(auth.currentUser);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={48} /></div>;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl md:rounded-[3rem] shadow-2xl p-8 md:p-12 text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-[#D8232A] mx-auto mb-8">
            <ShieldCheck size={48} />
          </div>
          <h2 className="text-3xl font-black text-[#8B0000] uppercase mb-4 tracking-tight">Admin Portal</h2>
          <p className="text-gray-500 mb-10 text-sm leading-relaxed">This area is restricted to authorized personnel. Please sign in with your official account to manage the portal.</p>
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-[#D8232A] text-white py-4 rounded-3xl font-bold shadow-xl shadow-red-500/30 flex items-center justify-center gap-3 hover:bg-[#8B0000] hover:-translate-y-1 transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" className="w-6 h-6 bg-white p-1 rounded-full" />
            Sign in with Google
          </button>
          {!user && <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Access restricted to: {ADMIN_EMAIL}</p>}
          {user && user.email !== ADMIN_EMAIL && (
            <div className="mt-8 p-4 bg-red-50 rounded-2xl">
              <p className="text-xs font-bold text-[#D8232A]">Access Denied: {user.email}</p>
              <button onClick={() => signOut(auth)} className="text-xs underline mt-2">Sign out and retry</button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white border-r p-6 md:py-12 flex flex-col md:space-y-10 border-b md:border-b-0 sticky top-0 md:h-screen z-40 bg-white/90 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4 md:mb-0">
          <div className="flex items-center gap-4 px-4 bg-gray-50 p-4 rounded-3xl border border-gray-100 flex-1 md:flex-none">
             {user.photoURL ? <img src={user.photoURL} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl shadow-lg border-2 border-white" /> : <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500 rounded-2xl text-white flex items-center justify-center font-bold">A</div>}
             <div className="overflow-hidden">
               <p className="text-[10px] font-black uppercase text-[#D8232A] tracking-widest leading-none mb-1">Administrator</p>
               <p className="text-xs md:text-sm font-bold text-gray-800 truncate">{user.displayName || 'Admin'}</p>
             </div>
          </div>
          <button onClick={() => signOut(auth)} className="md:hidden p-3 text-gray-400">
            <LogOut size={20} />
          </button>
        </div>

        <nav className="grid grid-cols-2 sm:grid-cols-4 md:flex md:flex-col gap-2 pb-2 md:pb-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 md:gap-4 px-3 md:px-6 py-3 md:py-4 rounded-2xl font-bold text-[11px] md:text-sm transition-all whitespace-nowrap md:whitespace-normal",
                activeTab === tab.id ? "bg-[#D8232A] text-white shadow-lg shadow-red-500/20" : "text-gray-500 bg-gray-50 md:bg-transparent hover:bg-gray-100"
              )}
            >
              <tab.icon size={16} className="md:w-[20px] md:h-[20px] shrink-0" />
              <span className="truncate">{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="pt-10 hidden md:block mt-auto">
          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-x-hidden pb-24 md:pb-12 space-y-8 md:space-y-12">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <DashboardOverview key="dash" />}
          {activeTab === 'documents' && <DocumentManagement key="docs" />}
          {activeTab === 'news' && <NewsManagement key="news" />}
          {activeTab === 'requests' && <ServiceRequestDashboard key="reqs" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Sub-components for Admin
function DashboardOverview() {
  const [stats, setStats] = useState({
    requests: 0,
    docs: 0,
    visitors: 1250, // Fallback/Placeholder if not implemented
    latestNews: 'No news posted yet'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Documents Count
        const docsSnap = await getDocs(collection(db, 'documents'));
        const docsCount = docsSnap.size;

        // 2. Service Requests Count
        const REQ_COLLECTIONS = [
          'gangajal_orders', 'aadhaar_bookings', 'passport_requests', 
          'article_booking_requests', 'account_opening_requests', 
          'plirpli_requests', 'other_help_requests'
        ];
        
        const counts = await Promise.all(REQ_COLLECTIONS.map(async col => {
          const snap = await getDocs(collection(db, col));
          return snap.size;
        }));
        const totalRequests = counts.reduce((a, b) => a + b, 0);

        // 3. Latest News
        const newsQ = query(collection(db, 'news'), orderBy('createdAt', 'desc'), where('createdAt', '!=', null));
        const newsSnap = await getDocs(newsQ);
        const latestNews = newsSnap.empty ? 'No news posted yet' : newsSnap.docs[0].data().content;

        // 4. Visitors Count
        const visitorDoc = doc(db, 'site_stats', 'visitors');
        const visitorSnap = await getDoc(visitorDoc);
        const visitorCount = visitorSnap.exists() ? visitorSnap.data().count : 1250;

        setStats({
          requests: totalRequests,
          docs: docsCount,
          visitors: visitorCount,
          latestNews: latestNews
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-ip-red" size={40} />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <header className="mb-8 md:mb-12 text-center md:text-left">
        <h1 className="text-2xl md:text-4xl font-black text-[#8B0000] uppercase mb-2">Admin Dashboard</h1>
        <div className="w-20 h-1 bg-ip-red mx-auto md:mx-0 mb-4" />
        <p className="text-[10px] md:text-sm text-gray-500 font-medium px-4 md:px-0">Real-time overview of portal statistics and recent updates.</p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: 'Service Requests', value: stats.requests.toString(), icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Total bookings & orders' },
          { label: 'Documents Uploaded', value: stats.docs.toString(), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Official repository items' },
          { label: 'Latest News Update', value: 'Details', icon: Megaphone, color: 'text-emerald-600', bg: 'bg-emerald-50', content: stats.latestNews },
          { label: 'Total Visitors', value: stats.visitors.toLocaleString(), icon: User, color: 'text-[#D8232A]', bg: 'bg-red-50', desc: 'Portal reach analytics' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between min-h-[200px] hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="relative z-10">
              <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                <stat.icon size={24} className="md:w-[28px] md:h-[28px]" />
              </div>
              <p className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{stat.label}</p>
              {stat.content ? (
                <p className="text-xs font-bold text-gray-800 line-clamp-3 leading-relaxed mt-2">{stat.content}</p>
              ) : (
                <div className="mt-auto">
                  <p className="text-2xl md:text-4xl font-black text-gray-800">{stat.value}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tighter">{stat.desc}</p>
                </div>
              )}
            </div>
            <div className={cn("absolute -bottom-8 -right-8 w-32 h-32 opacity-5 rounded-full", stat.bg)} />
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-[#D8232A] shrink-0 shadow-inner">
            <ShieldCheck size={40} />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight mb-2">Portal Status: Secured</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
              All communications are encrypted. Role-based access control is active. Only authorized personnel from Dhenkanal Postal Division can modify critical portal data.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function NewsManagement() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setNewsList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'news'), { content, createdAt: serverTimestamp() });
      setContent('');
      fetchNews();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await deleteDoc(doc(db, 'news', id));
    fetchNews();
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="text-3xl font-black text-[#8B0000] uppercase mb-8">News Management</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <form onSubmit={handleAdd} className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-xl border border-gray-100 h-fit">
          <h3 className="font-black text-[#D8232A] uppercase tracking-widest text-[10px] md:text-xs mb-6">Create New Update</h3>
          <textarea 
            required 
            rows={4}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 md:px-6 py-3 md:py-4 focus:ring-2 focus:ring-red-500 outline-none transition-all mb-6 text-sm md:text-base"
            placeholder="Type your news here..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <button 
            disabled={saving}
            className="w-full bg-[#D8232A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#8B0000] disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
            Post Announcement
          </button>
        </form>

        <div className="space-y-4">
          <h3 className="font-black text-gray-400 uppercase tracking-widest text-xs mb-6">Current Marquee Items</h3>
          {newsList.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group">
              <div className="flex-1 pr-6">
                <p className="text-sm font-bold text-gray-800 mb-1">{item.content}</p>
                <p className="text-[10px] text-gray-400 font-bold tracking-widest">{formatDate(item.createdAt?.toDate ? item.createdAt.toDate() : item.createdAt)}</p>
              </div>
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DocumentManagement() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    title: '', category: CATEGORIES[0], subCategory: '', description: '', fileUrl: '', externalLink: ''
  });

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setDocs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'documents'), {
        ...form,
        category: form.category.toLowerCase().replace(/[\/\s]/g, '-'),
        createdAt: serverTimestamp(),
        authorUid: auth.currentUser?.uid
      });
      setShowAdd(false);
      setForm({ title: '', category: CATEGORIES[0], subCategory: '', description: '', fileUrl: '', externalLink: '' });
      fetchDocs();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await deleteDoc(doc(db, 'documents', id));
    fetchDocs();
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-black text-[#8B0000] uppercase">Official Repository</h2>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-[#D8232A] text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#8B0000] transition-all shadow-xl shadow-red-500/20 w-full md:w-auto"
        >
          <Plus size={20} />
          Upload New
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {docs.map(doc => (
          <div key={doc.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between h-64 group hover:shadow-xl transition-all">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-red-50 text-[#D8232A] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">{doc.category}</span>
                <button onClick={() => handleDelete(doc.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
              <h4 className="font-bold text-gray-800 line-clamp-2 mb-2">{doc.title}</h4>
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{doc.subCategory}</p>
            </div>
            <div className="pt-4 border-t flex items-center justify-between">
               <p className="text-[10px] text-gray-400">{formatDate(doc.createdAt?.toDate ? doc.createdAt.toDate() : doc.createdAt)}</p>
               <div className="flex gap-2">
                 {doc.fileUrl && <a href={doc.fileUrl} className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-red-600"><FileDown size={14} /></a>}
                 {doc.externalLink && <a href={doc.externalLink} target="_blank" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600"><Eye size={14} /></a>}
               </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden">
               <div className="bg-[#D8232A] p-8 text-white flex justify-between items-center">
                 <h3 className="text-2xl font-black uppercase tracking-tight">Upload Document</h3>
                 <button onClick={() => setShowAdd(false)} className="bg-white/20 p-2 rounded-full"><X /></button>
               </div>
               <form onSubmit={handleAdd} className="p-6 md:p-10 space-y-4 max-h-[70vh] overflow-y-auto">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</label>
                      <select required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sub Category</label>
                      <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" value={form.subCategory} onChange={e => setForm({...form, subCategory: e.target.value})} placeholder="e.g. Rules, Forms" />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document Title</label>
                    <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Official name of document" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                    <textarea rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief summary..." />
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                    <div className="flex flex-col justify-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Drive Repository</p>
                      <a 
                        href="https://drive.google.com/drive/folders/12n_G6cD8Ps-N2DvPm45HI17PhYmNYsOl?usp=sharing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        Open Official G-Drive Folder
                      </a>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl">
                      <p className="text-[9px] text-blue-800 leading-tight">
                        <strong>Tip:</strong> Upload your file to the correct category subfolder in Drive first, then copy the "Share Link" and paste it below.
                      </p>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">External Link (Official URL)</label>
                      <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" value={form.externalLink} onChange={e => setForm({...form, externalLink: e.target.value})} placeholder="e.g. indiapost.gov.in link" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">G-Drive File Link</label>
                      <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" value={form.fileUrl} onChange={e => setForm({...form, fileUrl: e.target.value})} placeholder="https://drive.google.com/..." />
                    </div>
                 </div>
                 <button disabled={loading} className="w-full bg-[#D8232A] text-white py-4 rounded-2xl font-bold uppercase tracking-widest mt-6 shadow-xl shadow-red-500/20">
                   {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Save Document'}
                 </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ServiceRequestDashboard() {
  const [activeReqTab, setActiveReqTab] = useState('gangajal_orders');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const REQ_TYPES = [
    { id: 'gangajal_orders', name: 'Gangajal' },
    { id: 'aadhaar_bookings', name: 'Aadhaar' },
    { id: 'passport_requests', name: 'Passport' },
    { id: 'article_booking_requests', name: 'Articles' },
    { id: 'account_opening_requests', name: 'Accounts' },
    { id: 'plirpli_requests', name: 'PLI/RPLI' },
    { id: 'other_help_requests', name: 'Others' }
  ];

  useEffect(() => {
    fetchRequests();
  }, [activeReqTab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, activeReqTab), orderBy('submittedAt', 'desc'));
      const snap = await getDocs(q);
      setRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await deleteDoc(doc(db, activeReqTab, id));
    fetchRequests();
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="text-3xl font-black text-[#8B0000] uppercase mb-8">Service Dashboard</h2>
      
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {REQ_TYPES.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveReqTab(tab.id)}
              className={cn("px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap transition-all", activeReqTab === tab.id ? "bg-[#8B0000] text-white shadow-lg" : "bg-white text-gray-500 border border-gray-100")}
            >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl md:rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Mobile: Card List, Desktop: Table */}
        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-red-600" /></div>
        ) : requests.length === 0 ? (
          <div className="p-20 text-center text-gray-400 font-bold uppercase text-xs">No requests found</div>
        ) : (
          <>
            <div className="md:hidden divide-y divide-gray-50">
              {requests.map(req => (
                <div key={req.id} className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-gray-800 text-sm">{req.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{req.mobile}</p>
                    </div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                      {formatDate(req.submittedAt?.toDate ? req.submittedAt.toDate() : req.submittedAt)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[11px] text-gray-600 leading-relaxed mb-2">{req.address}</p>
                    <div className="flex flex-wrap gap-1">
                      {req.quantity && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[8px] font-bold tracking-tighter uppercase">Qty: {req.quantity}</span>}
                      {req.bookingDate && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[8px] font-bold tracking-tighter uppercase">Booked: {req.bookingDate}</span>}
                      {req.message && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[8px] font-bold tracking-tighter uppercase">Has Message</span>}
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={() => handleDelete(req.id)} className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-lg">
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto scrollbar-hide">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client Details</th>
                    <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Request Info</th>
                    <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {requests.map(req => (
                      <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 md:px-8 py-4 md:py-6">
                          <p className="font-bold text-gray-800 text-sm">{req.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium">{req.mobile}</p>
                        </td>
                        <td className="px-6 md:px-8 py-4 md:py-6">
                          <p className="text-[11px] text-gray-600 line-clamp-1 max-w-[200px] md:max-w-xs">{req.address}</p>
                          <div className="mt-1 flex flex-wrap gap-1 md:gap-2">
                            {req.quantity && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[9px] font-bold tracking-tighter uppercase">Qty: {req.quantity}</span>}
                            {req.bookingDate && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[9px] font-bold tracking-tighter uppercase">Booked: {req.bookingDate}</span>}
                            {req.message && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-bold tracking-tighter uppercase">Has Message</span>}
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-4 md:py-6 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                          {formatDate(req.submittedAt?.toDate ? req.submittedAt.toDate() : req.submittedAt)}
                        </td>
                        <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                          <button onClick={() => handleDelete(req.id)} className="p-2 text-gray-200 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

