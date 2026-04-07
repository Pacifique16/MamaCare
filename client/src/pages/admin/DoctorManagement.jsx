import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import AdminFooter from '../../components/layout/AdminFooter';
import { Users, ShieldCheck, Heart, Search, Filter, Download, Edit2, Ban, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorManagement = () => {
    const navigate = useNavigate();
    const doctors = [
        { id: 'MC-49022', name: 'Dr. Sarah Jenkins', specialty: 'Obstetrics & Gynecology', status: 'Verified', lastActive: '2 hours ago', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100' },
        { id: 'MC-88210', name: 'Dr. Michael Chen', specialty: 'Fetal Medicine Specialist', status: 'Pending', lastActive: 'Yesterday', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100' },
        { id: 'MC-31002', name: 'Dr. Elena Rodriguez', specialty: 'Neonatologist', status: 'Verified', lastActive: '3 days ago', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100' },
    ];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto p-8 space-y-12 animate-in slide-in-from-bottom-4 duration-700">
                
                {/* Header Branding */}
                <div className="flex justify-between items-end gap-4">
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">STAFF DIRECTORY</span>
                        <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Doctor Management</h1>
                        <p className="text-gray-400 font-medium">Verify credentials and manage clinical staff access.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/admin/add-doctor')}
                        className="bg-[#005C5C] text-white px-10 py-5 rounded-2xl font-bold text-sm shadow-xl shadow-mamacare-teal/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add New Doctor
                    </button>
                </div>

                {/* KPI Overview (Matches Image 2) */}
                <div className="grid md:grid-cols-3 gap-8 pt-4">
                   <div className="bg-white rounded-[2.5rem] p-10 border border-white shadow-card flex items-center justify-between group hover:shadow-2xl transition-all">
                      <div className="space-y-4">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Practitioners</p>
                         <h3 className="text-6xl font-extrabold text-gray-900 tracking-tighter">142</h3>
                      </div>
                      <div className="w-16 h-16 bg-teal-50 text-mamacare-teal rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                         <Users size={32} />
                      </div>
                   </div>

                   <div className="bg-red-50/50 rounded-[2.5rem] p-10 border border-white shadow-card flex items-center justify-between group hover:shadow-2xl transition-all">
                      <div className="space-y-4">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Verification</p>
                         <h3 className="text-6xl font-extrabold text-gray-900 tracking-tighter">12</h3>
                      </div>
                      <div className="w-16 h-16 bg-red-100 text-red-400 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                         <ShieldCheck size={32} />
                      </div>
                   </div>

                   <div className="bg-blue-50/50 rounded-[2.5rem] p-10 border border-white shadow-card flex items-center justify-between group hover:shadow-2xl transition-all">
                      <div className="space-y-4">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Sessions</p>
                         <h3 className="text-6xl font-extrabold text-gray-900 tracking-tighter">89</h3>
                      </div>
                      <div className="w-16 h-16 bg-blue-100 text-blue-400 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                         <Heart size={32} fill="currentColor" opacity="0.3" />
                      </div>
                   </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 p-4 rounded-[2rem]">
                   <div className="relative w-full md:w-[600px] group">
                      <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mamacare-teal" />
                      <input 
                        type="text" 
                        placeholder="Search by name or medical ID..." 
                        className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-16 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-mamacare-teal/5 transition-all"
                      />
                   </div>
                   <div className="flex items-center gap-4 w-full md:w-auto">
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-100 px-8 py-5 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all">
                         <Filter size={18} />
                         Filters
                      </button>
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-100 px-8 py-5 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all">
                         <Download size={18} />
                         Export
                      </button>
                   </div>
                </div>

                {/* Practitioner Table */}
                <div className="bg-white rounded-[3rem] overflow-hidden border border-white shadow-card animate-in-up duration-1000">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-gray-50/50">
                            <th className="p-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Doctor Details</th>
                            <th className="p-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Specialty</th>
                            <th className="p-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="p-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Active</th>
                            <th className="p-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                         </tr>
                      </thead>
                      <tbody>
                         {doctors.map((doc, i) => (
                           <tr key={i} className="group border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-all">
                              <td className="p-10">
                                 <div className="flex items-center gap-4">
                                    <img src={doc.img} alt={doc.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-100 group-hover:scale-110 transition-transform" />
                                    <div className="space-y-1">
                                       <p className="font-bold text-gray-900 group-hover:text-mamacare-teal transform transition-colors">{doc.name}</p>
                                       <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">ID: {doc.id}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-10">
                                 <p className="text-sm font-bold text-gray-600">{doc.specialty}</p>
                              </td>
                              <td className="p-10">
                                 <span className={`flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                                    doc.status === 'Verified' ? 'bg-teal-50 text-mamacare-teal' : 'bg-orange-50 text-orange-400'
                                 }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${doc.status === 'Verified' ? 'bg-mamacare-teal' : 'bg-orange-400'}`}></div>
                                    {doc.status}
                                 </span>
                              </td>
                              <td className="p-10 text-sm font-bold text-gray-400">
                                 {doc.lastActive}
                              </td>
                              <td className="p-10 text-right md:text-left">
                                 <div className="flex items-center gap-4">
                                    {doc.status === 'Pending' ? (
                                        <button className="bg-mamacare-teal text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-mamacare-teal-dark shadow-lg shadow-mamacare-teal/10 transition-all">
                                            Verify
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => navigate('/admin/edit-doctor')}
                                            className="p-2.5 text-gray-300 hover:text-mamacare-teal bg-gray-50 rounded-xl transition-all"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    )}
                                    <button className="p-2.5 text-gray-300 hover:text-red-400 bg-gray-50 rounded-xl transition-all">
                                       <Ban size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>

                   {/* Pagination (Matches Image 2) */}
                   <div className="p-10 bg-gray-50/50 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-50">
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Showing 1-10 of 142 doctors</p>
                      <div className="flex items-center gap-2">
                         <button className="p-3 text-gray-300 hover:text-mamacare-teal transition-all"><ChevronLeft size={20} /></button>
                         <div className="flex items-center gap-2">
                             <button className="w-10 h-10 bg-mamacare-teal text-white rounded-xl font-bold text-sm shadow-xl shadow-mamacare-teal/20 transform scale-110">1</button>
                             <button className="w-10 h-10 bg-white border border-gray-100 text-gray-400 rounded-xl font-bold text-sm hover:border-mamacare-teal/20 transition-all">2</button>
                             <button className="w-10 h-10 bg-white border border-gray-100 text-gray-400 rounded-xl font-bold text-sm hover:border-mamacare-teal/20 transition-all">3</button>
                         </div>
                         <button className="p-3 text-gray-400 hover:text-mamacare-teal transition-all"><ChevronRight size={20} /></button>
                      </div>
                   </div>
                </div>

                <AdminFooter />
            </div>
        </AdminLayout>
    );
};

// Internal Plus icon for the button
const Plus = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

export default DoctorManagement;
