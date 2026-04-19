import React from 'react';
import Navbar from '../layout/Navbar';
import { Phone } from 'lucide-react';

const TriageLayout = ({ children, step = 1, totalSteps = 4, stepTitle = "Symptom Profile" }) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-poppins pb-20">
      <Navbar />

      <main className="pt-32 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        {/* Progress Header */}
        <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                <span>Step {step} of {totalSteps}: {stepTitle}</span>
                <span>{progress}% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-mamacare-teal transition-all duration-1000 ease-out shadow-lg shadow-mamacare-teal/20"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px]">
            {children}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-4 px-8 border-t border-gray-100 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <span className="text-xl font-bold text-mamacare-teal tracking-tight">MamaCare</span>
            <div className="flex flex-wrap justify-center items-center gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <a href="#" className="text-red-500 flex items-center gap-2">
                   <Phone size={12} />
                   Emergency Call
                </a>
                <a href="#" className="hover:text-mamacare-teal transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-mamacare-teal transition-colors">Help Center</a>
                <a href="#" className="hover:text-mamacare-teal transition-colors">Terms</a>
            </div>
            <p className="text-[10px] font-bold text-[#005c5c]/60 uppercase tracking-widest text-center">
                © 2026 MamaCare Maternal Health Platform.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default TriageLayout;
