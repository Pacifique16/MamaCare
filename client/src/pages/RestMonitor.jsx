import React from 'react';
import Navbar from '../components/layout/Navbar';
import { AlertCircle, Phone, MessageSquare, BookOpen, Clock, Activity, Scale, ShieldAlert, Utensils, Bell, Users, ChevronRight, BarChart3 } from 'lucide-react';

const RestMonitor = () => {
   return (
      <div className="min-h-screen bg-[#FDFDFD] font-outfit pb-20 overflow-x-hidden">
         {/* Top Red Alert Bar */}
         <div className="fixed top-20 left-0 right-0 z-40 bg-[#BA1A1A] text-white py-3 px-8 flex items-center justify-between shadow-xl animate-pulse">
            <div className="flex items-center gap-3">
               <AlertCircle size={20} />
               <span className="text-xs font-bold uppercase tracking-widest leading-none pt-0.5">Active Alert: Preeclampsia Risk Detected. Please follow your physician's instructions.</span>
            </div>
            <div className="flex items-center gap-6">
               <button className="text-[10px] font-extrabold uppercase tracking-widest border-b border-white pb-0.5 hover:text-white/80 transition-colors">View Emergency Instructions</button>
               <button className="bg-white text-red-600 px-6 py-2 rounded-full font-extrabold text-[10px] flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all">
                  <Phone size={14} />
                  Call Doctor
               </button>
            </div>
         </div>

         <Navbar />

         <main className="pt-40 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
            {/* Main Header */}
            <div className="space-y-6">
               <h1 className="text-6xl font-bold text-[#005C5C] tracking-tight">Rest & Monitor, Aline.</h1>
               <p className="text-gray-400 font-medium max-w-3xl text-lg leading-relaxed">
                  Your doctor has been notified. Focus on rest and monitor your symptoms as instructed. We are monitoring your vitals in real-time.
               </p>
            </div>

            {/* Top Action Cards */}
            <div className="grid md:grid-cols-2 gap-8">
               <div className="bg-[#E6F3F3] rounded-[3rem] p-12 space-y-12 shadow-card border border-[#DCECEC] group hover:shadow-2xl transition-all duration-500">
                  <div className="flex justify-between items-start">
                     <div className="w-16 h-16 bg-[#B2DFE0] rounded-3xl flex items-center justify-center text-[#005C5C] group-hover:scale-110 transition-transform">
                        <MessageSquare size={32} />
                     </div>
                     <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#005C5C]/50">ACTION REQUIRED</span>
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Symptom Log</h2>
                     <p className="text-[#005C5C]/70 font-medium leading-relaxed">Keep track of headaches, vision changes, or swelling every 4 hours.</p>
                  </div>
                  <button className="w-full bg-[#005C5C] text-white py-6 rounded-3xl font-bold text-lg hover:bg-mamacare-teal-dark shadow-xl shadow-mamacare-teal/20 transition-all active:scale-[0.98]">
                     Update Status
                  </button>
               </div>

               <div className="bg-white rounded-[3rem] p-12 space-y-12 shadow-card border border-gray-50 group hover:shadow-2xl transition-all duration-500">
                  <div className="flex justify-between items-start">
                     <div className="w-16 h-16 bg-[#FBE9E7] rounded-3xl flex items-center justify-center text-[#F44336] group-hover:scale-110 transition-transform">
                        <BookOpen size={32} />
                     </div>
                     <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-300">RESOURCE</span>
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Medical Guidance</h2>
                     <p className="text-gray-400 font-medium leading-relaxed">Essential reading on managing Preeclampsia risks and what to expect next.</p>
                  </div>
                  <button className="w-full bg-[#E0E0E0] text-gray-600 py-6 rounded-3xl font-bold text-lg hover:bg-gray-300 transition-all active:scale-[0.98]">
                     Explore Library
                  </button>
               </div>
            </div>

            {/* Vitals Section */}
            <section className="space-y-8 pt-10">
               <div className="flex items-center gap-4">
                  <div className="h-[2px] bg-mamacare-teal w-12 opacity-30"></div>
                  <h3 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#005C5C]">LIVE VITAL MONITORING</h3>
               </div>

               <div className="grid lg:grid-cols-3 gap-8">
                  {/* Blood Pressure Card */}
                  <div className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-card relative overflow-hidden group h-64 flex flex-col justify-between">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#E6F3F3] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform"></div>
                     <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-400">Blood Pressure</p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-6xl font-bold text-[#005C5C] tracking-tighter">140/90</span>
                           <span className="text-sm md:text-md font-bold text-gray-300">mmHg</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 group/status cursor-default">
                        <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-orange-50 text-orange-400 rounded-full">Elevated - Monitoring</span>
                     </div>
                  </div>

                  {/* Weight Status Card */}
                  <div className="bg-[#F8F9FA] rounded-[2.5rem] p-10 border border-gray-100 shadow-card h-64 flex flex-col justify-between relative group">
                     <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-400">Weight Status</p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-6xl font-bold text-gray-900 tracking-tighter">68.4</span>
                           <span className="text-sm md:text-md font-bold text-gray-300">kg</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="px-4 py-2 bg-white rounded-xl shadow-sm flex items-center gap-2">
                           <Activity size={14} className="text-mamacare-teal" />
                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">+0.5kg this week</span>
                        </div>
                     </div>
                  </div>

                  {/* Health Stability Flow Chart */}
                  <div className="bg-[#E6F3F3] rounded-[2.5rem] p-10 shadow-card h-64 flex flex-col justify-between relative overflow-hidden group">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-mamacare-teal italic">Health Stability Flow</span>
                        <BarChart3 size={20} className="text-mamacare-teal/30 group-hover:scale-110 transition-all" />
                     </div>
                     <div className="flex items-end justify-between h-24 gap-2">
                        {[40, 60, 90, 70, 85].map((h, i) => (
                           <div key={i} className="flex-1 relative group/bar">
                              <div
                                 className={`w-full rounded-t-xl transition-all duration-1000 ease-out hover:opacity-100 ${i === 4 ? 'bg-mamacare-teal opacity-100' : 'bg-mamacare-teal/30 opacity-60'}`}
                                 style={{ height: `${h}%` }}
                              ></div>
                              {i === 4 && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full border-2 border-mamacare-teal animate-ping"></div>}
                              {i === 4 && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full border-2 border-mamacare-teal"></div>}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </section>

            {/* Recommended Actions */}
            <section className="space-y-8 pt-10">
               <div className="flex items-center gap-4">
                  <div className="h-[2px] bg-mamacare-teal w-12 opacity-30"></div>
                  <h3 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#005C5C]">RECOMMENDED ACTIONS</h3>
               </div>

               <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-card space-y-6 group hover:scale-[1.02] transition-all">
                     <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-mamacare-teal">
                        <Utensils size={24} />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-xl font-bold text-gray-900 leading-tight">Rest & Nutrition</h4>
                        <p className="text-sm font-medium text-gray-400 leading-relaxed">Focus on a low-sodium diet and left-side resting to improve circulation.</p>
                     </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-card space-y-6 group hover:scale-[1.02] transition-all">
                     <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-400">
                        <Bell size={24} />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-xl font-bold text-gray-900 leading-tight">When to Call Again</h4>
                        <p className="text-sm font-medium text-gray-400 leading-relaxed">Immediate markers: severe headache, upper gastric pain, or vision spots.</p>
                     </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-card space-y-6 group hover:scale-[1.02] transition-all">
                     <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                        <Users size={24} />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-xl font-bold text-gray-900 leading-tight">Emergency Contacts</h4>
                        <p className="text-sm font-medium text-gray-400 leading-relaxed">Direct line to Labor & Delivery and your primary OB-GYN's after-hours line.</p>
                     </div>
                  </div>
               </div>
            </section>
         </main>


      </div>
   );
};

export default RestMonitor;
