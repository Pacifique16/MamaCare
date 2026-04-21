import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7F8] font-poppins">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 sticky top-0 z-40">
           <div className="max-w-7xl mx-auto h-full flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <span className="text-[12px] font-bold text-slate-700 tracking-widest uppercase">System Administration</span>
              </div>

              <div className="flex items-center gap-6">
                 <div className="relative group hidden md:block">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-focus-within:text-mamacare-teal" />
                    <input 
                      type="text" 
                      placeholder="Search systems..." 
                      className="bg-white border border-gray-300 rounded-xl py-2 pl-10 pr-4 text-sm  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20 transition-all w-64 text-gray-900"
                    />
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-500 hover:text-mamacare-teal bg-gray-50 rounded-xl transition-all relative">
                       <Bell size={20} />
                       {/* <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span> */}
                    </button>
                    <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>
                    <div className="relative">
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 pl-2 group focus:outline-none"
                        >
                           <div className="w-10 h-10 rounded-full border-2 border-mamacare-teal/20 overflow-hidden flex items-center justify-center text-mamacare-teal group-hover:bg-mamacare-teal/5 transition-all">
                              <User size={20} />
                           </div>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden z-[60]">
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                 </div>
              </div>
           </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1">
          {children}
          <AdminFooter />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
