import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ServiceRequest from './components/services/ServiceRequest';
import Admin from './pages/Admin';
import InternalSite from './pages/InternalSite';
import CustomAppPage from './pages/CustomAppPage';
import MyAppsPage from './pages/MyAppsPage';
import { db } from './lib/firebase';
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';

export default function App() {
  useEffect(() => {
    const trackVisitor = async () => {
      const visitorDoc = doc(db, 'site_stats', 'visitors');
      try {
        const snap = await getDoc(visitorDoc);
        if (snap.exists()) {
          await updateDoc(visitorDoc, { count: increment(1) });
        } else {
          try {
            await setDoc(visitorDoc, { count: 1 });
          } catch (e) {
            // Admin only usually for creation based on rules, so if it fails it's fine
            console.log("Visitor doc initialize failed - expected if not admin");
          }
        }
      } catch (error) {
        console.error("Error tracking visitor:", error);
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
            <Route path="/my-apps" element={<MyAppsPage />} />
            <Route path="/my-apps/:id" element={<CustomAppPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
