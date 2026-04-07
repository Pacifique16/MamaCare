import { User, ChevronDown, Globe, Bell, LayoutDashboard, Stethoscope, BookOpen, Calendar as CalendarIcon, Heart, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Triage', path: '/triage/symptom-profile', icon: Stethoscope },
    { name: 'Library', path: '/library', icon: BookOpen },
    { name: 'Appointments', path: '/appointments', icon: CalendarIcon },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-mamacare-teal tracking-tighter">MamaCare</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-bold transition-colors relative py-2 ${location.pathname.startsWith(link.path)
                ? 'text-mamacare-teal after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-mamacare-teal'
                : 'text-gray-400 hover:text-mamacare-teal'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-mamacare-teal bg-[#E6F3F3] rounded-full">
            <Activity size={18} />
          </button>
          <button className="p-2 text-gray-400">
            <Bell size={20} />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-mamacare-teal/20 overflow-hidden">
            <User size={20} className="m-auto" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
