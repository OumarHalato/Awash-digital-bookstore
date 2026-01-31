
import React, { useState } from 'react';
import { Book } from '../types';

interface BookPreviewProps {
  book: Book;
  onClose: () => void;
}

const BookPreview: React.FC<BookPreviewProps> = ({ book, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pages = book.previewPages || [
    "ይህ መፅሀፍ በአሁኑ ሰዓት የቅምሻ ገጾች የሉትም።",
    "እባክዎን በቅርቡ እንደገና ይሞክሩ።",
    "ለማንበብ ስለፈለጉ እናመሰግናለን!"
  ];

  const totalPages = pages.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
    >
      <div className="max-w-4xl w-full h-[80vh] flex flex-col items-center justify-center gap-8 relative">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
          aria-label="ቅምሻውን ዝጋ"
        >
          <span className="text-sm font-bold uppercase tracking-widest mr-2">ዝጋ</span>
          <span className="text-xl">✕</span>
        </button>

        <div className="text-center">
          <h2 id="preview-title" className="text-2xl font-bold text-white mb-1">{book.title}</h2>
          <p className="text-blue-400 text-sm font-medium">የተመረጡ ገጾች (Preview Mode)</p>
        </div>

        {/* Book Spread View */}
        <div className="relative w-full max-w-3xl aspect-[1.4/1] bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex overflow-hidden perspective-1000">
          {/* Middle Spine Shadow */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/10 via-black/5 to-black/10 z-10 pointer-events-none"></div>

          {/* Left Page (Paper Texture) */}
          <div className="flex-1 bg-[#fcfaf2] p-8 md:p-12 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]"></div>
            <div className="relative z-10 flex flex-col h-full">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-8">{book.author}</span>
              <div className="flex-grow flex items-center justify-center">
                <div className="text-slate-300 transform -rotate-12 opacity-5">
                   <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/></svg>
                </div>
              </div>
              <p className="text-slate-400 text-xs font-bold mt-auto text-center">{currentPage * 2 + 1}</p>
            </div>
          </div>

          {/* Right Page (Content) */}
          <div className="flex-1 bg-[#fcfaf2] p-8 md:p-12 relative overflow-hidden flex flex-col border-l border-slate-200">
             <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]"></div>
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex-grow animate-in slide-in-from-right-4 fade-in duration-500 key={currentPage}">
                   <p className="text-slate-800 text-lg md:text-xl leading-relaxed font-serif italic mb-6">
                      "{pages[currentPage]}"
                   </p>
                   <div className="w-12 h-0.5 bg-blue-500 mb-4"></div>
                </div>
                <p className="text-slate-400 text-xs font-bold mt-auto text-center">{currentPage * 2 + 2}</p>
             </div>
          </div>

          {/* Navigation Controls on the Book itself */}
          <button 
            onClick={prevPage}
            disabled={currentPage === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white disabled:opacity-0 transition-all z-20 group"
            aria-label="የቀድሞው ገጽ"
          >
            <svg className="w-6 h-6 text-slate-800 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button 
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white disabled:opacity-0 transition-all z-20 group"
            aria-label="ቀጣይ ገጽ"
          >
            <svg className="w-6 h-6 text-slate-800 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2">
          {pages.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 transition-all rounded-full ${i === currentPage ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`}
            ></div>
          ))}
        </div>

        <p className="text-white/40 text-xs font-medium uppercase tracking-[0.2em]">
          ለማንበብ የቀኝ እና የግራ ቀስቶችን ይጠቀሙ
        </p>
      </div>
    </div>
  );
};

export default BookPreview;
