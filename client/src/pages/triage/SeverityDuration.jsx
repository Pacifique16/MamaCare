import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TriageLayout from '../../components/triage/TriageLayout';
import { Smile, Meh, Frown, Clock, HelpCircle, Lightbulb, ChevronLeft, ArrowRight, Eye, Wind, Activity } from 'lucide-react';

const SeverityDuration = () => {
    const navigate = useNavigate();
    const [severity, setSeverity] = useState({
        'Headache': 'Moderate',
        'Blurred Vision': 'Mild'
    });
    const [duration, setDuration] = useState('1-6 Hours');

    const severityLevels = [
        { id: 'Mild', label: 'Mild', desc: 'Barely noticeable, allows daily tasks', icon: Smile, color: 'text-green-500', bg: 'bg-green-50' },
        { id: 'Moderate', label: 'Moderate', desc: 'Distracting, but manageable', icon: Meh, color: 'text-orange-400', bg: 'bg-orange-50' },
        { id: 'Severe', label: 'Severe', desc: 'Incapacitating, urgent concern', icon: Frown, color: 'text-red-500', bg: 'bg-red-50' }
    ];

    const durations = ['< 1 Hour', '1-6 Hours', '6-24 Hours', '24+ Hours'];

    return (
        <TriageLayout step={2} totalSteps={4} stepTitle="Severity & Duration">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#005C5C]">SYMPTOM ASSESSMENT</span>
                    <h1 className="text-6xl font-bold text-gray-900 tracking-tight">Step 2 of 4: Severity & Duration</h1>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Main Content (8/12) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Symptom Severity Sections */}
                        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-card border border-gray-50 space-y-16">
                            <div className="space-y-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-mamacare-teal rounded-xl flex items-center justify-center text-white">
                                        <Activity size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Symptom Severity</h2>
                                </div>

                                {/* Headache Severity */}
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-mamacare-teal"></div>
                                            <h3 className="text-xl font-bold text-gray-900">Headache</h3>
                                        </div>
                                        <span className="px-5 py-2 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-700">SYMPTOM 01</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        {severityLevels.map((lvl) => (
                                            <button
                                                key={lvl.id}
                                                onClick={() => setSeverity(prev => ({ ...prev, 'Headache': lvl.id }))}
                                                className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all duration-300 group ${severity['Headache'] === lvl.id
                                                        ? 'border-mamacare-teal bg-mamacare-teal/5 ring-4 ring-mamacare-teal/5'
                                                        : 'border-gray-50 bg-[#FAFAFA] hover:border-gray-200'
                                                    }`}
                                            >
                                                <lvl.icon size={32} className={`mb-4 transition-transform group-hover:scale-110 ${severity['Headache'] === lvl.id ? 'text-mamacare-teal' : 'text-gray-300'}`} />
                                                <span className={`text-lg font-bold mb-1 ${severity['Headache'] === lvl.id ? 'text-mamacare-teal' : 'text-gray-900'}`}>{lvl.label}</span>
                                                <p className="text-[10px] font-medium text-gray-400 text-center leading-relaxed px-4">{lvl.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Blurred Vision Severity */}
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-mamacare-teal"></div>
                                            <h3 className="text-xl font-bold text-gray-900">Blurred Vision</h3>
                                        </div>
                                        <span className="px-5 py-2 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-700">SYMPTOM 02</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        {severityLevels.map((lvl) => (
                                            <button
                                                key={lvl.id}
                                                onClick={() => setSeverity(prev => ({ ...prev, 'Blurred Vision': lvl.id }))}
                                                className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all duration-300 group ${severity['Blurred Vision'] === lvl.id
                                                        ? 'border-mamacare-teal bg-mamacare-teal/5 ring-4 ring-mamacare-teal/5'
                                                        : 'border-gray-50 bg-[#FAFAFA] hover:border-gray-200'
                                                    }`}
                                            >
                                                <lvl.icon size={32} className={`mb-4 transition-transform group-hover:scale-110 ${severity['Blurred Vision'] === lvl.id ? 'text-mamacare-teal' : 'text-gray-300'}`} />
                                                <span className={`text-lg font-bold mb-1 ${severity['Blurred Vision'] === lvl.id ? 'text-mamacare-teal' : 'text-gray-900'}`}>{lvl.label}</span>
                                                <p className="text-[10px] font-medium text-gray-400 text-center leading-relaxed px-4">{lvl.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Duration Section */}
                        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-card border border-gray-50 space-y-12">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-mamacare-teal rounded-xl flex items-center justify-center text-white">
                                    <Clock size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Symptom Duration</h2>
                            </div>

                            <p className="text-gray-400 font-medium">How long have you been experiencing these sensations?</p>

                            <div className="grid grid-cols-4 gap-6">
                                {durations.map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setDuration(d)}
                                        className={`py-6 rounded-2xl font-bold transition-all duration-300 border-2 ${duration === d
                                                ? 'bg-[#005C5C] text-white border-[#005C5C] shadow-lg shadow-[#005C5C]/20'
                                                : 'bg-white border-gray-100 text-gray-900 hover:border-gray-200'
                                            }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between pt-8">
                            <button
                                onClick={() => navigate('/triage/symptom-profile')}
                                className="px-12 py-5 bg-gray-100 text-gray-400 font-bold rounded-full hover:bg-gray-200 hover:text-gray-600 transition-all flex items-center gap-3 group"
                            >
                                <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                                Back
                            </button>

                            <button
                                onClick={() => navigate('/triage/vitals-clinical')}
                                className="px-12 py-5 bg-mamacare-teal text-white font-bold rounded-full shadow-xl shadow-mamacare-teal/20 transition-all hover:bg-mamacare-teal-dark hover:scale-105 flex items-center gap-3 group"
                            >
                                Next: Vitals
                                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar (4/12) */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="bg-[#FAFAFA] border border-gray-100 rounded-[2.5rem] p-10 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-900">Why we ask</h3>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                                    Understanding the intensity and timeline of your symptoms helps our AI assess potential risks like Preeclampsia or Gestational Hypertension with greater accuracy.
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                    <Lightbulb size={120} />
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-400">
                                        <Lightbulb size={20} fill="currentColor" opacity="0.2" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#CB8F00]">QUICK TIP</h4>
                                        <p className="text-xs font-bold text-gray-600 italic leading-relaxed">
                                            "Try to focus on how the symptoms feel right now compared to your normal wellness state."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="relative rounded-[2.5rem] overflow-hidden group shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1518611012118-2969c63b07b7?auto=format&fit=crop&q=80&w=600"
                                alt="Calm"
                                className="w-full h-80 object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-10 space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">SANCTUARY MODE</span>
                                <h3 className="text-2xl font-bold text-white leading-tight">Take a deep breath. You're doing great.</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TriageLayout>
    );
};

export default SeverityDuration;
