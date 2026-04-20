import React from 'react';
import { Stethoscope, ArrowRight, Heart } from 'lucide-react';

const TriageCard = () => {
  return (
    <div className="relative bg-gradient-to-br from-[#FF8A8A] to-[#FF5E5E] rounded-[3rem] p-10 md:p-14 text-white overflow-hidden group shadow-2xl shadow-pink-500/20 h-full flex flex-col justify-center transition-all duration-700 hover:scale-[1.01]">
      {/* Abstract Graphic Background */}
      <div className="absolute right-[-5%] bottom-[-5%] opacity-20 pointer-events-none transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-6">
        <Heart size={380} fill="currentColor" />
      </div>

      <div className="relative z-10 space-y-10">
        <div className="flex justify-between items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center text-white border border-white/20 transition-all duration-500 group-hover:bg-white group-hover:text-[#FF5E5E] group-hover:rotate-12">
                <Stethoscope size={32} />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/60 transition-all duration-500 group-hover:text-white group-hover:translate-x-1">
                <ArrowRight size={20} />
            </div>
        </div>

        <div className="space-y-6">
            <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-white/60">Clinical Assessment</span>
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-none">
                    Smart <br /> Triage
                </h2>
            </div>
            <p className="text-white/90 text-lg font-bold leading-relaxed max-w-sm">
                Feeling something unusual? Check your symptoms quickly with our clinical-grade tool.
            </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
            <span className="px-6 py-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white border border-white/10 transition-all group-hover:bg-white/30">
                AVAILABLE 24/7
            </span>
            <span className="px-6 py-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white border border-white/10 transition-all group-hover:bg-white/30">
                AI POWERED
            </span>
        </div>
      </div>
    </div>
  );
};

export default TriageCard;
