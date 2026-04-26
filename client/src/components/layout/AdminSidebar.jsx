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
      <div className="p-10 border-b border-gray-50 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mamacare-teal rounded-xl flex items-center justify-center text-white shadow-lg shadow-mamacare-teal/10">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">MamaCare</h2>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Admin Central</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isStaffSection = item.name === 'Staff Directory' && window.location.pathname.includes('/admin/edit-doctor');
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-6 py-4 rounded-xl font-bold text-[13px] transition-all group relative ${(isActive || isStaffSection)
                  ? 'bg-gray-50 text-mamacare-teal'
                  : 'text-gray-600 hover:bg-gray-50/50 hover:text-gray-600'
                }`
              }
            >
              <div className="flex items-center gap-4">
                <item.icon size={18} className="transition-transform group-hover:scale-110" />
                <span className="tracking-tight">{item.name}</span>
              </div>

              {/* Active Marker */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-mamacare-teal rounded-r-full transition-all duration-300 ${window.location.pathname === item.path ? 'opacity-100' : 'opacity-0'
                }`} />

              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
            </NavLink>
          );
        })}
      </nav>

      {/* Lower Actions */}
      <div className="p-8 border-t border-gray-50 space-y-6">
        <NavLink
          to="/admin/add-doctor"
          className="w-full bg-mamacare-teal text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-mamacare-teal/10 hover:bg-mamacare-teal-dark transition-all"
        >
          <PlusCircle size={16} />
          Register Doctor
        </NavLink>

        <div className="space-y-1">
          <NavLink to="/login" className="w-full flex items-center gap-4 px-6 py-3 rounded-xl font-bold text-xs text-red-400 hover:bg-red-50 transition-all mt-4 border border-red-50">
            <LogOut size={16} />
            Logout
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
