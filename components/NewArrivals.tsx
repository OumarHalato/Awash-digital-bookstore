
import React, { useRef } from 'react';
import { Book } from '../types';
import BookCard from './BookCard';
import ScrollReveal from './ScrollReveal';

interface NewArrivalsProps {
  books: Book[];
  onView: (book: Book) => void;
  onQuickView: (book: Book) => void;
  onShare: (book: Book) => void;
  onPreview: (book: Book) => void;
  onToggleReadLater: (book: Book) => void;
  readLaterBooks: Book[];
  onToggleBookmark?: (bookId: string) => void;
  bookmarkedIds?: string[];
  isDarkMode?: boolean;
  onSeeAll: () => void;
}

const NewArrivals: React.FC<NewArrivalsProps> = ({ 
  books, 
  onView, 
  onQuickView, 
  onShare, 
  onPreview, 
  onToggleReadLater,
  readLaterBooks,
  onToggleBookmark,
  bookmarkedIds = [],
  isDarkMode = false,
  onSeeAll
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className={`py-12 border-y transition-colors duration-300 mb-12 overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-3xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              አዲስ የገቡ <span className="text-blue-500">✨</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">በቅርቡ መደብራችንን የተቀላቀሉ ድንቅ ስራዎች</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex gap-2">
              <button 
                onClick={() => scroll('left')}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isDarkMode ? 'border-slate-700 text-slate-500 hover:text-blue-400 hover:border-blue-400' : 'border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600'}`}
                aria-label="ወደ ኋላ"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button 
                onClick={() => scroll('right')}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isDarkMode ? 'border-slate-700 text-slate-500 hover:text-blue-400 hover:border-blue-400' : 'border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600'}`}
                aria-label="ወደ ፊት"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <button 
              onClick={onSeeAll}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${isDarkMode ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-600 hover:text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'}`}
            >
              ሁሉንም እይ
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book, index) => (
            <div key={book.id} className="w-[280px] flex-shrink-0 snap-start">
              <ScrollReveal delay={index * 100}>
                <BookCard 
                  book={book} 
                  onView={onView} 
                  onQuickView={onQuickView}
                  onShare={onShare}
                  onPreview={onPreview}
                  onToggleReadLater={onToggleReadLater}
                  isReadLater={!!readLaterBooks.find(b => b.id === book.id)}
                  onToggleBookmark={onToggleBookmark}
                  isBookmarked={bookmarkedIds.includes(book.id)}
                  isDarkMode={isDarkMode}
                />
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
