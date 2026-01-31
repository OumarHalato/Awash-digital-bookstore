
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Message, Book } from '../types';

const STORAGE_KEY = 'awash_librarian_history';

interface LibrarianProps {
  interactedBooks?: Book[];
}

const Librarian: React.FC<LibrarianProps> = ({ interactedBooks = [] }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize: Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
        setDefaultMessage();
      }
    } else {
      setDefaultMessage();
    }
  }, []);

  // Save history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const setDefaultMessage = () => {
    setMessages([
      { role: 'model', text: 'ሰላም! እኔ አዋሽ መጻሕፍት መደብር ረዳት ነኝ። የሚፈልጉትን መፅሀፍ ለመጠቆም ዝግጁ ነኝ። ምን አይነት መፅሀፍ ማንበብ ይፈልጋሉ?' }
    ]);
  };

  const clearHistory = () => {
    if (window.confirm('የውይይት ታሪክዎን መሰረዝ ይፈልጋሉ? (Do you want to clear your chat history?)')) {
      localStorage.removeItem(STORAGE_KEY);
      setDefaultMessage();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Build browsing history context string
      const interactionContext = interactedBooks.length > 0 
        ? `The user has recently shown interest in the following books in our store:
${interactedBooks.map(b => `- "${b.title}" by ${b.author} (Genre: ${b.category}, Rating: ${b.rating}/5): ${b.description}`).join('\n')}
Use this history to provide highly personalized advice. If they like these, suggest similar books. If they didn't like them, pivot to something else.`
        : "The user hasn't browsed specific books in detail yet in this session.";

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: newMessages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: `You are the "Awash Librarian," a personalized digital book expert for Awash Digital Book Store. 
          
          CURRENT USER CONTEXT:
          ${interactionContext}

          CRITICAL: You have a long-term memory. You MUST remember the context of the current conversation and use the provided interaction history to suggest books the user is likely to enjoy.
          
          Guidelines:
          1. Leverage the browsing history above. If a user has been looking at history books, recommend more history or historical fiction.
          2. If you already suggested a book in the chat, do not repeat yourself.
          3. If the user mentions a book from their interaction history, show you know they've been looking at it.
          4. Primary language is Amharic (አማርኛ), secondary is English. Mix naturally if helpful.
          5. Be sophisticated, friendly, and book-smart. 
          6. Mention Ethiopian classics (Haddis Alemayehu, Bealu Girma, etc.) alongside international ones.
          7. Keep responses helpful and concise.`,
          temperature: 0.8,
        }
      });

      const aiText = response.text || "ይቅርታ፣ አሁን መልስ መስጠት አልቻልኩም። እባክዎ ትንሽ ቆይተው ይሞክሩ።";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "ስህተት ተከስቷል። እባክዎ ግንኙነትዎን ያረጋግጡ።" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div 
      className="flex flex-col h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      role="dialog"
      aria-label="የመጻሕፍት ጠቋሚ ረዳት ውይይት (Librarian Chat Assistant)"
    >
      <div className="bg-blue-600 p-4 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl" aria-hidden="true">
            🤖
          </div>
          <div>
            <h3 className="font-bold text-sm">የመጻሕፍት ጠቋሚ ረዳት</h3>
            <p className="text-[10px] opacity-80" aria-live="polite">
              {isTyping ? 'መልስ እየተጻፈ ነው...' : 'ሁሌም ዝግጁ'}
            </p>
          </div>
        </div>
        <button 
          onClick={clearHistory}
          className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
          title="ታሪክን አጽዳ (Clear History)"
          aria-label="ታሪክን አጽዳ"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div 
        ref={scrollRef} 
        className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <span className="sr-only">{m.role === 'user' ? 'እርስዎ፡' : 'ረዳቱ፡'}</span>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start" aria-hidden="true">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <label htmlFor="librarian-input" className="sr-only">መልዕክትዎን ይጻፉ</label>
        <input 
          id="librarian-input"
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="መፅሀፍ እንዲጠቆምልዎ ይጠይቁ..."
          className="flex-grow px-4 py-2.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
          autoComplete="off"
        />
        <button 
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          aria-label="መልዕክት ላክ (Send Message)"
          className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 transition-all shadow-md focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Librarian;
