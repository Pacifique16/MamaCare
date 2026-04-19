import React from 'react';

const MetricCard = ({ title, value, unit, status, chartType = 'bar' }) => {
  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-card border border-[#008484]/10 flex flex-col gap-6 group hover:border-[#005c5c]/20 transition-all duration-300 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#006a68]">{title}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#003e3d]">{value}</span>
            <span className="text-sm font-bold text-[#006a68]">{unit}</span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            chartType === 'bar' ? 'bg-mamacare-teal/10 text-mamacare-teal' : 'bg-red-50 text-red-400'
        }`}>
            {/* Small icon indicator as seen in design */}
            <div className="w-2 h-2 rounded-full bg-current"></div>
        </div>
      </div>

      {/* Mini Chart Area */}
      <div className="h-24 w-full flex items-end gap-1.5 pb-4">
        {chartType === 'bar' ? (
          // Bar Chart for Weight
          [40, 60, 50, 70, 85, 100].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 rounded-md bg-mamacare-teal/10 group-hover:bg-mamacare-teal/20 transition-all duration-500 relative overflow-hidden" 
              style={{ height: `${h}%` }}
            >
                {i === 5 && <div className="absolute inset-0 bg-mamacare-teal transition-all"></div>}
            </div>
          ))
        ) : (
          // Wave Line Chart for BP
          <div className="w-full h-full relative">
            <svg viewBox="0 0 200 80" className="w-full h-full">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path 
                d="M0,60 C50,60 50,40 100,50 C150,60 150,20 200,30" 
                fill="none" 
                stroke="url(#lineGrad)" 
                strokeWidth="3" 
                strokeLinecap="round"
                className="drop-shadow-lg"
              />
              <circle cx="200" cy="30" r="4" fill="#ef4444" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <div className={`w-1.5 h-1.5 rounded-full ${chartType === 'bar' ? 'bg-mamacare-teal' : 'bg-red-400'}`}></div>
        <p className="text-[10px] font-bold text-[#005c5c]/80 italic">
          {status}
        </p>
      </div>
    </div>
  );
};

export default MetricCard;
