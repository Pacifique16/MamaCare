import React from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { Phone } from 'lucide-react';

const TriageLayout = ({ children, step = 1, totalSteps = 4, stepTitle = "Symptom Profile" }) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-poppins pb-4">
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
      <Footer />
    </div>
  );
};

export default TriageLayout;
