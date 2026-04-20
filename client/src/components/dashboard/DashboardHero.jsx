import React from 'react';
import { Heart, Apple, ChevronRight } from 'lucide-react';

const DashboardHero = ({ userName = "Aline", week = 28 }) => {
  const progress = (week / 40) * 100;

  return (
    <div className="relative w-full bg-gradient-to-br from-[#005C5C] to-[#008484] rounded-[3rem] overflow-hidden p-12 md:p-16 text-white group shadow-2xl shadow-mamacare-teal/20 transition-all duration-700 hover:scale-[1.01]">
      <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none blur-3xl animate-pulse"></div>

      {/* Background Stylized Graphic */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-white scale-150 transition-transform duration-1000 group-hover:rotate-12 translate-x-20">
          <path d="M100,20 C120,40 180,60 180,100 C180,140 120,160 100,180 C80,160 20,140 20,100 C20,60 80,40 100,20" />
        </svg>
      </div>

      <div className="relative z-10 space-y-12">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Hello, {userName}.
            </h1>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight opacity-90">
              You're in your {week}th week!
            </h2>
          </div>
          <p className="text-white/70 text-lg max-w-md font-medium leading-relaxed pt-2">
            Your journey is progressing beautifully. This week, your baby is developing distinct sleep-wake cycles.
          </p>
        </div>

        <div className="space-y-6 max-w-xl">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
            <span>{progress}% of your journey</span>
            <span>{40 - week} weeks to go</span>
          </div>
          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-teal-200 to-white rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Baby Milestone Floating Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] flex items-center gap-6 group/milestone hover:bg-white/20 transition-all duration-500 cursor-pointer w-fit pr-12">
            <div className="w-14 h-14 bg-white/90 rounded-2xl flex items-center justify-center text-mamacare-teal group-hover/milestone:rotate-12 transition-transform duration-500 shadow-xl">
              <Apple size={28} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/50 mb-1">Weekly Milestone</p>
              <p className="text-lg font-bold">Baby is the size of an eggplant!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
