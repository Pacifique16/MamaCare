import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';

const LibraryResource = ({ title, category, image, index = 0 }) => {
  let displayImage = image;
  if (title?.includes('Safe Exercises for Pregnancy') || image?.includes('1518611012118-2969c63b07b7')) {
    displayImage = '/sportsprWoman.jpg';
  } else if (title?.includes('Safe Sleep Positions') || image?.includes('1544126592-807daa2b569b')) {
    displayImage = '/SleepingPrWoman.jpg';
  }

  const isImageRight = index % 2 === 0;

  return (
    <div className={`group relative bg-mamacare-teal/5 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 overflow-hidden transition-all duration-500 hover:bg-mamacare-teal/10 hover:shadow-2xl border border-white/50 ${isImageRight ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      
      {/* Content Section */}
      <div className="flex-1 space-y-6 z-10 text-left">
        <div className="space-y-4">
          <span className="px-4 py-1.5 bg-mamacare-teal/10 text-mamacare-teal text-[10px] font-extrabold uppercase tracking-widest rounded-full inline-block">
            {category}
          </span>
          <h3 className="text-3xl font-bold text-[#003e3d] leading-[1.1] tracking-tight group-hover:text-mamacare-teal transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm font-medium text-gray-700/60 leading-relaxed max-w-[280px]">
            Discover essential insights and professional guidance for your maternal journey.
          </p>
        </div>

        <Link to="/library" className="bg-mamacare-teal text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-mamacare-teal/20 hover:bg-mamacare-teal-dark active:scale-95 transition-all inline-block">
          Explore
        </Link>
      </div>

      {/* Image Section */}
      <div className="w-full md:w-1/2 h-64 rounded-[2rem] overflow-hidden relative shadow-2xl transition-transform duration-700 ease-out group-hover:scale-[1.02]">
        <img 
          src={displayImage} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Decorative Element */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:bg-white/20 transition-all duration-700" />
    </div>
  );
};

export default LibraryResource;
