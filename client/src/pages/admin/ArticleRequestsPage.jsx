import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { articleRequestsApi } from '../../api/services';
import { MessageSquarePlus, Clock, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

const STATUS_STYLES = {
  Pending:   { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: <Clock size={14} /> },
  Reviewed:  { bg: 'bg-green-50',  text: 'text-green-700',  icon: <CheckCircle size={14} /> },
  Dismissed: { bg: 'bg-gray-100',  text: 'text-gray-500',   icon: <XCircle size={14} /> },
};

const CATEGORY_COLORS = {
  Nutrition: 'bg-[#FFEBEE] text-[#E91E63]',
  Safety: 'bg-[#FFF3E0] text-[#EF6C00]',
  MentalHealth: 'bg-[#F3E5F5] text-[#7B1FA2]',
  FetalDevelopment: 'bg-[#E0F2F1] text-[#00796B]',
  Fitness: 'bg-[#E3F2FD] text-[#1565C0]',
  Postpartum: 'bg-[#FFF8E1] text-[#F57F17]',
  Default: 'bg-gray-100 text-gray-600'
};
const CATEGORY_LABELS = { Nutrition: 'Nutrition', Safety: 'Safety', MentalHealth: 'Wellness', FetalDevelopment: 'Fetal Development', Fitness: 'Fitness', Postpartum: 'Postpartum' };

const ArticleRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const load = () => {
    articleRequestsApi.getAll()
      .then(r => setRequests(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await articleRequestsApi.updateStatus(id, status);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-12 animate-in slide-in-from-bottom-4 duration-700">
        {/* High-Fidelity Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10 font-poppins">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">USER FEEDBACK</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Article Requests</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-mamacare-teal/10 text-mamacare-teal px-6 py-3 rounded-xl font-bold text-sm tracking-widest uppercase flex items-center gap-2">
               <MessageSquarePlus size={18} />
               {requests.filter(r => r.status === 'Pending').length} Pending
            </div>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="flex justify-start">
          <div className="relative w-48">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-6 pr-10 py-2.5 bg-white border border-mamacare-teal/20 rounded-full text-[11px] font-bold uppercase tracking-widest text-gray-700 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20 appearance-none shadow-sm cursor-pointer hover:border-mamacare-teal transition-all"
            >
              <option value="All">All Requests</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Dismissed">Dismissed</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-mamacare-teal">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {Array(4).fill(0).map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-[2.5rem] animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <MessageSquarePlus size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-sm font-poppins">No requests yet</p>
          </div>
        ) : (
          <div className="space-y-6 font-poppins">
            {filtered.map(req => {
              const style = STATUS_STYLES[req.status] || STATUS_STYLES.Pending;
              const categoryColor = CATEGORY_COLORS[req.category] || CATEGORY_COLORS.Default;
              const categoryLabel = CATEGORY_LABELS[req.category] || req.category;
              
              return (
                <div key={req.id} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg hover:border-mamacare-teal/20 transition-all group">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-mamacare-teal transition-colors">{req.topic}</h3>
                        {req.category && (
                          <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${categoryColor}`}>
                            {categoryLabel}
                          </span>
                        )}
                      </div>
                      {req.description && <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2 font-medium">{req.description}</p>}
                      <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                        <span className="text-gray-600">{req.submittedByName}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{req.submittedByEmail}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${style.bg} ${style.text}`}>
                        {style.icon} {req.status}
                      </span>
                      {req.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(req.id, 'Reviewed')}
                            className="px-4 py-2 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-green-100 transition-colors">
                            Mark Reviewed
                          </button>
                          <button onClick={() => updateStatus(req.id, 'Dismissed')}
                            className="px-4 py-2 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors">
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ArticleRequestsPage;
