import React from 'react';

const PasswordStrengthMeter = ({ strength = 3 }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
        <span className="text-gray-400">Password Strength</span>
        <span className="text-mamacare-teal">Strong</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((step) => (
          <div 
            key={step}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              step <= strength ? 'bg-mamacare-teal' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
