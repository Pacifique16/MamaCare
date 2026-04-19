import React from 'react';

const LibraryResource = ({ title, category, image }) => {
  let displayImage = image;
  if (title?.includes('Safe Exercises for Pregnancy') || image?.includes('1518611012118-2969c63b07b7')) {
    displayImage = '/sportsprWoman.jpg';
  } else if (title?.includes('Safe Sleep Positions') || image?.includes('1544126592-807daa2b569b')) {
    displayImage = '/SleepingPrWoman.jpg';
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img src={displayImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div>
        <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#007B83]">{category}</span>
        <h5 className="font-bold text-slate-900 leading-snug">{title}</h5>
        <p className="text-xs text-slate-500 mt-1">6 min read • Helpful Guide</p>
      </div>
    </div>
  );
};

export default LibraryResource;
