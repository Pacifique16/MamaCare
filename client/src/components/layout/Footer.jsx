import { useNavigate, Link } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
  return (
    <footer className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-mamacare-teal">MamaCare</span>
          </div>

          <div className="flex items-center gap-8">
            <Link to="#" className="text-gray-500 hover:text-mamacare-teal text-sm transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-gray-500 hover:text-mamacare-teal text-sm transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-gray-500 hover:text-mamacare-teal text-sm transition-colors">Contact Support</Link>
          </div>

          <div className="text-gray-400 text-sm">
            © 2026 MamaCare Digital Sanctuary. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
