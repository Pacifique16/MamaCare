import React from 'react';
import { Baby } from 'lucide-react';

const CenteredLayout = ({ children, hideHeader = false, hideFooter = false }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gray-50/50 overflow-hidden font-poppins">
      
      {/* Ripple Background Effect */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
        <div className="relative w-full h-full flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
                <div 
                    key={i}
                    className="ripple"
                    style={{ 
                        width: `${(i + 1) * 300}px`, 
                        height: `${(i + 1) * 300}px`,
                        animationDelay: `${i * -1.2}s`,
                        top: '50%',
                        left: '50%'
                    }}
                />
            ))}
        </div>
      </div>

      {/* Header */}
      {!hideHeader && (
        <div className="relative z-10 flex flex-col items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-mamacare-teal/10 rounded-full flex items-center justify-center text-mamacare-teal">
                <Baby size={24} />
            </div>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-mamacare-teal tracking-tight">MamaCare</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-1">Your Digital Sanctuary</p>
            </div>
        </div>
      )}

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-lg px-4">
        <div className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-gray-200/50 border border-white relative overflow-hidden">
             {children}
        </div>
      </div>

      {/* Footer Text */}
      {!hideFooter && (
        <div className="relative z-10 mt-12 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                Securely Encrypted for your Privacy
            </p>
        </div>
      )}
    </div>
  );
};

export default CenteredLayout;
