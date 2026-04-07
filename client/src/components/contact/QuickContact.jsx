import React from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const QuickContact = () => {
  return (
    <div className="space-y-6">
      {/* Presence Card */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-gray-50 flex flex-col gap-6 relative overflow-hidden group">
        <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-500">
             <MapPin size={120} className="text-gray-400" />
        </div>
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-mamacare-teal">
          <MapPin size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Our Presence</h3>
          <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-[180px]">
            124 Sanctuary Way, Wellness District, CA 90210
          </p>
        </div>
        <button className="flex items-center gap-2 text-mamacare-teal font-bold text-sm tracking-tight hover:gap-3 transition-all">
          View on Map <ArrowRight size={16} />
        </button>
      </div>

      {/* Quick Contact Card */}
      <div className="bg-mamacare-teal rounded-[2.5rem] p-8 shadow-2xl shadow-mamacare-teal/20 text-white flex flex-col gap-8 transition-all hover:-translate-y-1 hover:bg-mamacare-teal-dark duration-300">
        <h3 className="text-xl font-bold">Quick Contact</h3>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-white/50 mb-1">Email support</p>
              <p className="text-sm font-bold">hello@mamacare.app</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-white/50 mb-1">24/7 Helpline</p>
              <p className="text-sm font-bold">+1 (800) MAMA-CARE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickContact;
