import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Download,
  ExternalLink,
  FileText,
  Calendar,
  Filter,
  ChevronRight,
  LayoutGrid,
  List,
  Eye,
  ClipboardList,
  Megaphone,
  ClipboardCheck,
  IdCard,
  UserCheck,
  X,
  Maximize2,
  Package,
  Wrench
} from "lucide-react";
import { formatDate, cn } from "../lib/utils";

interface Document {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  description: string;
  fileUrl?: string;
  externalLink?: string;
  createdAt: any;
}

const getGDrivePreviewUrl = (url?: string) => {
  if (!url) return "";
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  }
  return url;
};

const getDocTheme = (title: string, index: number) => {
  const normTitle = title.toLowerCase();
  
  let iconType = 'file-text';
  if (normTitle.includes('bag') || normTitle.includes('parcel')) iconType = 'package';
  else if (normTitle.includes('report') || normTitle.includes('abstract')) iconType = 'clipboard-list';
  else if (normTitle.includes('tool')) iconType = 'wrench';
  else if (normTitle.includes('track')) iconType = 'search';
  else if (normTitle.includes('ppt') || normTitle.includes('presentation')) iconType = 'ppt';
  else if (normTitle.includes('list') || normTitle.includes('excel')) iconType = 'excel';
  else if (normTitle.includes('form')) iconType = 'clipboard-list';

  // Fallbacks mimicking the attached image (Blue, Purple, Teal, Red)
  const fallbacks = [
    { bgClass: 'bg-[#3b82f6]', textColor: 'text-white', descColor: 'text-white/80', iconColor: 'text-slate-600', iconType: iconType, themeColor: '#3b82f6' },
    { bgClass: 'bg-[#8b5cf6]', textColor: 'text-white', descColor: 'text-white/80', iconColor: 'text-slate-600', iconType: iconType, themeColor: '#8b5cf6' },
    { bgClass: 'bg-[#14b8a6]', textColor: 'text-white', descColor: 'text-white/80', iconColor: 'text-slate-600', iconType: iconType, themeColor: '#14b8a6' },
    { bgClass: 'bg-[#ef4444]', textColor: 'text-white', descColor: 'text-white/80', iconColor: 'text-slate-600', iconType: iconType, themeColor: '#ef4444' },
    { bgClass: 'bg-[#a855f7]', textColor: 'text-white', descColor: 'text-white/80', iconColor: 'text-slate-600', iconType: iconType, themeColor: '#a855f7' },
    { bgClass: 'bg-[#2563eb]', textColor: 'text-white', descColor: 'text-white/80', iconColor: 'text-slate-600', iconType: iconType, themeColor: '#2563eb' },
  ];
  return fallbacks[index % fallbacks.length];
};

const DocIcon = ({ type, colorClass }: { type: string; colorClass: string }) => {
  const baseClass = "w-12 h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform";
  
  const IconComponent = () => {
    switch(type) {
      case 'file-text': return <FileText className={colorClass} size={24} />;
      case 'clipboard-list': return <ClipboardList className={colorClass} size={24} />;
      case 'megaphone': return <Megaphone className={colorClass} size={24} />;
      case 'clipboard-check': return <ClipboardCheck className={colorClass} size={24} />;
      case 'id-card': return <IdCard className={colorClass} size={24} />;
      case 'user-check': return <UserCheck className={colorClass} size={24} />;
      case 'package': return <Package className={colorClass} size={24} />;
      case 'wrench': return <Wrench className={colorClass} size={24} />;
      case 'search': return <Search className={colorClass} size={24} />;
      case 'ppt': return <div className={`font-bold ${colorClass} text-xl flex flex-col items-center justify-center`}>P</div>;
      case 'excel': return <div className={`font-bold ${colorClass} text-xl flex flex-col items-center justify-center`}>X</div>;
      default: return <FileText className={colorClass} size={24} />;
    }
  };

  return (
    <div className={baseClass}>
      <IconComponent />
    </div>
  );
};

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<Document | null>(null);

  const categoryName = categoryId?.replace(/-/g, " ").toUpperCase();

  useEffect(() => {
    const q = query(
      collection(db, "documents"),
      where("category", "==", categoryId),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setDocuments(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Document,
          ),
        );
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [categoryId]);

  const filteredDocs = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.subCategory.toLowerCase().includes(search.toLowerCase()) ||
      doc.description.toLowerCase().includes(search.toLowerCase()),
  );

  // Group by sub-category
  const groupedDocs = filteredDocs.reduce((acc, doc) => {
    if (!acc[doc.subCategory]) acc[doc.subCategory] = [];
    acc[doc.subCategory].push(doc);
    return acc;
  }, {} as any);

  const getTheme = (subCat: string) => {
    const themes = [
      { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: 'text-blue-500', btn: 'bg-blue-600 hover:bg-blue-700', badge: 'bg-blue-100 text-blue-700', hover: 'hover:border-blue-300' },
      { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: 'text-emerald-500', btn: 'bg-emerald-600 hover:bg-emerald-700', badge: 'bg-emerald-100 text-emerald-700', hover: 'hover:border-emerald-300' },
      { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', icon: 'text-amber-500', btn: 'bg-amber-600 hover:bg-amber-700', badge: 'bg-amber-100 text-amber-700', hover: 'hover:border-amber-300' },
      { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', icon: 'text-purple-500', btn: 'bg-purple-600 hover:bg-purple-700', badge: 'bg-purple-100 text-purple-700', hover: 'hover:border-purple-300' },
      { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', icon: 'text-rose-500', btn: 'bg-rose-600 hover:bg-rose-700', badge: 'bg-rose-100 text-rose-700', hover: 'hover:border-rose-300' },
      { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', icon: 'text-indigo-500', btn: 'bg-indigo-600 hover:bg-indigo-700', badge: 'bg-indigo-100 text-indigo-700', hover: 'hover:border-indigo-300' },
      { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-100', icon: 'text-cyan-500', btn: 'bg-cyan-600 hover:bg-cyan-700', badge: 'bg-cyan-100 text-cyan-700', hover: 'hover:border-cyan-300' },
    ];
    let hash = 0;
    for (let i = 0; i < subCat.length; i++) {
      hash = subCat.charCodeAt(i) + ((hash << 5) - hash);
    }
    return themes[Math.abs(hash) % themes.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Category Header */}
      <div className="bg-[#8B0000] py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="text-white space-y-3 md:space-y-4 text-center md:text-left w-full">
            <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-400 text-[10px] md:text-xs font-black uppercase tracking-widest">
              <Link to="/" className="hover:underline">
                Home
              </Link>
              <ChevronRight size={14} />
              <span className="truncate max-w-[150px]">{categoryName}</span>
            </div>
            <h1 className="text-3xl md:text-6xl font-black leading-tight">
              {categoryName}
            </h1>
            <p className="text-white/60 font-medium text-xs md:text-base">
              Access official resources, documents and downloads.
            </p>
          </div>

          <div className="w-full max-w-md">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
              <input
                type="text"
                placeholder={`Search in ${categoryName}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-12 py-3 md:py-4 text-sm md:text-base text-white placeholder:text-white/40 outline-none focus:bg-white/20 focus:border-yellow-400 transition-all backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex justify-between items-center px-8 py-6 border-b bg-gray-50/50">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 bg-[#D8232A] rounded-full" />
              <h2 className="font-black text-[#8B0000] uppercase tracking-wider text-sm">
                Available Resources
              </h2>
            </div>
            <div className="flex bg-white rounded-xl p-1 border">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "grid"
                    ? "bg-red-50 text-[#D8232A]"
                    : "text-gray-400",
                )}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "list"
                    ? "bg-red-50 text-[#D8232A]"
                    : "text-gray-400",
                )}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          <div className="p-4 md:p-8">
            {loading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-400 font-bold uppercase text-xs">
                  Loading Documents...
                </p>
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="py-20 text-center opacity-40 grayscale flex flex-col items-center gap-4">
                <FileText size={48} md:size={64} strokeWidth={1} />
                <p className="font-black uppercase tracking-widest text-xs md:text-sm">
                  No documents found
                </p>
              </div>
            ) : (
              (Object.entries(groupedDocs) as any).map(([subCat, docs]: [string, any]) => {
                const theme = getTheme(subCat);
                return (
                  <div key={subCat} className="mb-8 md:mb-12 last:mb-0">
                    <div className={cn("flex items-center gap-3 mb-4 md:mb-6 p-2 md:p-3 rounded-xl md:rounded-2xl w-fit", theme.bg)}>
                      <Filter size={14} className={theme.text} />
                      <h3 className={cn("font-black text-[10px] md:text-xs uppercase tracking-widest", theme.text)}>
                        {subCat}
                      </h3>
                      <span className={cn("px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold", theme.badge)}>
                        {docs.length}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "gap-4 md:gap-6",
                        viewMode === "grid"
                          ? "grid grid-cols-1 lg:grid-cols-2"
                          : "flex flex-col",
                      )}
                    >
                      {docs.map((doc: any, docIdx: number) => {
                        const cardTheme = getDocTheme(doc.title, docIdx);
                        return (
                          <motion.div
                            layout
                            key={doc.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setSelectedDocForPreview(doc)}
                            className={cn(
                              "relative cursor-pointer select-none transition-all duration-300 hover:shadow-lg active:scale-[0.99] group flex overflow-hidden shadow-sm border border-black/5 hover:-translate-y-1",
                              "p-4 md:p-6 rounded-xl md:rounded-2xl items-center gap-4 md:gap-6 h-auto",
                              cardTheme.bgClass
                            )}
                            style={{ 
                              background: cardTheme.bgClass.includes('gradient') 
                                ? undefined 
                                : cardTheme.bgClass.startsWith('bg-[') 
                                  ? cardTheme.bgClass.substring(4, cardTheme.bgClass.indexOf(']')) 
                                  : undefined 
                            }}
                            id={`doc-card-${doc.id}`}
                          >
                            {/* Card Body */}
                            <div className="flex gap-4 md:gap-6 items-center h-full w-full flex-row">
                              {/* Left Icon Panel */}
                              <DocIcon type={cardTheme.iconType} colorClass={cardTheme.iconColor} />

                              {/* Right Content Panel */}
                              <div className="flex-1 min-w-0 text-white flex flex-col justify-center">
                                <h4 className="font-semibold text-white text-lg md:text-xl mb-1 leading-snug tracking-normal line-clamp-2">
                                  {doc.title}
                                </h4>
                                <p className="text-[11px] md:text-sm text-white/90 line-clamp-1 md:line-clamp-2 leading-relaxed">
                                  {doc.description || "Official document"}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Immersive File Preview Modal */}
      <AnimatePresence>
        {selectedDocForPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDocForPreview(null)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-5xl h-[85vh] bg-white rounded-3xl md:rounded-[2.5rem] shadow-[0_35px_80px_rgba(0,0,0,0.35)] border border-slate-150 overflow-hidden flex flex-col z-10"
            >
              {/* Dynamic Header Badge matched to Doc colors */}
              {(() => {
                const modalTheme = getDocTheme(selectedDocForPreview.title, 0);
                return (
                  <div 
                    className="p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 shadow-lg"
                    style={{ backgroundColor: modalTheme.themeColor }}
                  >
                    <div className="space-y-1 max-w-[70%]">
                      <div className="flex items-center gap-2">
                        <span className="bg-white/20 text-white font-black uppercase text-[9px] md:text-[10px] px-2.5 py-0.5 rounded-full tracking-widest">
                          {selectedDocForPreview.subCategory}
                        </span>
                        <span className="text-white/60 font-medium text-[10px] md:text-xs uppercase tracking-wider">
                          {selectedDocForPreview.category.replace(/-/g, " ")}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-2xl font-black uppercase tracking-tight line-clamp-1">
                        {selectedDocForPreview.title}
                      </h3>
                    </div>

                    {/* Navigation/Close panel */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      {selectedDocForPreview.fileUrl && (
                        <a
                          href={selectedDocForPreview.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-50 font-bold text-[10px] md:text-xs py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-95"
                          title="View Full File in New Tab"
                        >
                          <Maximize2 size={14} />
                          Full View
                        </a>
                      )}
                      
                      {selectedDocForPreview.fileUrl && (
                        <a
                          href={selectedDocForPreview.fileUrl}
                          download
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white/25 hover:bg-white/30 text-white font-bold text-[10px] md:text-xs py-2.5 px-4 rounded-xl transition-all border border-white/10 active:scale-95"
                          title="Download File"
                        >
                          <Download size={14} />
                          Download
                        </a>
                      )}

                      {selectedDocForPreview.externalLink && (
                        <a
                          href={selectedDocForPreview.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] md:text-xs py-2.5 px-4 rounded-xl transition-all active:scale-95"
                          title="Open External Site"
                        >
                          <ExternalLink size={14} />
                          Official Site
                        </a>
                      )}

                      <button
                        onClick={() => setSelectedDocForPreview(null)}
                        className="bg-black/15 hover:bg-black/25 text-white p-2.5 rounded-full transition-colors cursor-pointer shrink-0"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Embedded Document Frame area */}
              <div className="flex-1 bg-slate-150 relative shadow-inner flex flex-col items-center justify-center overflow-hidden">
                {selectedDocForPreview.fileUrl ? (
                  <iframe
                    src={getGDrivePreviewUrl(selectedDocForPreview.fileUrl)}
                    className="w-full h-full border-0 shadow-lg rounded-b-none"
                    allow="autoplay"
                    title={selectedDocForPreview.title}
                  />
                ) : (
                  <div className="text-center p-8 max-w-sm flex flex-col items-center gap-4">
                    <FileText size={48} className="text-slate-400" />
                    <h3 className="font-extrabold text-slate-700 uppercase tracking-tight">No file link attached</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      This entry does not have an uploaded file. You can still access the resource via the "Official Site" link.
                    </p>
                    {selectedDocForPreview.externalLink && (
                      <a
                        href={selectedDocForPreview.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#D8232A] text-white font-bold text-xs py-3 px-6 rounded-xl hover:bg-[#8B0000] shadow-md transition-colors inline-flex items-center gap-2"
                      >
                        <ExternalLink size={14} />
                        Visit Official Site
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
