
import React, { useState } from 'react';
import { Book } from '../types';
import { CATEGORIES } from '../constants';

interface AdminDashboardProps {
  books: Book[];
  isDarkMode?: boolean;
  onAdd: (book: Book) => void;
  onUpdate: (book: Book) => void;
  onDelete: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  books, 
  isDarkMode = false, 
  onAdd, 
  onUpdate, 
  onDelete 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    description: '',
    price: 0,
    category: 'fiction',
    coverImage: 'https://picsum.photos/seed/newbook/400/600',
    rating: 5.0,
    year: new Date().getFullYear().toString(),
    isNew: true
  });

  const handleOpenAdd = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      description: '',
      price: 0,
      category: 'fiction',
      coverImage: 'https://picsum.photos/seed/' + Math.floor(Math.random() * 1000) + '/400/600',
      rating: 5.0,
      year: new Date().getFullYear().toString(),
      isNew: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setFormData(book);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      onUpdate({ ...editingBook, ...formData } as Book);
    } else {
      onAdd({ ...formData, id: Date.now().toString() } as Book);
    }
    setIsModalOpen(false);
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const averageRating = books.length > 0 
    ? (books.reduce((acc, b) => acc + b.rating, 0) / books.length).toFixed(1)
    : "0.0";

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              አስተዳደር ፓነል (Admin)
              <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md uppercase tracking-widest">Dashboard</span>
            </h1>
            <p className="text-slate-500 font-medium">የመጻሕፍት ስብስቡን እዚህ ያስተዳድሩ</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="ፈልግ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all w-64 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}
                />
                <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
             <button 
              onClick={handleOpenAdd}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
               አዲስ መፅሀፍ
             </button>
          </div>
        </header>

        {/* Stats Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: 'ጠቅላላ መጻሕፍት', value: books.length, icon: '📚', color: 'blue' },
             { label: 'አዲስ የገቡ', value: books.filter(b => b.isNew).length, icon: '✨', color: 'emerald' },
             { label: 'ምድቦች', value: CATEGORIES.length - 1, icon: '🏷️', color: 'purple' },
             { label: 'ተወዳጅ (Avg Rating)', value: averageRating, icon: '⭐', color: 'amber' }
           ].map((stat, i) => (
             <div key={i} className={`p-6 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                   <span className="text-2xl">{stat.icon}</span>
                </div>
                <h3 className="text-2xl font-black">{stat.value}</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">{stat.label}</p>
             </div>
           ))}
        </div>

        {/* Book List Table */}
        <div className={`rounded-3xl border overflow-hidden transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className={`text-[10px] font-black uppercase tracking-[0.2em] border-b ${isDarkMode ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                <tr>
                  <th className="px-6 py-4">ሽፋን</th>
                  <th className="px-6 py-4">ርዕስ</th>
                  <th className="px-6 py-4">ደራሲ</th>
                  <th className="px-6 py-4">ምድብ</th>
                  <th className="px-6 py-4">ዋጋ</th>
                  <th className="px-6 py-4">ደረጃ</th>
                  <th className="px-6 py-4 text-right">ተግባር</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10 dark:divide-slate-800">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <img src={book.coverImage} className="w-10 h-14 object-cover rounded-md shadow-sm" alt="" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm">{book.title}</div>
                      {book.isNew && <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">New</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm">{book.price} ETB</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        ⭐ {book.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(book)}
                          className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-blue-600/20 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                          title="አስተካክል"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button 
                          onClick={() => { if(window.confirm('ይህ መፅሀፍ በእርግጥ ይሰረዝ?')) onDelete(book.id); }}
                          className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-red-600/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                          title="ሰርዝ"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredBooks.length === 0 && (
            <div className="p-12 text-center text-slate-500">
               ምንም መፅሀፍ አልተገኘም።
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
           <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-900'}`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black">{editingBook ? 'መፅሀፍ አስተካክል' : 'አዲስ መፅሀፍ ጨምር'}</h2>
                <button onClick={() => setIsModalOpen(false)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>✕</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">ርዕስ</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">ደራሲ</label>
                    <input 
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">ምድብ</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                    >
                      {CATEGORIES.filter(c => c.id !== 'all' && c.id !== 'new').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">ዋጋ (ETB)</label>
                    <input 
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">ዓመተ ምህረት</label>
                    <input 
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">ደረጃ (Rating 0-5)</label>
                    <input 
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">የሽፋን ምስል URL</label>
                  <input 
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">መግለጫ</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="isNew"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isNew" className="text-sm font-bold">አዲስ ገቢ መሆኑን አሳይ</label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-grow py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
                  >
                    {editingBook ? 'አስተካክል' : 'መፅሀፉን ጨምር'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={`px-8 py-4 font-bold rounded-2xl border transition-all ${isDarkMode ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    ተመለስ
                  </button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
