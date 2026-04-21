import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import AdminFooter from '../../components/layout/AdminFooter';
import { BarChart3, Heart, Plus, Edit2, Trash2 } from 'lucide-react';
import { adminApi, libraryApi, doctorsApi } from '../../api/services';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [queue, setQueue] = useState([]);
  const [articles, setArticles] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    adminApi.getStats().then(r => setStats(r.data)).catch(() => {});
    adminApi.getVerificationQueue().then(r => setQueue(r.data)).catch(() => {});
    libraryApi.getAll().then(r => setArticles(r.data)).catch(() => {});
  }, []);

  const handleVerify = async (id) => {
    await doctorsApi.verify(id);
    setQueue(q => q.filter(d => d.id !== id));
    setStats(s => s ? { ...s, pendingDoctors: s.pendingDoctors - 1 } : s);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">
        <div className="flex justify-between items-end gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">SYSTEM ADMINISTRATION</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Central Oversight</h1>
          </div>
          <button className="bg-mamacare-teal text-white px-10 py-5 rounded-2xl font-bold text-sm shadow-xl shadow-mamacare-teal/20 transition-all hover:bg-mamacare-teal-dark active:scale-[0.98]">
            Generate Reports
          </button>
        </div>

        {/* Live Stats */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Total Mothers', value: stats.totalMothers, color: 'bg-teal-50 text-mamacare-teal', path: '/patients' },
              { label: 'Total Doctors', value: stats.totalDoctors, color: 'bg-blue-50 text-blue-500', path: '/admin/doctors' },
              { label: 'Pending Verification', value: stats.pendingDoctors, color: 'bg-orange-50 text-orange-500', path: '#queue' },
              { label: 'High Risk Mothers', value: stats.highRiskMothers, color: 'bg-red-50 text-red-500', path: '/patients' },
            ].map((s, i) => (
              <Link key={i} to={s.path} className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card flex items-center justify-between hover:scale-[1.02] hover:shadow-2xl transition-all cursor-pointer group">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-mamacare-teal transition-colors">{s.label}</p>
                  <h3 className="text-5xl font-extrabold text-gray-900 tracking-tighter">{s.value}</h3>
                </div>
                <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                  <BarChart3 size={24} />
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 bg-white rounded-[3rem] p-12 border border-white shadow-card space-y-12">
            <h3 className="text-2xl font-bold text-gray-900">User Growth Dynamics</h3>
            <div className="flex items-end justify-between h-[300px] gap-2 pt-10 px-4">
              {[{ m: 'JAN', h1: 40, h2: 30 }, { m: 'FEB', h1: 50, h2: 45 }, { m: 'MAR', h1: 65, h2: 50 }, { m: 'APR', h1: 55, h2: 40 }, { m: 'MAY', h1: 45, h2: 35 }, { m: 'JUN', h1: 75, h2: 55 }, { m: 'JUL', h1: 60, h2: 45 }, { m: 'AUG', h1: 50, h2: 40 }, { m: 'SEP', h1: 85, h2: 60 }].map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full flex justify-center gap-1 h-[250px] items-end">
                    <div className="w-6 bg-gray-50 rounded-t-lg" style={{ height: `${d.h2}%` }}></div>
                    <div className="w-10 bg-mamacare-teal rounded-t-lg shadow-lg shadow-mamacare-teal/10" style={{ height: `${d.h1}%` }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{d.m}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#FCE4EC] rounded-[2.5rem] p-10 space-y-12 shadow-card">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pink-400 shadow-sm"><BarChart3 size={20} /></div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-900">Average Response Time</h4>
                <span className="text-5xl font-extrabold text-gray-900 tracking-tighter">14.2m</span>
              </div>
            </div>
            <div className="bg-[#E0F2F1] rounded-[2.5rem] p-10 space-y-12 shadow-card">
              <div className="w-12 h-12 bg-[#005C5C] rounded-2xl flex items-center justify-center text-white"><Heart size={20} fill="currentColor" /></div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-900">Maternal Trust Score</h4>
                <span className="text-5xl font-extrabold text-gray-900 tracking-tighter">98.4%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 pt-10">
          {/* Verification Queue — live from API */}
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Doctor Verification Queue</h2>
              <span className="px-4 py-1.5 bg-[#005C5C] text-white text-[10px] font-extrabold rounded-full">{queue.length} PENDING</span>
            </div>
            <div className="space-y-4">
              {queue.length === 0 && <p className="text-gray-400 font-medium text-sm">No pending verifications.</p>}
              {queue.map(doc => (
                <div key={doc.id} className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card flex items-center justify-between group hover:shadow-2xl transition-all">
                  <div className="flex items-center gap-6">
                    <img src={doc.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.fullName)}&background=005C5C&color=fff`} alt={doc.fullName} className="w-16 h-16 rounded-3xl object-cover ring-4 ring-gray-50" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900">{doc.fullName}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleVerify(doc.id)} className="bg-teal-50 text-mamacare-teal border border-mamacare-teal/20 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-mamacare-teal hover:text-white transition-all">
                      Verify
                    </button>
                    <button className="bg-gray-50 text-gray-400 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-400 transition-all">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Library CMS — live from API */}
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Health Library CMS</h2>
              <button onClick={() => navigate('/admin/library')} className="flex items-center gap-2 text-mamacare-teal font-bold text-[10px] uppercase tracking-widest border-b border-mamacare-teal/20 pb-0.5">
                <Plus size={16} />New Article
              </button>
            </div>
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-white shadow-card">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Article Title</th>
                    <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Updated</th>
                    <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((item, i) => (
                    <tr key={i} className="group border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-all">
                      <td className="p-8">
                        <p className="font-bold text-gray-900 group-hover:text-mamacare-teal transition-colors">{item.title}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category: {item.category}</p>
                      </td>
                      <td className="p-8">
                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest ${item.status === 'Published' ? 'bg-teal-50 text-mamacare-teal' : 'bg-gray-100 text-gray-400'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-8 text-sm font-bold text-gray-400">
                        {new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <button onClick={() => navigate('/admin/library')} className="p-2 text-gray-300 hover:text-mamacare-teal transition-all"><Edit2 size={16} /></button>
                          <button onClick={() => navigate('/admin/library')} className="p-2 text-gray-300 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <AdminFooter />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
