import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DoctorLayout from '../../components/layout/DoctorLayout';
import { 
  AlertTriangle, 
  Calendar, 
  BarChart3, 
  Eye, 
  MessageSquare, 
  FileText,
  Plus,
  BookOpen
} from 'lucide-react';

const PatientRoster = () => {
    const navigate = useNavigate();

    const patients = [
        { id: '#MC-8291', name: 'Elena Wright', initials: 'EW', color: 'bg-teal-50 text-teal-700', age: '24 Weeks', progress: 'w-[60%]', risk: 'LOW RISK', riskColor: 'bg-teal-50 text-teal-600', bp: '118/72', weight: '154', apptDate: 'Oct 14, 2023', apptTime: '09:30 AM' },
        { id: '#MC-9102', name: 'Maya Lopez', initials: 'ML', color: 'bg-red-50 text-red-700', age: '31 Weeks', progress: 'w-[80%]', risk: 'HIGH RISK', riskColor: 'bg-red-50 text-red-600', bp: '145/95', bpRed: true, weight: '172', apptDate: 'Tomorrow', apptDateRed: true, apptTime: '08:00 AM' },
        { id: '#MC-7723', name: 'Sarah Parker', initials: 'SP', color: 'bg-orange-50 text-orange-700', age: '12 Weeks', progress: 'w-[30%]', risk: 'MEDIUM RISK', riskColor: 'bg-orange-50 text-orange-600', bp: '112/68', weight: '142', apptDate: 'Oct 20, 2023', apptTime: '02:15 PM' },
        { id: '#MC-8812', name: 'Ananya Kapoor', initials: 'AK', color: 'bg-teal-50 text-teal-700', age: '38 Weeks', progress: 'w-[95%]', risk: 'LOW RISK', riskColor: 'bg-teal-50 text-teal-600', bp: '120/80', weight: '168', apptDate: 'Oct 16, 2023', apptTime: '11:00 AM' },
    ];

    const actionButton = (
        <button className="flex items-center gap-2 px-6 py-3 bg-[#005C5C] text-white rounded-full font-bold shadow-lg shadow-teal-900/10 hover:bg-[#004D4D] transition-all text-sm">
            <Plus size={18} />
            Add New Patient
        </button>
    );

    return (
        <DoctorLayout title="Maternal Patient Roster" subtitle="Managing 42 active prenatal journeys" activeActionButton={actionButton}>
            
            {/* KPI Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 flex items-start justify-between">
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">HIGH RISK</p>
                        <h3 className="text-4xl font-extrabold text-red-600">04</h3>
                    </div>
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                        <AlertTriangle size={20} />
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 flex items-start justify-between">
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">DUE THIS MONTH</p>
                        <h3 className="text-4xl font-extrabold text-[#005C5C]">12</h3>
                    </div>
                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center">
                        <Calendar size={20} />
                    </div>
                </div>

                <div className="bg-[#007373] text-white rounded-3xl p-8 flex justify-between relative overflow-hidden shadow-lg shadow-teal-900/10">
                    <div className="space-y-4 z-10 relative">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-teal-100">PROGRAM HEALTH</p>
                        <div className="flex items-center gap-4">
                            <h3 className="text-4xl font-extrabold text-white">98.2%</h3>
                            <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full font-bold">+2.4% vs last mo</span>
                        </div>
                        <p className="text-sm font-medium text-teal-50">Vitals reporting compliance is at an all-time high.</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-50 z-0 flex items-end gap-2 pr-6 pb-6">
                        <div className="w-4 h-12 bg-teal-900/30 rounded-t-sm"></div>
                        <div className="w-4 h-8 bg-teal-900/30 rounded-t-sm"></div>
                        <div className="w-4 h-16 bg-teal-900/30 rounded-t-sm"></div>
                    </div>
                </div>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[25%]">PATIENT DETAILS</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">GESTATIONAL AGE</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">RISK LEVEL</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">LAST VITALS</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">NEXT APPT</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {patients.map((patient, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => navigate(`/doctor/patients/${patient.id.replace('#', '')}`)}>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${patient.color}`}>
                                                {patient.initials}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{patient.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {patient.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-2 w-32">
                                            <p className="font-bold text-gray-900 text-sm">{patient.age}</p>
                                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div className={`h-full bg-[#005C5C] ${patient.progress} rounded-full`}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 ${patient.riskColor}`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                            {patient.risk}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-0.5 text-xs font-medium">
                                            <p className="text-gray-900">
                                                <span className="font-bold">BP:</span> <span className={patient.bpRed ? 'text-red-500 font-bold' : ''}>{patient.bp} mmHg</span>
                                            </p>
                                            <p className="text-gray-500">
                                                <span className="font-bold text-gray-900">Weight:</span> {patient.weight} lbs
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-0.5">
                                            <p className={`font-bold text-sm ${patient.apptDateRed ? 'text-red-500' : 'text-gray-900'}`}>{patient.apptDate}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{patient.apptTime}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 text-gray-400">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hover:text-[#005C5C]" onClick={(e) => e.stopPropagation()}>
                                                <MessageSquare size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hover:text-[#005C5C]" onClick={(e) => e.stopPropagation()}>
                                                <FileText size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-teal-50 rounded-lg transition-colors text-[#005C5C] bg-teal-50/50" onClick={(e) => { e.stopPropagation(); navigate(`/doctor/patients/${patient.id.replace('#', '')}`) }}>
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500 font-medium bg-white">
                    <p>Showing 4 of 42 patients</p>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50">&lt;</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#005C5C] text-white font-bold">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 font-bold">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 font-bold">3</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100">&gt;</button>
                    </div>
                </div>
            </div>

            {/* Bottom Widgets */}
            <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-3 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-900">Weekly Care Distribution</h3>
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#005C5C]"></div> ROUTINE</div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400"></div> SPECIALIZED</div>
                        </div>
                    </div>
                    {/* Simplified Bar Chart visualization mimicking image */}
                    <div className="flex-1 flex items-end justify-between gap-4 h-40 pt-4 pb-2 border-b border-gray-100">
                        {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((day, i) => {
                            const heights = ['h-16', 'h-24', 'h-36', 'h-20', 'h-28', 'h-16', 'h-8'];
                            const h = heights[i];
                            const isWed = day === 'WED';
                            const isSat = day === 'SAT';
                            return (
                                <div key={day} className="flex flex-col items-center gap-4 flex-1">
                                    <div className={`w-full rounded-t-lg transition-all hover:opacity-80
                                        ${isWed ? 'bg-[#007373]' : isSat ? 'bg-red-100' : 'bg-[#E6F0F0]'} ${h}`}
                                    ></div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex justify-between mt-4">
                        {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((day) => (
                            <div key={day} className={`flex-1 text-center text-[10px] font-bold uppercase tracking-widest ${day === 'WED' ? 'text-[#005C5C]' : 'text-gray-400'}`}>
                                {day}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-[#007373] text-white rounded-3xl p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600 rounded-bl-full opacity-50 -mr-10 -mt-10"></div>
                    <div className="z-10 bg-teal-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-teal-100">
                        <BookOpen size={24} />
                    </div>
                    <div className="space-y-4 z-10">
                        <h3 className="text-xl font-bold leading-tight">Patient Resource Center</h3>
                        <p className="text-sm text-teal-100 text-medium leading-relaxed">Assign educational materials to patients based on their current gestational week.</p>
                    </div>
                    <div className="mt-8 z-10 w-full relative">
                        <button className="w-full bg-white text-[#005C5C] font-bold py-3.5 rounded-full text-sm hover:bg-gray-50 transition-colors">
                            Browse Library
                        </button>
                        {/* Fake floating plus button matching image */}
                        <div className="absolute -top-[190px] -right-8 w-14 h-14 bg-[#004D4D] rounded-full flex items-center justify-center text-white shadow-xl">
                            <Plus size={24} />
                        </div>
                    </div>
                </div>
            </div>

        </DoctorLayout>
    );
};

export default PatientRoster;
