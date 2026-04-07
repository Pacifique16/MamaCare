import React from 'react';
import { Stethoscope, ArrowRight, Heart } from 'lucide-react';

const TriageCard = () => {
  return (
    <div className="relative bg-[#FFABAB] rounded-[2.5rem] p-10 md:p-12 text-white overflow-hidden group shadow-xl shadow-[#FFABAB]/20 h-full flex flex-col justify-between">
      {/* Abstract Heart Graphic Background */}
      <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none translate-x-12 translate-y-12 transition-transform duration-700 group-hover:scale-110">
        <Heart size={300} fill="currentColor" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
                <Stethoscope size={28} />
            </div>
            <ArrowRight size={24} className="opacity-60 transition-transform group-hover:translate-x-2" />
        </div>

        <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight leading-tight">
                Smart <br /> Triage
            </h2>
            <p className="text-white/80 text-lg font-medium leading-relaxed max-w-[240px]">
                Feeling something unusual? Check your symptoms quickly with our clinical-grade tool.
            </p>
        </div>
      </div>

      <div className="relative z-10 flex gap-3 mt-8">
        <span className="px-5 py-2 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm border border-white/10 transition-colors group-hover:bg-white/30 cursor-default">
            AVAILABLE 24/7
        </span>
        <span className="px-5 py-2 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm border border-white/10 transition-colors group-hover:bg-white/30 cursor-default">
            FAST RESPONSE
        </span>
      </div>
    </div>
  );
};

export default TriageCard;
