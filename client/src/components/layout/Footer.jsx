import { Phone, Baby } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-4 px-8 border-t border-gray-100 mt-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <Baby className="text-mamacare-teal" size={24} />
          <span className="text-xl font-bold text-mamacare-teal tracking-tight">MamaCare</span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 text-[12px] font-medium text-gray-700 font-poppins tracking-wider">
          <Link to="/emergency" className="text-red-500 flex items-center gap-2 hover:text-red-600 transition-colors"><Phone size={12} />Emergency Call</Link>
          <Link to="/privacy" className="hover:text-mamacare-teal transition-colors">Privacy Policy</Link>
          <Link to="/help" className="hover:text-mamacare-teal transition-colors">Help Center</Link>
          <Link to="/terms" className="hover:text-mamacare-teal transition-colors">Terms of Service</Link>
        </div>
        <p className="text-[12px] font-medium text-[#005c5c]/60 font-poppins tracking-wider">© 2026 MamaCare Maternal Health Platform.</p>
      </div>
    </footer>
  );
};

export default Footer;
