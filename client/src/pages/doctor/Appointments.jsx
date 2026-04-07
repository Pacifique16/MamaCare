import React from 'react';
import DoctorLayout from '../../components/layout/DoctorLayout';
import { 
  Search, 
  AlertTriangle, 
  Activity, 
  Droplets,
  Clock,
  CheckCircle2,
  Calendar,
  Bell,
  Plus,
  ArrowRight,
  Users,
  Sparkles
} from 'lucide-react';

const Appointments = () => {
    return (
        <DoctorLayout>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-8 border-b border-gray-100">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Appointments</h1>
                    <p className="text-gray-500 font-medium text-lg">Manage your prenatal visit schedule with calm efficiency.</p>
                </div>
                <div className="flex bg-gray-50 rounded-full p-1 border border-gray-100 mt-6 md:mt-0 shadow-sm">
                    <button className="px-6 py-2 bg-white text-[#005C5C] font-bold text-sm rounded-full shadow-sm">Schedule Visit</button>
                    <button className="px-6 py-2 text-gray-500 font-bold text-sm rounded-full hover:bg-gray-100 transition-colors">Calendar View</button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div className="relative w-full md:max-w-xl">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by patient name, ID or week..." 
                        className="w-full h-12 bg-gray-100 border border-transparent rounded-2xl pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-gray-200 focus:outline-none transition-colors"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button className="px-6 py-3 bg-white border border-gray-200 text-gray-900 font-bold text-sm rounded-2xl shadow-sm">All</button>
                    <button className="px-6 py-3 bg-gray-50 text-gray-500 font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors">High Risk</button>
                    <button className="px-6 py-3 bg-gray-50 text-gray-500 font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors">Routine</button>
                    <button className="px-6 py-3 bg-gray-50 text-gray-500 font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors">Postpartum</button>
                </div>
            </div>

            {/* Priority Alerts */}
            <div className="mb-14">
                <div className="flex items-center gap-4 mb-6">
                    <AlertTriangle className="text-[#C62828]" size={24} fill="currentColor" />
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Priority Alerts</h2>
                    <span className="bg-red-50 text-[#C62828] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-red-100">2 REQUIRES ACTION</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Alert Card 1 */}
                    <div className="bg-white rounded-[2.5rem] p-8 border-2 border-red-50 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow">
                        <div className="absolute top-0 left-0 w-2 h-full bg-[#C62828]"></div>
                        
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                    <div className="w-8 h-8 bg-gray-700 rounded-t-full mt-4"></div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Aline S.</h3>
                                    <p className="text-xs font-bold text-gray-500 tracking-wide mt-1">28 Weeks • First Pregnancy</p>
                                </div>
                            </div>
                            <span className="bg-red-50 text-[#C62828] px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest shadow-sm">HIGH RISK</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">BLOOD PRESSURE</p>
                                <p className="text-xl font-extrabold text-[#C62828]">140/90</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">SYMPTOM FLAG</p>
                                <p className="text-sm font-bold text-gray-900 leading-tight">Edema &<br/>Headache</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2 text-[#C62828]">
                                <Activity size={16} />
                                <span className="text-xs font-bold leading-tight">AI Flags: Potential<br/>Preeclampsia</span>
                            </div>
                            <button className="bg-[#005C5C] text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-teal-900/10 hover:bg-teal-800 transition-colors">
                                View Triage Report
                            </button>
                        </div>
                    </div>

                    {/* Alert Card 2 */}
                    <div className="bg-white rounded-[2.5rem] p-8 border-2 border-red-50 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow">
                        <div className="absolute top-0 left-0 w-2 h-full bg-[#C62828]"></div>
                        
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-[#1A2530] rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                    <div className="w-8 h-8 bg-blue-900 rounded-t-full mt-4"></div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Elena R.</h3>
                                    <p className="text-xs font-bold text-gray-500 tracking-wide mt-1">34 Weeks • GDM Managed</p>
                                </div>
                            </div>
                            <span className="bg-red-50 text-[#C62828] px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest shadow-sm">HIGH RISK</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">GLUCOSE (F)</p>
                                <p className="text-xl font-extrabold text-[#C62828]">105 mg/dL</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">FETAL MOVEMENT</p>
                                <p className="text-sm font-bold text-gray-900 leading-tight">Reduced Report</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2 text-[#C62828]">
                                <AlertTriangle size={16} />
                                <span className="text-xs font-bold leading-tight tracking-tight">Immediate NST<br/>Recommended</span>
                            </div>
                            <button className="bg-[#005C5C] text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-teal-900/10 hover:bg-teal-800 transition-colors">
                                View Triage Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Schedule Table */}
            <div className="mb-14">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Today's Schedule</h2>
                    <p className="text-sm font-bold text-gray-500">Monday, October 23rd</p>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] pb-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.15em]">PATIENT</th>
                                    <th className="px-8 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.15em]">STAGE</th>
                                    <th className="px-8 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.15em]">TIME</th>
                                    <th className="px-8 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.15em]">VISIT TYPE</th>
                                    <th className="px-8 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.15em]">STATUS</th>
                                    <th className="px-8 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.15em] text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {/* Row 1 */}
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 font-bold flex items-center justify-center">MJ</div>
                                            <div>
                                                <p className="font-bold text-gray-900">Maya Johnson</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">ID: MC-4920</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-gray-900">12 Weeks</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                            <Clock size={16} className="text-[#005C5C]" />
                                            09:30 AM
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-4 py-1.5 bg-teal-50 text-[#005C5C] font-bold text-[10px] uppercase tracking-widest rounded-full">Routine Check-up</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                            <span className="text-sm font-bold text-gray-900">Waiting</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-4 text-gray-400">
                                            <CheckCircle2 size={16} className="text-[#005C5C] hover:scale-110 transition-transform cursor-pointer" />
                                            <Calendar size={16} className="hover:text-gray-900 hover:scale-110 transition-transform cursor-pointer" />
                                            <Bell size={16} className="hover:text-gray-900 hover:scale-110 transition-transform cursor-pointer" />
                                        </div>
                                    </td>
                                </tr>

                                {/* Row 2 */}
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center">SC</div>
                                            <div>
                                                <p className="font-bold text-gray-900">Sarah Chen</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">ID: MC-8821</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-gray-900">24 Weeks</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                            <Clock size={16} className="text-[#005C5C]" />
                                            10:15 AM
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-4 py-1.5 bg-red-50 text-[#C62828] font-bold text-[10px] uppercase tracking-widest rounded-full">Glucose Screening</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                            <span className="text-sm font-bold text-gray-500">Scheduled</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-4 text-gray-400">
                                            <CheckCircle2 size={16} className="text-[#005C5C] hover:scale-110 transition-transform cursor-pointer" />
                                            <Calendar size={16} className="hover:text-gray-900 hover:scale-110 transition-transform cursor-pointer" />
                                            <Bell size={16} className="hover:text-gray-900 hover:scale-110 transition-transform cursor-pointer" />
                                        </div>
                                    </td>
                                </tr>

                                {/* Row 3 */}
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 font-bold flex items-center justify-center">DB</div>
                                            <div>
                                                <p className="font-bold text-gray-900">Dianne Black</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">ID: MC-2234</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-gray-900">38 Weeks</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                            <Clock size={16} className="text-[#005C5C]" />
                                            11:00 AM
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-4 py-1.5 bg-orange-50 text-orange-600 font-bold text-[10px] uppercase tracking-widest rounded-full">Birth Plan Review</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                            <span className="text-sm font-bold text-gray-500">Confirmed</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-4 text-gray-400">
                                            <CheckCircle2 size={16} className="text-[#005C5C] hover:scale-110 transition-transform cursor-pointer" />
                                            <Calendar size={16} className="hover:text-gray-900 hover:scale-110 transition-transform cursor-pointer" />
                                            <Bell size={16} className="hover:text-gray-900 hover:scale-110 transition-transform cursor-pointer" />
                                        </div>
                                    </td>
                                </tr>

                                {/* Row 4 - URGENT */}
                                <tr className="bg-red-50/30">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-red-100 text-[#C62828] font-bold flex items-center justify-center border-2 border-red-200">AS</div>
                                            <div>
                                                <p className="font-extrabold text-[#C62828]">Aline S.</p>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">ID: MC-0012</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-gray-900">28 Weeks</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-sm font-extrabold text-[#C62828]">
                                            <Clock size={16} />
                                            11:45 AM
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-4 py-1.5 bg-red-100 text-[#C62828] font-extrabold text-[10px] uppercase tracking-widest rounded-full shadow-sm">Urgent BP Follow-up</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-[#C62828]">
                                            <div className="w-2 h-2 rounded-full bg-[#C62828] animate-pulse"></div>
                                            <span className="text-sm font-extrabold">URGENT</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="bg-[#C62828] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_4px_14px_rgba(198,40,40,0.3)] hover:bg-[#B71C1C] transition-all">
                                            Check-in Now
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="px-8 pt-6 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500 font-medium">
                        <p>Showing 4 of 12 appointments for today</p>
                        <div className="flex items-center gap-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 font-bold text-gray-400">&lt;</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 font-bold text-gray-400">&gt;</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Action Cards */}
            <div className="grid md:grid-cols-3 gap-6 pb-12">
                <div className="bg-[#007373] text-white rounded-3xl p-8 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-1">Next Multi-Visit</h3>
                        <p className="text-sm text-teal-100 font-medium mb-8">Bulk scheduling for clinics</p>
                    </div>
                    <button className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3.5 rounded-xl text-sm transition-colors border border-white/20">
                        Start Batching
                    </button>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Resource Manager</h3>
                        <p className="text-sm text-gray-500 font-medium mb-8">Room 3 and NST Station 1 free</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 font-bold text-xs ring-2 ring-gray-50">SC</div>
                            <div className="w-10 h-10 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-[#005C5C] font-bold text-xs ring-2 ring-gray-50">MJ</div>
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">2 Staff Active</span>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-[#005C5C]">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">AI Optimization</h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[200px]">
                        Your afternoon block is optimized for 3 telehealth visits.
                    </p>
                </div>
            </div>

        </DoctorLayout>
    );
};

export default Appointments;
