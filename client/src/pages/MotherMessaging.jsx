import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { messagesApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { Send, CheckCheck, MessageSquare, ChevronLeft, Phone } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-poppins">
      <Navbar />
      <main className="pt-32 pb-20 max-w-5xl mx-auto px-4">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-[#005C5C] transition-colors mb-6">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex h-[600px]">

          {/* Doctor list sidebar */}
          <div className="w-[280px] border-r border-gray-100 flex flex-col bg-gray-50/50 shrink-0">
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Doctors</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-4 flex gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : doctors.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-xs">No doctors available</div>
              ) : (
                doctors.map(doc => (
                  <button key={doc.doctorId} onClick={() => handleSelectDoctor(doc)}
                    className={`w-full p-4 border-b border-gray-50 text-left flex items-start gap-3 transition-all hover:bg-white ${activeDoctor?.doctorId === doc.doctorId ? 'bg-white border-l-4 border-l-[#005C5C]' : 'border-l-4 border-l-transparent'}`}>
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-[#005C5C] flex items-center justify-center shrink-0 overflow-hidden">
                      {doc.doctorImage
                        ? <img src={doc.doctorImage} alt={doc.doctorName} className="w-full h-full object-cover" />
                        : <span className="font-bold text-sm">{doc.doctorName?.split(' ').filter(w => w !== 'Dr.').map(n => n[0]).join('').slice(0, 2)}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={`text-sm truncate ${doc.unreadCount > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{doc.doctorName}</span>
                        {doc.lastMessageAt && <span className="text-[10px] text-gray-400 shrink-0 ml-1">{formatTime(doc.lastMessageAt)}</span>}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{doc.lastMessage || doc.specialty}</p>
                    </div>
                    {doc.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-[#005C5C] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">{doc.unreadCount}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          {!activeDoctor ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
              <MessageSquare size={48} className="opacity-20" />
              <p className="font-semibold text-sm">Select a doctor to start messaging</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="h-16 border-b border-gray-100 px-6 flex items-center gap-3 bg-white shrink-0">
                <div className="w-9 h-9 rounded-full bg-teal-100 text-[#005C5C] flex items-center justify-center overflow-hidden shrink-0">
                  {activeDoctor.doctorImage
                    ? <img src={activeDoctor.doctorImage} alt={activeDoctor.doctorName} className="w-full h-full object-cover" />
                    : <span className="font-bold text-sm">{activeDoctor.doctorName?.split(' ').filter(w => w !== 'Dr.').map(n => n[0]).join('').slice(0, 2)}</span>
                  }
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm leading-tight">{activeDoctor.doctorName}</p>
                  <p className="text-[10px] text-gray-400">{activeDoctor.specialty}</p>
                </div>
                {activeDoctor.doctorPhone && (
                  <a href={`tel:${activeDoctor.doctorPhone}`}
                    className="w-9 h-9 bg-green-50 text-green-600 rounded-full flex items-center justify-center hover:bg-green-100 transition-colors"
                    title={`Call ${activeDoctor.doctorName}`}>
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
                  const isMe = !msg.sentByDoctor;
                  const showDate = i === 0 || new Date(msg.sentAt).toDateString() !== new Date(messages[i - 1].sentAt).toDateString();
                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <div className="text-center">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                            {new Date(msg.sentAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                      <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && (
                          <div className="w-7 h-7 rounded-full bg-teal-100 text-[#005C5C] flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                            {activeDoctor.doctorImage
                              ? <img src={activeDoctor.doctorImage} alt="" className="w-full h-full object-cover" />
                              : <span>{activeDoctor.doctorName?.split(' ').filter(w => w !== 'Dr.').map(n => n[0]).join('').slice(0, 2)}</span>
                            }
                          </div>
                        )}
                        <div className={`max-w-xs px-4 py-3 rounded-2xl ${isMe ? 'bg-[#005C5C] text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'}`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                            <span className={`text-[10px] ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                              {new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <CheckCheck size={12} className={msg.isRead ? 'text-teal-300' : 'text-white/40'} />}
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
                    placeholder="Type a message..."
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
      </main>
      <Footer />
    </div>
  );
};

export default MotherMessaging;
