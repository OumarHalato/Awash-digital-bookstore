
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../types';

interface ReadLaterModalProps {
  books: Book[];
  bookmarkedBooks?: Book[];
  onClose: () => void;
  onRemove: (bookId: string) => void;
  onRemoveBookmark?: (bookId: string) => void;
  onView: (book: Book) => void;
  isDarkMode?: boolean;
}

const ReadLaterModal: React.FC<ReadLaterModalProps> = ({ 
  books, 
  bookmarkedBooks = [], 
  onClose, 
  onRemove, 
  onRemoveBookmark,
  onView,
  isDarkMode = false
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'bookmarks'>('list');
  const navigate = useNavigate();

  const handleNavigate = (id: string) => {
    onClose();
    navigate(`/book/${id}`);
  };

  return (
    <div 
      className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 rounded-3xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`p-6 border-b flex flex-col gap-4 ${isDarkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-blue-50/50 border-slate-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>የተቀመጡ መጻሕፍት</h2>
              <p className="text-xs text-slate-500 font-medium">ጠቅላላ {books.length + bookmarkedBooks.length} የተቀመጡ ነገሮች</p>
            </div>
            <button 
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-500 hover:text-slate-300' : 'hover:bg-white text-slate-400 hover:text-slate-600'}`}
              aria-label="ዝጋ"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className={`flex p-1 rounded-xl ${isDarkMode ? 'bg-slate-950/50' : 'bg-slate-200/50'}`}>
            <button 
              onClick={() => setActiveTab('list')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'list' ? (isDarkMode ? 'bg-slate-800 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-500 hover:text-slate-400'}`}
            >
              ቆይቶ ላንብብ ({books.length})
            </button>
            <button 
              onClick={() => setActiveTab('bookmarks')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'bookmarks' ? (isDarkMode ? 'bg-slate-800 text-yellow-500 shadow-sm' : 'bg-white text-yellow-600 shadow-sm') : 'text-slate-500 hover:text-slate-400'}`}
            >
              ምልክት የተደረገባቸው ({bookmarkedBooks.length})
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {activeTab === 'list' ? (
            books.length > 0 ? (
              books.map((book) => (
                <div 
                  key={book.id} 
                  className={`flex items-center gap-4 p-3 rounded-2xl transition-all border group cursor-pointer ${
                    isDarkMode ? 'bg-slate-800/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700' : 'bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200'
                  }`}
                  onClick={() => handleNavigate(book.id)}
                >
                  <img src={book.coverImage} alt="" className="w-16 h-20 object-cover rounded-lg shadow-sm" />
                  <div className="flex-grow min-w-0">
                    <h3 className={`font-bold text-sm truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{book.title}</h3>
                    <p className="text-xs text-slate-500 truncate">በ {book.author}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleNavigate(book.id); }} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm transition-colors">ዝርዝር</button>
                    <button onClick={(e) => { e.stopPropagation(); onRemove(book.id); }} className={`p-2 transition-colors ${isDarkMode ? 'text-slate-600 hover:text-red-400' : 'text-slate-400 hover:text-red-500'}`} title="አስወግድ"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                <p className="text-sm font-bold text-center">ቆይተው የሚያነቧቸው <br/>ምንም መጻሕፍት የሉም</p>
              </div>
            )
          ) : (
            bookmarkedBooks.length > 0 ? (
              bookmarkedBooks.map((book) => (
                <div 
                  key={book.id} 
                  className={`flex flex-col gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                    isDarkMode ? 'bg-yellow-900/10 border-yellow-900/30' : 'bg-yellow-50/50 border-yellow-100'
                  }`}
                  onClick={() => handleNavigate(book.id)}
                >
                  <div className="flex items-center gap-3">
                    <img src={book.coverImage} alt="" className="w-10 h-12 object-cover rounded shadow-sm" />
                    <div className="flex-grow min-w-0">
                      <h3 className={`font-bold text-xs truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{book.title}</h3>
                      <p className="text-[10px] text-slate-500">በ {book.author}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); handleNavigate(book.id); }} className={`p-2 transition-colors ${isDarkMode ? 'text-slate-600 hover:text-blue-400' : 'text-slate-400 hover:text-blue-600'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                      <button onClick={(e) => { e.stopPropagation(); onRemoveBookmark?.(book.id); }} className={`p-2 transition-colors ${isDarkMode ? 'text-slate-600 hover:text-red-400' : 'text-slate-400 hover:text-red-500'}`} title="ምልክት አስወግድ"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl border shadow-sm transition-colors ${isDarkMode ? 'bg-slate-950/40 border-yellow-900/40' : 'bg-white/80 border-yellow-100'}`}>
                    <p className={`text-xs italic leading-relaxed line-clamp-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>"{book.description}"</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                <p className="text-sm font-bold text-center">ምልክት የተደረገባቸው <br/>መግለጫዎች የሉም</p>
              </div>
            )
          )}
        </div>

        <div className={`p-4 border-t transition-colors duration-300 flex justify-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
          <button 
            onClick={onClose}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-colors ${isDarkMode ? 'bg-white text-slate-900 hover:bg-blue-500 hover:text-white' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
          >
            ተመለስ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadLaterModal;
