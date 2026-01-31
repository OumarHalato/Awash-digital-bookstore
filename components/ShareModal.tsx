
import React, { useState } from 'react';
import { Book } from '../types';

interface ShareModalProps {
  book: Book;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ book, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/#book-${book.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { name: 'Telegram', icon: '✈️', color: 'bg-[#229ED9]', url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out "${book.title}" on Awash Digital Book Store!`)}` },
    { name: 'Facebook', icon: '👥', color: 'bg-[#1877F2]', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'X (Twitter)', icon: '✖️', color: 'bg-[#000000]', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Reading "${book.title}" by ${book.author}`)}` },
    { name: 'WhatsApp', icon: '💬', color: 'bg-[#25D366]', url: `https://wa.me/?text=${encodeURIComponent(`I found this book on Awash: ${book.title} - ${shareUrl}`)}` },
  ];

  return (
    <div 
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
    >
      <div 
        className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
          aria-label="ዝጋ"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h3 id="share-title" className="text-xl font-bold text-slate-900 mb-1">መፅሐፉን ያጋሩ</h3>
          <p className="text-slate-500 text-sm">"{book.title}" ለወዳጅ ዘመድዎ ያጋሩ</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
              aria-label={`${option.name} ላይ አጋራ`}
            >
              <div className={`w-12 h-12 ${option.color} text-white rounded-full flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110`}>
                {option.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-600">{option.name}</span>
            </a>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ሊንኩን ይቅዱ</p>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <input 
              readOnly 
              value={shareUrl}
              className="bg-transparent border-none text-xs text-slate-600 flex-grow px-3 py-2 outline-none"
            />
            <button 
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copied ? 'ተቀድቷል!' : 'ቅዳ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
