
import React, { useState, useMemo } from 'react';
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

  const isFiltered = activeCategory !== 'all' || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 1000;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter','Noto_Sans_Ethiopic',sans-serif]">
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
            <button className="p-2 text-slate-700 hover:text-blue-600 transition-colors relative rounded-full focus:ring-2 focus:ring-blue-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
            </button>
            <button className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <ScrollReveal className="md:w-1/2 space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              የእውቀት አዋሽ፣ <br/>የንባብ ምንጭ።
            </h2>
            <p className="text-blue-100 text-lg max-w-lg leading-relaxed">
              ምርጥ የኢትዮጵያ እና የአለም መጻሕፍትን በዲጅታል አማራጭ እዚሁ ያግኙ። ከታሪክ እስከ ልብ ወለድ ድንቅ ስብስቦችን አቅርበንልዎታል።
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl">
                አሁኑኑ ይጀምሩ
              </button>
              <button 
                onClick={() => setIsLibrarianOpen(true)}
                className="px-8 py-3 bg-blue-600/30 border border-blue-400/30 text-white font-bold rounded-xl hover:bg-blue-600/50 transition-colors backdrop-blur-sm"
              >
                AI ረዳትን ይጠይቁ
              </button>
            </div>
          </ScrollReveal>
          <div className="md:w-1/2 relative hidden md:block">
             <ScrollReveal className="relative z-10 grid grid-cols-2 gap-4" delay={200}>
                <img src="https://picsum.photos/seed/h1/300/400" alt="" className="rounded-2xl shadow-2xl rotate-[-5deg]" />
                <img src="https://picsum.photos/seed/h2/300/400" alt="" className="rounded-2xl shadow-2xl rotate-[5deg] translate-y-8" />
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
              <div className="flex items-center justify-between px-2 mb-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider">ማጣሪያዎች</h4>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <button onClick={() => toggleSection('categories')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50">
                  <span className="font-bold text-slate-800 text-sm">ምድቦች</span>
                  <svg className={`w-4 h-4 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {expandedSections.categories && (
                  <div className="p-2 pt-0 space-y-1">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${activeCategory === cat.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span className="text-sm">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50">
                  <span className="font-bold text-slate-800 text-sm">ዋጋ (ETB)</span>
                  <svg className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {expandedSections.price && (
                  <div className="p-4 pt-0 space-y-4">
                    <input 
                      type="range" min="0" max="1000" step="50"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>0 ETB</span>
                      <span>{priceRange[1]} ETB</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </aside>

          {/* Book Grid */}
          <section className="flex-grow">
            <div className="bg-white rounded-3xl p-6 mb-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
                  {CATEGORIES.find(c => c.id === activeCategory)?.label} መጻሕፍት
                </h3>
                <span className="text-slate-500 text-sm font-medium">{filteredAndSortedBooks.length} ውጤቶች</span>
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-slate-100 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">ተወዳጅ</option>
                <option value="title">በስም</option>
                <option value="price-low">ዝቅተኛ ዋጋ</option>
                <option value="price-high">ከፍተኛ ዋጋ</option>
              </select>
            </div>

            {filteredAndSortedBooks.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedBooks.map((book, index) => (
                  <ScrollReveal key={book.id} delay={index * 50}>
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
              <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300">
                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                <p className="font-bold">ምንም መፅሀፍ አልተገኘም</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modals & Overlays */}
      {previewBook && <BookPreview book={previewBook} onClose={() => setPreviewBook(null)} />}
      {shareBook && <ShareModal book={shareBook} onClose={() => setShareBook(null)} />}
      
      {/* Quick View Modal */}
      {quickViewBook && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setQuickViewBook(null)}>
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full flex flex-col md:flex-row shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="md:w-1/2 h-64 md:h-auto">
              <img src={quickViewBook.coverImage} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col">
              <h2 className="text-2xl font-bold mb-2">{quickViewBook.title}</h2>
              <p className="text-slate-500 mb-4 font-medium">በ {quickViewBook.author}</p>
              <RatingStars rating={quickViewBook.rating} className="mb-6" />
              <p className="text-slate-600 text-sm leading-relaxed mb-8 line-clamp-4">{quickViewBook.description}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">{quickViewBook.price} ETB</span>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors">አሁን ይግዙ</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-in slide-in-from-bottom-8 duration-300">
           <div className="max-w-4xl mx-auto py-20 px-4 relative">
              <button onClick={() => setSelectedBook(null)} className="fixed top-8 right-8 p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-[110]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-1/3">
                  <img src={selectedBook.coverImage} className="w-full rounded-2xl shadow-2xl sticky top-24" alt="" />
                </div>
                <div className="md:w-2/3 space-y-8">
                  <div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block">{selectedBook.category}</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900">{selectedBook.title}</h2>
                    <p className="text-xl text-slate-500 mt-2">በ {selectedBook.author} {selectedBook.year && `(${selectedBook.year})`}</p>
                  </div>
                  <RatingStars rating={selectedBook.rating} />
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-700 leading-relaxed">{selectedBook.description}</p>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">ዋጋ</p>
                      <p className="text-3xl font-black text-slate-900">{selectedBook.price} ETB</p>
                    </div>
                    <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all transform hover:-translate-y-1">ወደ ቅርጫት ጨምር</button>
                  </div>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Floating Librarian Button */}
      {!isLibrarianOpen && (
        <button 
          onClick={() => setIsLibrarianOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-40 group"
          aria-label="የመጻሕፍት ረዳት ይጠይቁ"
        >
          <span className="text-2xl group-hover:animate-bounce">🤖</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      )}

      {/* Librarian Side Panel */}
      {isLibrarianOpen && (
        <div className="fixed inset-0 z-[150] pointer-events-none">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm pointer-events-auto" onClick={() => setIsLibrarianOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl pointer-events-auto animate-in slide-in-from-right-full duration-300">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-bold">የመጻሕፍት ረዳት</h3>
                <button onClick={() => setIsLibrarianOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">✕</button>
              </div>
              <div className="flex-grow overflow-hidden">
                <Librarian interactedBooks={interactedBooks} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© 2025 አዋሽ ዲጅታል መጻሕፍት መደብር። መብቱ የተጠበቀ ነው።</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
