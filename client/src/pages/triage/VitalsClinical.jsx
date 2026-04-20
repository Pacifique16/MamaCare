import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TriageLayout from '../../components/triage/TriageLayout';
import { Activity, Thermometer, Scale, Info, ShieldCheck, Phone, CheckCircle2, ChevronLeft, Sparkles } from 'lucide-react';

const VitalsClinical = () => {
  const navigate = useNavigate();
  const [vitals, setVitals] = useState({
      systolic: '120',
      diastolic: '80',
      temp: '36.6',
      weight: '68.5'
  });
  const [tempUnit, setTempUnit] = useState('°C');
  const [isAvailable, setIsAvailable] = useState({
      bp: true,
      temp: true,
      weight: true
  });

  return (
    <TriageLayout step={3} totalSteps={4} stepTitle="Vitals & Clinical Data">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#005C5C]">STEP 3 OF 4</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tight">Vitals & Clinical Data</h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Main Content (8/12) */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* Blood Pressure Card */}
                <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-card border border-gray-50 space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-mamacare-teal/5 rounded-2xl flex items-center justify-center text-mamacare-teal">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Blood Pressure</h3>
                                <p className="text-sm font-medium text-gray-400 leading-tight italic">Measure while sitting and relaxed</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Not Available</span>
                            <button 
                                onClick={() => setIsAvailable(prev => ({ ...prev, bp: !prev.bp }))}
                                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${isAvailable.bp ? 'bg-mamacare-teal' : 'bg-gray-200'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${isAvailable.bp ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>

                    <div className={`grid grid-cols-2 gap-8 transition-opacity duration-300 ${isAvailable.bp ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        <div className="space-y-3">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-700">SYSTOLIC (TOP)</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={vitals.systolic}
                                    onChange={(e) => setVitals(prev => ({ ...prev, systolic: e.target.value }))}
                                    className="input-field bg-gray-50 focus:bg-white py-6 text-2xl font-bold text-gray-900 pr-16" 
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-sm">mmHg</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-700">DIASTOLIC (BOTTOM)</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={vitals.diastolic}
                                    onChange={(e) => setVitals(prev => ({ ...prev, diastolic: e.target.value }))}
                                    className="input-field bg-gray-50 focus:bg-white py-6 text-2xl font-bold text-gray-900 pr-16" 
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-sm">mmHg</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body Temperature Card */}
                <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-card border border-gray-50 space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-400">
                                <Thermometer size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Body Temperature</h3>
                                <p className="text-sm font-medium text-gray-400 leading-tight italic">Use a digital thermometer for accuracy</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Not Available</span>
                            <button 
                                onClick={() => setIsAvailable(prev => ({ ...prev, temp: !prev.temp }))}
                                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${isAvailable.temp ? 'bg-mamacare-teal' : 'bg-gray-200'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${isAvailable.temp ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>

                    <div className={`space-y-4 transition-opacity duration-300 ${isAvailable.temp ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-700">CURRENT TEMP</label>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    value={vitals.temp}
                                    onChange={(e) => setVitals(prev => ({ ...prev, temp: e.target.value }))}
                                    className="input-field bg-gray-50 focus:bg-white py-6 text-2xl font-bold text-gray-900" 
                                />
                            </div>
                            <div className="flex bg-gray-100 rounded-2xl p-1 h-[72px]">
                                <button 
                                    onClick={() => setTempUnit('°C')}
                                    className={`px-8 py-4 rounded-xl font-bold transition-all ${tempUnit === '°C' ? 'bg-white text-mamacare-teal' : 'text-gray-400'}`}
                                >
                                    °C
                                </button>
                                <button 
                                    onClick={() => setTempUnit('°F')}
                                    className={`px-8 py-4 rounded-xl font-bold transition-all ${tempUnit === '°F' ? 'bg-white text-mamacare-teal' : 'text-gray-400'}`}
                                >
                                    °F
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Weight Card */}
                <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-card border border-gray-50 space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-400">
                                <Scale size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Current Weight</h3>
                                <p className="text-sm font-medium text-gray-400 leading-tight italic">Monitor tracking for fluid retention</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Not Available</span>
                            <button 
                                onClick={() => setIsAvailable(prev => ({ ...prev, weight: !prev.weight }))}
                                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${isAvailable.weight ? 'bg-mamacare-teal' : 'bg-gray-200'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${isAvailable.weight ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>

                    <div className={`space-y-4 transition-opacity duration-300 ${isAvailable.weight ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-700">WEIGHT</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={vitals.weight}
                                onChange={(e) => setVitals(prev => ({ ...prev, weight: e.target.value }))}
                                className="input-field bg-gray-50 focus:bg-white py-6 text-2xl font-bold text-gray-900 pr-12" 
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-lg">kg</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-8">
                    <button 
                        onClick={() => navigate('/triage/severity-duration')}
                        className="px-12 py-5 bg-gray-100 text-gray-400 font-bold rounded-full hover:bg-gray-200 hover:text-gray-600 transition-all flex items-center gap-3 group"
                    >
                        <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                        Back
                    </button>

                    <button 
                        onClick={() => navigate('/triage/analysis-results')}
                        className="px-12 py-5 bg-mamacare-teal text-white font-bold rounded-full shadow-xl shadow-mamacare-teal/20 transition-all hover:bg-mamacare-teal-dark hover:scale-105 flex items-center gap-3 group"
                    >
                        Analyze My Symptoms
                        <Sparkles size={20} className="transition-transform group-hover:rotate-12" />
                    </button>
                </div>
            </div>

            {/* Sidebar (4/12) */}
            <div className="lg:col-span-4 space-y-8">
                <section className="bg-mamacare-teal rounded-[2.5rem] p-10 text-white space-y-10 shadow-2xl shadow-mamacare-teal/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                         <Info size={180} />
                    </div>

                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
                        <Info size={24} />
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-3xl font-bold leading-tight">Why Vitals Matter</h3>
                        <p className="text-white/80 text-sm font-medium leading-relaxed">
                            Clinical data allows our AI to detect subtle physiological changes that might be missed during symptom reporting alone. 
                        </p>
                        <p className="text-white/80 text-sm font-medium leading-relaxed italic">
                            For instance, tracking blood pressure is crucial for identifying early signs of <span className="font-bold border-b border-white/40 pb-0.5">preeclampsia</span>, a condition that requires immediate medical attention.
                        </p>
                    </div>

                    <div className="pt-10 border-t border-white/20 flex items-center gap-4">
                        <img 
                            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100" 
                            alt="Advisor" 
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20"
                        />
                        <div>
                            <p className="text-sm font-bold">Dr. Sarah Mitchell</p>
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-tight">OBGYN Advisory Board</p>
                        </div>
                    </div>
                </section>

                <div className="bg-white rounded-[2.5rem] p-10 space-y-8 border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-700">MEDICAL SUPPORT</p>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-mamacare-teal/5 rounded-xl flex items-center justify-center text-mamacare-teal">
                                <Phone size={18} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-gray-900">24/7 Nurse Hotline</h4>
                                <p className="text-[10px] font-medium text-gray-400">Immediate help for urgent vitals concerns.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-mamacare-teal/5 rounded-xl flex items-center justify-center text-mamacare-teal">
                                <ShieldCheck size={18} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-gray-900">Emergency Guide</h4>
                                <p className="text-[10px] font-medium text-gray-400">What to do if your readings are in the red zone.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </TriageLayout>
  );
};

export default VitalsClinical;
