import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { contactMessagesApi } from '../../api/services';
import { Mail, MailOpen, Clock, ChevronDown } from 'lucide-react';

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    contactMessagesApi.getAll()
      .then(r => setMessages(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    await contactMessagesApi.markRead(id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const handleExpand = (msg) => {
    setExpanded(expanded?.id === msg.id ? null : msg);
    if (!msg.isRead) markRead(msg.id);
  };

  const filtered = filter === 'All' ? messages
    : filter === 'Unread' ? messages.filter(m => !m.isRead)
    : messages.filter(m => m.isRead);

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-12 animate-in slide-in-from-bottom-4 duration-700">
        {/* High-Fidelity Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10 font-poppins">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">SUPPORT DESK</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Contact Messages</h1>
          </div>
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <div className="bg-orange-50 text-orange-500 px-6 py-3 rounded-xl font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                 <Mail size={18} />
                 {unreadCount} Unread
              </div>
            )}
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="flex justify-start mb-6">
          <div className="relative w-48">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-6 pr-10 py-2.5 bg-white border border-mamacare-teal/20 rounded-full text-[11px] font-bold uppercase tracking-widest text-gray-700 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20 appearance-none shadow-sm cursor-pointer hover:border-mamacare-teal transition-all"
            >
              <option value="All">All Messages</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-mamacare-teal">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-[2.5rem] animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Mail size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-sm font-poppins">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4 font-poppins">
            {filtered.map(msg => (
              <div key={msg.id}
                className={`bg-white border rounded-[2rem] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all ${!msg.isRead ? 'border-mamacare-teal/30' : 'border-gray-100'}`}>
                {/* Header row */}
                <button onClick={() => handleExpand(msg)}
                  className="w-full flex items-center gap-6 p-6 md:p-8 text-left hover:bg-gray-50/50 transition-colors group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${!msg.isRead ? 'bg-mamacare-teal/10 text-mamacare-teal' : 'bg-gray-100 text-gray-400 group-hover:text-mamacare-teal group-hover:bg-teal-50'}`}>
                    {msg.isRead ? <MailOpen size={20} /> : <Mail size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`text-lg transition-colors ${!msg.isRead ? 'font-bold text-gray-900 group-hover:text-mamacare-teal' : 'font-semibold text-gray-600 group-hover:text-gray-900'}`}>{msg.name}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{msg.email}</span>
                      {!msg.isRead && <span className="px-3 py-1 bg-orange-50 text-orange-500 text-[10px] font-bold uppercase tracking-widest rounded-full">New</span>}
                    </div>
                    <p className={`text-base truncate transition-colors ${!msg.isRead ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>{msg.subject}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                     <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                       <Clock size={14} />
                       {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                     </div>
                  </div>
                </button>

                {/* Expanded message */}
                {expanded?.id === msg.id && (
                  <div className="px-8 pb-8 pt-4 border-t border-gray-50/50 bg-gray-50/30">
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-bold text-mamacare-teal uppercase tracking-widest mb-2">Subject</p>
                        <p className="text-base font-bold text-gray-900">{msg.subject}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-mamacare-teal uppercase tracking-widest mb-2">Message</p>
                        <p className="text-sm font-medium text-gray-600 leading-relaxed whitespace-pre-wrap bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">{msg.message}</p>
                      </div>
                      <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-mamacare-teal text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-mamacare-teal-dark shadow-lg shadow-mamacare-teal/20 transition-all hover:scale-105 active:scale-95">
                        <Mail size={16} /> Reply via Email
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContactMessagesPage;
