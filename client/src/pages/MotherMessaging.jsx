import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { messagesApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { Send, CheckCheck, MessageSquare, ChevronLeft, Phone, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const MotherMessaging = () => {
  const { user } = useAuth();
  const motherId = user?.motherId;

  const [doctors, setDoctors] = useState([]);
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  // Load doctor list - only once per session
  useEffect(() => {
    if (!motherId) return;
    const cached = sessionStorage.getItem(`doctors_${motherId}`);
    if (cached) {
      setDoctors(JSON.parse(cached));
      setLoading(false);
      // Refresh in background
      messagesApi.getMotherConversation(motherId)
        .then(r => { setDoctors(r.data); sessionStorage.setItem(`doctors_${motherId}`, JSON.stringify(r.data)); })
        .catch(() => {});
      return;
    }
    messagesApi.getMotherConversation(motherId)
      .then(r => { setDoctors(r.data); sessionStorage.setItem(`doctors_${motherId}`, JSON.stringify(r.data)); setLoading(false); })
      .catch(() => setLoading(false));
  }, [motherId]);

  // Load messages when active doctor changes
  useEffect(() => {
    if (!activeDoctor) return;
    loadMessages(activeDoctor.doctorId);
    clearInterval(pollRef.current);
    pollRef.current = setInterval(() => loadMessages(activeDoctor.doctorId), 5000);
    return () => clearInterval(pollRef.current);
  }, [activeDoctor?.doctorId]);

  const loadMessages = (doctorId) => {
    messagesApi.getConversation(motherId, doctorId)
      .then(r => {
        setMessages(r.data);
        // Mark doctor messages as read
        r.data.filter(m => !m.isRead && m.sentByDoctor)
          .forEach(m => messagesApi.markRead(m.id));
        // Clear unread in sidebar
        setDoctors(prev => prev.map(d =>
          d.doctorId === doctorId ? { ...d, unreadCount: 0 } : d
        ));
      })
      .catch(() => {});
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectDoctor = (doc) => {
    setActiveDoctor(doc);
    setMessages([]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeDoctor || sending) return;
    setSending(true);
    const content = text.trim();
    setText('');
    try {
      const res = await messagesApi.send({
        motherId,
        doctorId: activeDoctor.doctorId,
        content,
        sentByDoctor: false,
      });
      setMessages(prev => [...prev, res.data]);
      setDoctors(prev => prev.map(d =>
        d.doctorId === activeDoctor.doctorId
          ? { ...d, lastMessage: content, lastMessageAt: new Date().toISOString() }
          : d
      ));
    } catch {}
    setSending(false);
  };

  const formatTime = (dt) => {
    if (!dt) return '';
    const d = new Date(dt);
    const now = new Date();
    if (d.toDateString() === now.toDateString())
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredDoctors = doctors.filter(d => d.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) || d.specialty?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-poppins">
      <Navbar />
      <main className="pt-32 pb-20 max-w-6xl mx-auto px-4">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-mamacare-teal transition-colors mb-6">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex h-[700px]">

          {/* Doctor list sidebar */}
          <div className="w-[320px] border-r border-gray-100 flex flex-col bg-gray-50/30 shrink-0">
            <div className="p-6 border-b border-gray-100 space-y-4 bg-white">
              <p className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">Your Doctors</p>
              <div className="relative">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search doctors..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-mamacare-teal/30 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-4 flex gap-3 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : filteredDoctors.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm font-medium">No doctors found</div>
              ) : (
                filteredDoctors.map(doc => (
                  <button key={doc.doctorId} onClick={() => handleSelectDoctor(doc)}
                    className={`w-full p-4 rounded-2xl text-left flex items-start gap-4 transition-all ${activeDoctor?.doctorId === doc.doctorId ? 'bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100' : 'hover:bg-gray-100/50 border border-transparent'}`}>
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 text-mamacare-teal flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                        {doc.doctorImage
                          ? <img src={doc.doctorImage} alt={doc.doctorName} className="w-full h-full object-cover" />
                          : <span className="font-bold text-base">{doc.doctorName?.split(' ').filter(w => w !== 'Dr.').map(n => n[0]).join('').slice(0, 2)}</span>
                        }
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm truncate ${doc.unreadCount > 0 ? 'font-bold text-gray-900' : 'font-bold text-gray-700'}`}>{doc.doctorName}</span>
                        {doc.lastMessageAt && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0 ml-2">{formatTime(doc.lastMessageAt)}</span>}
                      </div>
                      <p className={`text-xs truncate ${doc.unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>{doc.lastMessage || doc.specialty}</p>
                    </div>
                    {doc.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm shadow-orange-500/20">{doc.unreadCount}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          {!activeDoctor ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 bg-gray-50/10">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <MessageSquare size={32} className="text-gray-300" />
              </div>
              <p className="font-bold text-gray-500 text-sm tracking-wide">Select a conversation</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col bg-gray-50/10 relative">
              {/* Header */}
              <div className="h-20 border-b border-gray-100 px-8 flex items-center gap-4 bg-white/80 backdrop-blur-md shrink-0 absolute top-0 left-0 right-0 z-10">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-mamacare-teal flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {activeDoctor.doctorImage
                      ? <img src={activeDoctor.doctorImage} alt={activeDoctor.doctorName} className="w-full h-full object-cover" />
                      : <span className="font-bold text-base">{activeDoctor.doctorName?.split(' ').filter(w => w !== 'Dr.').map(n => n[0]).join('').slice(0, 2)}</span>
                    }
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-base leading-tight mb-0.5">{activeDoctor.doctorName}</p>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{activeDoctor.specialty}</p>
                </div>
                {activeDoctor.doctorPhone && (
                  <a href={`tel:${activeDoctor.doctorPhone}`}
                    className="w-10 h-10 bg-white border border-gray-100 text-gray-600 rounded-xl flex items-center justify-center hover:text-mamacare-teal hover:border-mamacare-teal/20 hover:bg-teal-50 shadow-sm transition-all"
                    title={`Call ${activeDoctor.doctorName}`}>
                    <Phone size={18} />
                  </a>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-8 pt-28 pb-32 space-y-6">
                {messages.length === 0 && (
                  <div className="text-center py-10">
                     <p className="text-gray-400 text-sm font-medium bg-white inline-block px-4 py-2 rounded-full border border-gray-100 shadow-sm">No messages yet. Say hello!</p>
                  </div>
                )}
                {messages.map((msg, i) => {
                  const isMe = !msg.sentByDoctor;
                  const showDate = i === 0 || new Date(msg.sentAt).toDateString() !== new Date(messages[i - 1].sentAt).toDateString();
                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <div className="text-center my-6">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white border border-gray-100 px-4 py-1.5 rounded-full shadow-sm">
                            {new Date(msg.sentAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                      <div className={`flex items-end gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && (
                          <div className="w-8 h-8 rounded-xl bg-teal-50 text-mamacare-teal flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden shadow-sm">
                            {activeDoctor.doctorImage
                              ? <img src={activeDoctor.doctorImage} alt="" className="w-full h-full object-cover" />
                              : <span>{activeDoctor.doctorName?.split(' ').filter(w => w !== 'Dr.').map(n => n[0]).join('').slice(0, 2)}</span>
                            }
                          </div>
                        )}
                        <div className={`max-w-[70%] px-5 py-3.5 ${isMe ? 'bg-gradient-to-tr from-mamacare-teal to-[#007A7A] text-white rounded-3xl rounded-br-sm shadow-lg shadow-mamacare-teal/20' : 'bg-white border border-gray-100 text-gray-700 rounded-3xl rounded-bl-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)]'}`}>
                          <p className="text-[14px] leading-relaxed font-medium">{msg.content}</p>
                          <div className={`flex items-center gap-1.5 mt-1.5 ${isMe ? 'justify-end' : ''}`}>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                              {new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <CheckCheck size={14} className={msg.isRead ? 'text-[#4ade80]' : 'text-white/40'} />}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
                <form onSubmit={handleSend} className="max-w-3xl mx-auto pointer-events-auto shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full">
                  <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-full pl-6 pr-2 py-2 focus-within:border-mamacare-teal focus-within:ring-4 focus-within:ring-mamacare-teal/10 transition-all">
                    <input value={text} onChange={e => setText(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400" />
                    <button type="submit" disabled={!text.trim() || sending}
                      className="w-12 h-12 bg-mamacare-teal text-white rounded-full flex items-center justify-center hover:bg-[#004848] transition-all disabled:opacity-40 disabled:hover:bg-mamacare-teal shrink-0 hover:scale-105 active:scale-95 shadow-md">
                      <Send size={18} className="translate-x-0.5 -translate-y-0.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MotherMessaging;
