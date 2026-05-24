import React, { useState, useEffect } from 'react';
import CategoryCards from '../components/home/CategoryCards';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, Hammer, Cpu, PiggyBank, Mail, ExternalLink, QrCode, X, Copy, Check, Download, Loader2, Calendar, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const OFFICIAL_LINKS = [
  {
    name: 'PMV Ticket Raise',
    url: 'https://pmv-toolkit.vercel.app/',
    description: 'Raise technical and operational support tickets for PM Vishwakarma services.',
    icon: Ticket,
    color: 'bg-amber-50 border-amber-100 hover:border-amber-300 text-amber-900',
    iconBg: 'bg-amber-500 text-white',
    themeColor: '#d97706',
  },
  {
    name: 'PM Vishwakarma Portal',
    url: 'https://pmv-toolkit.vercel.app/',
    description: 'Official PM Vishwakarma platform for artisan onboarding and benefits.',
    icon: Hammer,
    color: 'bg-orange-50 border-orange-100 hover:border-orange-300 text-orange-900',
    iconBg: 'bg-orange-500 text-white',
    themeColor: '#ea580c',
  },
  {
    name: 'APT 2.0',
    url: 'https://app.indiapost.gov.in/employeeportal',
    description: 'Access the official India Post Employee Portal for internal staff services.',
    icon: Cpu,
    color: 'bg-red-50 border-red-100 hover:border-red-300 text-red-900',
    iconBg: 'bg-red-500 text-white',
    themeColor: '#dc2626',
  },
  {
    name: 'Post Office saving Schemes',
    url: 'https://www.indiapost.gov.in/banking-services/savings',
    description: 'Explore national savings schemes, interest rates, and secure post banking.',
    icon: PiggyBank,
    color: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300 text-emerald-900',
    iconBg: 'bg-emerald-500 text-white',
    themeColor: '#059669',
  },
  {
    name: 'ePost',
    url: 'https://epost-indiapost.gov.in/Home.aspx',
    description: 'Send electronic messages as physical letters across secure mail networks.',
    icon: Mail,
    color: 'bg-blue-50 border-blue-100 hover:border-blue-300 text-blue-900',
    iconBg: 'bg-blue-500 text-white',
    themeColor: '#2563eb',
  },
];

export default function InternalSite() {
  const [selectedLinkForQR, setSelectedLinkForQR] = React.useState<typeof OFFICIAL_LINKS[number] | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setPhotos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching photos for gallery:", err);
      } finally {
        setLoadingPhotos(false);
      }
    };
    fetchPhotos();
  }, []);

  const downloadSVG = (link: typeof OFFICIAL_LINKS[number]) => {
    const svgId = `qr-code-svg-${link.name.toLowerCase().replace(/[\/\s]/g, '-')}`;
    const svgElement = document.getElementById(svgId);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${link.name.toLowerCase().replace(/[\/\s]/g, '_')}_qr.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen py-12"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black text-[#8B0000] uppercase tracking-tight mb-4">Internal Portal</h2>
          <div className="w-24 h-1 bg-ip-red mx-auto mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access our comprehensive range of services and product categories. Explore specialized solutions tailored for your needs.
          </p>
        </div>
        
        <CategoryCards />

        {/* Photo Gallery Section */}
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 mt-16 pb-6">
          <div className="flex items-center gap-5 mb-10">
            <div className="section-heading-line animate-pulse bg-gradient-to-r from-red-500 to-amber-500" />
            <div>
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Photo Gallery</h2>
              <p className="text-xs font-bold text-ip-maroon uppercase tracking-[0.3em] opacity-60">Visual Highlights & Division Events</p>
            </div>
          </div>

          {loadingPhotos ? (
            <div className="py-16 text-center">
              <Loader2 className="animate-spin text-red-650 mx-auto" size={32} />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4">Loading Gallery...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200/55 rounded-[2.5rem] p-12 text-center max-w-lg mx-auto">
              <ImageIcon className="text-slate-300 w-12 h-12 mx-auto mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-1">Gallery is Empty</p>
              <p className="text-xs text-slate-400 font-medium font-bold">No event photographs are published yet. Admins can upload photos from the Admin Portal.</p>
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
                    {/* Blurred background backdrop to fill frame with matching colors */}
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
        </section>

        {/* Official Links Section */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-5 mb-10">
            <div className="section-heading-line" />
            <div>
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Official Links</h2>
              <p className="text-xs font-bold text-ip-maroon uppercase tracking-[0.3em] opacity-60">Important Web Portals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OFFICIAL_LINKS.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="h-full"
              >
                <div
                  className={`group relative flex flex-col justify-between border rounded-3xl p-6 ${link.color} transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 active:scale-[0.99] h-full`}
                  id={`official-link-card-${link.name.toLowerCase().replace(/[\/\s]/g, '-')}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`${link.iconBg} p-3 h-12 w-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md`}>
                        <link.icon size={20} />
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                        title="Open link in new tab"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>

                    <div className="flex flex-col pr-4">
                      <h3 className="font-extrabold text-base mb-1 tracking-tight uppercase text-slate-900">
                        {link.name}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {link.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-dashed border-slate-200/60 pt-4">
                    <button
                      onClick={() => {
                        setSelectedLinkForQR(link);
                      }}
                      className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white hover:bg-slate-100 border border-slate-200/60 shadow-xs py-1.5 px-3.5 rounded-2xl cursor-pointer"
                    >
                      <QrCode size={14} />
                      View QR Code
                    </button>
                    
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold uppercase tracking-wider text-ip-maroon hover:underline flex items-center gap-1"
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Modern QR Code Backdrop-Blurred Modal */}
      <AnimatePresence>
        {selectedLinkForQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLinkForQR(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.2)] border border-slate-100 p-8 overflow-hidden z-10"
            >
              {/* Top Accent Bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-2" 
                style={{ backgroundColor: selectedLinkForQR.themeColor }}
              />

              {/* Close Button */}
              <button
                onClick={() => setSelectedLinkForQR(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center mt-2">
                {/* Header with Title & Icon */}
                <div className="flex items-center gap-3.5 mb-2">
                  <div 
                    className="p-2.5 rounded-lg text-white shadow-sm"
                    style={{ backgroundColor: selectedLinkForQR.themeColor }}
                  >
                    <selectedLinkForQR.icon size={18} />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-tight">
                    {selectedLinkForQR.name}
                  </h3>
                </div>
                
                <p className="text-xs text-slate-500 font-medium max-w-xs mb-6">
                  {selectedLinkForQR.description}
                </p>

                {/* Stylish QR Code Frame */}
                <div className="relative p-6 bg-slate-50 border border-slate-100 rounded-3xl shadow-inner mb-6 md:p-8 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.03)] border border-slate-200/40">
                    <QRCodeSVG
                      id={`qr-code-svg-${selectedLinkForQR.name.toLowerCase().replace(/[\/\s]/g, '-')}`}
                      value={selectedLinkForQR.url}
                      size={200}
                      level="H"
                      includeMargin={true}
                      fgColor="#1e293b"
                    />
                  </div>
                </div>

                {/* URL Badge */}
                <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-3 mb-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Address</p>
                  <p className="text-xs font-mono text-slate-700 break-all select-all font-medium">
                    {selectedLinkForQR.url}
                  </p>
                </div>

                {/* Interactive Action Buttons */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button
                    onClick={() => copyToClipboard(selectedLinkForQR.url)}
                    className="flex items-center justify-center gap-2.5 text-xs font-bold border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 py-3 px-4 rounded-2xl transition-all shadow-xs cursor-pointer active:scale-98"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => downloadSVG(selectedLinkForQR)}
                    className="flex items-center justify-center gap-2.5 text-xs font-bold text-white py-3 px-4 rounded-2xl transition-all hover:brightness-105 shadow-md hover:shadow-lg cursor-pointer active:scale-98"
                    style={{ backgroundColor: selectedLinkForQR.themeColor }}
                  >
                    <Download size={14} />
                    <span>Save QR</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                      <Calendar size={12} className="text-red-700" />
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
    </motion.div>
  );
}
