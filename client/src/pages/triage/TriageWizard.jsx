import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import StepIndicator from '../../components/triage/StepIndicator';
import { 
  AlertCircle, AlertTriangle, ChevronLeft, ArrowRight, 
  Activity, Thermometer, Droplets, Zap, Eye, Skull, 
  Heart, Smile, Meh, Frown, Clock, Info, ShieldCheck, 
  Phone, Sparkles, Brain, Scale, CheckCircle2
} from 'lucide-react';
import { triageApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const SYMPTOMS_DB = {
  redFlags: [
    { id: 'headache_severe', label: 'Severe Headache', icon: Skull, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'vision_blurred', label: 'Blurred Vision', icon: Eye, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'swelling_sudden', label: 'Sudden Swelling', icon: Activity, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'bleeding_vaginal', label: 'Vaginal Bleeding', icon: Droplets, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'chest_pain', label: 'Chest Pain', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'breathing_difficulty', label: 'Difficulty Breathing', icon: Zap, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'fetal_movement_reduced', label: 'Reduced Fetal Movement', icon: Activity, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'seizure', label: 'Seizure / Convulsion', icon: Skull, color: 'text-red-500', bg: 'bg-red-50' },
  ],
  moderate: [
    { id: 'nausea', label: 'Nausea / Vomiting', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-50' },
    { id: 'fatigue', label: 'Fatigue', icon: Thermometer, color: 'text-orange-400', bg: 'bg-orange-50' },
    { id: 'headache_mild', label: 'Mild Headache', icon: Heart, color: 'text-orange-400', bg: 'bg-orange-50' },
    { id: 'back_pain', label: 'Back Pain', icon: Activity, color: 'text-orange-400', bg: 'bg-orange-50' },
    { id: 'abdominal_cramps', label: 'Abdominal Cramps', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-50' },
    { id: 'fever', label: 'Fever', icon: Thermometer, color: 'text-orange-400', bg: 'bg-orange-50' },
    { id: 'dizziness', label: 'Dizziness', icon: Eye, color: 'text-orange-400', bg: 'bg-orange-50' },
    { id: 'swelling_mild', label: 'Mild Swelling (feet/ankles)', icon: Droplets, color: 'text-orange-400', bg: 'bg-orange-50' },
    { id: 'urination_painful', label: 'Painful Urination', icon: Droplets, color: 'text-orange-400', bg: 'bg-orange-50' },
    { id: 'insomnia', label: 'Insomnia / Poor Sleep', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-50' },
  ]
};

const TriageWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const motherId = user?.motherId || 1;
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [savedTriageId, setSavedTriageId] = useState(null);
  const [triageResult, setTriageResult] = useState(null);
  
  // Assessment State
  const [assessment, setAssessment] = useState({
    symptoms: [],
    severities: {},
    duration: '1-6 Hours',
    vitals: {
      systolic: '120',
      diastolic: '80',
      temp: '36.6',
      weight: '68.5'
    },
    isAvailable: {
      bp: true,
      temp: true,
      weight: true
    }
  });

  const nextStep = () => {
    setDirection(1);
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSymptom = (id) => {
    setAssessment(prev => {
      const isSelected = prev.symptoms.includes(id);
      const newSymptoms = isSelected 
        ? prev.symptoms.filter(s => s !== id) 
        : [...prev.symptoms, id];
      
      const newSeverities = { ...prev.severities };
      if (!isSelected) newSeverities[id] = 'Moderate'; // Default
      else delete newSeverities[id];

      return { ...prev, symptoms: newSymptoms, severities: newSeverities };
    });
  };

  // Animation variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-poppins">
      <Navbar />
      
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        <StepIndicator currentStep={step} />

        <div className="relative overflow-hidden min-h-[600px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "circOut" }}
              className="w-full"
            >
              {step === 1 && (
                <SymptomsStep 
                  assessment={assessment} 
                  toggleSymptom={toggleSymptom} 
                  onNext={nextStep} 
                />
              )}
              {step === 2 && (
                <SeverityStep 
                  assessment={assessment} 
                  setAssessment={setAssessment} 
                  onNext={nextStep} 
                  onBack={prevStep} 
                />
              )}
              {step === 3 && (
                <VitalsStep 
                  assessment={assessment} 
                  setAssessment={setAssessment} 
                  onNext={async () => {
                    nextStep();
                    try {
                      const res = await triageApi.create({
                        motherId,
                        symptoms: assessment.symptoms,
                        severityScore: Object.values(assessment.severities).filter(v => v === 'Severe').length * 3 +
                          Object.values(assessment.severities).filter(v => v === 'Moderate').length * 2 +
                          Object.values(assessment.severities).filter(v => v === 'Mild').length,
                        durationDescription: assessment.duration,
                        bloodPressureSystolic: parseInt(assessment.vitals.systolic) || null,
                        bloodPressureDiastolic: parseInt(assessment.vitals.diastolic) || null,
                        temperature: parseFloat(assessment.vitals.temp) || null,
                        heartRate: parseFloat(assessment.vitals.heartRate) || null,
                      });
                      setSavedTriageId(res?.data?.id || null);
                      setTriageResult(res?.data || null);
                    } catch {}
                  }}
                  onBack={prevStep} 
                />
              )}
              {step === 4 && (
                <ProcessingStep onNext={nextStep} />
              )}
              {step === 5 && (
                <ResultsStep assessment={assessment} triageResult={triageResult} onRestart={() => { setStep(1); setTriageResult(null); }} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* --- Step 1: Symptoms Selection --- */
const SymptomsStep = ({ assessment, toggleSymptom, onNext }) => (
  <div className="max-w-5xl mx-auto space-y-12">
    <div className="text-center space-y-4">
      <h1 className="text-5xl font-black text-[#005C5C] tracking-tight">How are you feeling?</h1>
      <p className="text-gray-500 font-medium max-w-xl mx-auto">Select any symptoms you're currently experiencing. This helps our AI start the clinical assessment.</p>
    </div>

    <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-card border border-gray-50 space-y-16">
      <section className="space-y-8">
        <div className="flex items-center gap-3 text-red-500">
          <AlertCircle size={20} />
          <h2 className="text-xl font-bold">Priority Symptoms</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {SYMPTOMS_DB.redFlags.map(s => (
            <SymptomCard 
              key={s.id} 
              symptom={s} 
              isSelected={assessment.symptoms.includes(s.id)} 
              onClick={() => toggleSymptom(s.id)} 
              activeColor="red"
            />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-3 text-orange-400">
          <AlertTriangle size={20} />
          <h2 className="text-xl font-bold">General Symptoms</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {SYMPTOMS_DB.moderate.map(s => (
            <SymptomCard 
              key={s.id} 
              symptom={s} 
              isSelected={assessment.symptoms.includes(s.id)} 
              onClick={() => toggleSymptom(s.id)} 
              activeColor="orange"
            />
          ))}
        </div>
      </section>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onNext}
          disabled={assessment.symptoms.length === 0}
          className={`group px-12 py-5 rounded-3xl font-bold flex items-center gap-3 transition-all duration-500 ${
            assessment.symptoms.length > 0 ? 'bg-[#003e3d] text-white shadow-xl shadow-[#003e3d]/20 hover:scale-105' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to Details
          <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  </div>
);

const SymptomCard = ({ symptom, isSelected, onClick, activeColor }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all duration-300 group text-left ${
      isSelected 
        ? activeColor === 'red' ? 'border-red-500 bg-red-50 shadow-lg shadow-red-500/10' : 'border-orange-400 bg-orange-50 shadow-lg shadow-orange-400/10'
        : 'border-gray-50 bg-[#FAFAFA] hover:border-gray-200'
    }`}
  >
    <div className={`w-12 h-12 ${symptom.bg} rounded-2xl flex items-center justify-center ${symptom.color} transition-transform group-hover:scale-110`}>
      <symptom.icon size={24} />
    </div>
    <span className="font-bold text-gray-900 flex-1">{symptom.label}</span>
  </button>
);

/* --- Step 2: Severity & Duration --- */
const SeverityStep = ({ assessment, setAssessment, onNext, onBack }) => {
  const levels = [
    { id: 'Mild', label: 'Mild', icon: Smile, color: 'text-green-500' },
    { id: 'Moderate', label: 'Moderate', icon: Meh, color: 'text-orange-400' },
    { id: 'Severe', label: 'Severe', icon: Frown, color: 'text-red-500' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-[#003e3d] tracking-tight">Tell us more</h1>
        <p className="text-gray-500 font-medium max-w-xl mx-auto">Refining the intensity of your symptoms helps our AI prioritize your safety.</p>
      </div>

      <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-card border border-gray-50 space-y-16">
        {assessment.symptoms.map(symId => {
          const symData = [...SYMPTOMS_DB.redFlags, ...SYMPTOMS_DB.moderate].find(s => s.id === symId);
          return (
            <div key={symId} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${symData?.color === 'text-red-500' ? 'bg-red-500' : 'bg-orange-400'}`} />
                <h3 className="text-xl font-bold text-gray-900">{symData?.label}</h3>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {levels.map(lvl => (
                  <button 
                    key={lvl.id}
                    onClick={() => setAssessment(prev => ({
                      ...prev,
                      severities: { ...prev.severities, [symId]: lvl.id }
                    }))}
                    className={`flex flex-col items-center p-6 rounded-3xl border-2 transition-all ${
                      assessment.severities[symId] === lvl.id ? 'border-[#003e3d] bg-[#003e3d]/5 ring-4 ring-[#003e3d]/5' : 'border-gray-50 bg-[#FAFAFA]'
                    }`}
                  >
                    <lvl.icon size={28} className={assessment.severities[symId] === lvl.id ? lvl.color : 'text-gray-300'} />
                    <span className="text-xs font-bold mt-2">{lvl.label}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
          <button onClick={onBack} className="text-gray-400 font-bold flex items-center gap-2 hover:text-[#003e3d] transition-all">
            <ChevronLeft size={20} /> Back
          </button>
          <button onClick={onNext} className="px-10 py-4 bg-[#003e3d] text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-all">
            Next: Vitals
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- Step 3: Vitals --- */
const VitalsStep = ({ assessment, setAssessment, onNext, onBack }) => (
  <div className="max-w-4xl mx-auto space-y-12">
    <div className="text-center space-y-4">
      <h1 className="text-5xl font-black text-[#003e3d] tracking-tight">Clinical Vitals</h1>
      <p className="text-gray-500 font-medium max-w-xl mx-auto">Optional but highly recommended for a precise clinical baseline.</p>
    </div>

    <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-card border border-gray-50 space-y-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#003e3d]">Blood Pressure (Systolic)</label>
          <input 
            type="text" 
            value={assessment.vitals.systolic} 
            onChange={(e) => setAssessment(prev => ({ ...prev, vitals: { ...prev.vitals, systolic: e.target.value } }))}
            className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#003e3d]/20 text-2xl font-bold"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#003e3d]">Blood Pressure (Diastolic)</label>
          <input 
            type="text" 
            value={assessment.vitals.diastolic} 
            onChange={(e) => setAssessment(prev => ({ ...prev, vitals: { ...prev.vitals, diastolic: e.target.value } }))}
            className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#003e3d]/20 text-2xl font-bold"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#003e3d]">Temperature (°C)</label>
          <input 
            type="text" 
            value={assessment.vitals.temp} 
            onChange={(e) => setAssessment(prev => ({ ...prev, vitals: { ...prev.vitals, temp: e.target.value } }))}
            className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#003e3d]/20 text-2xl font-bold"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#003e3d]">Heart Rate (bpm)</label>
          <input 
            type="text" 
            value={assessment.vitals.heartRate || ''} 
            onChange={(e) => setAssessment(prev => ({ ...prev, vitals: { ...prev.vitals, heartRate: e.target.value } }))}
            className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#003e3d]/20 text-2xl font-bold"
            placeholder="e.g. 80"
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-gray-50">
        <button onClick={onBack} className="text-gray-400 font-bold flex items-center gap-2 hover:text-[#003e3d] transition-all">
          <ChevronLeft size={20} /> Back
        </button>
        <button onClick={onNext} className="group px-12 py-5 bg-[#003e3d] text-white rounded-3xl font-bold shadow-xl flex items-center gap-3 hover:scale-105 transition-all">
          Analyze My Health
          <Sparkles size={20} />
        </button>
      </div>
    </div>
  </div>
);

/* --- Step 4: AI Processing --- */
const ProcessingStep = ({ onNext }) => {
  useEffect(() => {
    const timer = setTimeout(onNext, 3500);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="max-w-2xl mx-auto text-center space-y-12 py-20">
      <div className="relative inline-block">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-mamacare-teal/20 rounded-full blur-3xl"
        />
        <div className="relative bg-white w-32 h-32 rounded-[2.5rem] shadow-2xl flex items-center justify-center text-mamacare-teal mx-auto">
          <Brain size={64} className="animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-[#003e3d] tracking-tight">Analyzing Your Profile</h2>
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map(i => (
            <motion.div 
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ delay: i * 0.2, duration: 0.8, repeat: Infinity }}
              className="w-3 h-3 bg-mamacare-teal rounded-full"
            />
          ))}
        </div>
        <p className="text-gray-400 font-medium">Cross-referencing symptoms with clinical maternity guidelines...</p>
      </div>
    </div>
  );
};

/* --- Step 5: Results --- */
const ResultsStep = ({ triageResult, onRestart }) => {
  const outcomeMap = {
    High: {
      level: 'High', color: 'text-red-500', border: 'border-red-100', ring: 'border-red-500',
    },
    Medium: {
      level: 'Medium', color: 'text-orange-400', border: 'border-orange-100', ring: 'border-orange-400',
    },
    Low: {
      level: 'Low', color: 'text-mamacare-teal', border: 'border-teal-50', ring: 'border-mamacare-teal',
    },
  };

  const risk = triageResult
    ? { ...outcomeMap[triageResult.riskLevel] || outcomeMap.Low, desc: triageResult.aiRecommendation }
    : { level: 'Unknown', color: 'text-gray-400', border: 'border-gray-100', ring: 'border-gray-400', desc: 'Could not retrieve your results. Please try again.' };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-10">
      <div className="text-center space-y-4">
        <div className={`flex items-center justify-center gap-2 ${risk.color}`}>
          <CheckCircle2 size={24} />
          <span className="text-xs font-black uppercase tracking-widest">Assessment Complete</span>
        </div>
        <h1 className="text-5xl font-black text-[#003e3d] tracking-tight">Your Triage Analysis</h1>
      </div>

      <div className="bg-white rounded-[3.5rem] p-12 md:p-20 shadow-2xl border border-gray-50 flex flex-col items-center text-center space-y-12 relative overflow-hidden">
        {/* Abstract Background for Risk Level */}
        <div className={`absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none -mr-20 -mt-20 rounded-full blur-3xl ${risk.level === 'High' ? 'bg-red-500' : 'bg-mamacare-teal'}`} />

        <div className={`w-48 h-48 rounded-full border-8 ${risk.border} flex flex-col items-center justify-center relative transition-all duration-1000`}>
          <div className={`absolute inset-0 border-8 ${risk.ring} rounded-full border-t-transparent -rotate-45`} />
          <span className={`text-4xl font-black ${risk.color}`}>{risk.level}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Risk Level</span>
        </div>

        <div className="space-y-6 max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-900">Clinical Recommendation</h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            {risk.desc}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
          <a href="tel:+250789534491" className={`flex items-center justify-center gap-3 p-6 ${risk.level === 'High' ? 'bg-red-500' : 'bg-mamacare-teal'} text-white rounded-3xl font-bold shadow-xl transition-all hover:scale-105`}>
            <Phone size={20} /> Call Nursing Line
          </a>
          <button className="flex items-center justify-center gap-3 p-6 bg-gray-50 text-gray-900 rounded-3xl font-bold border border-gray-100 transition-all hover:bg-gray-100">
            <Clock size={20} /> Log & Monitor
          </button>
        </div>

        <button onClick={onRestart} className="text-[#003e3d] font-bold underline underline-offset-8 hover:text-mamacare-teal transition-colors">Restart Assessment</button>
      </div>
    </div>
  );
};

export default TriageWizard;
