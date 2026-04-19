import React from 'react';
import { Activity, Clock, HeartPulse, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Symptoms', icon: Activity },
    { id: 2, label: 'Details', icon: Clock },
    { id: 3, label: 'Vitals', icon: HeartPulse },
    { id: 4, label: 'Analysis', icon: BrainCircuit }
  ];

  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-16 relative">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full" />
      
      {/* Progress Line */}
      <motion.div 
        className="absolute top-1/2 left-0 h-1 bg-mamacare-teal -translate-y-1/2 z-0 rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.8, ease: "circOut" }}
      />

      {steps.map((step) => {
        const Icon = step.icon;
        const isActive = currentStep >= step.id;
        const isCurrent = currentStep === step.id;

        return (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
            <motion.div 
              initial={false}
              animate={{ 
                scale: isCurrent ? 1.2 : 1,
                backgroundColor: isActive ? '#005C5C' : '#FFFFFF',
                borderColor: isActive ? '#005C5C' : '#E5E7EB',
                color: isActive ? '#FFFFFF' : '#9CA3AF'
              }}
              className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-shadow duration-500 shadow-sm ${isCurrent ? 'shadow-mamacare-teal/20' : ''}`}
            >
              {isActive && currentStep > step.id ? (
                <CheckCircle2 size={24} />
              ) : (
                <Icon size={24} />
              )}
            </motion.div>
            <span className={`text-[10px] font-bold uppercase tracking-[0.1em] transition-colors duration-500 ${isActive ? 'text-mamacare-teal' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
