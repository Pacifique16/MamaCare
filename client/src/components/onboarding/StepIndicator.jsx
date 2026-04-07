import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep = 1 }) => {
  const steps = [
    { label: 'Personal', id: 1 },
    { label: 'Details', id: 2 },
    { label: 'Medical', id: 3 },
  ];

  return (
    <div className="flex items-center justify-center w-full max-w-2xl mx-auto mb-16 px-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step Circle */}
          <div className="flex flex-col items-center relative">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold ${
                currentStep >= step.id 
                  ? 'bg-mamacare-teal border-mamacare-teal text-white shadow-lg shadow-mamacare-teal/20' 
                  : 'bg-white border-gray-200 text-gray-300'
              }`}
            >
              {currentStep > step.id ? <Check size={18} strokeWidth={3} /> : step.id}
            </div>
            <span 
              className={`absolute -bottom-7 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                currentStep >= step.id ? 'text-mamacare-teal' : 'text-gray-300'
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Connection Line */}
          {index < steps.length - 1 && (
            <div className="flex-1 h-[2px] bg-gray-100 mx-4 relative overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full bg-mamacare-teal transition-all duration-500 ease-in-out ${
                    currentStep > step.id ? 'w-full' : 'w-0'
                  }`}
                />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
