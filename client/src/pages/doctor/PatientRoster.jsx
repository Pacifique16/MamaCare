import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../../components/layout/DoctorLayout';
import { AlertTriangle, Calendar, Eye, MessageSquare, Plus, X, Search } from 'lucide-react';
import { doctorsApi, mothersApi, appointmentsApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const riskColor = (risk) => ({
  High: { badge: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
  Medium: { badge: 'bg-orange-50 text-orange-600', dot: 'bg-orange-400' },
  Low: { badge: 'bg-teal-50 text-teal-600', dot: 'bg-teal-500' },
}[risk] || { badge: 'bg-gray-50 text-gray-400', dot: 'bg-gray-400' });

const PatientRoster = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const doctorId = user?.doctorId || 1;
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    doctorsApi.getPatients(doctorId).then(r => setPatients(r.data)).catch(() => {});
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
    } catch {}
    setAdding(null);
  };

  const filteredMothers = allMothers.filter(m =>
    m.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  );

  const actionButton = (
    <button onClick={openModal} className="flex items-center gap-2 px-6 py-3 bg-[#005C5C] text-white rounded-full font-bold shadow-lg hover:bg-[#004D4D] transition-all text-sm">
      <Plus size={18} />Add New Patient
    </button>
  );

  return (
    <DoctorLayout title="Maternal Patient Roster" subtitle={`Managing ${patients.length} active prenatal journeys`} activeActionButton={actionButton}>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 flex items-start justify-between">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">HIGH RISK</p>
            <h3 className="text-4xl font-extrabold text-red-600">{String(highRisk).padStart(2, '0')}</h3>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center"><AlertTriangle size={20} /></div>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-gray-100 flex items-start justify-between">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">DUE THIS MONTH</p>
            <h3 className="text-4xl font-extrabold text-[#005C5C]">{String(dueThisMonth).padStart(2, '0')}</h3>
          </div>
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center"><Calendar size={20} /></div>
        </div>
        <div className="bg-[#007373] text-white rounded-3xl p-8 flex justify-between relative overflow-hidden shadow-lg">
          <div className="space-y-4 z-10 relative">
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-100">PROGRAM HEALTH</p>
            <h3 className="text-4xl font-extrabold text-white">98.2%</h3>
            <p className="text-sm font-medium text-teal-50">Vitals reporting compliance is at an all-time high.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">PATIENT DETAILS</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">GESTATIONAL AGE</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">RISK LEVEL</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">DUE DATE</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {patients.map((p) => {
                const colors = riskColor(p.riskLevel);
                const initials = p.fullName.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => navigate(`/doctor/patients/${p.id}`)}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg overflow-hidden">
                          {p.profileImageUrl
                            ? <img src={p.profileImageUrl} alt={p.fullName} className="w-full h-full object-cover" />
                            : initials
                          }
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{p.fullName}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: #{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2 w-32">
                        <p className="font-bold text-gray-900 text-sm">{p.gestationalWeek} Weeks</p>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#005C5C] rounded-full" style={{ width: `${(p.gestationalWeek / 40) * 100}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 ${colors.badge}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></div>
                        {p.riskLevel} RISK
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-sm text-gray-900">
                        {new Date(p.expectedDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 text-gray-400">
                        <button className="p-2 hover:bg-gray-100 rounded-lg hover:text-[#005C5C]" onClick={e => { e.stopPropagation(); navigate(`/doctor/messaging?motherId=${p.id}`); }}><MessageSquare size={18} /></button>
                        <button className="p-2 hover:bg-teal-50 rounded-lg text-[#005C5C] bg-teal-50/50" onClick={e => { e.stopPropagation(); navigate(`/doctor/patients/${p.id}`); }}><Eye size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500 font-medium bg-white">
          <p>Showing {patients.length} patients</p>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-black text-gray-900">Add New Patient</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#005C5C]" />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredMothers.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-10">No mothers found</p>
              ) : filteredMothers.map(m => {
                const alreadyAdded = patients.some(p => p.id === m.id);
                return (
                  <div key={m.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-50 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm overflow-hidden">
                        {m.profileImageUrl
                          ? <img src={m.profileImageUrl} alt={m.fullName} className="w-full h-full object-cover" />
                          : m.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2)
                        }
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{m.fullName}</p>
                        <p className="text-xs text-gray-400">{m.email}</p>
                      </div>
                    </div>
                    {alreadyAdded ? (
                      <span className="text-xs font-bold text-gray-400 px-3 py-1 bg-gray-100 rounded-full">Already added</span>
                    ) : (
                      <button onClick={() => addPatient(m)} disabled={adding === m.id}
                        className="px-4 py-2 bg-[#005C5C] text-white text-xs font-bold rounded-xl hover:bg-[#004848] disabled:opacity-50 transition-all">
                        {adding === m.id ? 'Adding...' : 'Add'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </DoctorLayout>
  );
};

export default PatientRoster;
