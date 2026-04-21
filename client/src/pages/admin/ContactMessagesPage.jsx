import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { contactMessagesApi } from '../../api/services';
import { Mail, MailOpen, Clock } from 'lucide-react';

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
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#005C5C]/10 rounded-xl flex items-center justify-center">
            <Mail size={20} className="text-[#005C5C]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Contact Messages</h1>
            <p className="text-gray-400 text-sm">Messages submitted via the Contact Support page</p>
          </div>
          {unreadCount > 0 && (
            <span className="ml-auto bg-[#005C5C] text-white text-xs font-bold px-3 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {['All', 'Unread', 'Read'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === f ? 'bg-[#005C5C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Mail size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(msg => (
              <div key={msg.id}
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${!msg.isRead ? 'border-[#005C5C]/30' : 'border-gray-100'}`}>
                {/* Header row */}
                <button onClick={() => handleExpand(msg)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${!msg.isRead ? 'bg-[#005C5C]/10 text-[#005C5C]' : 'bg-gray-100 text-gray-400'}`}>
                    {msg.isRead ? <MailOpen size={16} /> : <Mail size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-sm ${!msg.isRead ? 'text-gray-900' : 'text-gray-600'}`}>{msg.name}</span>
                      <span className="text-gray-300 text-xs">·</span>
                      <span className="text-gray-400 text-xs">{msg.email}</span>
                      {!msg.isRead && <span className="w-2 h-2 bg-[#005C5C] rounded-full" />}
                    </div>
                    <p className={`text-sm truncate ${!msg.isRead ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>{msg.subject}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                    <Clock size={12} />
                    {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </button>

                {/* Expanded message */}
                {expanded?.id === msg.id && (
                  <div className="px-5 pb-5 border-t border-gray-50">
                    <div className="pt-4 space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Subject</p>
                        <p className="text-sm font-semibold text-gray-800">{msg.subject}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Message</p>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-[#005C5C] text-white text-xs font-bold rounded-xl hover:bg-[#004848] transition-colors">
                        <Mail size={13} /> Reply via Email
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
