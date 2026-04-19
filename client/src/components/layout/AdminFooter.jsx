import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="py-4 border-t border-gray-100 mt-8 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-gray-900 tracking-tight">MamaCare Admin Portal</h4>
          <p className="text-[10px] font-bold text-[#005c5c]/60 uppercase tracking-widest">
            © 2026 MamaCare Maternal Health Platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <a href="/privacy" className="hover:text-mamacare-teal transition-all">Privacy Policy</a>
          <a href="/terms" className="hover:text-mamacare-teal transition-all">Terms of Service</a>
          <a href="/support" className="hover:text-mamacare-teal transition-all">Contact Support</a>
          <a href="/login" className="text-mamacare-teal border-b border-mamacare-teal/30 pb-0.5">Healthcare Provider Login</a>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
