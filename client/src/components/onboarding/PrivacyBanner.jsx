import React from 'react';
import { ShieldCheck } from 'lucide-react';
import safetyImg from '../../assets/data-safety.png';

const PrivacyBanner = () => {
  return (
    <div className="relative w-full bg-mamacare-teal rounded-[2rem] overflow-hidden p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-8 group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 flex-1 space-y-6">
        <h2 className="text-3xl font-bold leading-tight max-w-sm">
          Your data is safe, and your journey is unique.
        </h2>
        <p className="text-white/70 text-sm font-medium max-w-md leading-relaxed">
          We use end-to-end encryption for all medical data. Your records are only accessible to you and your authorized healthcare providers.
        </p>
        <div className="flex items-center gap-2 pt-4 group-hover:scale-105 transition-transform duration-500">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Privacy Guaranteed</span>
        </div>
      </div>

      {/* Illustration Overlay */}
      <div className="relative z-10 w-full md:w-[40%] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-102">
        <img 
          src={safetyImg} 
          alt="Safety Illustration" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-mamacare-teal/20 backdrop-blur-[1px]"></div>
      </div>
    </div>
  );
};

export default PrivacyBanner;
