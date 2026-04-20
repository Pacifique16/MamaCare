import { User, ChevronDown, Globe, Bell, LayoutDashboard, Stethoscope, BookOpen, Calendar as CalendarIcon, Heart, Activity, LogOut, Baby } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Triage', path: '/triage', icon: Stethoscope },
    { name: 'Library', path: '/library', icon: BookOpen },
    { name: 'Appointments', path: '/appointments', icon: CalendarIcon },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Baby className="text-mamacare-teal transition-transform group-hover:rotate-12" size={24} />
          <span className="text-xl font-bold text-mamacare-teal tracking-tighter">MamaCare</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm transition-colors relative py-2 ${location.pathname.startsWith(link.path)
                ? 'text-mamacare-teal font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-mamacare-teal'
                : 'text-gray-800 font-medium hover:text-mamacare-teal'
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
          <button className="p-2 text-gray-700 hover:text-mamacare-teal transition-colors">
            <Bell size={20} />
          </button>
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full border-2 border-mamacare-teal/20 overflow-hidden flex items-center justify-center hover:bg-mamacare-teal/5 transition-colors focus:outline-none"
            >
              <User size={20} className="text-gray-600 m-auto" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden z-50">
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
    </nav>
  );
};

export default Navbar;
