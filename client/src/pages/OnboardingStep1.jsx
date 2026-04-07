import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/onboarding/StepIndicator';
import TrimesterSelector from '../components/onboarding/TrimesterSelector';
import PrivacyBanner from '../components/onboarding/PrivacyBanner';
import { User, Calendar, Baby, Activity, ShieldCheck, Heart, Stethoscope, ChevronLeft, ArrowRight, UserPlus, Droplets, Thermometer } from 'lucide-react';

const OnboardingStep1 = () => {
  const navigate = useNavigate();
  const [gestationalDiabetes, setGestationalDiabetes] = useState(false);
  const [hypertension, setHypertension] = useState(true);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-outfit pb-20">
      {/* Navbar - MaternalCare Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-2xl font-bold text-[#005C5C] tracking-tight">MaternalCare</span>
          <div className="hidden md:flex items-center gap-10">
            {['Dashboard', 'Triage', 'Library', 'Appointments'].map((item) => (
              <a key={item} href="#" className="text-sm font-bold text-gray-400 hover:text-[#005C5C] transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-400">EN/KN</span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <User size={18} />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 px-4 md:px-8 max-w-5xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-5">
          <span className="px-5 py-1.5 bg-[#FF69B4]/10 text-[#FF69B4] text-[10px] font-bold uppercase tracking-widest rounded-full">
            ONBOARDING JOURNEY
          </span>
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Tailoring your care journey.</h1>
          <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
            Let's create your pregnancy profile. This information helps us provide you with the most relevant medical insights and reminders.
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={1} />

        {/* Form Sections */}
        <div className="space-y-8">

          {/* Section 1: Personal Information */}
          <section className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-card border border-gray-50/50 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-mamacare-teal/5 rounded-2xl flex items-center justify-center text-mamacare-teal">
                <UserPlus size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your basic identity for hospital registration.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                <input type="text" placeholder="Sarah Mitchell" className="input-field bg-gray-50 focus:bg-white border-none py-4 text-gray-900 font-bold" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date of Birth</label>
                <div className="relative">
                  <input type="text" placeholder="mm/dd/yyyy" className="input-field bg-gray-50 focus:bg-white border-none py-4 text-gray-900 font-bold" />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</label>
                <div className="relative">
                  <input type="text" placeholder="Seattle, WA" className="input-field bg-gray-50 focus:bg-white border-none py-4 text-gray-900 font-bold" />
                  <Activity className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Pregnancy Details */}
          <section className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-card border border-gray-50/50 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FF69B4]/5 rounded-2xl flex items-center justify-center text-[#FF69B4]">
                <Baby size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pregnancy Details</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">How far along are you in this journey?</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Trimester</span>
                <TrimesterSelector defaultValue="2nd" />
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Expected Due Date</label>
                  <div className="relative">
                    <input type="text" placeholder="mm/dd/yyyy" className="input-field bg-gray-50 focus:bg-white border-none py-4 text-gray-900 font-bold" />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Weight (kg)</label>
                  <div className="relative">
                    <input type="text" placeholder="68" className="input-field bg-gray-50 focus:bg-white border-none py-4 text-gray-900 font-bold pr-12" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">kg</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Medical History */}
          <section className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-card border border-gray-50/50 space-y-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-400">
                <Stethoscope size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Medical History</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pre-existing conditions for personalized risk assessment.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-300">
                    <Droplets size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Gestational Diabetes</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight leading-tight">History or current concerns with blood sugar levels.</p>
                  </div>
                </div>
                <button
                  onClick={() => setGestationalDiabetes(!gestationalDiabetes)}
                  className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${gestationalDiabetes ? 'bg-mamacare-teal' : 'bg-gray-200'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${gestationalDiabetes ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-300">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Hypertension</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight leading-tight">History of high blood pressure or preeclampsia.</p>
                  </div>
                </div>
                <button
                  onClick={() => setHypertension(!hypertension)}
                  className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${hypertension ? 'bg-mamacare-teal' : 'bg-gray-200'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${hypertension ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-12 gap-8">
          <button className="flex items-center gap-2 text-gray-400 font-bold hover:text-mamacare-teal transition-all text-sm group">
            <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            Save and finish later
          </button>

          <div className="flex items-center gap-4">
            <button className="px-10 py-4 bg-gray-100 text-gray-400 font-bold rounded-[1.25rem] hover:bg-gray-200 hover:text-gray-600 transition-all">
              Previous
            </button>
            <button
              onClick={() => navigate('/onboarding/complete')}
              className="px-10 py-4 bg-mamacare-teal text-white font-bold rounded-[1.25rem] shadow-xl shadow-mamacare-teal/20 transition-all hover:bg-mamacare-teal-dark flex items-center gap-2 group"
            >
              Next Step
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Privacy Banner */}
        <div className="pt-20">
          <PrivacyBanner />
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="pt-32 pb-12 px-8 border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-xl font-bold text-[#005C5C] tracking-tight">MaternalCare</span>
          <div className="flex items-center gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
            <a href="#">Healthcare Provider Login</a>
          </div>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            © 2026 MaternalCare platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingStep1;
