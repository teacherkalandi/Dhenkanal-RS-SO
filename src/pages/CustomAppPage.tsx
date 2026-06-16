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
    <div className="max-w-7xl w-full mx-auto p-4 md:p-8 pt-8 md:pt-12">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors uppercase tracking-widest bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-6 md:p-12 min-h-[60vh] overflow-hidden"
      >
        <div className="mb-10 text-center">
           <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">{appData.title}</h1>
           <div className="w-24 h-1.5 bg-[#D8232A] rounded-full mx-auto mt-6" />
        </div>

        <div className="w-full h-[800px] border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50">
          <iframe 
            title={appData.title}
            srcDoc={appData.htmlCode}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className="w-full h-full border-none"
            style={{ minHeight: '800px' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
