import React from 'react';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-4 px-8 border-t border-gray-100 mt-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <span className="text-xl font-bold text-mamacare-teal tracking-tight">MamaCare</span>
        <div className="flex flex-wrap justify-center items-center gap-8 text-[10px] font-bold text-[#006a68] uppercase tracking-widest">
          <a href="#" className="text-red-500 flex items-center gap-2 font-extrabold"><Phone size={12} />Emergency Call</a>
          <Link to="#" className="hover:text-mamacare-teal transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-mamacare-teal transition-colors">Help Center</Link>
          <Link to="#" className="hover:text-mamacare-teal transition-colors">Terms of Service</Link>
        </div>
        <p className="text-[10px] font-bold text-[#005c5c]/60 uppercase tracking-widest">© 2026 MamaCare Maternal Health Platform.</p>
      </div>
    </footer>
  );
};

export default Footer;
