import React from 'react';

const MetricCard = ({ title, value, unit, status, chartType = 'bar' }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] space-y-4 font-body hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400">{title}</span>
          <div className="text-3xl font-bold text-slate-900 mt-1">
            {value} <span className="text-base font-medium text-slate-400">{unit}</span>
          </div>
        </div>
        
        {chartType === 'bar' ? (
          <span className="text-xs font-bold text-mamacare-teal bg-mamacare-teal/10 px-2 py-1 rounded">{status}</span>
        ) : (
          <span className="material-symbols-outlined text-mamacare-teal" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        )}
      </div>

      {chartType === 'bar' ? (
        <div className="h-48 w-full relative overflow-hidden rounded-md">
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 h-full pt-4 px-1">
            <div className="w-full bg-mamacare-teal/10 rounded-t-sm group relative h-full flex flex-col justify-end">
              <div className="bg-mamacare-teal h-[40%] rounded-t-sm transition-all hover:opacity-80"></div>
            </div>
            <div className="w-full bg-mamacare-teal/10 rounded-t-sm group relative h-full flex flex-col justify-end">
              <div className="bg-mamacare-teal h-[55%] rounded-t-sm transition-all hover:opacity-80"></div>
            </div>
            <div className="w-full bg-mamacare-teal/10 rounded-t-sm group relative h-full flex flex-col justify-end">
              <div className="bg-mamacare-teal h-[45%] rounded-t-sm transition-all hover:opacity-80"></div>
            </div>
            <div className="w-full bg-mamacare-teal/10 rounded-t-sm group relative h-full flex flex-col justify-end">
              <div className="bg-mamacare-teal h-[65%] rounded-t-sm transition-all hover:opacity-80"></div>
            </div>
            <div className="w-full bg-mamacare-teal/10 rounded-t-sm group relative h-full flex flex-col justify-end">
              <div className="bg-mamacare-teal h-[75%] rounded-t-sm transition-all hover:opacity-80"></div>
            </div>
            <div className="w-full bg-mamacare-teal/10 rounded-t-sm group relative h-full flex flex-col justify-end">
              <div className="bg-mamacare-teal h-[70%] rounded-t-sm transition-all hover:opacity-80"></div>
            </div>
            <div className="w-full bg-mamacare-teal/10 rounded-t-sm group relative h-full flex flex-col justify-end">
              <div className="bg-mamacare-teal h-[85%] rounded-t-sm transition-all hover:opacity-80"></div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30 pointer-events-none"></div>
        </div>
      ) : (
        <div className="h-48 w-full relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 100">
            <path className="opacity-30 hover:opacity-50 transition-opacity text-mamacare-teal" d="M0,50 Q25,20 50,50 T100,50 T150,50 T200,50" fill="none" stroke="currentColor" strokeWidth="2"></path>
            <path className="text-mamacare-teal" d="M0,60 Q25,30 50,60 T100,60 T150,60 T200,60" fill="none" stroke="currentColor" strokeWidth="3"></path>
          </svg>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30 pointer-events-none"></div>
        </div>
      )}

      <div className="text-[10px] font-bold text-slate-400 text-center  tracking-widest">
        {chartType === 'bar' ? 'Weight Trend (7 Days)' : 'Cardiovascular Stability'}
      </div>
    </div>
  );
};

export default MetricCard;
