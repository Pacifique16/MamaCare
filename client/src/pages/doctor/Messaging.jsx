import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorLayout from '../../components/layout/DoctorLayout';
import { messagesApi, mothersApi, doctorsApi, patientAppointmentsApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { Search, Send, CheckCheck, MessageSquare, Phone } from 'lucide-react';

const avatar = (name, img) => img
  ? <img src={img} alt={name} className="w-full h-full object-cover" />
  : <span className="font-bold text-sm">{name?.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>;

const Messaging = () => {
  const { user } = useAuth();
  const doctorId = parseInt(user?.doctorId, 10) || 1;
  const [searchParams] = useSearchParams();
  const preselectedMotherId = searchParams.get('motherId') ? Number(searchParams.get('motherId')) : null;

  const [conversations, setConversations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  // Load conversation list and patients from all sources
  useEffect(() => {
    setLoading(true);
    
    const fetchEverything = async () => {
      try {
        const [convsRes, mothersRes, patientsRes] = await Promise.all([
          messagesApi.getConversations(doctorId).catch(() => ({ data: [] })),
          doctorsApi.getPatients(doctorId).catch(() => ({ data: [] })),
          patientAppointmentsApi.getAll({ doctorId }).catch(() => ({ data: [] }))
        ]);

        const activeConvs = convsRes.data || [];
        const rosterMothers = mothersRes.data || [];
        const clinicalPatients = patientsRes.data || [];

        // Build a unique list of people the doctor can message
        const map = new Map();

        // 1. Add people from active conversations
        activeConvs.forEach(c => {
          map.set(c.motherId, {
            id: c.motherId,
            name: c.motherName,
            image: c.motherImage,
            phone: c.motherPhone,
            lastMessage: c.lastMessage,
            lastMessageAt: c.lastMessageAt,
            unreadCount: c.unreadCount,
            source: 'conversation'
          });
        });

        // 2. Add mothers from roster
        rosterMothers.forEach(m => {
          if (!map.has(m.id)) {
            map.set(m.id, {
              id: m.id,
              name: m.fullName,
              image: m.profileImageUrl,
              phone: m.phoneNumber,
              lastMessage: null,
              lastMessageAt: null,
              unreadCount: 0,
              source: 'roster'
            });
          }
        });

        // 3. Add patients from clinical appointments
        clinicalPatients.forEach(p => {
          if (!map.has(p.patientId)) {
            map.set(p.patientId, {
              id: p.patientId,
              name: p.patientName,
              image: null,
              phone: null,
              lastMessage: null,
              lastMessageAt: null,
              unreadCount: 0,
              source: 'clinical'
            });
          }
        });

        const merged = Array.from(map.values());
        setConversations(merged);

        if (preselectedMotherId) {
          const found = merged.find(c => c.id === preselectedMotherId);
          if (found) {
            setActiveConv(found);
          } else {
            try {
              const m = await mothersApi.getById(preselectedMotherId);
              const synthetic = {
                id: preselectedMotherId,
                name: m.data.fullName,
                image: m.data.profileImageUrl,
                phone: m.data.phoneNumber,
                lastMessage: null,
                lastMessageAt: null,
                unreadCount: 0,
                isNew: true
              };
              setConversations(prev => [synthetic, ...prev]);
              setActiveConv(synthetic);
            } catch {}
          }
        }
      } catch (err) {
        console.error('Messaging init error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEverything();
  }, [doctorId, preselectedMotherId]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConv) return;
    loadMessages(activeConv.id);
    // Poll every 5s
    pollRef.current = setInterval(() => loadMessages(activeConv.id), 5000);
    return () => clearInterval(pollRef.current);
  }, [activeConv?.id]);

  const loadMessages = (motherId) => {
    messagesApi.getConversation(motherId, doctorId)
      .then(r => {
        setMessages(r.data);
        // Mark unread messages as read
        r.data.filter(m => !m.isRead && !m.sentByDoctor)
          .forEach(m => messagesApi.markRead(m.id));
        // Update unread count in sidebar
        setConversations(prev => prev.map(c =>
          c.id === motherId ? { ...c, unreadCount: 0 } : c
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
        motherId: activeConv.id,
        doctorId,
        content,
        sentByDoctor: true,
      });
      setMessages(prev => [...prev, res.data]);
      setConversations(prev => {
        const exists = prev.find(c => c.id === activeConv.id);
        if (exists) {
          return prev.map(c =>
            c.id === activeConv.id ? { ...c, lastMessage: content, lastMessageAt: new Date().toISOString() } : c
          );
        }
        return [{
          id: activeConv.id,
          name: activeConv.name,
          image: activeConv.image,
          phone: activeConv.phone,
          lastMessage: content,
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0
        }, ...prev];
      });
    } catch {}
    setSending(false);
  };

  const filtered = conversations.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (a.lastMessageAt && b.lastMessageAt) return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
    if (a.lastMessageAt) return -1;
    if (b.lastMessageAt) return 1;
    return a.name?.localeCompare(b.name);
  });

  const formatTime = (dt) => {
    if (!dt) return '';
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
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
              Live Chat Status
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-card overflow-hidden flex h-[750px]">
          {/* Sidebar */}
          <div className="w-[380px] border-r border-gray-100 flex flex-col bg-white shrink-0">
            <div className="p-8 border-b border-gray-50 space-y-5">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black text-mamacare-teal uppercase tracking-[0.25em]">Patient Messages</p>
              </div>
            <div className="relative">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-mamacare-teal/5 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
            {loading ? (
              <div className="p-8 space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50" />
                    <div className="flex-1 space-y-2 pt-2">
                      <div className="h-3 bg-gray-50 rounded w-1/2" />
                      <div className="h-2 bg-gray-50 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 px-10 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={32} className="text-gray-200" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-gray-400">No matches found</p>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">We couldn't find any patients matching your search criteria.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map(conv => (
                    <button key={conv.id} onClick={() => handleSelectConv(conv)}
                      className={`w-full p-6 text-left flex items-start gap-5 transition-all duration-200 border-l-4 border-t-0 border-b-0 border-r-0 ${activeConv?.id === conv.id ? 'bg-mamacare-teal/8 border-l-mamacare-teal' : 'hover:bg-gray-50/80 border-l-transparent'}`}>
                      <div className="relative shrink-0">
                        <div className={`w-14 h-14 rounded-2xl bg-teal-50 text-mamacare-teal flex items-center justify-center font-bold text-xl overflow-hidden shadow-sm border-2 border-white`}>
                          {conv.image
                            ? <img src={conv.image} alt={conv.name} className="w-full h-full object-cover" />
                            : <span>{conv.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                          }
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-[14px] truncate tracking-tight ${conv.unreadCount > 0 ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>{conv.name}</span>
                          {conv.lastMessageAt && <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest shrink-0 ml-2">{formatTime(conv.lastMessageAt)}</span>}
                        </div>
                        <p className={`text-[12px] truncate leading-relaxed ${conv.unreadCount > 0 ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                          {conv.lastMessage || (conv.source === 'roster' ? 'New patient assigned' : 'Start consultation')}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="px-2 py-1 bg-orange-500 text-white text-[9px] font-black rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-orange-500/20">{conv.unreadCount}</span>
                      )}
                    </button>
                ))}
              </div>
            )}
          </div>
        </div>

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
              <div className="h-24 border-b border-gray-50 px-10 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-3xl bg-teal-50 text-mamacare-teal flex items-center justify-center overflow-hidden shrink-0 shadow-md ring-4 ring-white group-hover:rotate-3 transition-transform duration-500">
                      {activeConv.image
                        ? <img src={activeConv.image} alt={activeConv.name} className="w-full h-full object-cover" />
                        : <span className="text-2xl font-black">{activeConv.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                      }
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-[18px]">{activeConv.name}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{activeConv.phone || 'Patient'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {activeConv.phone && (
                    <a href={`tel:${activeConv.phone}`}
                      className="w-12 h-12 bg-white border border-gray-100 text-gray-600 rounded-2xl flex items-center justify-center hover:text-mamacare-teal hover:border-mamacare-teal/20 hover:bg-teal-50 shadow-sm transition-all hover:scale-110 active:scale-95 group"
                      title={`Call ${activeConv.name}`}>
                      <Phone size={20} className="group-hover:rotate-12 transition-transform" />
                    </a>
                  )}
                  <button className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-all">
                    <Search size={20} />
                  </button>
                </div>
              </div>

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
                  const isMe = isDoctor;
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
                        {!isMe && (
                          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-mamacare-teal flex items-center justify-center text-[10px] font-black shrink-0 overflow-hidden shadow-sm border-2 border-white group-hover:rotate-6 transition-transform">
                            {activeConv.image
                              ? <img src={activeConv.image} alt="" className="w-full h-full object-cover" />
                              : <span>{activeConv.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                            }
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
