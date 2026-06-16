import React, { useState, useEffect } from 'react';
import Hero from '../components/home/Hero';
import NewsMarquee from '../components/home/NewsMarquee';
import ServiceShortcuts from '../components/home/ServiceShortcuts';
import MyAppSection from '../components/home/MyAppSection';
import ServiceRequest from '../components/services/ServiceRequest';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Mail, ArrowRight, FileText, Bell, Loader2, ZoomIn, Calendar, Image as ImageIcon, X } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { cn } from '../lib/utils';

export default function Home() {
  const [impDocs, setImpDocs] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [activeNoticeTab, setActiveNoticeTab] = useState('Notice');

  useEffect(() => {
    async function fetchData() {
      try {
        const docsQuery = query(collection(db, 'important_documents'), orderBy('createdAt', 'desc'));
        const docsSnap = await getDocs(docsQuery);
        setImpDocs(docsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const noticesQuery = query(collection(db, 'notices_circulars'), orderBy('createdAt', 'desc'));
        const noticesSnap = await getDocs(noticesQuery);
        setNotices(noticesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching homepage bulletin boards:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const photosQuery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const photosSnap = await getDocs(photosQuery);
        setPhotos(photosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching photos for gallery:", err);
      } finally {
        setLoadingPhotos(false);
      }
    }
    fetchPhotos();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <Hero />
      <NewsMarquee />
      <ServiceShortcuts />

      {/* Service Request Portal Section */}
      <section id="service-request" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-ip-red font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Official Citizen Services</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-6">
                Service <span className="text-ip-red">Request</span> Portal
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Order postal services directly from your home. Select a service below to start your application.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b-2 border-slate-100 pb-2">
              <span>Secure Government Portal</span>
              <ArrowRight size={14} className="text-ip-red" />
            </div>
          </div>
          
          <div className="bg-slate-50/50 rounded-[3.5rem] p-4 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-ip-red/5 rounded-full blur-3xl -mr-32 -mt-32" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-ip-amber/10 rounded-full blur-3xl -ml-32 -mb-32" />
             
             <ServiceRequest hideHeader />
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="bg-white py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-ip-red font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Event Photograph Repository</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-4">
                Photo <span className="text-ip-red">Gallery</span>
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Highlights from important postal circles, district divisions, and community outreach campaigns.
              </p>
            </div>
          </div>

          {loadingPhotos ? (
            <div className="py-16 text-center">
              <Loader2 className="animate-spin text-[#D8232A] mx-auto" size={32} />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4">Loading Gallery...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200/55 rounded-[2.5rem] p-12 text-center max-w-lg mx-auto">
              <ImageIcon className="text-slate-300 w-12 h-12 mx-auto mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-1">Gallery is Empty</p>
              <p className="text-xs text-slate-400 font-bold">No event photographs are published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative cursor-pointer bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 border border-slate-150 flex flex-col h-96"
                >
                  {/* Photo Head */}
                  <div className="relative h-56 overflow-hidden bg-slate-950 shrink-0 flex items-center justify-center">
                    {/* Blurred background backdrop */}
                    <img
                      referrerPolicy="no-referrer"
                      src={photo.imageUrl}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110 pointer-events-none"
                    />
                    <img
                      referrerPolicy="no-referrer"
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="relative z-10 max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-750 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                      <div className="bg-white/95 text-slate-800 p-3 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300 ease-out">
                        <ZoomIn size={18} />
                      </div>
                    </div>
                    {photo.date && (
                      <div className="absolute bottom-3 left-4 bg-black/60 backdrop-blur-md text-white font-extrabold text-[9px] uppercase tracking-widest py-1 px-3 rounded-full leading-none shadow-sm z-20">
                        {photo.date}
                      </div>
                    )}
                  </div>
                  
                  {/* Photo Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between overflow-hidden">
                    <div className="space-y-2 overflow-y-auto pr-1">
                      <h3 className="font-extrabold text-slate-800 text-base uppercase tracking-tight group-hover:text-red-750 transition-colors leading-snug line-clamp-2">
                        {photo.title}
                      </h3>
                      {photo.description && (
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3">
                          {photo.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox / Enlarged View Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            {/* Lightbox Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden z-[51] flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Image Frame */}
              <div className="relative bg-slate-950 flex items-center justify-center min-h-[40vh] md:w-3/5 overflow-hidden">
                <img
                  referrerPolicy="no-referrer"
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain max-h-[40vh] md:max-h-[80vh]"
                />
                
                {/* Close Overlay Button on Mobile */}
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 left-4 md:hidden bg-white/90 text-slate-800 hover:bg-white rounded-full p-2 h-10 w-10 flex items-center justify-center shadow-md cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Text / Context Content */}
              <div className="p-8 md:p-12 md:w-2/5 flex flex-col justify-between bg-white text-slate-800 overflow-y-auto max-h-[50vh] md:max-h-[85vh]">
                <div>
                  <div className="hidden md:flex justify-end mb-6">
                    <button
                      onClick={() => setSelectedPhoto(null)}
                      className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 h-10 w-10 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {selectedPhoto.date && (
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 py-1.5 px-3 rounded-xl mb-4 leading-none">
                      <Calendar size={12} className="text-[#D8232A]" />
                      {selectedPhoto.date}
                    </div>
                  )}

                  <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight leading-snug mb-4">
                    {selectedPhoto.title}
                  </h3>
                  
                  <div className="w-12 h-1 bg-[#D8232A] mb-6" />

                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {selectedPhoto.description || "No description provided for this visual snapshot."}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-6 mt-8 flex flex-col gap-2">
                  <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Dhenkanal Division Gallery</p>
                  <div className="flex gap-4">
                    <a 
                      href={selectedPhoto.imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1"
                    >
                      View Original Link
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Important Documents & Notices Bulletin Board */}
      <section className="py-16 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* IMPORTANT DOCUMENTS COLUMN */}
            <div className="bg-white rounded-[2.5rem] shadow-md hover:shadow-lg border-2 border-[#1b4395]/30 hover:border-[#1b4395]/80 transition-all duration-300 overflow-hidden flex flex-col min-h-[480px]">
              {/* Box Header - Royal Blue exactly like the screenshot */}
              <div className="bg-[#1b4395] px-6 py-5 flex items-center gap-3 text-white border-b-2 border-[#1b4395]/10">
                <FileText className="text-white shrink-0 animate-pulse" size={24} />
                <h3 className="text-lg md:text-xl font-black tracking-wider uppercase m-0 leading-none">Important Documents</h3>
              </div>
              
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                {loading ? (
                  <div className="flex-1 flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-[#1b4395]" size={36} />
                  </div>
                ) : impDocs.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
                    <FileText size={48} className="stroke-1 mb-3 opacity-60" />
                    <p className="text-sm font-bold uppercase tracking-wider">No Important Documents Published</p>
                    <p className="text-xs text-gray-400 mt-1">Manage documents inside the Admin Dashboard</p>
                  </div>
                ) : (
                  <ul className="space-y-4 flex-1 max-h-[360px] overflow-y-auto pr-2 list-scrollbar">
                    {impDocs.map((docItem) => (
                      <li key={docItem.id} className="flex items-start gap-2.5 pb-3 border-b border-dashed border-gray-100 last:border-0 hover:bg-slate-50/50 p-2 rounded-xl transition-all group">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D8232A] mt-1.5 shrink-0 group-hover:scale-125 transition-all" />
                        <div className="flex-1 text-sm leading-relaxed">
                          <span className="text-[#8B0000] font-black tracking-tight hover:text-[#D8232A] transition-colors pr-2">
                            {docItem.title}
                          </span>
                          
                          {/* Optional file and flipbook links matching the picture */}
                          <span className="inline-flex items-center gap-1.5 ml-1 text-xs">
                            {docItem.pdfUrl && (
                              <a 
                                href={docItem.pdfUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-blue-600 hover:text-blue-800 font-extrabold uppercase hover:underline inline-flex items-center gap-0.5"
                                title="Open PDF Document"
                              >
                                PDF
                              </a>
                            )}
                            {docItem.pdfUrl && docItem.flipbookUrl && <span className="text-gray-300">|</span>}
                            {docItem.flipbookUrl && (
                              <a 
                                href={docItem.flipbookUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-blue-600 hover:text-blue-800 font-extrabold uppercase hover:underline inline-flex items-center gap-0.5"
                                title="Open Flipbook link"
                              >
                                Flipbook
                              </a>
                            )}
                          </span>
                          
                          {docItem.isNew && (
                            <span className="text-[#D8232A] font-black tracking-widest text-[11px] uppercase ml-2 select-none animate-pulse">
                              New!
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* NOTICE BOARD COLUMN */}
            <div className="bg-white rounded-[2.5rem] shadow-md hover:shadow-lg border-2 border-[#E59834]/30 hover:border-[#E59834]/80 transition-all duration-300 overflow-hidden flex flex-col min-h-[480px]">
              {/* Box Header - Deep Gold / Amber exactly like the screenshot */}
              <div className="bg-[#E59834] px-6 py-5 flex items-center gap-3 text-white border-b-2 border-[#E59834]/10">
                <Bell className="text-white shrink-0" size={24} />
                <h3 className="text-lg md:text-xl font-black tracking-wider uppercase m-0 leading-none">Notice / Circular</h3>
              </div>

              {/* Tabs Section exactly like screenshot */}
              <div className="bg-gray-50/80 border-b border-gray-100 px-4 py-2.5">
                <div className="flex flex-wrap gap-1.5">
                  {['Notice', 'Accommodation', 'CGHS', 'Pension/Salary', 'Miscellaneous'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveNoticeTab(tab)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer",
                        activeNoticeTab === tab 
                          ? "bg-white text-blue-700 shadow-sm border border-gray-200/60"
                          : "text-gray-500 hover:bg-white/60 hover:text-blue-600"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col">
                {loading ? (
                  <div className="flex-1 flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-[#E59834]" size={36} />
                  </div>
                ) : notices.filter(n => n.category === activeNoticeTab).length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
                    <Bell size={48} className="stroke-1 mb-3 opacity-60" />
                    <p className="text-sm font-bold uppercase tracking-wider">No Notices in {activeNoticeTab}</p>
                    <p className="text-xs text-gray-400 mt-1">Upload notice / circular inside the Admin Dashboard</p>
                  </div>
                ) : (
                  <ul className="space-y-4 flex-1 max-h-[360px] overflow-y-auto pr-2 list-scrollbar">
                    {notices.filter(n => n.category === activeNoticeTab).map((notice) => (
                      <li key={notice.id} className="flex items-start gap-2.5 pb-3 border-b border-dashed border-gray-100 last:border-0 hover:bg-slate-50/50 p-2 rounded-xl transition-all group">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D8232A] mt-1.5 shrink-0 group-hover:scale-125 transition-all" />
                        <div className="flex-1 text-sm leading-relaxed">
                          {notice.fileUrl ? (
                            <a 
                              href={notice.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-700 font-bold hover:underline hover:text-blue-900 transition-colors inline leading-snug tracking-tight"
                            >
                              {notice.title}
                            </a>
                          ) : (
                            <span className="text-slate-800 font-bold leading-snug tracking-tight">
                              {notice.title}
                            </span>
                          )}

                          {notice.isNew && (
                            <span className="text-blue-600 font-black tracking-widest text-[11px] uppercase ml-2 select-none animate-pulse">
                              New!
                            </span>
                          )}

                          {notice.date && (
                            <div className="text-[10px] text-gray-450 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
                              <span>Published:</span>
                              <span className="text-gray-500">{notice.date}</span>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* My Apps Section */}
      <MyAppSection />

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-white rounded-[3rem] shadow-sm border border-gray-50 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-1 space-y-4">
            <h3 className="text-2xl font-black text-[#8B0000] uppercase">Dhenkanal RS SO</h3>
            <p className="text-gray-600 leading-relaxed">
              Serving the community of Dhenkanal with dedication and technological advancement. We provide more than just letters; we provide connections.
            </p>
            <div className="pt-4 flex flex-col gap-4">
               <div className="flex items-center gap-3 text-sm text-gray-600">
                 <MapPin size={18} className="text-[#D8232A]" />
                 <span>Near Dhenkanal Railway Station, 759013</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                 <Mail size={18} className="text-[#D8232A]" />
                 <span>dhenkanalrsso@indiapost.gov.in</span>
               </div>
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-all">
              <h4 className="font-bold text-[#8B0000] mb-3 uppercase tracking-wider">Mission</h4>
              <p className="text-sm text-gray-600">To provide high-quality and reliable postal, financial, and retail services to the doorstep of every citizen.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-all">
              <h4 className="font-bold text-[#8B0000] mb-3 uppercase tracking-wider">Vision</h4>
              <p className="text-sm text-gray-600">To be the most preferred and reliable logistics and financial service provider in the region.</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
