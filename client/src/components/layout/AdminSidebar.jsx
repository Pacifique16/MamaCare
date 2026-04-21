import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  PlusCircle,
  HelpCircle,
  LogOut,
  ChevronRight,
  Baby,
  CalendarDays,
  Settings,
  MessageSquarePlus,
  BookOpen,
  Inbox
} from 'lucide-react';

const AdminSidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('mamacare_user');
    window.location.href = '/';
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Staff Directory', icon: Users, path: '/admin/doctors' },
    { name: 'Patients', icon: Baby, path: '/patients' },
    { name: 'Appointments', icon: CalendarDays, path: '/patient-appointments' },
    { name: 'Article Requests', icon: MessageSquarePlus, path: '/admin/article-requests' },
    { name: 'Health Library', icon: BookOpen, path: '/admin/library' },
    { name: 'Contact Messages', icon: Inbox, path: '/admin/contact-messages' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 font-poppins">
      <div className="p-8 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mamacare-teal rounded-xl flex items-center justify-center text-white shadow-lg shadow-mamacare-teal/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Admin Portal</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isStaffSection = item.name === 'Staff Directory' && window.location.pathname.includes('/admin/edit-doctor');
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all group ${(isActive || isStaffSection)
                  ? 'bg-mamacare-teal/5 text-mamacare-teal'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`
              }
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className="transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </NavLink>
          );
        })}
      </nav>

      {/* Lower Actions */}
      <div className="p-6 border-t border-gray-50 space-y-4">
        <NavLink
          to="/admin/add-doctor"
          className="w-full bg-mamacare-teal text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-mamacare-teal/20 hover:bg-mamacare-teal-dark transition-all active:scale-[0.98]"
        >
          <PlusCircle size={18} />
          Add New Doctor
        </NavLink>

        <div className="space-y-1">
          <NavLink to="/settings" className={({ isActive }) => `w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${isActive ? 'bg-mamacare-teal/5 text-mamacare-teal' : 'text-gray-400 hover:bg-gray-50'}`}>
            <Settings size={18} />
            Settings
          </NavLink>
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-gray-400 hover:bg-gray-50 transition-all">
            <HelpCircle size={18} />
            Support
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
