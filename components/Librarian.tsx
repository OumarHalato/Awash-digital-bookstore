import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Message, Book } from '../types';

const STORAGE_KEY = 'awash_librarian_history';

interface LibrarianProps {
  interactedBooks?: Book[];
  isDarkMode?: boolean;
  onPreferencesChange?: () => void;
}

const Librarian: React.FC<LibrarianProps> = ({ interactedBooks = [], isDarkMode = false, onPreferencesChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (e) {
        setDefaultMessage();
      }
    } else {
      setDefaultMessage();
    }
  }, []);

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
    if (window.confirm('የውይይት ታሪክዎን መሰረዝ ይፈልጋሉ?')) {
      localStorage.removeItem(STORAGE_KEY);
      setDefaultMessage();
    }
  };

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', text: textToSend };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const interactionContext = interactedBooks.length > 0 
        ? `The user has recently interacted with (viewed or saved) these books: ${interactedBooks.map(b => `"${b.title}"`).join(', ')}. Use this for context.`
        : "";

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: newMessages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: `You are the "Awash Librarian," a sophisticated expert for Awash Digital Book Store. 
          Expertise: Ethiopian literature (Haddis Alemayehu, Bealu Girma, etc.) and international classics.
          Style: Warm, literary, and helpful. 
          Context: ${interactionContext}
          Language: Primarily Amharic. Use English where appropriate.
          Task: Recommend books, explain literary themes, and assist users.`,
          temperature: 0.8,
          thinkingConfig: { thinkingBudget: 1000 }
        }
      });

      const aiText = response.text || "ይቅርታ፣ አሁን መልስ መስጠት አልቻልኩም።";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
      
      // Trigger a preference update if the user asked for a recommendation
      if (onPreferencesChange && (textToSend.toLowerCase().includes('recommend') || textToSend.includes('ጥቁሙኝ') || textToSend.includes('ምረጡልኝ'))) {
        onPreferencesChange();
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("ይቅርታ፣ የእርስዎ ብራውዘር የድምፅ ፍለጋን አይደግፍም።");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'am-ET';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  return (
    <div className={`flex flex-col h-full transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`} role="dialog">
      <div ref={scrollRef} className={`flex-grow overflow-y-auto p-4 space-y-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-300 ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : isDarkMode 
                  ? 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`p-3 rounded-2xl rounded-tl-none flex flex-col gap-2 items-start shadow-sm min-w-[150px] border transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tight italic">ረዳቱ እያሰበ ነው...</span>
            </div>
          </div>
        )}
      </div>

      <div className={`p-4 border-t transition-colors duration-300 flex flex-col gap-3 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="መፅሀፍ እንዲጠቆምልዎ ይጠይቁ..."
            className={`flex-grow px-4 py-2.5 rounded-full text-sm outline-none transition-all ${
              isDarkMode 
                ? 'bg-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-500 placeholder:text-slate-600' 
                : 'bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400'
            }`}
          />
          <button 
            onClick={startListening}
            className={`p-2.5 rounded-full transition-all shadow-md ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="በድምፅ ይጠይቁ"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z" /></svg>
          </button>
          <button 
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
            className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 shadow-md shrink-0 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
        <div className="flex justify-end">
          <button onClick={clearHistory} className={`text-[10px] font-bold transition-colors flex items-center gap-1 ${isDarkMode ? 'text-slate-600 hover:text-red-500' : 'text-slate-400 hover:text-red-500'}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            ታሪክን አጽዳ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Librarian;