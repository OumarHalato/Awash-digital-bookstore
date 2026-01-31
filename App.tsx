
import React, { useState, useMemo, useEffect } from 'react';
import { BOOKS, CATEGORIES } from './constants';
import { Book } from './types';
import BookCard from './components/BookCard';
import Librarian from './components/Librarian';
import RatingStars from './components/RatingStars';
import ScrollReveal from './components/ScrollReveal';
import BookPreview from './components/BookPreview';
import ShareModal from './components/ShareModal';

type SortOption = 'default' | 'title' | 'author' | 'price-low' | 'price-high';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [shareBook, setShareBook] = useState<Book | null>(null);
  const [isLibrarianOpen, setIsLibrarianOpen] = useState(false);
  
  // Interaction History for AI Context
  const [interactedBooks, setInteractedBooks] = useState<Book[]>([]);

  // New Filter States
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: false
  });

  const addToInteractions = (book: Book) => {
    setInteractedBooks(prev => {
      if (prev.find(b => b.id === book.id)) return prev;
      // Keep last 10 interactions to avoid token overflow but provide good context
      const newInteractions = [book, ...prev].slice(0, 10);
      return newInteractions;
    });
  };

  const handleOpenDetail = (book: Book) => {
    setSelectedBook(book);
    addToInteractions(book);
  };

  const handleOpenQuickView = (book: Book) => {
    setQuickViewBook(book);
    addToInteractions(book);
  };

  const handleOpenPreview = (book: Book) => {
    setPreviewBook(book);
    addToInteractions(book);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredAndSortedBooks = useMemo(() => {
    let result = BOOKS.filter(book => {
      const matchesCategory = activeCategory === 'all' || book.category === activeCategory;
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1];
      const matchesRating = book.rating >= minRating;
      
      return matchesCategory && matchesSearch && matchesPrice && matchesRating;
    });

    switch (sortBy) {
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title, 'am'));
        break;
      case 'author':
        result.sort((a, b) => a.author.localeCompare(b.author, 'am'));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [activeCategory, searchQuery, sortBy, priceRange, minRating]);

  const clearFilters = () => {
    setActiveCategory('all');
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSearchQuery('');
  };

  const isFiltered = activeCategory !== 'all' || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 1000;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200" aria-hidden="true">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">አዋሽ ዲጅታል</h1>
              <p className="text-[10px] uppercase tracking-widest text-blue-700 font-bold">Awash Book Store</p>
            </div>
          </div>

          <div className="hidden md:flex flex-grow max-w-md mx-8" role="search">
            <div className="relative w-full">
              <label htmlFor="main-search" className="sr-only">መጻሕፍት ይፈልጉ</label>
              <input 
                id="main-search"
                type="text" 
                placeholder="የሚፈልጉትን መፅሀፍ ወይም ደራሲ ይፈልጉ..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <nav className="flex items-center gap-4" aria-label="የተጠቃሚ ምናሌ">
            <button 
              className="p-2 text-slate-700 hover:text-blue-600 transition-colors relative focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              aria-label="የግዢ ቅርጫት (Shopping Cart)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
            </button>
            <button 
              className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="የተጠቃሚ ፕሮፋይል"
            ></button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4 overflow-hidden" aria-labelledby="hero-title">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <ScrollReveal className="md:w-1/2 space-y-6">
            <h2 id="hero-title" className="text-4xl md:text-5xl font-extrabold leading-tight">
              የእውቀት አዋሽ፣ <br/>የንባብ ምንጭ።
            </h2>
            <p className="text-blue-100 text-lg max-w-lg leading-relaxed">
              ምርጥ የኢትዮጵያ እና የአለም መጻሕፍትን በዲጅታል አማራጭ እዚሁ ያግኙ። ከታሪክ እስከ ልብ ወለድ፣ ከልጆች እስከ ራስን ማገዝ ድንቅ ስብስቦችን አቅርበንልዎታል።
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl focus:outline-none focus:ring-4 focus:ring-white/20">
                አሁኑኑ ይጀምሩ
              </button>
              <button 
                onClick={() => setIsLibrarianOpen(true)}
                aria-expanded={isLibrarianOpen}
                className="px-8 py-3 bg-blue-600/30 border border-blue-400/30 text-white font-bold rounded-xl hover:bg-blue-600/50 transition-colors backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-400/50"
              >
                AI ረዳትን ይጠይቁ
              </button>
            </div>
          </ScrollReveal>
          <div className="md:w-1/2 relative" aria-hidden="true">
             <ScrollReveal className="relative z-10 grid grid-cols-2 gap-4" delay={200}>
                <img src="https://picsum.photos/seed/h1/300/400" alt="" className="rounded-2xl shadow-2xl rotate-[-5deg] hover:rotate-0 transition-transform duration-500" />
                <img src="https://picsum.photos/seed/h2/300/400" alt="" className="rounded-2xl shadow-2xl rotate-[5deg] translate-y-8 hover:rotate-0 transition-transform duration-500" />
             </ScrollReveal>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/20 blur-[120px] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 flex-grow w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-64 flex-shrink-0">
            <ScrollReveal className="space-y-6 sticky top-24">
              {/* Sidebar Header with Clear */}
              <div className="flex items-center justify-between px-2 mb-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider">ማጣሪያዎች</h4>
                {isFiltered && (
                  <button 
                    onClick={clearFilters}
                    className="text-[10px] text-blue-600 font-bold hover:underline"
                  >
                    ሁሉንም አፅዳ
                  </button>
                )}
              </div>

              {/* Categories Section (Collapsible) */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <button 
                  onClick={() => toggleSection('categories')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-800 text-sm">ምድቦች</span>
                  <svg 
                    className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedSections.categories && (
                  <div className="p-2 pt-0 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative ${
                          activeCategory === cat.id 
                            ? 'bg-blue-50 text-blue-700 font-bold' 
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {activeCategory === cat.id && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full"></div>
                        )}
                        <span className="text-base" aria-hidden="true">{cat.icon}</span>
                        <span className="text-sm">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range Section (Collapsible) */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <button 
                  onClick={() => toggleSection('price')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-800 text-sm">ዋጋ (ETB)</span>
                  <svg 
                    className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedSections.price && (
                  <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] text-slate-400 font-bold block mb-1">ዝቅተኛ</label>
                        <input 
                          type="number" 
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] text-slate-400 font-bold block mb-1">ከፍተኛ</label>
                        <input 
                          type="number" 
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Section (Collapsible) */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <button 
                  onClick={() => toggleSection('rating')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-800 text-sm">ደረጃ</span>
                  <svg 
                    className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedSections.rating && (
                  <div className="p-2 pt-0 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {[4, 3, 2].map(r => (
                      <button 
                        key={r}
                        onClick={() => setMinRating(minRating === r ? 0 : r)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                          minRating === r ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <RatingStars rating={r} max={5} />
                          <span className="text-xs font-medium">እና ከዚያ በላይ</span>
                        </div>
                        {minRating === r && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <section className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden shadow-xl" aria-labelledby="promo-title">
                 <div className="relative z-10">
                   <h4 id="promo-title" className="font-bold mb-2">ፕሪሚየም አባልነት</h4>
                   <p className="text-xs text-slate-400 mb-4">በወር 299 ብር ብቻ ሁሉንም መጻሕፍት ያለ ገደብ ያንብቡ።</p>
                   <button className="w-full py-2.5 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900">ይመዝገቡ</button>
                 </div>
                 <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl" aria-hidden="true"></div>
              </section>
            </ScrollReveal>
          </aside>

          {/* Book Grid Area */}
          <section className="flex-grow" aria-labelledby="books-grid-title">
            <ScrollReveal className="bg-white rounded-3xl p-6 mb-8 border border-slate-200 shadow-sm">
               <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                 <div>
                    <h3 id="books-grid-title" className="text-2xl font-extrabold text-slate-900 mb-1">
                      {CATEGORIES.find(c => c.id === activeCategory)?.label} መጻሕፍት
                    </h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <span aria-live="polite">{filteredAndSortedBooks.length} ውጤቶች</span>
                      {isFiltered && <span className="w-1 h-1 rounded-full bg-slate-300"></span>}
                      {isFiltered && <span className="text-blue-600 text-[10px] font-bold uppercase tracking-wide">ማጣሪያ ገብቷል</span>}
                    </div>
                 </div>
                 
                 {/* Enhanced Sorting UI */}
                 <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-1">ደርድር፡</span>
                   <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-hide max-w-full">
                     {(['default', 'title', 'price-low', 'price-high'] as SortOption[]).map((opt) => (
                       <button
                         key={opt}
                         onClick={() => setSortBy(opt)}
                         className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                           sortBy === opt 
                             ? 'bg-white text-blue-600 shadow-sm' 
                             : 'text-slate-500 hover:text-slate-700'
                         }`}
                       >
                         {opt === 'default' ? 'ተወዳጅ' : 
                          opt === 'title' ? 'ስም' : 
                          opt === 'price-low' ? 'ዝቅተኛ ዋጋ' : 'ከፍተኛ ዋጋ'}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
            </ScrollReveal>

            {filteredAndSortedBooks.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedBooks.map((book, index) => (
                  <ScrollReveal key={book.id} delay={index * 100}>
                    <BookCard 
                      book={book} 
                      onView={handleOpenDetail} 
                      onQuickView={handleOpenQuickView}
                      onShare={(b) => setShareBook(b)}
                      onPreview={handleOpenPreview}
                    />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300" role="status">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1