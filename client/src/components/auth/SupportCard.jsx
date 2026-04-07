import React from 'react';

const SupportCard = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 max-w-[200px] transition-transform hover:scale-105 duration-300">
      <p className="text-[10px] font-bold uppercase tracking-wider text-mamacare-teal mb-3">Need Support?</p>
      <p className="text-[12px] text-gray-500 font-medium mb-4 leading-relaxed">
        Our community is here for you 24/7.
      </p>
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
            >
              <img 
                src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                alt="Support Agent"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-mamacare-teal/10 flex items-center justify-center text-[10px] font-bold text-mamacare-teal">
            +12
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportCard;
