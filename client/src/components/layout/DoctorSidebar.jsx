import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  BookOpen, 
  Settings,
  LogOut
} from 'lucide-react';

const DoctorSidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor/dashboard' },
        { icon: Users, label: 'Patients', path: '/doctor/patients' },
        { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
        { icon: MessageSquare, label: 'Messaging', path: '/doctor/messaging' },
        { icon: BookOpen, label: 'Library', path: '/library' },
    ];

    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col sticky top-0">
            <div className="p-8">
                <NavLink to="/doctor/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-mamacare-teal rounded-xl flex items-center justify-center text-white">
                        <span className="font-black text-xl">M</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">MataCare</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Provider Portal</span>
                    </div>
                </NavLink>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm transition-all group
                            ${isActive 
                                ? 'bg-mamacare-teal/5 text-mamacare-teal border-r-4 border-mamacare-teal rounded-r-none pr-12 scale-[1.02]' 
                                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                            }
                        `}
                    >
                        <item.icon size={20} className="transition-transform group-hover:scale-110" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-50 space-y-2">
                <NavLink
                    to="/doctor/settings"
                    className={({ isActive }) => `
                        flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm transition-all
                        ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
                    `}
                >
                    <Settings size={20} />
                    Settings
                </NavLink>
                <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-50 transition-all">
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default DoctorSidebar;
