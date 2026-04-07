import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TriageLayout from '../../components/triage/TriageLayout';
import { AlertCircle, AlertTriangle, ChevronLeft, ArrowRight, Activity, Thermometer, Droplets, Zap, Eye, Skull, Heart } from 'lucide-react';

const SymptomProfile = () => {
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const symptoms = {
    redFlags: [
        { id: 'headache_severe', label: 'Severe Headache', icon: Skull, color: 'text-red-500', bg: 'bg-red-50' },
        { id: 'vision_blurred', label: 'Blurred Vision', icon: Eye, color: 'text-red-500', bg: 'bg-red-50' },
        { id: 'swelling_sudden', label: 'Sudden Swelling', icon: Activity, color: 'text-red-500', bg: 'bg-red-50' },
    ],
    moderate: [
        { id: 'nausea', label: 'Nausea', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-50' },
        { id: 'fatigue', label: 'Fatigue', icon: Thermometer, color: 'text-orange-400', bg: 'bg-orange-50' },
        { id: 'headache_mild', label: 'Mild Headache', icon: Heart, color: 'text-orange-400', bg: 'bg-orange-50' },
    ]
  };

  const toggleSymptom = (id) => {
    setSelectedSymptoms(prev => 
        prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <TriageLayout step={1} totalSteps={4} stepTitle="Symptom Profile">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full">EMERGENCY CHECK</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">• AI-Powered Assistant</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
                Smart Symptom <span className="italic font-serif text-mamacare-teal">Triage</span>
            </h1>
            <p className="text-gray-500 font-medium max-w-xl leading-relaxed">
                Describe how you're feeling. Our AI analysis helps determine the urgency of your symptoms and provides clinical guidance.
            </p>
        </div>

        {/* Symptom Selection Area */}
        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-card border border-gray-50 space-y-16">
            
            {/* Red Flags Section */}
            <section className="space-y-8">
                <div className="flex items-center gap-3 text-red-500">
                    <AlertCircle size={20} />
                    <h2 className="text-xl font-bold">Red Flag Symptoms</h2>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tight ml-auto">Select these if they are severe or sudden.</span>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                    {symptoms.redFlags.map((s) => (
                        <button 
                            key={s.id}
                            onClick={() => toggleSymptom(s.id)}
                            className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all duration-300 group ${
                                selectedSymptoms.includes(s.id) 
                                ? 'border-red-500 bg-red-50 shadow-lg shadow-red-500/10' 
                                : 'border-gray-50 bg-[#FAFAFA] hover:border-gray-200'
                            }`}
                        >
                            <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center ${s.color} transition-transform group-hover:scale-110`}>
                                <s.icon size={24} />
                            </div>
                            <span className="font-bold text-gray-900">{s.label}</span>
                            <div className={`ml-auto w-6 h-6 rounded-md border-2 border-gray-200 flex items-center justify-center transition-all ${
                                selectedSymptoms.includes(s.id) ? 'bg-red-500 border-red-500 text-white' : 'bg-white'
                            }`}>
                                {selectedSymptoms.includes(s.id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Moderate Symptoms Section */}
            <section className="space-y-8">
                <div className="flex items-center gap-3 text-orange-400">
                    <AlertTriangle size={20} />
                    <h2 className="text-xl font-bold">Moderate Symptoms</h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                    {symptoms.moderate.map((s) => (
                        <button 
                            key={s.id}
                            onClick={() => toggleSymptom(s.id)}
                            className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all duration-300 group ${
                                selectedSymptoms.includes(s.id) 
                                ? 'border-orange-400 bg-orange-50 shadow-lg shadow-orange-400/10' 
                                : 'border-gray-50 bg-[#FAFAFA] hover:border-gray-200'
                            }`}
                        >
                            <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center ${s.color} transition-transform group-hover:scale-110`}>
                                <s.icon size={24} />
                            </div>
                            <span className="font-bold text-gray-900">{s.label}</span>
                            <div className={`ml-auto w-6 h-6 rounded-md border-2 border-gray-200 flex items-center justify-center transition-all ${
                                selectedSymptoms.includes(s.id) ? 'bg-orange-400 border-orange-400 text-white' : 'bg-white'
                            }`}>
                                {selectedSymptoms.includes(s.id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-12 border-t border-gray-50">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-400 font-bold hover:text-mamacare-teal transition-all text-sm group"
                >
                    <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                    Back
                </button>

                <button 
                  onClick={() => navigate('/triage/severity-duration')}
                  disabled={selectedSymptoms.length === 0}
                  className={`px-12 py-5 rounded-[1.5rem] font-bold shadow-xl flex items-center gap-3 transition-all duration-500 ${
                        selectedSymptoms.length > 0 
                        ? 'bg-mamacare-teal text-white shadow-mamacare-teal/20 hover:bg-mamacare-teal-dark hover:scale-105' 
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none grayscale'
                    }`}
                >
                    Next: Severity
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>

        {/* Information Grid */}
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#005C5C] rounded-[2.5rem] p-10 md:p-12 text-white relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-bold leading-tight max-w-[280px]">Want a more precise analysis?</h3>
                    <p className="text-white/60 text-sm font-medium leading-relaxed max-w-sm">
                        Inputting your vitals like Blood Pressure and Heart Rate gives our AI a clinical baseline for more accurate advice.
                    </p>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10 flex items-center gap-2">
                             <Activity size={16} />
                             Vitals Tracking
                        </button>
                        <button className="px-6 py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10 flex items-center gap-2">
                             <Droplets size={16} />
                             Sync History
                        </button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                    <AlertCircle size={200} />
                </div>
            </div>

            <div className="bg-gray-100/50 rounded-[2.5rem] p-10 md:p-12 border border-gray-100 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-mamacare-teal">
                    <Zap size={32} fill="currentColor" opacity="0.2" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">Trusted AI Guidance</h3>
                    <p className="text-gray-400 text-sm font-medium max-w-[280px] mx-auto leading-relaxed">
                        Our clinical models are validated by maternal health experts to prioritize your safety.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </TriageLayout>
  );
};

export default SymptomProfile;
