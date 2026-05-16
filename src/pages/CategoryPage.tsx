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

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
              (Object.entries(groupedDocs) as any).map(([subCat, docs]: [string, any]) => (
                <div key={subCat} className="mb-8 md:mb-12 last:mb-0">
                  <div className="flex items-center gap-3 mb-4 md:mb-6 bg-gray-50 p-2 md:p-3 rounded-xl md:rounded-2xl w-fit">
                    <Filter size={14} className="text-[#D8232A]" />
                    <h3 className="font-black text-[#D8232A] text-[10px] md:text-xs uppercase tracking-widest">
                      {subCat}
                    </h3>
                    <span className="bg-red-100 text-[#D8232A] px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold">
                      {docs.length}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "gap-4 md:gap-6",
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        : "flex flex-col",
                    )}
                  >
                    {docs.map((doc) => (
                      <motion.div
                        layout
                        key={doc.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                          "bg-white border border-gray-100 rounded-3xl p-5 md:p-6 transition-all hover:shadow-xl hover:border-red-100 group",
                          viewMode === "list" &&
                            "md:flex md:items-center md:justify-between",
                        )}
                      >
                        <div
                          className={cn(
                            "space-y-4",
                            viewMode === "list" &&
                              "md:flex-1 md:flex md:items-center md:gap-6 md:space-y-0",
                          )}
                        >
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-[#D8232A] transition-colors shrink-0">
                            <FileText size={20} md:size={24} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-sm md:text-lg mb-1 leading-tight">
                              {doc.title}
                            </h4>
                            <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                              {doc.description}
                            </p>
                            <div className="flex items-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              <div className="flex items-center gap-1">
                                <Calendar size={10} md:size={12} />
                                {formatDate(
                                  doc.createdAt?.toDate
                                    ? doc.createdAt.toDate()
                                    : doc.createdAt,
                                )}
                              </div>
                              {doc.fileUrl && (
                                <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase">
                                  Download
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          className={cn(
                            "mt-5 md:mt-6 pt-5 md:pt-6 border-t md:border-t-0 flex gap-2 md:gap-3",
                            viewMode === "list" && "md:mt-0 md:pt-0 md:min-w-[280px]",
                          )}
                        >
                          {doc.fileUrl && (
                            <a
                              href={doc.fileUrl}
                              className="flex-1 bg-[#D8232A] text-white py-2.5 md:py-3 rounded-xl font-bold text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-[#8B0000] transition-colors shadow-lg shadow-red-500/10"
                            >
                              <Download size={14} />
                              Download
                            </a>
                          )}
                          {doc.externalLink && (
                            <a
                              href={doc.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-white border-2 border-slate-100 text-slate-700 py-2.5 md:py-3 rounded-xl font-bold text-[10px] md:text-xs flex items-center justify-center gap-2 hover:border-[#D8232A] hover:text-[#D8232A] transition-all"
                            >
                              <ExternalLink size={14} />
                              View Official
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
