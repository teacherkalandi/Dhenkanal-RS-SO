import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ServiceRequest from './components/services/ServiceRequest';
import Admin from './pages/Admin';
import InternalSite from './pages/InternalSite';
import { db } from './lib/firebase';
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';

export default function App() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const visitorDoc = doc(db, 'site_stats', 'visitors');
        const snap = await getDoc(visitorDoc);
        if (snap.exists()) {
          await updateDoc(visitorDoc, { count: increment(1) });
        } else {
          try {
            await setDoc(visitorDoc, { count: 1 });
          } catch (e) {
            // Silently fail for regular users
          }
        }
      } catch (error) {
        // Only log if it's not a permission error
        if (error instanceof Error && !error.message.includes('permission-denied')) {
          console.error("Error tracking visitor:", error);
        }
      }
    };
    trackVisitor();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans selection:bg-red-100 selection:text-red-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/services" element={<ServiceRequest />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/internal-site" element={<InternalSite />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
