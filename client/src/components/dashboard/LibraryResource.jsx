import React from 'react';
import { ChevronRight } from 'lucide-react';

const LibraryResource = ({ title, category, image }) => {
  return (
    <div className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-gray-50 transition-all duration-300">
      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 ${
            category === 'NUTRITION' ? 'text-mamacare-teal' : 'text-blue-400'
        }`}>{category}</p>
        <h4 className="text-sm font-bold text-gray-900 leading-tight truncate-2-lines">{title}</h4>
      </div>
      <ChevronRight size={16} className="text-gray-300 group-hover:text-mamacare-teal transition-all group-hover:translate-x-1" />
    </div>
  );
};

export default LibraryResource;
