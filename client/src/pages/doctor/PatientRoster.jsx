import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../../components/layout/DoctorLayout';
import { 
  AlertTriangle, 
  Calendar, 
  Eye, 
  MessageSquare, 
  Plus, 
  X, 
  Search, 
  ChevronDown, 
  Activity, 
  Users, 
  ClipboardCheck, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { doctorsApi, mothersApi, appointmentsApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const riskColor = (risk) => ({
  High: { badge: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
  Medium: { badge: 'bg-orange-50 text-orange-600', dot: 'bg-orange-400' },
  Low: { badge: 'bg-teal-50 text-teal-600', dot: 'bg-teal-500' },
}[risk] || { badge: 'bg-gray-50 text-gray-400', dot: 'bg-gray-400' });

const PAGE_SIZE = 4;

const PatientRoster = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const doctorId = user?.doctorId || 1;
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log('Fetching roster for doctor:', doctorId);
    doctorsApi.getPatients(doctorId)
      .then(r => setPatients(r.data))
      .catch(err => {
        console.error('Failed to fetch roster:', err);
        toast.error('Could not load patient roster.');
      });
  }, [doctorId]);

  const highRisk = patients.filter(p => p.riskLevel === 'High').length;
  const dueThisMonth = patients.filter(p => {
    const due = new Date(p.expectedDueDate);
    const now = new Date();
    return due.getMonth() === now.getMonth() && due.getFullYear() === now.getFullYear();
  }).length;

  const [showModal, setShowModal] = useState(false);
  const [allMothers, setAllMothers] = useState([]);
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(null);

  const openModal = () => {
    setShowModal(true);
    setSearch('');
    mothersApi.getAll().then(r => setAllMothers(r.data)).catch(() => {});
  };

  const addPatient = async (mother) => {
    setAdding(mother.id);
    try {
      await appointmentsApi.create({
        motherId: mother.id,
        doctorId,
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'RoutineCheckup',
        status: 'Scheduled',
        notes: 'Initial consultation'
      });
      doctorsApi.getPatients(doctorId).then(r => setPatients(r.data)).catch(() => {});
      setShowModal(false);
      toast.success('Patient linked successfully!');
    } catch {
      toast.error('Failed to link patient.');
    }
    setAdding(null);
  };

  const filteredMothers = allMothers.filter(m =>
    m.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(patients.length / PAGE_SIZE));
  const paginatedPatients = patients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto space-y-12 font-poppins animate-in fade-in duration-1000 pb-20">
        
        {/* 1. Premium Branding Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">PATIENT CARE</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Patient Roster</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-lg shadow-sm">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                Active Surveillance
              </span>
            </div>
            <button 
              onClick={openModal}
              className="bg-mamacare-teal text-white px-8 py-3 rounded-xl font-bold text-[13px] shadow-lg shadow-mamacare-teal/10 transition-all hover:bg-[#004848] active:scale-[0.98] flex items-center gap-2"
            >
              <Plus size={18} />
              Add New Patient
            </button>
          </div>
        </div>

        {/* 2. High-Fidelity Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Total Patients', value: patients.length, change: 'Active prenatal files', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50', progress: '100%' },
            { title: 'High Risk', value: highRisk, change: 'Critical attention', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', progress: `${(highRisk / Math.max(1, patients.length)) * 100}%` },
            { title: 'Due This Month', value: dueThisMonth, change: 'Expected deliveries', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50', progress: `${(dueThisMonth / Math.max(1, patients.length)) * 100}%` },
            { title: 'Program Health', value: '98.2%', change: 'Compliance rate', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50', progress: '98.2%' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group relative overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[14px] font-semibold text-gray-700">{stat.title}</p>
                    <h3 className="text-4xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
                  </div>
                  <p className="text-[10px] font-medium text-gray-600 uppercase tracking-widest">{stat.change}</p>
                </div>
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <div className="absolute bottom-2 left-0 h-1.5 bg-gray-50/50 w-full">
                <div className={`h-full ${stat.color.replace('text', 'bg')} rounded-r-full transition-all duration-1000`} style={{ width: stat.progress }} />
              </div>
            </div>
          ))}
        </div>

        {/* 3. Main Patient Directory Table */}
        <div className="bg-white rounded-[2.5rem] border border-white shadow-card overflow-hidden">
          <div className="p-10 flex justify-between items-center border-b border-gray-50 bg-white">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-mamacare-teal uppercase tracking-[0.2em]">PATIENT MANAGEMENT</span>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Active Patient Directory</h2>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100 transition-all">
                  Sort: Recent <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-8 text-[14px] font-semibold text-gray-600 uppercase tracking-widest">Patient Name</th>
                  <th className="p-8 text-[14px] font-semibold text-gray-600 uppercase tracking-widest">Gestational Age</th>
                  <th className="p-8 text-[14px] font-semibold text-gray-600 text-center uppercase tracking-widest">Risk Level</th>
                  <th className="p-8 text-[14px] font-semibold text-gray-600 uppercase tracking-widest">Expected Due Date</th>
                  <th className="p-8 text-[14px] font-semibold text-gray-600 text-right uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedPatients.map((p) => {
                  const colors = riskColor(p.riskLevel);
                  const initials = p.fullName.split(' ').map(n => n[0]).join('').slice(0, 2);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-all cursor-pointer group" onClick={() => navigate(`/doctor/patients/${p.id}`)}>
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">
                             {p.profileImageUrl 
                               ? <img src={p.profileImageUrl} alt={p.fullName} className="w-full h-full object-cover rounded-2xl" />
                               : initials
                             }
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-bold text-gray-900 text-sm group-hover:text-mamacare-teal transition-colors">{p.fullName}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: MP00{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="space-y-2 w-32">
                          <p className="font-bold text-gray-900 text-sm">{p.gestationalWeek} Weeks</p>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-mamacare-teal rounded-full" style={{ width: `${(p.gestationalWeek / 40) * 100}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${colors.badge}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
                          {p.riskLevel} RISK
                        </span>
                      </td>
                      <td className="p-8">
                        <p className="font-bold text-sm text-gray-900">
                          {new Date(p.expectedDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex items-center justify-end gap-3 transition-opacity">
                          <button className="p-3 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-mamacare-teal transition-all" onClick={e => { e.stopPropagation(); navigate(`/doctor/messaging?motherId=${p.id}`); }}>
                            <MessageSquare size={18} />
                          </button>
                          <button className="p-3 bg-teal-50 text-mamacare-teal rounded-xl hover:bg-mamacare-teal hover:text-white transition-all shadow-sm" onClick={e => { e.stopPropagation(); navigate(`/doctor/patients/${p.id}`); }}>
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="p-8 bg-gray-50/50 flex items-center justify-between border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, patients.length)} of {patients.length}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-3 text-gray-300 hover:text-mamacare-teal transition-all disabled:opacity-30">
                  <ChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${p === page ? 'bg-mamacare-teal text-white shadow-lg shadow-mamacare-teal/20' : 'text-gray-400 hover:bg-white'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-3 text-gray-400 hover:text-mamacare-teal transition-all disabled:opacity-30">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Add Patient Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md px-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
              <div className="flex items-center justify-between p-10 border-b border-gray-50">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.2em]">REGISTRATION</p>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Patient</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-all"><X size={24} /></button>
              </div>
              <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                <div className="relative">
                  <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search for mother by name or email..."
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-mamacare-teal/5 focus:bg-white transition-all shadow-sm" />
                </div>
              </div>
              <div className="overflow-y-auto flex-1 p-4 space-y-2">
                {filteredMothers.length === 0 ? (
                  <div className="py-20 text-center">
                    <Users size={48} className="text-gray-100 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No matching mothers found</p>
                  </div>
                ) : filteredMothers.map(m => {
                  const alreadyAdded = patients.some(p => p.id === m.id);
                  return (
                    <div key={m.id} className="flex items-center justify-between p-6 rounded-[1.5rem] border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">
                          {m.profileImageUrl 
                            ? <img src={m.profileImageUrl} alt={m.fullName} className="w-full h-full object-cover rounded-2xl" />
                            : m.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2)
                          }
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-gray-900 text-sm">{m.fullName}</p>
                          <p className="text-xs text-gray-500 font-medium">{m.email}</p>
                        </div>
                      </div>
                      {alreadyAdded ? (
                        <span className="text-[10px] font-black text-gray-400 px-4 py-2 bg-gray-100 rounded-xl uppercase tracking-widest">Already Linked</span>
                      ) : (
                        <button onClick={() => addPatient(m)} disabled={adding === m.id}
                          className="px-6 py-3 bg-mamacare-teal text-white text-[11px] font-black rounded-xl hover:bg-[#004848] disabled:opacity-50 transition-all uppercase tracking-widest shadow-lg shadow-mamacare-teal/10 active:scale-95">
                          {adding === m.id ? 'Adding...' : 'Link Patient'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default PatientRoster;
