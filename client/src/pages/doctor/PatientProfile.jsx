import React from 'react';
import DoctorLayout from '../../components/layout/DoctorLayout';
import { 
  ChevronRight, 
  Printer, 
  Download, 
  Mail, 
  Phone, 
  CreditCard,
  QrCode,
  AlertTriangle,
  HeartPulse,
  Scale,
  Calendar,
  MessageSquare,
  Stethoscope,
  Pill,
  Camera,
  TrendingUp
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const PatientProfile = () => {
    return (
        <DoctorLayout>
            {/* Custom Header matching the design */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 pb-8 border-b border-gray-100">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <NavLink to="/doctor/patients" className="hover:text-mamacare-teal transition-colors">PATIENTS</NavLink>
                        <ChevronRight size={12} />
                        <span className="text-[#005C5C]">PROFILE VIEW</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Aline Silva</h1>
                        <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                            <AlertTriangle size={12} />
                            HIGH RISK
                        </span>
                    </div>
                    <p className="text-gray-600 font-medium text-lg pt-1">
                        Gestational Age: <span className="font-bold text-[#005C5C]">28 Weeks</span> • Expected Due Date: Oct 24, 2024
                    </p>
                </div>
                <div className="flex gap-4 mt-6 md:mt-0">
                    <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold text-sm hover:bg-gray-200 transition-all flex items-center gap-2">
                        <Printer size={16} />
                        Print Record
                    </button>
                    <button className="px-6 py-3 bg-[#005C5C] text-white rounded-full font-bold text-sm hover:bg-teal-800 shadow-lg shadow-teal-900/20 transition-all flex items-center gap-2">
                        <Download size={16} />
                        Export Data
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Left Sidebar (Profile Cards) - 3/12 columns */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Main Profile Info Card */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center">
                        <div className="relative mb-6">
                            <div className="w-32 h-32 bg-[#1A2530] rounded-3xl overflow-hidden border-4 border-white shadow-lg flex items-end justify-center">
                                {/* Mimicking the avatar from the image */}
                                <div className="w-20 h-20 bg-orange-200 rounded-t-full relative z-10 flex flex-col items-center">
                                     <div className="w-10 h-4 bg-gray-800 rounded-t-full -mt-2"></div>
                                     <div className="w-4 h-6 bg-teal-600 mt-6 absolute w-full"></div>
                                </div>
                            </div>
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#00A3A3] text-white rounded-xl flex items-center justify-center border-2 border-white shadow-sm hover:bg-teal-500 transition-colors">
                                <Camera size={14} />
                            </button>
                        </div>

                        <div className="w-full space-y-6 pt-2">
                            <div className="space-y-3 w-full">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">CONTACT DETAILS</p>
                                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <Mail size={16} className="text-[#005C5C]" />
                                    a.silva@email.com
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <Phone size={16} className="text-[#005C5C]" />
                                    +1 (555) 012-3456
                                </div>
                            </div>

                            <div className="space-y-3 w-full">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">EMERGENCY CONTACT</p>
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900 text-sm">Roberto Silva (Spouse)</p>
                                    <p className="text-gray-500 text-sm">+1 (555) 012-7890</p>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors mt-2">
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Premium Care Plan Card */}
                    <div className="bg-[#004D4D] text-white rounded-3xl p-8 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <CreditCard className="text-teal-200/50" size={24} />
                            <span className="text-[10px] font-bold tracking-widest uppercase text-teal-100">PREMIUM CARE</span>
                        </div>
                        <div className="space-y-1 mb-6">
                            <p className="text-[10px] text-teal-200 uppercase tracking-widest font-bold">Provider</p>
                            <p className="font-bold text-lg leading-tight">Blue Cross Maternal Plan</p>
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] text-teal-200 uppercase tracking-widest font-bold">Member ID</p>
                                <p className="font-bold text-sm">MC-9920-X1</p>
                            </div>
                            <QrCode size={24} className="text-white" />
                        </div>
                    </div>

                    {/* Emergency Triage Button */}
                    <button className="w-full py-4 bg-[#C62828] text-white rounded-full font-bold flex items-center justify-center gap-2 shadow-xl shadow-red-900/20 hover:bg-[#B71C1C] transition-colors active:scale-95">
                        <AlertTriangle size={18} />
                        Emergency Triage
                    </button>
                </div>

                {/* Center Column (Timeline) - 6/12 columns */}
                <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-50 text-[#005C5C] rounded-xl flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Medical History</h2>
                        </div>
                        <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
                            <button className="px-4 py-1.5 bg-white text-[#005C5C] font-bold text-xs rounded-full shadow-sm">Timeline</button>
                            <button className="px-4 py-1.5 text-gray-400 font-bold text-xs rounded-full">Grid View</button>
                        </div>
                    </div>

                    {/* Interactive Timeline */}
                    <div className="relative pl-6 space-y-12 before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-100 mb-8">
                        <div className="absolute left-6 top-10 bottom-10 w-px bg-gray-200"></div>

                        {/* Timeline Item 1 - Urgent */}
                        <div className="relative pl-8">
                            <div className="absolute left-[-5px] top-6 w-3 h-3 bg-[#C62828] rounded-full ring-4 ring-white z-10 box-content"></div>
                            <div className="bg-red-50 border border-red-100 rounded-3xl p-6 relative group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[#C62828] bg-white border border-red-100 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                                        <AlertTriangle size={12} fill="currentColor" />
                                        URGENT FLAG
                                    </span>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">2 Hours Ago</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#C62828] mb-2">Potential Preeclampsia Detected</h3>
                                <p className="text-gray-700 text-sm font-medium leading-relaxed mb-6">
                                    Elevated systolic blood pressure (140 mmHg) combined with reported persistent headache and sudden edema in lower extremities.
                                </p>
                                <div className="flex gap-4">
                                    <button className="bg-[#C62828] text-white px-6 py-2 rounded-full text-xs font-bold shadow-lg shadow-red-900/10 hover:bg-[#B71C1C]">Review Vitals</button>
                                    <button className="bg-white text-gray-600 border border-red-100 px-6 py-2 rounded-full text-xs font-bold hover:bg-red-50">Acknowledge</button>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Item 2 - Warning */}
                        <div className="relative pl-8">
                            <div className="absolute left-[-5px] top-4 w-3 h-3 bg-orange-600 rounded-full ring-4 ring-white z-10 box-content"></div>
                            <div className="pt-2">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-orange-600 text-[10px] font-extrabold uppercase tracking-widest">
                                        TRIAGE RESULT
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">May 12, 2024</span>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">Mild Nausea & Dizziness</h3>
                                <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                    Patient completed self-triage. Symptoms recorded as moderate. Recommended hydration and rest.
                                </p>
                            </div>
                        </div>

                        {/* Timeline Item 3 - Routine */}
                        <div className="relative pl-8">
                            <div className="absolute left-[-5px] top-4 w-3 h-3 bg-[#005C5C] rounded-full ring-4 ring-white z-10 box-content"></div>
                            <div className="pt-2">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[#005C5C] text-[10px] font-extrabold uppercase tracking-widest">
                                        ROUTINE CHECKUP
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">May 05, 2024</span>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">24-Week Ultrasound & Vitals</h3>
                                <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                    Fetal heart rate: 145 bpm. Normal growth trajectory. Cervical length measured within normal range.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (Vitals & Actions) - 3/12 columns */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Current Vitals */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-6">
                            <TrendingUp className="text-[#005C5C]" size={20} />
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Current Vitals</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Vital: Blood Pressure */}
                            <div className="bg-gray-50 rounded-3xl p-6 flex items-center justify-between border border-gray-100 transition-all hover:bg-white hover:shadow-md hover:border-red-100 group">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">BLOOD PRESSURE</p>
                                    <div className="flex items-end gap-1">
                                        <h4 className="text-2xl font-extrabold text-[#C62828]">140/90</h4>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400">mmHg</p>
                                </div>
                                <div className="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <TrendingUp size={18} />
                                </div>
                            </div>

                            {/* Vital: Weight */}
                            <div className="bg-gray-50 rounded-3xl p-6 flex items-center justify-between border border-gray-100 transition-all hover:bg-white hover:shadow-md group">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">WEIGHT</p>
                                    <div className="flex items-end gap-1">
                                        <h4 className="text-2xl font-extrabold text-gray-900">72</h4>
                                        <span className="text-xs font-bold text-gray-500 mb-1">kg</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 bg-teal-100 text-[#005C5C] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Scale size={18} />
                                </div>
                            </div>

                            {/* Vital: Fetal Heart Rate */}
                            <div className="bg-gray-50 rounded-3xl p-6 flex items-center justify-between border border-gray-100 transition-all hover:bg-white hover:shadow-md group">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">FETAL HEART RATE</p>
                                    <div className="flex items-end gap-1">
                                        <h4 className="text-2xl font-extrabold text-gray-900">142</h4>
                                        <span className="text-xs font-bold text-gray-500 mb-1">bpm</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 bg-[#A0E2E2] text-[#005C5C] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <HeartPulse size={18} fill="currentColor" className="text-[#005C5C]" />
                                </div>
                            </div>
                        </div>

                        <p className="text-[10px] font-medium text-gray-400 text-center mt-6 italic">Last updated: 14:32 Today</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gray-100 rounded-3xl p-8">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 border-b border-gray-200 pb-4">QUICK ACTIONS</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="bg-white rounded-3xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center group border border-gray-50">
                                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center group-hover:bg-[#005C5C] group-hover:text-white transition-colors">
                                    <Calendar size={18} />
                                </div>
                                <span className="text-xs font-extrabold text-gray-800 leading-tight">Schedule<br/>Visit</span>
                            </button>
                            <button className="bg-white rounded-3xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center group border border-gray-50">
                                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center group-hover:bg-[#005C5C] group-hover:text-white transition-colors">
                                    <MessageSquare size={18} />
                                </div>
                                <span className="text-xs font-extrabold text-gray-800 leading-tight">Send<br/>Message</span>
                            </button>
                            <button className="bg-white rounded-3xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center group border border-gray-50">
                                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center group-hover:bg-[#005C5C] group-hover:text-white transition-colors">
                                    <Stethoscope size={18} />
                                </div>
                                <span className="text-xs font-extrabold text-gray-800 leading-tight">Refer<br/>Specialist</span>
                            </button>
                            <button className="bg-white rounded-3xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center group border border-gray-50">
                                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center group-hover:bg-[#005C5C] group-hover:text-white transition-colors">
                                    <Pill size={18} />
                                </div>
                                <span className="text-xs font-extrabold text-gray-800 leading-tight">Prescribe<br/>Meds</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default PatientProfile;
