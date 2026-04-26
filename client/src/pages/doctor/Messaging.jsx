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
    <DoctorLayout title="Secure Messaging" subtitle="Communicate with your patients securely.">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex h-[640px]">

        {/* Sidebar */}
        <div className="w-[320px] border-r border-gray-100 flex flex-col bg-gray-50/50 shrink-0">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search patients..."
                className="w-full h-10 bg-white border border-gray-200 rounded-xl pl-9 pr-3 text-sm focus:outline-none focus:border-[#005C5C] transition-colors" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="p-4 flex gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                No conversations yet
              </div>
            ) : (
              filtered.map(conv => (
                <button key={conv.motherId} onClick={() => handleSelectConv(conv)}
                  className={`w-full p-4 border-b border-gray-50 text-left flex items-start gap-3 transition-all hover:bg-white ${activeConv?.motherId === conv.motherId ? 'bg-white border-l-4 border-l-[#005C5C]' : 'border-l-4 border-l-transparent'}`}>
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-[#005C5C] flex items-center justify-center shrink-0 overflow-hidden">
                    {avatar(conv.motherName, conv.motherImage)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{conv.motherName}</span>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-1">{formatTime(conv.lastMessageAt)}</span>
                    </div>
                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-400'}`}>{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-[#005C5C] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">{conv.unreadCount}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        {!activeConv ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <MessageSquare size={48} className="opacity-20" />
            <p className="font-semibold">Select a conversation</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="h-16 border-b border-gray-100 px-6 flex items-center gap-3 bg-white shrink-0">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-[#005C5C] flex items-center justify-center overflow-hidden">
                {avatar(activeConv.motherName, activeConv.motherImage)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm leading-tight">{activeConv.motherName}</p>
                <p className="text-[10px] text-gray-400">Patient</p>
              </div>
              {activeConv.motherPhone && (
                <a href={`tel:${activeConv.motherPhone}`}
                  className="w-9 h-9 bg-green-50 text-green-600 rounded-full flex items-center justify-center hover:bg-green-100 transition-colors"
                  title={`Call ${activeConv.motherName}`}>
                  <Phone size={16} />
                </a>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
              {messages.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-10">No messages yet. Say hello!</p>
              )}
              {messages.map((msg, i) => {
                const isDoctor = msg.sentByDoctor;
                const showTime = i === 0 || new Date(msg.sentAt).toDateString() !== new Date(messages[i - 1].sentAt).toDateString();
                return (
                  <React.Fragment key={msg.id}>
                    {showTime && (
                      <div className="text-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                          {new Date(msg.sentAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                    <div className={`flex items-end gap-2 ${isDoctor ? 'justify-end' : 'justify-start'}`}>
                      {!isDoctor && (
                        <div className="w-7 h-7 rounded-full bg-teal-100 text-[#005C5C] flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                          {avatar(activeConv.motherName, activeConv.motherImage)}
                        </div>
                      )}
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${isDoctor ? 'bg-[#005C5C] text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'}`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isDoctor ? 'justify-end' : ''}`}>
                          <span className={`text-[10px] ${isDoctor ? 'text-white/60' : 'text-gray-400'}`}>
                            {new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isDoctor && <CheckCheck size={12} className={msg.isRead ? 'text-teal-300' : 'text-white/40'} />}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 shrink-0">
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:border-[#005C5C] focus-within:bg-white transition-all">
                <input value={text} onChange={e => setText(e.target.value)}
                  placeholder="Type a secure message..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-900 outline-none" />
                <button type="submit" disabled={!text.trim() || sending}
                  className="w-9 h-9 bg-[#005C5C] text-white rounded-full flex items-center justify-center hover:bg-[#004848] transition-all disabled:opacity-40 shrink-0">
                  <Send size={15} className="translate-x-0.5 -translate-y-0.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default Messaging;
