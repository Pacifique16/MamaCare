import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { chatApi } from '../api/services';

const SUGGESTIONS = [
  'What foods should I avoid?',
  'Safe exercises for pregnancy?',
  'How to sleep comfortably?',
  'What vitamins do I need?',
];

const PregnancyChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 I\'m your MamaCare AI assistant. Ask me anything about nutrition, exercise, symptoms, or any pregnancy topic!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    const message = text || input.trim();
    if (!message || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: message };
    const history = messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0);
    setMessages(prev => [...prev, userMsg, { role: 'assistant', content: null }]);
    setLoading(true);

    try {
      const res = await chatApi.send(message, history.map(m => ({ role: m.role, content: m.content })));
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: res.data.reply }
      ]);
    } catch (err) {
      const status = err?.response?.status;
      const msg = status === 429
        ? 'I\'m receiving too many requests right now. Please wait a moment and try again.'
        : 'Sorry, I couldn\'t connect right now. Please try again.';
      console.error('Chat error:', err?.response?.data?.error?.message || err?.message);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: msg }
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {!open && (
          <div className="relative bg-white text-gray-800 text-sm px-4 py-2 rounded-2xl shadow-lg border border-gray-100 whitespace-nowrap">
            Hello! How can I help you today?
            <span className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="w-16 h-16 bg-[#005C5C] text-white rounded-full shadow-2xl shadow-teal-900/30 flex items-center justify-center hover:bg-[#004848] transition-all hover:scale-110 active:scale-95"
        >
          {open ? <X size={28} /> : <MessageCircle size={28} />}
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: '520px' }}>

          {/* Header */}
          <div className="bg-[#005C5C] px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">MamaCare AI</p>
              <p className="text-teal-200 text-[10px]">Pregnancy health assistant</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/60 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-[#005C5C] rounded-full flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#005C5C] text-white rounded-br-none'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.content === null ? (
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                  ) : msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                    <User size={14} className="text-[#005C5C]" />
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions — only show at start */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="px-3 py-1.5 bg-teal-50 text-[#005C5C] text-xs font-semibold rounded-full hover:bg-teal-100 transition-colors border border-teal-100">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:border-[#005C5C] focus-within:bg-white transition-all">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about pregnancy..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-900 outline-none"
              />
              <button onClick={() => send()} disabled={!input.trim() || loading}
                className="w-8 h-8 bg-[#005C5C] text-white rounded-full flex items-center justify-center hover:bg-[#004848] transition-all disabled:opacity-40 shrink-0">
                <Send size={14} className="translate-x-0.5 -translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PregnancyChatbot;
