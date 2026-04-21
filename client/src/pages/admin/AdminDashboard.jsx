import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import AdminFooter from '../../components/layout/AdminFooter';
import { BarChart3, Heart, Plus, Edit2, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  const CATEGORY_THEMES = {
    Nutrition: { bg: 'bg-[#FFEBEE]', text: 'text-[#E91E63]', label: 'Nutrition' },
    Safety: { bg: 'bg-[#FFF3E0]', text: 'text-[#EF6C00]', label: 'Safety' },
    Fitness: { bg: 'bg-[#F3E5F5]', text: 'text-[#7B1FA2]', label: 'Wellness' },
    MentalHealth: { bg: 'bg-[#F3E5F5]', text: 'text-[#7B1FA2]', label: 'Wellness' },
    Default: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Other' }
  };

  const growthData = [
    { day: 'Tue', registrations: 190 },
    { day: 'Wed', registrations: 140 },
    { day: 'Thu', registrations: 180 },
    { day: 'Fri', registrations: 210 },
    { day: 'Sat', registrations: 260 },
    { day: 'Sun', registrations: 220 },
    { day: 'Mon', registrations: 250 },
  ];

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
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-lg shadow-sm">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                Live System Status
              </span>
            </div>
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
                className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[13px] font-medium text-gray-700 ">
                      {s.label}
                    </span>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-gray-50 ${s.color}`}>
                      {s.trend}
                    </div>
                  </div>
                  
                  <h3 className="text-4xl font-bold text-gray-900 tracking-tight">
                    {s.value}
                  </h3>

                  <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
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
          {/* High-Fidelity Area Chart (Platform Growth) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-10 border border-gray-100 shadow-sm space-y-10 group overflow-hidden relative">
            <div className="flex justify-between items-center relative z-10">
              <div className="space-y-1 pt-2">
                <span className="text-[9px] font-black text-mamacare-teal uppercase tracking-[0.2em]">PLATFORM TRENDS</span>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Enrollment Trends</h3>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-100 shadow-sm text-nowrap">
                <Calendar size={14} className="text-mamacare-teal" />
                Last 7 Days
              </div>
            </div>

            <div className="h-[300px] w-full pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#005C5C" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#005C5C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: '1px solid #f1f5f9',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                    labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                    itemStyle={{ color: '#005C5C' }}
                  />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    dy={15}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="registrations" 
                    stroke="#005C5C" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorTeal)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center gap-8 pt-8 border-t border-gray-50">
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-mamacare-teal shadow-lg shadow-mamacare-teal/20" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Registrations</span>
               </div>
               <div className="flex items-center gap-2 text-mamacare-teal">
                  <TrendingUp size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">+24% Increase</span>
               </div>
            </div>
          </div>

          {/* Secondary Column: Risk Distribution (Restored Pie Chart) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-10 border border-gray-100 shadow-sm space-y-8 flex flex-col items-center">
            <div className="w-full text-left space-y-1">
              <span className="text-[9px] font-black text-mamacare-teal uppercase tracking-[0.2em]">PATIENT ACUITY</span>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Risk Analysis</h3>
            </div>
            
            {/* Compact Donut Chart */}
            <div className="relative w-48 h-48 transition-transform duration-700 hover:scale-105">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f9fafb" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#005C5C" strokeWidth="12" strokeDasharray="150.8 251.2" className="transition-all duration-1000" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f97316" strokeWidth="12" strokeDasharray="70.4 251.2" strokeDashoffset="-150.8" className="transition-all duration-1000" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f87171" strokeWidth="12" strokeDasharray="30.1 251.2" strokeDashoffset="-221.2" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">12%</span>
                <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">High Risk</span>
              </div>
            </div>

            {/* Legend - Vertical Stacking for Sidebar */}
            <div className="w-full space-y-4">
              {[
                { label: 'Stable', value: '60%', color: 'bg-mamacare-teal', text: 'text-mamacare-teal' },
                { label: 'Moderate', value: '28%', color: 'bg-orange-500', text: 'text-orange-500' },
                { label: 'High Risk', value: '12%', color: 'bg-red-400', text: 'text-red-400' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className={`text-[10px] font-black ${item.text}`}>{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: item.value }} />
                  </div>
                </div>
              ))}
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
                <div key={doc.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:border-mamacare-teal/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden ring-2 ring-gray-50 group-hover:ring-mamacare-teal/10 transition-all">
                      <img src={doc.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.fullName)}&background=005C5C&color=fff`} alt={doc.fullName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-mamacare-teal transition-colors">{doc.fullName}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleVerify(doc.id)} className="bg-mamacare-teal text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-mamacare-teal-dark shadow-lg shadow-mamacare-teal/10 transition-all">
                      Approve
                    </button>
                    <button className="bg-white border border-gray-100 text-gray-400 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-gray-50 pb-6">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-mamacare-teal uppercase tracking-[0.2em]">CONTENT MANAGEMENT</span>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Library CMS</h2>
              </div>
              <button onClick={() => navigate('/admin/library')} className="text-mamacare-teal font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity bg-teal-50 px-4 py-2 rounded-lg">
                <Plus size={16} /> New Article
              </button>
            </div>
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm font-poppins">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="p-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Title</th>
                    <th className="p-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Status</th>
                    <th className="p-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {articles.slice(0, 4).map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50/30 transition-all">
                      <td className="p-6">
                        <p className="font-medium text-gray-900 text-sm leading-snug">{item.title}</p>
                        <div className="mt-2">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${CATEGORY_THEMES[item.category]?.bg || CATEGORY_THEMES.Default.bg} ${CATEGORY_THEMES[item.category]?.text || CATEGORY_THEMES.Default.text}`}>
                            {CATEGORY_THEMES[item.category]?.label || item.category}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${item.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate('/admin/library')} className="text-mamacare-teal hover:scale-110 transition-all"><Edit2 size={14} /></button>
                          <button onClick={() => navigate('/admin/library')} className="text-red-500 hover:scale-110 transition-all"><Trash2 size={14} /></button>
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
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
