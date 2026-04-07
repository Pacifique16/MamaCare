import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
    ChevronLeft, 
    Bell, 
    Search, 
    HelpCircle, 
    LayoutDashboard, 
    Users, 
    ShieldCheck, 
    Calendar, 
    Settings,
    Camera,
    RefreshCcw,
    Lock,
    Globe,
    Save,
    CheckCircle2,
    Plus,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditDoctor = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Basic Info');
    const [status, setStatus] = useState('Pending');

    const tabs = ['Basic Info', 'Credentials', 'Schedule', 'Activity Log'];

    return (
        <AdminLayout>
            <div className="flex h-screen overflow-hidden">
                {/* Internal Page Content */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] overflow-y-auto">
                    
                    {/* Header: Navigation & Context (Matches Image 3) */}
                    <div className="bg-white px-8 py-4 border-b border-gray-100 sticky top-0 z-30 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <button 
                             onClick={() => navigate('/admin/doctors')}
                             className="p-2.5 text-gray-400 hover:text-mamacare-teal bg-gray-50 rounded-xl transition-all"
                           >
                              <ChevronLeft size={20} />
                           </button>
                           <div className="flex items-center gap-4">
                              <h2 className="text-xl font-bold text-gray-900">Edit Profile: Dr. Michael Chen</h2>
                              <span className="px-4 py-1.5 bg-orange-50 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                                 {status === 'Pending' ? 'PENDING VERIFICATION' : status.toUpperCase()}
                              </span>
                           </div>
                        </div>

                        <div className="flex items-center gap-4">
                           <div className="relative group">
                              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                 type="text" 
                                 placeholder="Search resources..." 
                                 className="bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-mamacare-teal/5 transition-all w-64"
                              />
                           </div>
                           <button className="p-2.5 text-gray-400 hover:text-mamacare-teal transition-all"><Bell size={18} /></button>
                           <button className="p-2.5 text-gray-400 hover:text-mamacare-teal transition-all"><HelpCircle size={18} /></button>
                        </div>
                    </div>

                    <div className="flex-1 p-10 max-w-7xl mx-auto w-full grid grid-cols-12 gap-10">
                       
                       {/* Left Profile Summary Column (4/12) */}
                       <div className="col-span-12 lg:col-span-4 space-y-8">
                          {/* Profile Card */}
                          <div className="bg-white rounded-[3rem] p-10 border border-white shadow-card space-y-10 text-center animate-in-up duration-700">
                             <div className="relative w-40 h-40 mx-auto">
                                <img 
                                   src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200" 
                                   alt="Dr. Chen" 
                                   className="w-full h-full rounded-[40px] object-cover ring-8 ring-gray-50 shadow-xl"
                                />
                                <button className="absolute bottom-2 right-2 p-3 bg-mamacare-teal text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white">
                                   <Camera size={18} />
                                </button>
                             </div>

                             <div className="space-y-2">
                                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Dr. Michael Chen</h3>
                                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Senior Obstetrician • ID: #MC-8829</p>
                             </div>

                             <div className="space-y-4 pt-4 border-t border-gray-50">
                                <button className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm bg-gray-50 text-gray-900 hover:bg-gray-100 transition-all">
                                   <RefreshCcw size={16} />
                                   Reset Password
                                </button>
                                <button className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                                   <Lock size={16} className="rotate-12" />
                                   Suspend Access
                                </button>
                             </div>
                          </div>

                          {/* Status Management Card */}
                          <div className="bg-white rounded-[3rem] p-10 border border-white shadow-card space-y-8 animate-in-up duration-1000">
                             <h4 className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.2em] border-b border-gray-50 pb-4">STATUS MANAGEMENT</h4>
                             <div className="space-y-4">
                                {['Verified', 'Pending', 'Inactive'].map((s) => (
                                   <button 
                                      key={s}
                                      onClick={() => setStatus(s)}
                                      className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${
                                         status === s 
                                         ? 'border-mamacare-teal bg-mamacare-teal/5 text-mamacare-teal ring-4 ring-mamacare-teal/5' 
                                         : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-100'
                                      }`}
                                   >
                                      <div className="flex items-center gap-3">
                                         <div className={`w-2 h-2 rounded-full ${s === 'Verified' ? 'bg-mamacare-teal' : s === 'Pending' ? 'bg-orange-400' : 'bg-gray-300'}`}></div>
                                         <span className="font-bold text-sm">{s}</span>
                                      </div>
                                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${status === s ? 'border-mamacare-teal bg-mamacare-teal text-white' : 'border-gray-200'}`}>
                                         {status === s && <CheckCircle2 size={12} />}
                                      </div>
                                   </button>
                                ))}
                             </div>
                          </div>
                       </div>

                       {/* Right Dynamic Content Column (8/12) */}
                       <div className="col-span-12 lg:col-span-8 bg-white rounded-[3rem] border border-white shadow-card animate-in-up duration-500 overflow-hidden flex flex-col">
                          
                          {/* Tabs Navigation */}
                          <div className="p-10 border-b border-gray-50 flex items-center gap-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
                             {tabs.map(tab => (
                               <button 
                                 key={tab}
                                 onClick={() => setActiveTab(tab)}
                                 className={`text-sm font-bold transition-all relative pb-2 ${
                                    activeTab === tab 
                                    ? 'text-mamacare-teal after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-mamacare-teal' 
                                    : 'text-gray-400 hover:text-gray-600'
                                 }`}
                               >
                                 {tab}
                               </button>
                             ))}
                          </div>

                          {/* Tab Content: Basic Info */}
                          <div className="flex-1 p-10 md:p-12 space-y-12 overflow-y-auto max-h-[700px]">
                             
                             {/* Section: Professional Identity */}
                             <div className="space-y-8">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">PROFESSIONAL IDENTITY</h4>
                                <div className="grid md:grid-cols-2 gap-8">
                                   <div className="space-y-3">
                                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                      <input 
                                         type="text" 
                                         defaultValue="Dr. Michael Chen" 
                                         className="w-full bg-gray-50 border border-transparent rounded-2xl p-6 font-bold text-gray-900 focus:outline-none focus:bg-white focus:border-mamacare-teal/20 transition-all shadow-sm"
                                      />
                                   </div>
                                   <div className="space-y-3">
                                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Primary Specialty</label>
                                      <select className="w-full bg-gray-50 border border-transparent rounded-2xl p-6 font-bold text-gray-900 focus:outline-none focus:bg-white focus:border-mamacare-teal/20 transition-all shadow-sm appearance-none">
                                         <option>Obstetrics & Gynecology</option>
                                         <option>Neonatal Care</option>
                                         <option>Pediatrics</option>
                                      </select>
                                   </div>
                                   <div className="space-y-3">
                                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Medical License Number</label>
                                      <input 
                                         type="text" 
                                         defaultValue="MD-99120-X8" 
                                         className="w-full bg-gray-50 border border-transparent rounded-2xl p-6 font-bold text-gray-900 focus:outline-none focus:bg-white focus:border-mamacare-teal/20 transition-all shadow-sm"
                                      />
                                   </div>
                                   <div className="space-y-3">
                                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Years of Experience</label>
                                      <input 
                                         type="number" 
                                         defaultValue="14" 
                                         className="w-full bg-gray-50 border border-transparent rounded-2xl p-6 font-bold text-gray-900 focus:outline-none focus:bg-white focus:border-mamacare-teal/20 transition-all shadow-sm"
                                      />
                                   </div>
                                </div>
                             </div>

                             {/* Section: Contact & Outreach */}
                             <div className="space-y-8">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">CONTACT & OUTREACH</h4>
                                <div className="grid md:grid-cols-2 gap-8">
                                   <div className="space-y-3">
                                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Work Email</label>
                                      <div className="relative">
                                         <input 
                                            type="email" 
                                            defaultValue="m.chen@mamacare.hosp" 
                                            className="w-full bg-gray-100 border border-transparent rounded-2xl p-6 pl-16 font-bold text-gray-900 shadow-sm opacity-60 cursor-not-allowed"
                                            disabled
                                         />
                                         <Users size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                      </div>
                                   </div>
                                   <div className="space-y-3">
                                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Mobile Contact</label>
                                      <input 
                                         type="tel" 
                                         defaultValue="+1 (555) 092-4411" 
                                         className="w-full bg-gray-50 border border-transparent rounded-2xl p-6 font-bold text-gray-900 focus:outline-none focus:bg-white focus:border-mamacare-teal/20 transition-all shadow-sm"
                                      />
                                   </div>
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Clinical Bio</label>
                                   <textarea 
                                      className="w-full bg-gray-50 border border-transparent rounded-[2rem] p-8 font-bold text-gray-900 focus:outline-none focus:bg-white focus:border-mamacare-teal/20 transition-all shadow-sm h-40 resize-none leading-relaxed"
                                      defaultValue="Dr. Chen specialized in high-risk pregnancy management with a focus on maternal wellness and proactive postpartum care. Dedicated to patient education and empathetic clinical practice."
                                   />
                                </div>
                             </div>

                             {/* Language Proficiency */}
                             <div className="space-y-8 pb-10">
                                <div className="flex justify-between items-center">
                                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">LANGUAGE PROFICIENCY</h4>
                                   <span className="px-3 py-1 bg-[#E1F5FE] text-[#039BE5] text-[10px] font-extrabold uppercase tracking-widest rounded-full">Bilingual Enabled</span>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                   <div className="bg-[#E6F3F3] text-mamacare-teal px-6 py-4 rounded-2xl flex items-center gap-4 font-bold text-sm border-2 border-mamacare-teal/10 shadow-sm group">
                                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-extrabold text-[10px] text-mamacare-teal shadow-inner">EN</div>
                                      <span>English (Native)</span>
                                      <CheckCircle2 size={16} className="text-mamacare-teal" />
                                   </div>
                                   <div className="bg-red-50 text-red-500 px-6 py-4 rounded-2xl flex items-center gap-4 font-bold text-sm border-2 border-red-100 shadow-sm group">
                                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-extrabold text-[10px] text-red-500 shadow-inner">KN</div>
                                      <span>Kannada (Fluent)</span>
                                      <CheckCircle2 size={16} className="text-red-400" />
                                   </div>
                                   <button className="flex items-center justify-center w-16 h-16 border-2 border-dashed border-gray-100 rounded-3xl text-gray-300 hover:border-mamacare-teal hover:text-mamacare-teal transition-all">
                                      <Plus size={24} />
                                   </button>
                                </div>
                             </div>
                          </div>

                          {/* Action Bar (Sticky Bottom) */}
                          <div className="p-8 border-t border-gray-50 flex items-center justify-between gap-6 bg-white shrink-0">
                             <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-mamacare-teal rounded-full animate-pulse"></div>
                                <p className="text-xs text-gray-400 font-medium">Last updated: 2026-04-01 | By: admin_sarah</p>
                             </div>
                             <div className="flex items-center gap-6">
                                <button className="text-gray-400 font-extrabold text-xs uppercase tracking-widest hover:text-gray-600 transition-all">Discard Changes</button>
                                <button className="bg-[#005C5C] text-white px-10 py-5 rounded-2xl font-bold text-sm shadow-xl shadow-mamacare-teal/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                                   <Save size={18} />
                                   Save Updates
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default EditDoctor;
