import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { articleRequestsApi } from '../../api/services';
import { MessageSquarePlus, Clock, CheckCircle, XCircle } from 'lucide-react';

const STATUS_STYLES = {
  Pending:   { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: <Clock size={14} /> },
  Reviewed:  { bg: 'bg-green-50',  text: 'text-green-700',  icon: <CheckCircle size={14} /> },
  Dismissed: { bg: 'bg-gray-100',  text: 'text-gray-500',   icon: <XCircle size={14} /> },
};

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
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#005C5C]/10 rounded-xl flex items-center justify-center">
            <MessageSquarePlus size={20} className="text-[#005C5C]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Article Requests</h1>
            <p className="text-gray-400 text-sm">Topics suggested by mothers</p>
          </div>
          <span className="ml-auto bg-[#005C5C] text-white text-xs font-bold px-3 py-1 rounded-full">
            {requests.filter(r => r.status === 'Pending').length} pending
          </span>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {['All', 'Pending', 'Reviewed', 'Dismissed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === f ? 'bg-[#005C5C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <MessageSquarePlus size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No requests yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(req => {
              const style = STATUS_STYLES[req.status] || STATUS_STYLES.Pending;
              return (
                <div key={req.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-base">{req.topic}</h3>
                        {req.category && (
                          <span className="px-2 py-0.5 bg-[#005C5C]/10 text-[#005C5C] text-xs font-semibold rounded-md">{req.category}</span>
                        )}
                      </div>
                      {req.description && <p className="text-gray-500 text-sm mb-3 line-clamp-2">{req.description}</p>}
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="font-medium text-gray-600">{req.submittedByName}</span>
                        <span>·</span>
                        <span>{req.submittedByEmail}</span>
                        <span>·</span>
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
                        {style.icon} {req.status}
                      </span>
                      {req.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(req.id, 'Reviewed')}
                            className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-100 transition-colors">
                            Mark Reviewed
                          </button>
                          <button onClick={() => updateStatus(req.id, 'Dismissed')}
                            className="px-3 py-1.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">
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
