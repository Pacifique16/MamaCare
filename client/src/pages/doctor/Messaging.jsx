import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorLayout from '../../components/layout/DoctorLayout';
import { messagesApi, mothersApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { Search, Send, CheckCheck, MessageSquare, Phone } from 'lucide-react';

const avatar = (name, img) => img
  ? <img src={img} alt={name} className="w-full h-full object-cover" />
  : <span className="font-bold text-sm">{name?.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>;

const Messaging = () => {
  const { user } = useAuth();
  const doctorId = user?.doctorId || 1;
  const [searchParams] = useSearchParams();
  const preselectedMotherId = searchParams.get('motherId') ? Number(searchParams.get('motherId')) : null;

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  // Load conversation list
  useEffect(() => {
    messagesApi.getConversations(doctorId)
      .then(async r => {
        setConversations(r.data);
        if (preselectedMotherId) {
          const found = r.data.find(c => c.motherId === preselectedMotherId);
          if (found) {
            setActiveConv(found);
          } else {
            // Mother has no prior messages — fetch her info and open a blank chat
            try {
              const m = await mothersApi.getById(preselectedMotherId);
              const synthetic = {
                motherId: preselectedMotherId,
                motherName: m.data.fullName,
                motherImage: m.data.profileImageUrl,
                motherPhone: m.data.phoneNumber,
                lastMessage: null,
                lastMessageAt: null,
                unreadCount: 0
              };
              setConversations(prev => [synthetic, ...prev]);
              setActiveConv(synthetic);
            } catch {}
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [doctorId]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConv) return;
    loadMessages(activeConv.motherId);
    // Poll every 5s
    pollRef.current = setInterval(() => loadMessages(activeConv.motherId), 5000);
    return () => clearInterval(pollRef.current);
  }, [activeConv?.motherId]);

  const loadMessages = (motherId) => {
    messagesApi.getConversation(motherId, doctorId)
      .then(r => {
        setMessages(r.data);
        // Mark unread messages as read
        r.data.filter(m => !m.isRead && !m.sentByDoctor)
          .forEach(m => messagesApi.markRead(m.id));
        // Update unread count in sidebar
        setConversations(prev => prev.map(c =>
          c.motherId === motherId ? { ...c, unreadCount: 0 } : c
        ));
      })
      .catch(() => {});
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConv = (conv) => {
    setActiveConv(conv);
    setMessages([]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConv || sending) return;
    setSending(true);
    const content = text.trim();
    setText('');
    try {
      const res = await messagesApi.send({
        motherId: activeConv.motherId,
        doctorId,
        content,
        sentByDoctor: true,
      });
      setMessages(prev => [...prev, res.data]);
      setConversations(prev => prev.map(c =>
        c.motherId === activeConv.motherId ? { ...c, lastMessage: content, lastMessageAt: new Date().toISOString() } : c
      ));
    } catch {}
    setSending(false);
  };

  const filtered = conversations.filter(c =>
    c.motherName?.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (dt) => {
    const d = new Date(dt);
    const now = new Date();
    if (d.toDateString() === now.toDateString())
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto space-y-12 font-poppins animate-in fade-in duration-1000">
        
        {/* Premium Branding Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">SECURE COMMUNICATION</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Clinical Messages</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-lg shadow-sm">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                Live Chat Status
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-white shadow-card overflow-hidden flex h-[750px]">
          {/* Sidebar */}
          <div className="w-[360px] border-r border-gray-50 flex flex-col bg-gray-50/30 shrink-0">
            <div className="p-8 border-b border-gray-50">
              <div className="relative group">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mamacare-teal transition-colors" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search patients..."
                  className="w-full pl-16 pr-6 py-4 bg-white border border-transparent rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-mamacare-teal/5 transition-all outline-none shadow-sm" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="p-8 flex gap-4 animate-pulse border-b border-gray-50/50">
                    <div className="w-14 h-14 rounded-2xl bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-3 pt-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-2 bg-gray-100 rounded w-full" />
                    </div>
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div className="p-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 mx-auto">
                    <MessageSquare size={32} />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No conversations yet</p>
                </div>
              ) : (
                filtered.map(conv => (
                  <button key={conv.motherId} onClick={() => handleSelectConv(conv)}
                    className={`w-full p-8 border-b border-gray-50/50 text-left flex items-start gap-5 transition-all hover:bg-white relative group ${activeConv?.motherId === conv.motherId ? 'bg-white' : ''}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-sm transition-transform group-hover:scale-110 ${activeConv?.motherId === conv.motherId ? 'bg-mamacare-teal text-white' : 'bg-teal-50 text-mamacare-teal'}`}>
                      {avatar(conv.motherName, conv.motherImage)}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm truncate font-bold ${conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>{conv.motherName}</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{formatTime(conv.lastMessageAt)}</span>
                      </div>
                      <p className={`text-[12px] truncate leading-relaxed ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>{conv.lastMessage || 'Start a new conversation'}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="absolute top-1/2 -translate-y-1/2 right-6 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-xl flex items-center justify-center shadow-lg shadow-red-200">{conv.unreadCount}</span>
                    )}
                    {activeConv?.motherId === conv.motherId && (
                      <div className="absolute left-0 top-8 bottom-8 w-1 bg-mamacare-teal rounded-r-full" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          {!activeConv ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-white gap-6">
              <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 animate-bounce-slow">
                <MessageSquare size={48} />
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-gray-900 text-lg">Your Workspace Messaging</p>
                <p className="text-sm text-gray-400">Select a patient from the sidebar to begin consulting.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col bg-white">
              {/* Header */}
              <div className="h-24 border-b border-gray-50 px-10 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-mamacare-teal flex items-center justify-center overflow-hidden shadow-sm">
                    {avatar(activeConv.motherName, activeConv.motherImage)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base leading-tight">{activeConv.motherName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Now</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {activeConv.motherPhone && (
                    <a href={`tel:${activeConv.motherPhone}`}
                      className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm group"
                      title={`Call ${activeConv.motherName}`}>
                      <Phone size={20} className="group-hover:rotate-12 transition-transform" />
                    </a>
                  )}
                  <button className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-all">
                    <Search size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-gray-50/10 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-teal-100 mx-auto border border-gray-50">
                      <Send size={32} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No clinical history here. Send a secure greeting.</p>
                  </div>
                )}
                {messages.map((msg, i) => {
                  const isDoctor = msg.sentByDoctor;
                  const showTime = i === 0 || new Date(msg.sentAt).toDateString() !== new Date(messages[i - 1].sentAt).toDateString();
                  return (
                    <React.Fragment key={msg.id}>
                      {showTime && (
                        <div className="flex items-center gap-4 py-4">
                          <div className="h-px bg-gray-100 flex-1" />
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] bg-white px-4">
                            {new Date(msg.sentAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </span>
                          <div className="h-px bg-gray-100 flex-1" />
                        </div>
                      )}
                      <div className={`flex items-end gap-4 ${isDoctor ? 'justify-end' : 'justify-start'}`}>
                        {!isDoctor && (
                          <div className="w-10 h-10 rounded-xl bg-teal-50 text-mamacare-teal flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden shadow-sm">
                            {avatar(activeConv.motherName, activeConv.motherImage)}
                          </div>
                        )}
                        <div className="space-y-2 max-w-[70%]">
                          <div className={`px-6 py-4 rounded-[2rem] shadow-sm relative group ${isDoctor ? 'bg-mamacare-teal text-white rounded-br-none' : 'bg-white border border-white text-gray-800 rounded-bl-none shadow-card'}`}>
                            <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                            <div className={`flex items-center gap-2 mt-2 ${isDoctor ? 'justify-end' : ''}`}>
                              <span className={`text-[9px] font-black uppercase tracking-widest ${isDoctor ? 'text-white/60' : 'text-gray-400'}`}>
                                {new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isDoctor && <CheckCheck size={14} className={msg.isRead ? 'text-teal-300' : 'text-white/40'} />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-10 bg-white border-t border-gray-50 shrink-0">
                <form onSubmit={handleSend} className="relative flex items-center gap-4">
                  <div className="flex-1 bg-gray-50 rounded-[2rem] px-8 py-5 focus-within:bg-white focus-within:ring-4 focus-within:ring-mamacare-teal/5 border border-transparent focus-within:border-mamacare-teal/10 transition-all flex items-center shadow-inner group">
                    <input value={text} onChange={e => setText(e.target.value)}
                      placeholder="Type a secure medical consultation message..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-900 placeholder:text-gray-400 outline-none" />
                    <button type="submit" disabled={!text.trim() || sending}
                      className="w-12 h-12 bg-mamacare-teal text-white rounded-2xl flex items-center justify-center hover:bg-[#004848] transition-all disabled:opacity-30 shrink-0 shadow-lg shadow-mamacare-teal/20 group-hover:scale-105 active:scale-95">
                      <Send size={20} className="translate-x-0.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Messaging;
