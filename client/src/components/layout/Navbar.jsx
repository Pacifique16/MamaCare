import { User, ChevronDown, Globe, Bell, LayoutDashboard, Stethoscope, BookOpen, Calendar as CalendarIcon, Heart, Activity, LogOut, Baby, X, MessageSquare } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentsApi, messagesApi } from '../../api/services';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  const [unreadMessages, setUnreadMessages] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Poll unread message count for mothers
  useEffect(() => {
    if (user?.role !== 'Mother' || !user?.motherId) return;
    const checkUnread = () => {
      messagesApi.getMotherConversation(user.motherId)
        .then(r => {
          const total = r.data.reduce((sum, d) => sum + (d.unreadCount || 0), 0);
          setUnreadMessages(total);
          sessionStorage.setItem(`doctors_${user.motherId}`, JSON.stringify(r.data));
        })
        .catch(() => {});
    };
    // Use cached value immediately
    const cached = sessionStorage.getItem(`doctors_${user.motherId}`);
    if (cached) {
      const total = JSON.parse(cached).reduce((sum, d) => sum + (d.unreadCount || 0), 0);
      setUnreadMessages(total);
    }
    checkUnread();
    const interval = setInterval(checkUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Fetch cancelled appointments as notifications for mothers
  useEffect(() => {
    if (user?.role !== 'Mother' || !user?.motherId) return;
    appointmentsApi.getAll({ motherId: user.motherId })
      .then(r => {
        const cancelled = r.data.filter(a => a.status === 'Cancelled');
        // Load dismissed notifications from localStorage
        const dismissed = JSON.parse(localStorage.getItem('dismissed_notifs') || '[]');
        setNotifications(cancelled.filter(a => !dismissed.includes(a.id)));
      })
      .catch(() => {});
  }, [user]);

  // Close notif dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dismissNotif = (id) => {
    const dismissed = JSON.parse(localStorage.getItem('dismissed_notifs') || '[]');
    localStorage.setItem('dismissed_notifs', JSON.stringify([...dismissed, id]));
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const links = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Triage', path: '/triage', icon: Stethoscope },
    { name: 'Library', path: '/library', icon: BookOpen },
    { name: 'Appointments', path: '/appointments', icon: CalendarIcon },
    { name: 'Messages', path: '/messaging', icon: MessageSquare, badge: unreadMessages },
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
              {link.badge > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-mamacare-teal bg-[#E6F3F3] rounded-full">
            <Activity size={18} />
          </button>
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="relative p-2 text-gray-700 hover:text-mamacare-teal transition-colors"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                  <p className="font-bold text-gray-900 text-sm">Notifications</p>
                  {notifications.length > 0 && (
                    <button onClick={() => { notifications.forEach(n => dismissNotif(n.id)); }} className="text-[10px] font-bold text-gray-400 hover:text-mamacare-teal uppercase tracking-widest">
                      Clear all
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <Bell size={24} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 font-medium">No new notifications</p>
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.map(n => (
                      <div key={n.id} className="px-5 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                          <X size={14} className="text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900">Appointment Cancelled</p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">
                            {n.type?.replace(/([A-Z])/g, ' $1').trim()} · {new Date(n.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          {n.cancellationReason && (
                            <p className="text-xs text-red-400 font-medium mt-1">Reason: {n.cancellationReason}</p>
                          )}
                        </div>
                        <button onClick={() => dismissNotif(n.id)} className="text-gray-300 hover:text-gray-500 shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full border-2 border-mamacare-teal/20 overflow-hidden flex items-center justify-center hover:bg-mamacare-teal/5 transition-colors focus:outline-none"
            >
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User size={20} className="text-gray-600 m-auto" />
              )}
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden z-50">
                <a href="/settings" className="w-full px-4 py-3 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors block">
                  Settings
                </a>
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
