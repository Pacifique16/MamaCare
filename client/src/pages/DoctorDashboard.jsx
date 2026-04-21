import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Users,
  Calendar,
  ClipboardCheck,
  Filter,
  Plus,
  Phone,
  FileText,
  Send,
  Activity
} from 'lucide-react';
import DoctorLayout from '../components/layout/DoctorLayout';
import { doctorsApi, messagesApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const doctorId = user?.doctorId || 1;

  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  // Focused patient is always the first high-risk one
  const focusedPatient = patients.find(p => p.riskLevel === 'High') || patients[0];

  useEffect(() => {
    Promise.all([
      doctorsApi.getPatientsByPriority(doctorId),
    ]).then(([patientsRes]) => {
      setAllPatients(patientsRes.data);
      setPatients(patientsRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [doctorId]);

  useEffect(() => {
    if (!focusedPatient) return;
    messagesApi.getConversation(focusedPatient.id, doctorId)
      .then(r => setMessages(r.data))
      .catch(() => {});
  }, [focusedPatient?.id, doctorId]);

  const sendMessage = async () => {
    if (!msgInput.trim() || !focusedPatient) return;
    await messagesApi.send({ motherId: focusedPatient.id, doctorId, content: msgInput, sentByDoctor: true });
    setMsgInput('');
    messagesApi.getConversation(focusedPatient.id, doctorId).then(r => setMessages(r.data)).catch(() => {});
  };

  const applyFilter = (risk) => {
    setActiveFilter(risk);
    setFilterOpen(false);
    setPatients(risk === 'All' ? allPatients : allPatients.filter(p => p.riskLevel === risk));
  };

  const statCards = [
    { title: 'My Patients', value: patients.length, change: 'Assigned patients', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
    { title: 'High-Risk Cases', value: patients.filter(p => p.riskLevel === 'High').length, change: 'Immediate attention', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'Due This Month', value: patients.filter(p => { const d = new Date(p.expectedDueDate); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length, change: 'Expected deliveries', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Medium Risk', value: patients.filter(p => p.riskLevel === 'Medium').length, change: 'Monitor closely', icon: ClipboardCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  const riskBadge = (risk) => {
    if (risk === 'High') return 'bg-[#C62828] text-white';
    if (risk === 'Medium') return 'bg-orange-100 text-orange-600';
    return 'bg-teal-100 text-teal-600';
  };

  return (
    <DoctorLayout title="Dashboard Overview" subtitle="High-level view of your current patients and triage queue.">
      <div className="space-y-8 animate-in fade-in duration-500">

        {/* Emergency Alert — shown if any high-risk patient exists */}
        {focusedPatient && focusedPatient.riskLevel === 'High' && (
          <div className="bg-[#FFEBEB] border-l-[6px] border-red-500 rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm animate-pulse">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-red-900">
                  ALERT: {focusedPatient.fullName} ({focusedPatient.gestationalWeek} Weeks) — High Risk Patient
                </h3>
                <p className="text-sm text-red-700 font-medium">Requires immediate attention.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="bg-[#C62828] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#B71C1C] transition-all shadow-lg active:scale-95">Review Case</button>
              <button className="bg-white/50 text-red-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white transition-all active:scale-95">Dismiss</button>
            </div>
          </div>
        )}

        {/* KPI Stats */}
        {loading ? (
          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card h-32 animate-pulse bg-gray-50" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {statCards.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card flex items-center justify-between group hover:shadow-2xl transition-all duration-300">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
                  <h3 className="text-4xl font-extrabold text-gray-900 tracking-tighter">{stat.value}</h3>
                  <p className={`text-[10px] font-bold ${stat.color} bg-white px-2 py-1 rounded-full w-fit shadow-sm`}>{stat.change}</p>
                </div>
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                  <stat.icon size={24} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Patient Priority List */}
          <div className="lg:col-span-8 bg-white rounded-[3rem] border border-white shadow-card overflow-hidden">
            <div className="p-10 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Patient Priority List</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <button onClick={() => setFilterOpen(o => !o)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border transition-all ${activeFilter !== 'All' ? 'bg-[#005C5C] text-white border-[#005C5C]' : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'}`}>
                    <Filter size={18} />{activeFilter === 'All' ? 'Filter' : activeFilter + ' Risk'}
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20 w-40">
                      {['All', 'High', 'Medium', 'Low'].map(r => (
                        <button key={r} onClick={() => applyFilter(r)}
                          className={`w-full px-5 py-3 text-left text-sm font-bold transition-colors hover:bg-gray-50 ${activeFilter === r ? 'text-[#005C5C]' : 'text-gray-600'}`}>
                          {r === 'All' ? 'All Patients' : r + ' Risk'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => navigate('/doctor/patients')}
                  className="flex items-center gap-2 bg-[#005C5C] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-teal-100 hover:bg-teal-800 transition-all">
                  <Plus size={18} />New Patient
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-10 space-y-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />)}
              </div>
            ) : patients.length === 0 ? (
              <p className="p-10 text-gray-400 font-medium text-sm">No patients assigned yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patient Name</th>
                      <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trimester</th>
                      <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Risk Level</th>
                      <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Due Date</th>
                      <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient, idx) => (
                      <tr key={patient.id} className={`group border-b border-gray-50 last:border-0 hover:bg-teal-50/30 transition-all ${patient.riskLevel === 'High' ? 'bg-red-50/20' : ''}`}>
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg">
                              {patient.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-bold text-gray-900">{patient.fullName}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: #{patient.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                          <p className="text-sm font-bold text-gray-400">{patient.trimester} ({patient.gestationalWeek} Weeks)</p>
                        </td>
                        <td className="p-8 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm inline-flex items-center gap-2 ${riskBadge(patient.riskLevel)}`}>
                            <div className={`w-1.5 h-1.5 rounded-full bg-current ${patient.riskLevel === 'High' ? 'animate-pulse' : ''}`}></div>
                            {patient.riskLevel} Risk
                          </span>
                        </td>
                        <td className="p-8">
                          <p className="text-sm font-bold text-gray-400">
                            {new Date(patient.expectedDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </td>
                        <td className="p-8 text-right">
                          <button className="text-[#005C5C] font-extrabold text-sm hover:underline tracking-tight">Manage</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Patient Focus Sidebar */}
          {focusedPatient && (
            <div className="lg:col-span-4 space-y-8 h-full sticky top-28">
              <div className="bg-[#F8FAFB] rounded-[3rem] overflow-hidden shadow-2xl border border-white">
                <div className="p-10 bg-[#005C5C] space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-white text-2xl font-bold tracking-tight">Patient Focus: {focusedPatient.fullName.split(' ')[0]}</h3>
                      <p className="text-teal-100/60 font-bold text-[10px] uppercase tracking-widest">{focusedPatient.gestationalWeek}w Gestation</p>
                    </div>
                    {focusedPatient.riskLevel === 'High' && (
                      <span className="bg-[#004D4D] text-white text-[10px] font-extrabold py-1 px-3 rounded-lg tracking-widest uppercase shadow-lg">URGENT</span>
                    )}
                  </div>
                </div>

                <div className="p-10 space-y-10">
                  {/* Messaging */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em]">SECURE MESSAGING</h4>
                    <div className="bg-white rounded-[2.5rem] p-6 space-y-4 border border-gray-100 shadow-sm max-h-64 overflow-y-auto">
                      {messages.length === 0 && (
                        <p className="text-xs text-gray-400 font-medium text-center py-4">No messages yet.</p>
                      )}
                      {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sentByDoctor ? 'justify-end' : 'justify-start'}`}>
                          <div className={`rounded-2xl p-4 w-fit max-w-[90%] ${msg.sentByDoctor ? 'bg-[#E0F2F1] rounded-tr-none' : 'bg-gray-50 border border-gray-100 rounded-tl-none'}`}>
                            <p className={`text-xs font-bold leading-relaxed ${msg.sentByDoctor ? 'text-[#004D4D]' : 'text-gray-800'}`}>{msg.content}</p>
                            <p className="text-[9px] text-gray-400 font-bold mt-2 uppercase">
                              {new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={msgInput}
                        onChange={e => setMsgInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Type urgent message..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-6 pr-14 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/5 transition-all"
                      />
                      <button onClick={sendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#005C5C] text-white rounded-xl flex items-center justify-center hover:bg-teal-700 transition-all shadow-lg">
                        <Send size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-4 pt-4">
                    <button className="w-full bg-[#C62828] text-white py-6 rounded-3xl font-bold text-sm shadow-xl shadow-red-200 hover:bg-[#B71C1C] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                      onClick={() => focusedPatient?.phoneNumber && window.location.assign(`tel:${focusedPatient.phoneNumber}`)}
                    >
                      <Phone size={18} className="transition-transform group-hover:rotate-12" />
                      {focusedPatient?.phoneNumber ? 'Call Patient Now' : 'No Phone Number'}
                    </button>
                    <button className="w-full bg-[#E0E7E7] text-[#005C5C] py-6 rounded-3xl font-bold text-sm hover:bg-[#D1DADA] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                      onClick={() => navigate(`/doctor/patients/${focusedPatient.id}`)}
                    >
                      <FileText size={18} />
                      Full Clinical Record
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
