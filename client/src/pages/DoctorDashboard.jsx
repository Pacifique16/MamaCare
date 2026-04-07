import React from 'react';
import { 
  Bell, 
  Search, 
  User, 
  AlertTriangle, 
  Users, 
  Calendar, 
  ClipboardCheck, 
  Filter, 
  Plus, 
  Phone, 
  FileText, 
  Send,
  MoreVertical,
  Activity
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import DoctorLayout from '../components/layout/DoctorLayout';

const DoctorDashboard = () => {
    const patients = [
        { id: '#MC-4092', name: 'Aline M.', trimester: '3rd (28 Weeks)', risk: 'High', lastCheckup: 'Yesterday', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
        { id: '#MC-3821', name: 'Imani J.', trimester: '2nd (18 Weeks)', risk: 'Moderate', lastCheckup: '3 days ago', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100' },
        { id: '#MC-4115', name: 'Zahara L.', trimester: '1st (10 Weeks)', risk: 'Low', lastCheckup: 'May 12, 2024', img: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=100' },
    ];

    const stats = [
        { title: 'Active Patients', value: '124', change: '+4 this week', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
        { title: 'High-Risk Cases', value: '8', change: 'Immediate attention', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
        { title: "Today's Appointments", value: '12', change: '4 remaining', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50' },
        { title: 'Pending Triage', value: '15', change: 'Review needed', icon: ClipboardCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
    ];

    return (
        <DoctorLayout title="Dashboard Overview" subtitle="High-level view of your current patients and triage queue.">
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Emergency Alert Banner */}
                <div className="bg-[#FFEBEB] border-l-[6px] border-red-500 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm animate-pulse">
                              <AlertTriangle size={24} />
                         </div>
                         <div className="space-y-1">
                              <h3 className="font-bold text-red-900">NEW ALERT: Aline (28 Weeks) - Preeclampsia symptoms detected.</h3>
                              <p className="text-sm text-red-700 font-medium">High blood pressure and severe edema reported via mobile triage 14 minutes ago.</p>
                         </div>
                    </div>
                    <div className="flex gap-4">
                         <button className="bg-[#C62828] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#B71C1C] transition-all shadow-lg active:scale-95">Review Case</button>
                         <button className="bg-white/50 text-red-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white transition-all active:scale-95">Dismiss</button>
                    </div>
                </div>

                {/* KPI Statistics Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
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

                {/* Main Content Grid (Patient List + Sidebar Focus) */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Patient Priority List (Left 8/12) */}
                    <div className="lg:col-span-8 bg-white rounded-[3rem] border border-white shadow-card overflow-hidden">
                        <div className="p-10 flex justify-between items-center bg-white sticky top-0 z-10">
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Patient Priority List</h2>
                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 bg-gray-50 text-gray-600 px-6 py-3 rounded-xl font-bold text-sm border border-gray-100 hover:bg-gray-100 transition-all">
                                    <Filter size={18} />
                                    Filter
                                </button>
                                <button className="flex items-center gap-2 bg-[#005C5C] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-teal-100 hover:bg-teal-800 transition-all">
                                    <Plus size={18} />
                                    New Patient
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patient Name</th>
                                        <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trimester</th>
                                        <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Risk Level</th>
                                        <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Check-up</th>
                                        <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map((patient, idx) => (
                                        <tr key={idx} className={`group border-b border-gray-50 last:border-0 hover:bg-teal-50/30 transition-all ${idx === 0 ? 'bg-red-50/20' : ''}`}>
                                            <td className="p-8">
                                                <div className="flex items-center gap-4">
                                                    <img src={patient.img} alt="" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-100 group-hover:scale-105 transition-transform" />
                                                    <div className="space-y-0.5">
                                                        <p className="font-bold text-gray-900">{patient.name}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {patient.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <p className="text-sm font-bold text-gray-400">{patient.trimester}</p>
                                            </td>
                                            <td className="p-8 text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm inline-flex items-center gap-2 ${
                                                    patient.risk === 'High' ? 'bg-[#C62828] text-white' : 
                                                    patient.risk === 'Moderate' ? 'bg-orange-100 text-orange-600' : 
                                                    'bg-teal-100 text-teal-600'
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-current ${patient.risk === 'High' ? 'animate-pulse' : ''}`}></div>
                                                    {patient.risk} Risk
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <p className="text-sm font-bold text-gray-400">{patient.lastCheckup}</p>
                                            </td>
                                            <td className="p-8 text-right">
                                                <button className="text-[#005C5C] font-extrabold text-sm hover:underline tracking-tight">Manage</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Patient Focus Sidebar (Right 4/12) */}
                    <div className="lg:col-span-4 space-y-8 h-full sticky top-28">
                        <div className="bg-[#F8FAFB] rounded-[3rem] overflow-hidden shadow-2xl border border-white animate-in slide-in-from-right-8 duration-700">
                             {/* Sidebar Header */}
                             <div className="p-10 bg-[#005C5C] space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-white text-2xl font-bold tracking-tight">Patient Focus: Aline</h3>
                                        <p className="text-teal-100/60 font-bold text-[10px] uppercase tracking-widest">G3 P2 | 28w 4d Gestation</p>
                                    </div>
                                    <span className="bg-[#004D4D] text-white text-[10px] font-extrabold py-1 px-3 rounded-lg tracking-widest uppercase shadow-lg">URGENT</span>
                                </div>
                             </div>

                             <div className="p-10 space-y-10">
                                {/* Triage Results Section */}
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em]">RECENT TRIAGE RESULTS</h4>
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex gap-4 transition-all hover:shadow-md group">
                                             <div className="w-10 h-10 bg-[#C62828] text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-red-500/10">
                                                  <Activity size={18} />
                                             </div>
                                             <div className="space-y-1">
                                                  <p className="text-gray-900 font-bold text-sm">Vitals Alert</p>
                                                  <p className="text-gray-500 text-[10px] font-medium leading-relaxed">BP: 155/95 mmHg | Pulse: 92 bpm</p>
                                             </div>
                                        </div>
                                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex gap-4 transition-all hover:shadow-md group">
                                             <div className="w-10 h-10 bg-[#005C5C] text-white rounded-xl flex items-center justify-center shrink-0">
                                                  <ClipboardCheck size={18} />
                                             </div>
                                             <div className="space-y-1 font-outfit">
                                                  <p className="text-gray-900 font-bold text-sm">Self-Reported Symptoms</p>
                                                  <p className="text-gray-500 text-[10px] font-medium leading-relaxed italic">"Severe headache and blurred vision for 2 hours."</p>
                                             </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Messaging Section */}
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em]">SECURE MESSAGING</h4>
                                    <div className="bg-white rounded-[2.5rem] p-6 space-y-6 border border-gray-100 shadow-sm">
                                        <div className="space-y-2">
                                             <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none p-4 w-fit max-w-[90%]">
                                                  <p className="text-gray-800 text-xs font-bold leading-relaxed">Hello Dr. Sarah, I'm feeling very dizzy and my vision is spotting.</p>
                                                  <p className="text-[9px] text-gray-400 font-bold mt-2 uppercase">10:42 AM</p>
                                             </div>
                                        </div>
                                        <div className="flex justify-end">
                                             <div className="bg-[#E0F2F1] rounded-2xl rounded-tr-none p-4 w-fit max-w-[90%]">
                                                  <p className="text-[#004D4D] text-xs font-bold leading-relaxed">Aline, please remain seated. I have received your triage alert. Are you alone?</p>
                                                  <p className="text-[9px] text-teal-600/50 font-bold mt-2 uppercase">10:45 AM</p>
                                             </div>
                                        </div>
                                        <div className="relative pt-2">
                                             <input 
                                                type="text" 
                                                placeholder="Type urgent message..." 
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-6 pr-14 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/5 transition-all"
                                             />
                                             <button className="absolute right-2 top-[calc(50%+4px)] -translate-y-1/2 w-10 h-10 bg-[#005C5C] text-white rounded-xl flex items-center justify-center hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/10">
                                                  <Send size={18} />
                                             </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Section */}
                                <div className="space-y-4 pt-4">
                                     <button className="w-full bg-[#C62828] text-white py-6 rounded-3xl font-bold text-sm shadow-xl shadow-red-200 hover:bg-[#B71C1C] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group">
                                          <Phone size={18} className="transition-transform group-hover:rotate-12" />
                                          Call Patient Now
                                     </button>
                                     <button className="w-full bg-[#E0E7E7] text-[#005C5C] py-6 rounded-3xl font-bold text-sm hover:bg-[#D1DADA] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                          <FileText size={18} />
                                          Full Clinical Record
                                     </button>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorDashboard;
