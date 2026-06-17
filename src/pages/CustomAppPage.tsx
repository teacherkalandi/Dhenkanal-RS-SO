import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, ArrowLeft } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion } from 'motion/react';

export default function CustomAppPage() {
  const { id } = useParams<{ id: string }>();
  const [appData, setAppData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApp() {
      if (!id) return;
      try {
        const docRef = doc(db, 'custom_apps', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setAppData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('App not found');
        }
      } catch (err) {
        console.error('Error fetching custom app:', err);
        setError('Failed to load app');
      } finally {
        setLoading(false);
      }
    }
    fetchApp();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  if (error || !appData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
          <Link to="/" className="text-red-600 hover:text-red-800 underline">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="p-4 bg-white shadow-sm flex items-center justify-between border-b border-gray-100 z-10 shrink-0">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#D8232A] transition-colors uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <h1 className="text-lg md:text-xl font-black text-gray-900 tracking-tight truncate px-4">{appData.title}</h1>
        <div className="w-[120px] hidden md:block"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 w-full bg-white relative flex flex-col"
      >
        <iframe 
          title={appData.title}
          srcDoc={appData.htmlCode}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          className="flex-1 w-full h-full border-none"
          style={{ minHeight: 'calc(100vh - 73px)' }}
        />
      </motion.div>
    </div>
  );
}
