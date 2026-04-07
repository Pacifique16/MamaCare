import React from 'react';
import DoctorSidebar from './DoctorSidebar';
import { Search, Bell, HelpCircle, User } from 'lucide-react';

const DoctorLayout = ({ children, title, subtitle, activeActionButton }) => {
    return (
        <div className="flex min-h-screen bg-[#F5F7F8] font-outfit">
            <DoctorSidebar />
            
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-50">
                    <div className="flex items-center gap-6 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search by name, patient ID, or status..." 
                                className="w-full h-11 bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-mamacare-teal/10 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all">Risk: All</button>
                            <button className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all">Status: Active</button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pl-10">
                        <div className="flex items-center gap-4 border-r border-gray-100 pr-6 mr-6">
                            <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all">
                                <Bell size={20} />
                            </button>
                            <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all">
                                <HelpCircle size={20} />
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900 leading-none">Dr. Sarah Mitchell</p>
                                <p className="text-[9px] font-bold text-mamacare-teal uppercase tracking-widest mt-1">Obstetrician</p>
                            </div>
                            <img 
                                src="https://images.unsplash.com/photo-1559839734-2b71f1536785?auto=format&fit=crop&q=80&w=150" 
                                alt="Dr. Sarah" 
                                className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-50"
                            />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-10 space-y-10">
                    {(title || subtitle) && (
                        <div className="flex justify-between items-end mb-10">
                            <div className="space-y-1">
                                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
                                <p className="text-gray-500 font-medium text-lg">{subtitle}</p>
                            </div>
                            <div>
                                {activeActionButton}
                            </div>
                        </div>
                    )}
                    {children}
                </main>

                <footer className="py-8 px-10 border-t border-gray-50 bg-white">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        <span>MamaCare Provider Portal • HIPAA Compliant Environment</span>
                        <span>© 2024 MamaCare Maternal Health</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DoctorLayout;
