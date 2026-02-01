
import React from 'react';
import { Book } from '../types';
import RatingStars from './RatingStars';

interface BookCardProps {
  book: Book;
  onView: (book: Book) => void;
  onQuickView: (book: Book) => void;
  onShare: (book: Book) => void;
  onPreview: (book: Book) => void;
  onToggleReadLater: (book: Book) => void;
  isReadLater: boolean;
  onToggleBookmark?: (bookId: string) => void;
  isBookmarked?: boolean;
  isDarkMode?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onView, 
  onQuickView, 
  onShare, 
  onPreview, 
  onToggleReadLater,
  isReadLater,
  onToggleBookmark,
  isBookmarked = false,
  isDarkMode = false
}) => {
  return (
    <article className={`group rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border flex flex-col h-full focus-within:ring-2 focus-within:ring-blue-500 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
    }`}>
      <div className="relative overflow-hidden aspect-[2/3]">
        <img 
          src={book.coverImage} 
          alt={`${book.title} በመፅሐፍ ሽፋን (Cover of ${book.title})`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
           <button 
             onClick={(e) => {
               e.stopPropagation();
               onQuickView(book);
             }}
             aria-label={`${book.title} ቅጽበታዊ እይታ (Quick View ${book.title})`}
             className="px-4 py-2 bg-white text-slate-900 rounded-full text-xs font-bold shadow-xl hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 group-focus-within:translate-y-0 duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
           >
             ቅጽበታዊ እይታ
           </button>
        </div>

        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg" aria-label={`ዋጋ፡ ${book.price} ብር`}>
          {book.price} ETB
        </div>

        {/* Action Buttons Overlays (Share and Read Later) */}
        <div className="absolute top-2 left-2 flex flex-row gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onShare(book);
            }}
            className={`w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:text-blue-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${
              isDarkMode ? 'bg-slate-800/90 text-slate-300' : 'bg-white/90 text-slate-700'
            }`}
            aria-label={`${book.title} አጋራ (Share ${book.title})`}
            title="አጋራ"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleReadLater(book);
            }}
            className={`w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${
              isReadLater 
                ? 'bg-blue-600 text-white opacity-100' 
                : `${isDarkMode ? 'bg-slate-800/90 text-slate-300' : 'bg-white/90 text-slate-700'} opacity-0 group-hover:opacity-100`
            }`}
            aria-label={isReadLater ? 'ከቆይቶ ላንብብ አስወጣ' : 'ቆይቶ ላንብብ ውስጥ ክተት'}
            title={isReadLater ? "ከቆይቶ ላንብብ አስወጣ" : "ቆይቶ ላንብብ ውስጥ ክተት"}
          >
            <svg className="w-4 h-4" fill={isReadLater ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <a 
          href={`#book-${book.id}`}
          onClick={(e) => {
            e.preventDefault();
            onView(book);
          }}
          className="block mb-2 group/link cursor-pointer focus:outline-none"
          aria-label={`${book.title} ዝርዝር መረጃ ለማየት እዚህ ይጫኑ`}
        >
          <div className="flex items-center gap-2 mb-1.5 text-[10px] font-bold uppercase tracking-wider">
            <span className={`px-1.5 py-0.5 rounded capitalize ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              {book.category}
            </span>
            {book.year && <span className="text-slate-500">({book.year})</span>}
          </div>
          <div className="flex items-start justify-between gap-1">
            <h3 className={`font-bold text-lg mb-1 line-clamp-1 transition-colors ${isDarkMode ? 'text-slate-100 group-hover/link:text-blue-400' : 'text-slate-900 group-hover/link:text-blue-600'}`}>
              {book.title}
            </h3>
            {onToggleBookmark && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleBookmark(book.id);
                }}
                className={`mt-1 transition-colors ${isBookmarked ? 'text-yellow-500' : isDarkMode ? 'text-slate-600 hover:text-slate-500' : 'text-slate-300 hover:text-slate-400'}`}
                title="መግለጫውን ምልክት አድርግ"
              >
                <svg className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              </button>
            )}
          </div>
          <p className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-400 group-hover/link:text-blue-500' : 'text-slate-600 group-hover/link:text-blue-500'}`}>
            በ {book.author}
          </p>
        </a>
        
        <div className="mb-4">
          <RatingStars rating={book.rating} isDarkMode={isDarkMode} />
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <button 
            onClick={() => onPreview(book)}
            aria-label={`${book.title} ቅድመ እይታ (Preview ${book.title})`}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-colors font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            ቅድመ እይታ
          </button>
          <button 
            onClick={() => onView(book)}
            aria-label={`${book.title} ዝርዝር መረጃ ይመልከቱ (View details for ${book.title})`}
            className={`py-2 rounded-lg transition-colors font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-blue-700'
            }`}
          >
            ዝርዝር
          </button>
        </div>
      </div>
    </article>
  );
};

export default BookCard;
