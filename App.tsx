import React, { useState, useMemo, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { GoogleGenAI, Type } from '@google/genai';
import { BOOKS, CATEGORIES } from './constants';
import { Book, SortOption } from './types';
import BookCard from './components/BookCard';
import Librarian from './components/Librarian';
import RatingStars from './components/RatingStars';
import ScrollReveal from './components/ScrollReveal';
import BookPreview from './components/BookPreview';
import ShareModal from './components/ShareModal';
import ReadLaterModal from './components/ReadLaterModal';
import NewArrivals from './components/NewArrivals';
import { 
  BookCardSkeleton, 
  CategorySkeleton, 
  AuthorFilterSkeleton, 
  GridHeaderSkeleton 
} from './components/Skeleton';

const READ_LATER_KEY = 'awash_read_later';
const BOOKMARKS_KEY = 'awash_bookmarks';
const THEME_KEY = 'awash_theme';
const RECS_KEY = 'awash_ai_recs';
const BOOKS_PER_PAGE = 12;

// --- Sub-component: Home View ---
const Home: React.FC<{
  isLoading: boolean;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedAuthors: string[];
  setSelectedAuthors: (authors: string[]) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  isDarkMode: boolean;
  readLaterBooks: Book[];
  bookmarkedIds: string[];
  toggleReadLater: (book: Book) => void;
  toggleBookmark: (id: string) => void;
  setQuickViewBook: (book: Book) => void;
  setPreviewBook: (book: Book) => void;
  setShareBook: (book: Book) => void;
  isFiltering: boolean;
  availableAuthors: string[];
  filteredAuthorOptions: string[];
  authorSearch: string;
  setAuthorSearch: (s: string) => void;
  isAuthorDropdownOpen: boolean;
  setIsAuthorDropdownOpen: (open: boolean) => void;
  authorDropdownRef: React.RefObject<HTMLDivElement | null>;
  paginatedBooks: Book[];
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  clearAllFilters: () => void;
  newArrivalsBooks: Book[];
  aiRecommendations: Book[];
  isGeneratingRecs: boolean;
}> = (props) => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    authors: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleAuthor = (author: string) => {
    props.setSelectedAuthors(
      props.selectedAuthors.includes(author) 
        ? props.selectedAuthors.filter(a => a !== author) 
        : [...props.selectedAuthors, author]
    );
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <ScrollReveal className="md:w-1/2 space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              የእውቀት አዋሽ፣ <br/>የንባብ ምንጭ።
            </h2>
            <p className="text-blue-100 text-lg max-w-lg">
              ምርጥ የኢትዮጵያ እና የአለም መጻሕፍትን በዲጅታል አማራጭ እዚሁ ያግኙ። ከታሪክ እስከ ልብ ወለድ ድንቅ ስብስቦችን አቅርበንልዎታል።
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl">
                አሁኑኑ ይጀምሩ
              </button>
              <a href="#main-grid" className="px-8 py-3 bg-blue-600/30 border border-blue-400/30 text-white font-bold rounded-xl hover:bg-blue-600/50 transition-colors backdrop-blur-sm text-center">
                መጻሕፍትን ያስሱ
              </a>
            </div>
          </ScrollReveal>
          <div className="md:w-1/2 relative hidden md:block">
             <ScrollReveal className="relative z-10 grid grid-cols-2 gap-4" delay={200}>
                <img src="https://picsum.photos/seed/h1/300/400" alt="" className="rounded-2xl shadow-2xl rotate-[-5deg]" />
                <img src="https://picsum.photos/seed/h2/300/400" alt="" className="rounded-2xl shadow-2xl rotate-[5deg] translate-y-8" />
             </ScrollReveal>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      {(props.aiRecommendations.length > 0 || props.isGeneratingRecs) && (
        <section className={`py-12 border-b transition-colors duration-300 ${props.isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-blue-50/30 border-blue-100'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className={`text-2xl font-black flex items-center gap-2 ${props.isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  ለእርስዎ የተመረጡ <span className="text-blue-500 animate-pulse">✨</span>
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-1">በእርስዎ ፍላጎት መሰረት በAI ረዳታችን የተመረጡ</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {props.isGeneratingRecs ? (
                [...Array(4)].map((_, i) => <BookCardSkeleton key={i} />)
              ) : (
                props.aiRecommendations.map((book, index) => (
                  <ScrollReveal key={book.id} delay={index * 100}>
                    <BookCard 
                      book={book} 
                      onView={(b) => navigate(`/book/${b.id}`)} 
                      onQuickView={props.setQuickViewBook}
                      onShare={props.setShareBook}
                      onPreview={props.setPreviewBook}
                      onToggleReadLater={props.toggleReadLater}
                      isReadLater={!!props.readLaterBooks.find(b => b.id === book.id)}
                      onToggleBookmark={props.toggleBookmark}
                      isBookmarked={props.bookmarkedIds.includes(book.id)}
                      isDarkMode={props.isDarkMode}
                    />
                  </ScrollReveal>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {!props.isLoading && (
        <NewArrivals 
          books={props.newArrivalsBooks} 
          onView={(b) => navigate(`/book/${b.id}`)} 
          onQuickView={props.setQuickViewBook}
          onShare={props.setShareBook}
          onPreview={props.setPreviewBook}
          onToggleReadLater={props.toggleReadLater}
          readLaterBooks={props.readLaterBooks}
          onToggleBookmark={props.toggleBookmark}
          bookmarkedIds={props.bookmarkedIds}
          isDarkMode={props.isDarkMode}
          onSeeAll={() => {
            props.setActiveCategory('new');
            const target = document.getElementById('main-grid');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Main Content */}
      <main id="main-grid" className="max-w-7xl mx-auto px-4 py-12 flex-grow w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-72 flex-shrink-0">
            <ScrollReveal className="space-y-6 sticky top-24">
              <div className={`rounded-2xl border transition-colors duration-300 overflow-hidden shadow-sm ${props.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <button onClick={() => toggleSection('categories')} className={`w-full flex items-center justify-between p-4 ${props.isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                  <span className={`font-bold text-sm ${props.isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>ምድቦች</span>
                  <svg className={`w-4 h-4 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {expandedSections.categories && (
                  <>
                    {props.isLoading ? <CategorySkeleton /> : (
                      <div className="p-2 pt-0 space-y-1 animate-in fade-in duration-500">
                        {CATEGORIES.map(cat => (
                          <button 
                            key={cat.id}
                            onClick={() => props.setActiveCategory(cat.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${props.activeCategory === cat.id ? 'bg-blue-600/10 text-blue-500 font-bold' : props.isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
                          >
                            <span className="text-base">{cat.icon}</span>
                            <span className="text-sm">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className={`rounded-2xl border transition-colors duration-300 overflow-hidden shadow-sm ${props.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <button onClick={() => toggleSection('price')} className={`w-full flex items-center justify-between p-4 ${props.isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                  <span className={`font-bold text-sm ${props.isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>ዋጋ (ETB)</span>
                  <svg className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {expandedSections.price && (
                  <div className="p-4 pt-0 space-y-4">
                    <input 
                      type="range" min="0" max="1000" step="50"
                      value={props.priceRange[1]}
                      onChange={(e) => props.setPriceRange([props.priceRange[0], Number(e.target.value)])}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600 ${props.isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>0 ETB</span>
                      <span>{props.priceRange[1]} ETB</span>
                    </div>
                  </div>
                )}
              </div>

              <div className={`rounded-2xl border transition-colors duration-300 overflow-hidden shadow-sm ${props.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <button onClick={() => toggleSection('authors')} className={`w-full flex items-center justify-between p-4 ${props.isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                  <span className={`font-bold text-sm ${props.isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>ደራሲያን</span>
                  <svg className={`w-4 h-4 transition-transform ${expandedSections.authors ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {expandedSections.authors && (
                  <>
                    {props.isLoading ? <AuthorFilterSkeleton /> : (
                      <div className="p-4 pt-0 space-y-4 animate-in fade-in duration-500">
                        <div ref={props.authorDropdownRef} className="relative">
                          <div 
                            onClick={() => props.setIsAuthorDropdownOpen(true)}
                            className={`min-h-[44px] p-1.5 border rounded-xl flex flex-wrap gap-1.5 items-center cursor-text transition-all ${
                              props.isDarkMode 
                                ? 'bg-slate-800 border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-slate-700' 
                                : 'bg-slate-50 border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white'
                            }`}
                          >
                            {props.selectedAuthors.map(author => (
                              <span key={author} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${props.isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                                {author}
                                <button onClick={(e) => { e.stopPropagation(); toggleAuthor(author); }} className="hover:opacity-70 transition-colors">✕</button>
                              </span>
                            ))}
                            <input 
                              type="text"
                              placeholder={props.selectedAuthors.length === 0 ? "ደራሲ ይፈልጉ..." : ""}
                              value={props.authorSearch}
                              onChange={(e) => { props.setAuthorSearch(e.target.value); props.setIsAuthorDropdownOpen(true); }}
                              className={`flex-grow min-w-[60px] bg-transparent border-none outline-none text-xs placeholder:text-slate-500 py-1 ${props.isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}
                            />
                          </div>
                          {props.isAuthorDropdownOpen && (
                            <div className={`absolute z-50 top-full left-0 right-0 mt-2 border rounded-2xl shadow-xl max-h-56 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${props.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                              {props.filteredAuthorOptions.length > 0 ? (
                                props.filteredAuthorOptions.map(author => (
                                  <button
                                    key={author}
                                    onClick={() => { toggleAuthor(author); props.setAuthorSearch(''); }}
                                    className={`w-full text-left px-4 py-3 text-xs transition-colors border-b last:border-none flex items-center justify-between group ${
                                      props.selectedAuthors.includes(author) 
                                        ? 'bg-blue-600/20 text-blue-500 font-bold border-blue-600/10' 
                                        : props.isDarkMode ? 'hover:bg-slate-700 text-slate-300 border-slate-700' : 'hover:bg-slate-50 text-slate-700 border-slate-50'
                                    }`}
                                  >
                                    <span>{author}</span>
                                    {props.selectedAuthors.includes(author) && (
                                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-8 text-center text-slate-500 text-[10px] font-bold">ምንም ደራሲ አልተገኘም</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </ScrollReveal>
          </aside>

          {/* Book Grid */}
          <section className="flex-grow">
            {(props.isLoading || props.isFiltering) ? (
              <>
                <GridHeaderSkeleton />
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(Math.max(props.paginatedBooks.length, 8))].map((_, i) => <BookCardSkeleton key={i} />)}
                </div>
              </>
            ) : (
              <div className="animate-in fade-in duration-700">
                <div className={`rounded-3xl p-6 mb-8 border transition-colors duration-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${props.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <h3 className={`text-2xl font-extrabold mb-1 ${props.isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {CATEGORIES.find(c => c.id === props.activeCategory)?.label} መጻሕፍት
                    </h3>
                    <span className="text-slate-500 text-sm font-medium">{props.paginatedBooks.length} ውጤቶች ተገኝተዋል</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ደርድር፡</span>
                    <select 
                      value={props.sortBy}
                      onChange={(e) => props.setSortBy(e.target.value as any)}
                      className={`border-none rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 ${props.isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}
                    >
                      <option value="default">ተወዳጅ</option>
                      <option value="title">በስም</option>
                      <option value="price-low">ዝቅተኛ ዋጋ</option>
                      <option value="price-high">ከፍተኛ ዋጋ</option>
                    </select>
                  </div>
                </div>

                {props.paginatedBooks.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {props.paginatedBooks.map((book, index) => (
                        <ScrollReveal key={book.id} delay={index * 50}>
                          <BookCard 
                            book={book} 
                            onView={(b) => navigate(`/book/${b.id}`)} 
                            onQuickView={props.setQuickViewBook}
                            onShare={props.setShareBook}
                            onPreview={props.setPreviewBook}
                            onToggleReadLater={props.toggleReadLater}
                            isReadLater={!!props.readLaterBooks.find(b => b.id === book.id)}
                            onToggleBookmark={props.toggleBookmark}
                            isBookmarked={props.bookmarkedIds.includes(book.id)}
                            isDarkMode={props.isDarkMode}
                          />
                        </ScrollReveal>
                      ))}
                    </div>

                    {props.totalPages > 1 && (
                      <nav className="mt-12 flex items-center justify-center gap-2" aria-label="ገጽ መቀያየሪያ">
                        <button 
                          onClick={() => props.handlePageChange(props.currentPage - 1)}
                          disabled={props.currentPage === 1}
                          className={`flex items-center gap-1 px-4 py-2 border rounded-xl text-sm font-bold transition-all ${props.isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-400 disabled:opacity-30' : 'bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 disabled:opacity-50'}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                          ቀዳሚ
                        </button>
                        <div className="flex items-center gap-1">
                          {[...Array(props.totalPages)].map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => props.handlePageChange(i + 1)}
                              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${props.currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20' : props.isDarkMode ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-blue-500' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-600'}`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button 
                          onClick={() => props.handlePageChange(props.currentPage + 1)}
                          disabled={props.currentPage === props.totalPages}
                          className={`flex items-center gap-1 px-4 py-2 border rounded-xl text-sm font-bold transition-all ${props.isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-400 disabled:opacity-30' : 'bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 disabled:opacity-50'}`}
                        >
                          ቀጣይ
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </nav>
                    )}
                  </>
                ) : (
                  <div className={`flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed text-center animate-in fade-in duration-500 px-8 ${props.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="relative w-32 h-32 mb-6">
                      <div className={`absolute inset-0 rounded-full animate-pulse ${props.isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}></div>
                      <div className={`absolute inset-0 flex items-center justify-center ${props.isDarkMode ? 'text-blue-800' : 'text-blue-200'}`}>
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          <circle cx="12" cy="12" r="3" className="opacity-50" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35" className="text-blue-500" />
                        </svg>
                      </div>
                    </div>
                    <h3 className={`text-2xl font-black mb-3 ${props.isDarkMode ? 'text-white' : 'text-slate-900'}`}>ውጤት አልተገኘም</h3>
                    <p className="text-slate-500 text-sm max-w-sm mb-8">ለፍለጋዎ የሚሆን መጽሐፍ አላገኘንም። እባክዎ ሌሎች ቃላትን ወይም ማጣሪያዎችን በመጠቀም ይሞክሩ።</p>
                    <button onClick={props.clearAllFilters} className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 dark:shadow-blue-900/30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      ፍለጋውን አጽዳ
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

// --- Sub-component: Book Details View ---
const BookDetailsPage: React.FC<{
  isDarkMode: boolean;
  readLaterBooks: Book[];
  bookmarkedIds: string[];
  toggleReadLater: (book: Book) => void;
  toggleBookmark: (id: string) => void;
  addToInteractions: (book: Book) => void;
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const book = BOOKS.find(b => b.id === id);

  useEffect(() => {
    if (book) {
      props.addToInteractions(book);
      window.scrollTo(0, 0);
    }
  }, [book]);

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">መጽሐፉ አልተገኘም</h2>
        <Link to="/" className="text-blue-600 hover:underline">ወደ መነሻ ገጽ ይመለሱ</Link>
      </div>
    );
  }

  const isReadLater = !!props.readLaterBooks.find(b => b.id === book.id);
  const isBookmarked = props.bookmarkedIds.includes(book.id);

  return (
    <div className={`transition-colors duration-300 ${props.isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto py-12 md:py-20 px-4">
        <button 
          onClick={() => navigate(-1)} 
          className={`mb-8 flex items-center gap-2 font-bold transition-colors ${props.isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          ተመለስ
        </button>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <img src={book.coverImage} className="w-full rounded-2xl shadow-2xl sticky top-24" alt={book.title} />
            <div className="mt-6 flex flex-col gap-3">
              <button 
                onClick={() => props.toggleReadLater(book)}
                className={`w-full py-4 flex items-center justify-center gap-2 rounded-2xl font-bold transition-all border-2 ${
                  isReadLater 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30' 
                    : props.isDarkMode ? 'bg-transparent text-slate-300 border-slate-700 hover:border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-600'
                }`}
              >
                <svg className="w-5 h-5" fill={isReadLater ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                {isReadLater ? 'ቆይቶ ላንብብ ውስጥ አለ' : 'ቆይቶ ላንብብ ውስጥ ክተት'}
              </button>
            </div>
          </div>
          <div className="md:w-2/3 space-y-8">
            <div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block ${props.isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>{book.category}</span>
              <div className="flex items-start gap-3">
                <h2 className={`text-4xl md:text-5xl font-black leading-tight ${props.isDarkMode ? 'text-white' : 'text-slate-900'}`}>{book.title}</h2>
                <button 
                  onClick={() => props.toggleBookmark(book.id)}
                  className={`mt-2 p-2 rounded-xl transition-all ${isBookmarked ? 'bg-yellow-600/20 text-yellow-500 scale-110 shadow-sm' : props.isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400 hover:text-slate-500'}`}
                  title="መግለጫውን ምልክት አድርግ"
                >
                  <svg className="w-6 h-6" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                </button>
              </div>
              <p className="text-xl text-slate-500 mt-2">በ {book.author} {book.year && `(${book.year})`}</p>
            </div>
            <RatingStars rating={book.rating} isDarkMode={props.isDarkMode} />
            <div className={`p-6 rounded-3xl border transition-all duration-500 ${isBookmarked ? (props.isDarkMode ? 'bg-yellow-900/10 border-yellow-800 shadow-inner' : 'bg-yellow-50 border-yellow-200 shadow-inner') : (props.isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-transparent')}`}>
              {isBookmarked && (
                <span className="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-widest mb-4 block">🔖 ምልክት የተደረገበት መግለጫ</span>
              )}
              <p className={`text-lg leading-relaxed italic ${props.isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{book.description}</p>
            </div>
            <div className={`p-8 rounded-3xl border transition-colors duration-300 flex items-center justify-between ${props.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">ዋጋ</p>
                <p className={`text-3xl font-black ${props.isDarkMode ? 'text-white' : 'text-slate-900'}`}>{book.price} ETB</p>
              </div>
              <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 dark:shadow-blue-900/20 hover:bg-blue-700 transition-all">አሁኑኑ ይግዙ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Root App Component ---
const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  
  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [shareBook, setShareBook] = useState<Book | null>(null);
  const [isLibrarianOpen, setIsLibrarianOpen] = useState(false);
  const [isReadLaterOpen, setIsReadLaterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [readLaterBooks, setReadLaterBooks] = useState<Book[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [interactedBooks, setInteractedBooks] = useState<Book[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<Book[]>([]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [authorSearch, setAuthorSearch] = useState('');
  const [isAuthorDropdownOpen, setIsAuthorDropdownOpen] = useState(false);
  
  const authorDropdownRef = useRef<HTMLDivElement>(null);

  const availableAuthors = useMemo(() => {
    const authors = new Set(BOOKS.map(book => book.author));
    return Array.from(authors).sort();
  }, []);

  const filteredAuthorOptions = useMemo(() => {
    return availableAuthors.filter(author => 
      author.toLowerCase().includes(authorSearch.toLowerCase())
    );
  }, [availableAuthors, authorSearch]);

  const newArrivalsBooks = useMemo(() => {
    return BOOKS.filter(b => b.isNew);
  }, []);

  // Theme Initializer
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') setIsDarkMode(true);
    else if (savedTheme === 'light') setIsDarkMode(false);
    else setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // Load Persistence
  useEffect(() => {
    const savedReadLater = localStorage.getItem(READ_LATER_KEY);
    if (savedReadLater) {
      try {
        const ids = JSON.parse(savedReadLater) as string[];
        setReadLaterBooks(BOOKS.filter(b => ids.includes(b.id)));
      } catch (e) { console.error(e); }
    }
    const savedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
    if (savedBookmarks) {
      try {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      } catch (e) { console.error(e); }
    }
    const savedRecs = localStorage.getItem(RECS_KEY);
    if (savedRecs) {
      try {
        const ids = JSON.parse(savedRecs) as string[];
        setAiRecommendations(BOOKS.filter(b => ids.includes(b.id)));
      } catch (e) { console.error(e); }
    }

    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(READ_LATER_KEY, JSON.stringify(readLaterBooks.map(b => b.id)));
  }, [readLaterBooks]);

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    if (aiRecommendations.length > 0) {
      localStorage.setItem(RECS_KEY, JSON.stringify(aiRecommendations.map(b => b.id)));
    }
  }, [aiRecommendations]);

  // AI RECOMMENDATIONS LOGIC
  const fetchAIRecommendations = async () => {
    if (interactedBooks.length === 0 && readLaterBooks.length === 0) return;
    
    setIsGeneratingRecs(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const catalog = BOOKS.map(b => ({ id: b.id, title: b.title, description: b.description, category: b.category }));
      const history = interactedBooks.map(b => b.title);
      const bookmarks = readLaterBooks.map(b => b.title);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on the user reading history [${history.join(', ')}] and their saved books [${bookmarks.join(', ')}], select 4 highly relevant books from this catalog that the user hasn't seen yet or would love. 
        Catalog: ${JSON.stringify(catalog)}. 
        Return ONLY the IDs of the 4 selected books as a JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      const recommendedIds = JSON.parse(response.text || "[]") as string[];
      const recommendedBooks = BOOKS.filter(b => recommendedIds.includes(b.id)).slice(0, 4);
      if (recommendedBooks.length > 0) {
        setAiRecommendations(recommendedBooks);
      }
    } catch (error) {
      console.error("AI Recommendation Error:", error);
    } finally {
      setIsGeneratingRecs(false);
    }
  };

  // Generate recommendations periodically or when history grows
  useEffect(() => {
    const totalInteractions = interactedBooks.length + readLaterBooks.length;
    if (totalInteractions > 0 && totalInteractions % 3 === 0) {
       fetchAIRecommendations();
    }
  }, [interactedBooks.length, readLaterBooks.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authorDropdownRef.current && !authorDropdownRef.current.contains(event.target as Node)) {
        setIsAuthorDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addToInteractions = (book: Book) => {
    setInteractedBooks(prev => {
      const filtered = prev.filter(b => b.id !== book.id);
      return [book, ...filtered].slice(0, 10);
    });
  };

  const toggleReadLater = (book: Book) => {
    setReadLaterBooks(prev => {
      const isAlreadyIn = prev.find(b => b.id === book.id);
      if (isAlreadyIn) return prev.filter(b => b.id !== book.id);
      return [...prev, book];
    });
    addToInteractions(book);
  };

  const toggleBookmark = (bookId: string) => {
    setBookmarkedIds(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  const clearAllFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setPriceRange([0, 1000]);
    setSelectedAuthors([]);
    setSortBy('default');
  };

  const filteredAndSortedBooks = useMemo(() => {
    let result = BOOKS.filter(book => {
      const matchesCategory = activeCategory === 'all' || 
                             (activeCategory === 'new' ? book.isNew : book.category === activeCategory);
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1];
      const matchesAuthor = selectedAuthors.length === 0 || selectedAuthors.includes(book.author);
      return matchesCategory && matchesSearch && matchesPrice && matchesAuthor;
    });

    switch (sortBy) {
      case 'title': result.sort((a, b) => a.title.localeCompare(b.title, 'am')); break;
      case 'author': result.sort((a, b) => a.author.localeCompare(b.author, 'am')); break;
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
    }
    return result;
  }, [activeCategory, searchQuery, sortBy, priceRange, selectedAuthors]);

  const totalPages = Math.ceil(filteredAndSortedBooks.length / BOOKS_PER_PAGE);
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * BOOKS_PER_PAGE;
    return filteredAndSortedBooks.slice(start, start + BOOKS_PER_PAGE);
  }, [filteredAndSortedBooks, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const target = document.getElementById('main-grid');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <HashRouter>
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-['Inter','Noto_Sans_Ethiopic',sans-serif]`}>
        {/* Header */}
        <header className={`sticky top-0 z-40 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur-md border-b`}>
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
                A
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-xl font-bold tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>አዋሽ ዲጅታል</h1>
                <p className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">Awash Book Store</p>
              </div>
            </Link>

            <div className="hidden md:flex flex-grow max-w-md mx-8">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="የሚፈልጉትን መፅሀፍ ወይም ደራሲ ይፈልጉ..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all outline-none ${
                    isDarkMode ? 'bg-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-500' : 'bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 focus:bg-white'
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className={`absolute left-3 top-3.5 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>

            <nav className="flex items-center gap-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}
                aria-label={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {isDarkMode ? <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> : <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>}
              </button>
              <button onClick={() => setIsReadLaterOpen(true)} className={`p-2 transition-colors relative ${isDarkMode ? 'text-slate-300 hover:text-blue-400' : 'text-slate-700 hover:text-blue-600'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                {(readLaterBooks.length + bookmarkedIds.length > 0) && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full border-2 border-white dark:border-slate-900">{readLaterBooks.length + bookmarkedIds.length}</span>
                )}
              </button>
              <button className={`p-2 transition-colors relative ${isDarkMode ? 'text-slate-300 hover:text-blue-400' : 'text-slate-700 hover:text-blue-600'}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></button>
              <button className={`w-8 h-8 rounded-full border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}></button>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={
            <Home 
              isLoading={isLoading}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedAuthors={selectedAuthors}
              setSelectedAuthors={setSelectedAuthors}
              sortBy={sortBy}
              setSortBy={setSortBy}
              isDarkMode={isDarkMode}
              readLaterBooks={readLaterBooks}
              bookmarkedIds={bookmarkedIds}
              toggleReadLater={toggleReadLater}
              toggleBookmark={toggleBookmark}
              setQuickViewBook={setQuickViewBook}
              setPreviewBook={setPreviewBook}
              setShareBook={setShareBook}
              isFiltering={isFiltering}
              availableAuthors={availableAuthors}
              filteredAuthorOptions={filteredAuthorOptions}
              authorSearch={authorSearch}
              setAuthorSearch={setAuthorSearch}
              isAuthorDropdownOpen={isAuthorDropdownOpen}
              setIsAuthorDropdownOpen={setIsAuthorDropdownOpen}
              authorDropdownRef={authorDropdownRef}
              paginatedBooks={paginatedBooks}
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              clearAllFilters={clearAllFilters}
              newArrivalsBooks={newArrivalsBooks}
              aiRecommendations={aiRecommendations}
              isGeneratingRecs={isGeneratingRecs}
            />
          } />
          <Route path="/book/:id" element={
            <BookDetailsPage 
              isDarkMode={isDarkMode}
              readLaterBooks={readLaterBooks}
              bookmarkedIds={bookmarkedIds}
              toggleReadLater={toggleReadLater}
              toggleBookmark={toggleBookmark}
              addToInteractions={addToInteractions}
            />
          } />
        </Routes>

        {/* Overlays Shared Across Views */}
        {previewBook && <BookPreview book={previewBook} onClose={() => setPreviewBook(null)} isDarkMode={isDarkMode} />}
        {shareBook && <ShareModal book={shareBook} onClose={() => setShareBook(null)} isDarkMode={isDarkMode} />}
        {isReadLaterOpen && (
          <ReadLaterModal 
            books={readLaterBooks} 
            bookmarkedBooks={BOOKS.filter(b => bookmarkedIds.includes(b.id))}
            onClose={() => setIsReadLaterOpen(false)}
            onRemove={(id) => setReadLaterBooks(prev => prev.filter(b => b.id !== id))}
            onRemoveBookmark={(id) => toggleBookmark(id)}
            onView={(book) => { setIsReadLaterOpen(false); /* handled by router */ }}
            isDarkMode={isDarkMode}
          />
        )}
        
        {quickViewBook && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setQuickViewBook(null)}>
            <div className={`rounded-3xl overflow-hidden max-w-2xl w-full flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-200 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
              <div className="md:w-1/2 h-64 md:h-auto">
                <img src={quickViewBook.coverImage} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="p-8 md:w-1/2 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{quickViewBook.title}</h2>
                    <button onClick={() => toggleBookmark(quickViewBook.id)} className={`mt-1.5 transition-colors ${bookmarkedIds.includes(quickViewBook.id) ? 'text-yellow-500' : isDarkMode ? 'text-slate-600 hover:text-slate-500' : 'text-slate-300 hover:text-slate-400'}`}><svg className="w-5 h-5" fill={bookmarkedIds.includes(quickViewBook.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg></button>
                  </div>
                  <button onClick={() => toggleReadLater(quickViewBook)} className={`p-2 rounded-full transition-colors ${readLaterBooks.find(b => b.id === quickViewBook.id) ? 'text-blue-600 bg-blue-600/10' : isDarkMode ? 'text-slate-600 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}><svg className="w-5 h-5" fill={readLaterBooks.find(b => b.id === quickViewBook.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg></button>
                </div>
                <p className="text-slate-500 mb-4 font-medium">በ {quickViewBook.author}</p>
                <RatingStars rating={quickViewBook.rating} className="mb-6" isDarkMode={isDarkMode} />
                <p className={`text-sm leading-relaxed mb-8 line-clamp-4 p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} ${bookmarkedIds.includes(quickViewBook.id) ? (isDarkMode ? 'bg-yellow-900/20 border-l-2 border-yellow-700' : 'bg-yellow-50/50 border-l-2 border-yellow-200') : ''}`}>{quickViewBook.description}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-500">{quickViewBook.price} ETB</span>
                  <button className={`px-6 py-3 rounded-xl font-bold transition-colors ${isDarkMode ? 'bg-white text-slate-900 hover:bg-blue-600 hover:text-white' : 'bg-slate-900 text-white hover:bg-blue-600'}`}>አሁን ይግዙ</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Librarian */}
        {!isLibrarianOpen && (
          <button onClick={() => setIsLibrarianOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-40 group dark:shadow-blue-900/40"><span className="text-2xl group-hover:animate-bounce">🤖</span></button>
        )}
        {isLibrarianOpen && (
          <div className="fixed inset-0 z-[150] flex items-end justify-end md:p-8 pointer-events-none">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm pointer-events-auto" onClick={() => setIsLibrarianOpen(false)}></div>
            <div className={`w-full max-w-md h-[600px] shadow-2xl rounded-t-3xl md:rounded-3xl pointer-events-auto animate-in slide-in-from-bottom-full md:slide-in-from-right-full duration-300 overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-blue-600 text-white">
                  <h3 className="font-bold">የመጻሕፍት ረዳት</h3>
                  <button onClick={() => setIsLibrarianOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">✕</button>
                </div>
                <div className="flex-grow overflow-hidden">
                  <Librarian interactedBooks={interactedBooks} isDarkMode={isDarkMode} onPreferencesChange={fetchAIRecommendations} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <footer className={`transition-colors duration-300 py-12 mt-20 ${isDarkMode ? 'bg-slate-900 text-slate-500 border-t border-slate-800' : 'bg-slate-900 text-slate-400'}`}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm">© 2025 አዋሽ ዲጅታል መጻሕፍት መደብር። መብቱ የተጠበቀ ነው።</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;