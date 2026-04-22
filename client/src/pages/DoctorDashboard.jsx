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
  Activity,
  ChevronDown
} from 'lucide-react';
import DoctorLayout from '../components/layout/DoctorLayout';
import { doctorsApi, messagesApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

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
    try {
      await messagesApi.send({ motherId: focusedPatient.id, doctorId, content: msgInput, sentByDoctor: true });
      setMsgInput('');
      toast.success('Message sent');
      messagesApi.getConversation(focusedPatient.id, doctorId).then(r => setMessages(r.data)).catch(() => {});
    } catch (err) {
      toast.error('Failed to send message');
    }
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
    if (risk === 'High') return 'bg-red-100 text-red-600';
    if (risk === 'Medium') return 'bg-orange-100 text-orange-600';
    return 'bg-teal-100 text-teal-600';
  };

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto space-y-12 font-poppins animate-in fade-in duration-1000">
        
        {/* Premium Branding Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">CLINICAL WORKSPACE</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Doctor Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-lg shadow-sm">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                Live System Status
              </span>
            </div>
            <button className="bg-mamacare-teal text-white px-8 py-3 rounded-xl font-bold text-[13px] shadow-lg shadow-mamacare-teal/10 transition-all hover:bg-[#004848] active:scale-[0.98]">
              Generate Report
            </button>
          </div>
        </div>

        {/* Emergency Alert — shown if any high-risk patient exists */}
        {focusedPatient && focusedPatient.riskLevel === 'High' && (
          <div className="bg-[#FFEBEB] border-l-[6px] border-red-500 rounded-3xl p-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm animate-pulse shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-red-900 text-lg">
                  ALERT: {focusedPatient.fullName} ({focusedPatient.gestationalWeek} Weeks) — High Risk Patient
                </h3>
                <p className="text-sm text-red-700 font-medium">Requires immediate clinical attention and review.</p>
              </div>
            </div>
            <div className="flex gap-4 shrink-0">
              <button className="bg-[#C62828] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#B71C1C] transition-all shadow-lg active:scale-95">Review Case</button>
              <button className="bg-white/50 text-red-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white transition-all active:scale-95">Dismiss</button>
            </div>
          </div>
        )}

        {/* KPI Stats */}
        {loading ? (
          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {statCards.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[13px] font-medium text-gray-700">
                      {stat.title}
                    </span>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-gray-50 ${stat.color}`}>
                      {stat.change}
                    </div>
                  </div>
                  
                  <h3 className="text-4xl font-bold text-gray-900 tracking-tight">
                    {stat.value}
                  </h3>

                  <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.color.replace('text-', 'bg-')}`}
                      style={{ width: `${Math.max(15, (stat.value / Math.max(1, patients.length)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Patient Priority List */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-10 flex justify-between items-center bg-white sticky top-0 z-10 border-b border-gray-50">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-mamacare-teal uppercase tracking-[0.2em]">PATIENT MANAGEMENT</span>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Patient Priority List</h2>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <button onClick={() => setFilterOpen(o => !o)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border transition-all ${activeFilter !== 'All' ? 'bg-[#005C5C] text-white border-[#005C5C]' : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'}`}>
                    {activeFilter === 'All' ? 'All Patients' : activeFilter + ' Risk'}
                    <ChevronDown size={16} className={`transition-transform duration-300 ${filterOpen ? 'rotate-180' : ''}`} />
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
                      <th className="p-6 text-[14px] font-semibold text-gray-600">Patient Name</th>
                      <th className="p-6 text-[14px] font-semibold text-gray-600">Trimester</th>
                      <th className="p-6 text-[14px] font-semibold text-gray-600 text-center">Risk Level</th>
                      <th className="p-6 text-[14px] font-semibold text-gray-600">Due Date</th>
                      <th className="p-6 text-[14px] font-semibold text-gray-600 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {patients.map((patient, idx) => (
                      <tr key={patient.id} className={`group hover:bg-gray-50/30 transition-all ${patient.riskLevel === 'High' ? 'bg-red-50/10' : ''}`}>
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-mamacare-teal flex items-center justify-center font-bold text-lg border border-teal-100/50">
                              {patient.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-bold text-gray-900 text-sm group-hover:text-mamacare-teal transition-colors">{patient.fullName}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: MP00{patient.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <p className="text-sm font-medium text-gray-600">{patient.trimester} <span className="text-gray-600">({patient.gestationalWeek}w)</span></p>
                        </td>
                        <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${riskBadge(patient.riskLevel)}`}>
                            {patient.riskLevel}
                          </span>
                        </td>
                        <td className="p-6">
                          <p className="text-sm font-medium text-gray-600">
                            {new Date(patient.expectedDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </td>
                        <td className="p-6 text-right">
                          <button className="text-mamacare-teal font-extrabold text-xs uppercase tracking-widest hover:text-[#004848] transition-colors">Manage</button>
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
              <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm space-y-8">
                <div className="w-full text-left space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black text-mamacare-teal uppercase tracking-[0.2em]">PATIENT FOCUS</span>
                    {focusedPatient.riskLevel === 'High' && (
                      <span className="bg-red-50 text-red-500 text-[10px] font-extrabold py-1 px-3 rounded-lg tracking-widest uppercase">URGENT</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">{focusedPatient.fullName.split(' ')[0]}</h3>
                  <p className="text-sm font-medium text-gray-500">{focusedPatient.gestationalWeek}w Gestation</p>
                </div>

                <div className="space-y-6">
                  {/* Messaging */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em]">SECURE MESSAGING</h4>
                    <div className="bg-gray-50/50 rounded-[2rem] p-6 space-y-4 border border-gray-100 max-h-64 overflow-y-auto">
                      {messages.length === 0 && (
                        <p className="text-xs text-gray-400 font-medium text-center py-4">No messages yet.</p>
                      )}
                      {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sentByDoctor ? 'justify-end' : 'justify-start'}`}>
                          <div className={`rounded-3xl px-4 py-3 w-fit max-w-[90%] shadow-sm ${msg.sentByDoctor ? 'bg-gradient-to-tr from-mamacare-teal to-[#007A7A] text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'}`}>
                            <p className="text-[13px] font-medium leading-relaxed">{msg.content}</p>
                            <p className={`text-[9px] font-bold mt-1.5 uppercase ${msg.sentByDoctor ? 'text-white/70' : 'text-gray-400'}`}>
                              {new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="relative pt-2">
                      <input
                        type="text"
                        value={msgInput}
                        onChange={e => setMsgInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Type urgent message..."
                        className="w-full bg-white border border-gray-200 rounded-full py-3.5 pl-6 pr-14 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-mamacare-teal focus:ring-4 focus:ring-mamacare-teal/10 transition-all shadow-sm"
                      />
                      <button onClick={sendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 mt-1 w-10 h-10 bg-mamacare-teal text-white rounded-full flex items-center justify-center hover:bg-[#004848] transition-all shadow-sm hover:scale-105 active:scale-95">
                        <Send size={16} className="translate-x-0.5 -translate-y-0.5" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-6 border-t border-gray-50">
                    <button className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold text-sm shadow-sm hover:bg-red-100 transition-all flex items-center justify-center gap-3 group"
                      onClick={() => focusedPatient?.phoneNumber && window.location.assign(`tel:${focusedPatient.phoneNumber}`)}
                    >
                      <Phone size={16} className="transition-transform group-hover:rotate-12" />
                      {focusedPatient?.phoneNumber ? 'Call Patient Now' : 'No Phone Number'}
                    </button>
                    <button className="w-full bg-teal-50 text-mamacare-teal py-4 rounded-2xl font-bold text-sm hover:bg-teal-100 transition-all flex items-center justify-center gap-3"
                      onClick={() => navigate(`/doctor/patients/${focusedPatient.id}`)}
                    >
                      <FileText size={16} />
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
