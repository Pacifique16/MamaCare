import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import AdminFooter from '../../components/layout/AdminFooter';
import { BarChart3, Heart, Plus, Edit2, Trash2 } from 'lucide-react';
import { adminApi, libraryApi, doctorsApi } from '../../api/services';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [queue, setQueue] = useState([]);
  const [articles, setArticles] = useState([]);

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
      <div className="max-w-7xl mx-auto p-8 space-y-12 font-poppins animate-in fade-in duration-1000">
        
        {/* Restoration of Premium Branding */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">SYSTEM ADMINISTRATION</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Central Oversight</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
              Live System Status
            </span>
            <button className="bg-mamacare-teal text-white px-8 py-3 rounded-xl font-bold text-xs shadow-lg shadow-mamacare-teal/10 transition-all hover:bg-mamacare-teal-dark active:scale-[0.98]">
              Generate Report
            </button>
          </div>
        </div>

        {/* Live Stats Row - Realigned to SaaS standard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Mothers', value: stats.totalMothers.toLocaleString(), trend: '+12%', progress: '75%', color: 'text-mamacare-teal', path: '/patients' },
              { label: 'Total Doctors', value: stats.totalDoctors, trend: 'Stable', progress: '90%', color: 'text-blue-500', path: '/admin/doctors' },
              { label: 'Triage Success', value: '98.4%', trend: 'High', progress: '98%', color: 'text-teal-600', path: '/patients' },
              { label: 'Library Reach', value: '85k', trend: '+8%', progress: '15%', color: 'text-purple-500', path: '/admin/library' },
            ].map((s, i) => (
              <Link 
                key={i} 
                to={s.path} 
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {s.label}
                    </span>
                    <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-gray-50 ${s.color}`}>
                      {s.trend}
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {s.value}
                  </h3>

                  <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-mamacare-teal rounded-full"
                      style={{ width: s.progress }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-stretch font-poppins">
          {/* High-Fidelity Pie Chart (Risk Analysis) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-10 border border-gray-100 shadow-sm space-y-10 group overflow-hidden relative">
            <div className="flex justify-between items-center relative z-10">
              <div className="space-y-1 pt-2">
                <span className="text-[9px] font-black text-mamacare-teal uppercase tracking-[0.2em]">PATIENT ACUITY</span>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Risk Distribution</h3>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-100 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Analysis
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-around gap-12 py-10">
              {/* Premium Donut Chart */}
              <div className="relative w-64 h-64 shrink-0 transition-transform duration-700 group-hover:scale-105">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f9fafb" strokeWidth="12" />
                  
                  {/* Stable (60%) - Teal */}
                  <circle 
                    cx="50" cy="50" r="40" fill="transparent" 
                    stroke="#005C5C" strokeWidth="12" 
                    strokeDasharray="150.8 251.2" 
                    className="transition-all duration-1000"
                  />
                  
                  {/* Moderate (28%) - Orange-500 */}
                  <circle 
                    cx="50" cy="50" r="40" fill="transparent" 
                    stroke="#f97316" strokeWidth="12" 
                    strokeDasharray="70.4 251.2" 
                    strokeDashoffset="-150.8"
                    className="transition-all duration-1000"
                  />

                  {/* High Risk (12%) - Red-400 */}
                  <circle 
                    cx="50" cy="50" r="40" fill="transparent" 
                    stroke="#f87171" strokeWidth="12" 
                    strokeDasharray="30.1 251.2" 
                    strokeDashoffset="-221.2"
                    className="transition-all duration-1000"
                  />
                </svg>
                
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-extrabold text-gray-900 tracking-tight">842</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Monitored</span>
                </div>
              </div>

              {/* Data Legend */}
              <div className="flex-1 space-y-6 w-full md:max-w-xs">
                {[
                  { label: 'Low Risk / Stable', value: '60%', count: '505', color: 'bg-mamacare-teal', lightBg: 'bg-teal-50' },
                  { label: 'Moderate Monitoring', value: '28%', count: '236', color: 'bg-orange-500', lightBg: 'bg-orange-50' },
                  { label: 'High Risk / Critical', value: '12%', count: '101', color: 'bg-red-400', lightBg: 'bg-red-50' },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center justify-between p-4 rounded-2xl border border-gray-100/50 ${item.lightBg} shadow-sm transition-all hover:translate-x-1`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-[11px] font-bold text-gray-700">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-900">{item.value}</p>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{item.count} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Metrics - Color Optimized */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm flex flex-col justify-between h-[calc(50%-12px)] transition-all hover:bg-orange-50/20 group">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg Response Time</span>
                <h4 className="text-4xl font-bold text-gray-900 tracking-tight">14.2m</h4>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-orange-500 bg-orange-50 w-fit px-3 py-1 rounded-lg border border-orange-100 transition-all group-hover:scale-105">
                <span>-2.4m from last month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm flex flex-col justify-between h-[calc(50%-12px)] transition-all hover:bg-red-50/20 group">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Trust Score</span>
                <h4 className="text-4xl font-bold text-gray-900 tracking-tight">98.4%</h4>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-red-500 bg-red-50 w-fit px-3 py-1 rounded-lg border border-red-100 transition-all group-hover:scale-105">
                <span>Excellent Stability</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification and CMS Split */}
        <div className="grid lg:grid-cols-2 gap-8 pt-10 pb-20">
          {/* High-Fidelity Verification Header */}
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-gray-50 pb-6">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-mamacare-teal uppercase tracking-[0.2em]">CREDENTIAL REVIEW</span>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Verification Queue</h2>
              </div>
              <span className="px-3 py-1 bg-mamacare-teal/5 text-mamacare-teal text-[10px] font-extrabold rounded-lg border border-mamacare-teal/10">{queue.length} Tasks Pending</span>
            </div>
            <div className="space-y-3">
              {queue.length === 0 && (
                <div className="p-12 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                  <p className="text-gray-400 font-medium text-sm">All verifications completed.</p>
                </div>
              )}
              {queue.map(doc => (
                <div key={doc.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:border-mamacare-teal/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 overflow-hidden">
                      <img src={doc.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.fullName)}&background=005C5C&color=fff`} alt={doc.fullName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{doc.fullName}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleVerify(doc.id)} className="bg-mamacare-teal text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-mamacare-teal-dark transition-all">
                      Approve
                    </button>
                    <button className="bg-white border border-gray-100 text-gray-400 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High-Fidelity Library Header */}
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-gray-50 pb-6">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-mamacare-teal uppercase tracking-[0.2em]">CONTENT MANAGEMENT</span>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Library CMS</h2>
              </div>
              <button className="text-mamacare-teal font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity bg-teal-50 px-4 py-2 rounded-lg">
                <Plus size={16} /> New Article
              </button>
            </div>
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm font-poppins">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title</th>
                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {articles.slice(0, 4).map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50/30 transition-all">
                      <td className="p-6">
                        <p className="font-bold text-gray-900 text-sm leading-snug">{item.title}</p>
                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">{item.category}</p>
                      </td>
                      <td className="p-6">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${item.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <button className="text-gray-300 hover:text-mamacare-teal transition-colors"><Edit2 size={14} /></button>
                          <button className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-gray-50/30 border-t border-gray-50 text-center">
                 <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-mamacare-teal transition-colors">View All Content</button>
              </div>
            </div>
          </div>
        </div>

        <AdminFooter />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
