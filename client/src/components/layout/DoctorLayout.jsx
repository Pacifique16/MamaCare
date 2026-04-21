import React from 'react';
import DoctorSidebar from './DoctorSidebar';
import { Search, Bell, HelpCircle, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DoctorLayout = ({ children, title, subtitle, activeActionButton }) => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        if (user?.doctorId) {
            import('../../api/services').then(({ doctorsApi }) => {
                doctorsApi.getById(user.doctorId)
                    .then(r => setProfileImage(r.data.profileImageUrl))
                    .catch(() => {});
            });
        }
    }, [user?.doctorId]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    return (
        <div className="flex min-h-screen bg-[#F5F7F8] font-poppins">
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
                                <p className="text-sm font-bold text-gray-900 leading-none">{user?.name || 'Doctor'}</p>
                                <p className="text-[9px] font-bold text-mamacare-teal uppercase tracking-widest mt-1">Provider</p>
                            </div>
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                                    className="focus:outline-none relative"
                                >
                                    <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-gray-50 hover:ring-mamacare-teal/50 transition-all">
                                        {profileImage ? (
                                            <img src={profileImage} alt={user?.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-mamacare-teal flex items-center justify-center text-white font-bold text-sm">
                                                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'DR'}
                                            </div>
                                        )}
                                    </div>
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden z-50">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Log Out
                                        </button>
                                    </div>
                                )}
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

                <footer className="py-4 px-10 border-t border-gray-50 bg-white">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        <span>MamaCare Provider Portal • HIPAA Compliant Environment</span>
                        <span className="text-[10px] font-bold text-[#005c5c]/60 uppercase tracking-widest">© 2026 MamaCare Maternal Health Platform.</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DoctorLayout;
