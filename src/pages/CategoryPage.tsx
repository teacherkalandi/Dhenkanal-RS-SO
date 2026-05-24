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
  Maximize2
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
  
  // 1. Deen Dayal SPARSH Yojana Notification (Blue)
  if (normTitle.includes('deen dayal') || normTitle.includes('yojana notification') || (normTitle.includes('sparsh') && normTitle.includes('notification'))) {
    return {
      bgClass: 'bg-[#4B8BD2] bg-gradient-to-br from-[#4ea0e2] to-[#2e74af]',
      textColor: 'text-white',
      descColor: 'text-white/80',
      iconColor: 'bg-white text-[#4B8BD2]',
      iconType: 'file-text',
      themeColor: '#4B8BD2'
    };
  }
  
  // 2. SPARSH Application Form (Green)
  if (normTitle.includes('application form') || normTitle.includes('form')) {
    return {
      bgClass: 'bg-[#40C373] bg-gradient-to-br from-[#50d383] to-[#30ab62]',
      textColor: 'text-white',
      descColor: 'text-white/80',
      iconColor: 'bg-white text-[#40C373]',
      iconType: 'clipboard-list',
      themeColor: '#40C373'
    };
  }
  
  // 3. Directorate Notification (Orange/Brown)
  if (normTitle.includes('directorate')) {
    return {
      bgClass: 'bg-[#E17A2D] bg-gradient-to-br from-[#ea8c42] to-[#cb681e]',
      textColor: 'text-white',
      descColor: 'text-white/80',
      iconColor: 'bg-white text-[#E17A2D]',
      iconType: 'megaphone',
      themeColor: '#E17A2D'
    };
  }
  
  // 4. DDSY PPT (Red/Crimson)
  if (normTitle.includes('ppt') || normTitle.includes('presentation')) {
    return {
      bgClass: 'bg-[#C0392B] bg-gradient-to-br from-[#d64a3b] to-[#a82518]',
      textColor: 'text-white',
      descColor: 'text-white/80',
      iconColor: 'bg-white text-[#C0392B]',
      iconType: 'ppt',
      themeColor: '#C0392B'
    };
  }
  
  // 5. SPARSH Applicant List (Purple)
  if (normTitle.includes('applicant list') || normTitle.includes('applicants')) {
    return {
      bgClass: 'bg-[#9B59B6] bg-gradient-to-br from-[#af7ac5] to-[#884ea0]',
      textColor: 'text-white',
      descColor: 'text-white/80',
      iconColor: 'bg-white text-[#9B59B6]',
      iconType: 'excel',
      themeColor: '#9B59B6'
    };
  }
  
  // 6. Final List of Students for Exam (Teal)
  if (normTitle.includes('final list') || normTitle.includes('eligible') || normTitle.whitespaces || normTitle.includes('students for exam')) {
    return {
      bgClass: 'bg-[#2EAD95] bg-gradient-to-br from-[#3ac9b0] to-[#21907b]',
      textColor: 'text-white',
      descColor: 'text-white/80',
      iconColor: 'bg-white text-[#2EAD95]',
      iconType: 'clipboard-check',
      themeColor: '#2EAD95'
    };
  }
  
  // 7. Admit Cards (Dark Slate Blue)
  if (normTitle.includes('admit card')) {
    return {
      bgClass: 'bg-[#34495e] bg-gradient-to-br from-[#3e5871] to-[#1e2b38]',
      textColor: 'text-white',
      descColor: 'text-white/80',
      iconColor: 'bg-white text-[#34495e]',
      iconType: 'id-card',
      themeColor: '#34495e'
    };
  }
  
  // 8. Students attendance sheet (Amber/Yellow)
  if (normTitle.includes('attendance') || normTitle.includes('sheet')) {
    return {
      bgClass: 'bg-[#E1B12C] bg-gradient-to-br from-[#f1c40f] to-[#cfa020]',
      textColor: 'text-white',
      descColor: 'text-white/80',
      iconColor: 'bg-white text-[#E1B12C]',
      iconType: 'user-check',
      themeColor: '#E1B12C'
    };
  }
  
  // 9. SPARSH 2025 instructions (Purple-Green Gradient)
  if (normTitle.includes('instructions') || normTitle.includes('guidelines')) {
    return {
      bgClass: 'bg-gradient-to-br from-[#9B59B6] to-[#27AE60]',
      textColor: 'text-white',
      descColor: 'text-white/80',
      iconColor: 'bg-white text-[#9B59B6]',
      iconType: 'id-card',
      themeColor: '#9B59B6'
    };
  }

  // Fallbacks
  const fallbacks = [
    { bgClass: 'bg-[#4B8BD2] bg-gradient-to-br from-[#4ea0e2] to-[#2e74af]', textColor: 'text-white', descColor: 'text-white/80', iconColor: 'bg-white text-[#4B8BD2]', iconType: 'file-text', themeColor: '#4B8BD2' },
    { bgClass: 'bg-[#40C373] bg-gradient-to-br from-[#50d383] to-[#30ab62]', textColor: 'text-white', descColor: 'text-white/80', iconColor: 'bg-white text-[#40C373]', iconType: 'clipboard-list', themeColor: '#40C373' },
    { bgClass: 'bg-[#E17A2D] bg-gradient-to-br from-[#ea8c42] to-[#cb681e]', textColor: 'text-white', descColor: 'text-white/80', iconColor: 'bg-white text-[#E17A2D]', iconType: 'megaphone', themeColor: '#E17A2D' },
    { bgClass: 'bg-[#C0392B] bg-gradient-to-br from-[#d64a3b] to-[#a82518]', textColor: 'text-white', descColor: 'text-white/80', iconColor: 'bg-white text-[#C0392B]', iconType: 'file-text', themeColor: '#C0392B' },
    { bgClass: 'bg-[#9B59B6] bg-gradient-to-br from-[#af7ac5] to-[#884ea0]', textColor: 'text-white', descColor: 'text-white/80', iconColor: 'bg-white text-[#9B59B6]', iconType: 'excel', themeColor: '#9B59B6' },
  ];
  return fallbacks[index % fallbacks.length];
};

const DocIcon = ({ type, colorClass }: { type: string; colorClass: string }) => {
  const baseClass = "w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform";
  
  if (type === 'file-text') {
    return (
      <div className={baseClass}>
        <FileText className={colorClass} size={28} />
      </div>
    );
  }
  if (type === 'clipboard-list') {
    return (
      <div className={baseClass}>
        <ClipboardList className={colorClass} size={28} />
      </div>
    );
  }
  if (type === 'megaphone') {
    return (
      <div className={baseClass}>
        <Megaphone className={colorClass} size={28} />
      </div>
    );
  }
  if (type === 'clipboard-check') {
    return (
      <div className={baseClass}>
        <ClipboardCheck className={colorClass} size={28} />
      </div>
    );
  }
  if (type === 'id-card') {
    return (
      <div className={baseClass}>
        <IdCard className={colorClass} size={28} />
      </div>
    );
  }
  if (type === 'user-check') {
    return (
      <div className={baseClass}>
        <UserCheck className={colorClass} size={28} />
      </div>
    );
  }
  if (type === 'ppt') {
    return (
      <div className={baseClass}>
        <div className="relative font-bold text-[#C0392B] text-xl md:text-2xl flex items-center justify-center">
          P
        </div>
      </div>
    );
  }
  if (type === 'excel') {
    return (
      <div className={baseClass}>
        <div className="relative font-bold text-[#9B59B6] text-xl md:text-2xl flex items-center justify-center">
          X
        </div>
      </div>
    );
  }
  
  return (
    <div className={baseClass}>
      <FileText className={colorClass} size={28} />
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
                        "gap-6",
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
                              "relative cursor-pointer select-none transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:-translate-y-1.5 active:scale-[0.99] group flex flex-col justify-between overflow-hidden",
                              viewMode === "grid"
                                ? "p-6 md:p-8 rounded-[2rem] h-52 md:h-56"
                                : "p-5 rounded-2xl md:flex-row md:items-center md:justify-between h-auto gap-4 md:gap-6 min-h-[105px]"
                            )}
                            style={{ 
                              background: cardTheme.bgClass.includes('gradient') 
                                ? undefined 
                                : cardTheme.bgClass.startsWith('bg-[') 
                                  ? cardTheme.bgClass.substring(4, cardTheme.bgClass.indexOf(']')) 
                                  : undefined 
                            }}
                            className={cn(
                              "cursor-pointer select-none transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 active:scale-[0.99] group flex flex-col justify-between overflow-hidden",
                              viewMode === "grid"
                                ? cn("p-6 md:p-8 rounded-[2rem] h-52 md:h-56", cardTheme.bgClass)
                                : cn("p-5 rounded-2xl flex-row items-center gap-6 h-auto min-h-[105px]", cardTheme.bgClass)
                            )}
                            id={`doc-card-${doc.id}`}
                          >
                            {/* Card Body */}
                            <div className={cn("flex gap-5 md:gap-7 items-center h-full w-full", viewMode === "list" && "flex-row")}>
                              {/* Left Icon Panel */}
                              <DocIcon type={cardTheme.iconType} colorClass={cardTheme.iconColor} />

                              {/* Right Content Panel */}
                              <div className="flex-1 min-w-0 text-white">
                                <h4 className="font-extrabold text-white text-base md:text-xl mb-1.5 leading-tight tracking-tight uppercase line-clamp-2 md:line-clamp-3 group-hover:underline">
                                  {doc.title}
                                </h4>
                                <p className="text-[11px] md:text-sm text-white/80 line-clamp-2 md:line-clamp-3 leading-relaxed font-medium">
                                  {doc.description || "View this official document / notification."}
                                </p>
                              </div>
                            </div>

                            {/* subtle action overlay helper at bottom-right in grid view */}
                            {viewMode === "grid" && (
                              <div className="absolute bottom-4 right-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all font-bold text-[9px] uppercase text-white tracking-widest bg-black/15 px-3 py-1.5 rounded-full backdrop-blur-md">
                                <Eye size={12} />
                                <span>Click to View</span>
                              </div>
                            )}
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
