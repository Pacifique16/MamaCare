import React from 'react';
import { useNavigate } from 'react-router-dom';
import TriageLayout from '../../components/triage/TriageLayout';
import { CheckCircle2, AlertCircle, Phone, FileText, ChevronRight, Droplets, Activity, LayoutDashboard, Share2, Clock } from 'lucide-react';

const AnalysisResults = () => {
    const navigate = useNavigate();

    return (
        <TriageLayout step={4} totalSteps={4} stepTitle="Analysis Complete">
            <div className="max-w-7xl mx-auto space-y-12 pb-20">
                {/* Status Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-mamacare-teal" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-mamacare-teal">AI TRIAGE SUCCESS</span>
                    </div>
                    <h1 className="text-6xl font-bold text-gray-900 tracking-tight">Analysis Complete</h1>
                    <p className="text-gray-500 font-medium max-w-xl leading-relaxed">
                        Our specialized maternity AI has reviewed your inputs against clinical guidelines. Please review the findings below.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Main Results (8/12) */}
                    <div className="lg:col-span-8 bg-white rounded-[3rem] p-10 md:p-16 shadow-card border border-gray-50 space-y-16">
                        
                        <div className="flex flex-col md:flex-row items-center gap-12 border-b border-gray-50 pb-16">
                            {/* SVG Risk Gauge */}
                            <div className="relative w-56 h-56 group">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="112" cy="112" r="90"
                                        stroke="currentColor"
                                        strokeWidth="20"
                                        fill="transparent"
                                        className="text-gray-100"
                                    />
                                    <circle
                                        cx="112" cy="112" r="90"
                                        stroke="currentColor"
                                        strokeWidth="20"
                                        strokeDasharray="565.48"
                                        strokeDashoffset="141.37" // 75% for "Moderate"
                                        fill="transparent"
                                        className="text-[#CB8F00] transition-all duration-1000 ease-out"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-4xl font-bold text-[#CB8F00] tracking-tight">Moderate</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Risk Level</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6">
                                <span className="px-5 py-2 bg-orange-50 text-[#CB8F00] text-[10px] font-bold uppercase tracking-widest rounded-full">CLINICAL INDICATOR</span>
                                <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Priority Observation</h2>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    Based on your reported symptoms of <span className="text-gray-900 font-bold border-b-2 border-orange-200">localized leg swelling</span> and recent <span className="text-gray-900 font-bold border-b-2 border-orange-200">elevated blood pressure readings</span>, your case is classified as moderate priority. While not an immediate emergency, clinical follow-up is necessary.
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                                        <Droplets size={14} className="text-orange-400" />
                                        <span className="text-xs font-bold text-gray-500">Fluid Retention</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                                        <Activity size={14} className="text-red-400" />
                                        <span className="text-xs font-bold text-gray-500">BP: 145/92</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="space-y-10">
                            <h3 className="text-2xl font-bold text-gray-900">Detailed Breakdown</h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 bg-mamacare-teal/5 rounded-2xl flex items-center justify-center text-mamacare-teal group-hover:bg-mamacare-teal transition-all group-hover:text-white">
                                        <Droplets size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-bold text-gray-900">Swelling detected</h4>
                                        <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-lg">Consistent with mild edema. Requires monitoring to ensure it does not progress to the hands or face.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 bg-mamacare-teal/5 rounded-2xl flex items-center justify-center text-mamacare-teal group-hover:bg-mamacare-teal transition-all group-hover:text-white">
                                        <AlertCircle size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-bold text-gray-900">Clinical history check</h4>
                                        <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-lg">Previous pregnancy complications increase the sensitivity of this analysis. Risk weight adjusted accordingly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (4/12) */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="bg-mamacare-teal rounded-[2.5rem] p-10 text-white space-y-10 shadow-xl shadow-mamacare-teal/20 relative overflow-hidden">
                            <div className="space-y-8">
                                <h3 className="text-3xl font-bold tracking-tight">Actionable Advice</h3>
                                
                                <div className="bg-white/10 rounded-2xl p-6 border border-white/10 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-teal-200" size={20} />
                                        <h4 className="text-lg font-bold">Next Steps</h4>
                                    </div>
                                    <p className="text-sm font-medium text-teal-50/70 leading-relaxed">Schedule a check-up within 24 hours to review these symptoms with your primary OBGYN.</p>
                                </div>

                                <button className="w-full bg-teal-100/90 text-mamacare-teal py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl">
                                    <Phone size={20} />
                                    Speak with a Nurse
                                </button>
                                
                                <button className="w-full py-2 text-teal-100/60 font-bold hover:text-white text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                    View Full Report (PDF)
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </section>

                        <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-8 space-y-4 animate-pulse">
                            <div className="flex items-center gap-3 text-red-500">
                                <AlertCircle size={20} />
                                <h3 className="text-lg font-bold">When to seek ER care?</h3>
                            </div>
                            <p className="text-xs font-bold text-red-400/80 leading-relaxed">
                                If you experience sudden severe headache, blurred vision, or sharp abdominal pain, proceed to the nearest emergency room immediately.
                            </p>
                        </div>

                        <div className="relative rounded-[2.5rem] overflow-hidden group shadow-2xl h-64">
                            <img 
                                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600" 
                                alt="Nurse" 
                                className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-mamacare-teal/90 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8">
                                <h3 className="text-xl font-bold text-white leading-tight">We're with you every step of the way.</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Health Trends Flow Section */}
                <div className="space-y-12 pt-12">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Your Health Trends</h2>
                    </div>

                    <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-card border border-gray-50 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-5 pointer-events-none">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-mamacare-teal/40 rounded-full blur-[100px]"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/20 rounded-full blur-[100px]"></div>
                        </div>

                        {/* Visual Trend Chart */}
                        <div className="h-48 w-full relative group">
                            <svg viewBox="0 0 1000 150" className="w-full h-full">
                                <defs>
                                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#005C5C" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#005C5C" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path 
                                    d="M0,120 C150,110 250,50 350,90 C450,130 550,40 650,100 C750,160 850,70 1000,80" 
                                    fill="none" 
                                    stroke="#005C5C" 
                                    strokeWidth="3" 
                                    className="transition-all duration-1000 opacity-20"
                                />
                                <path 
                                    d="M0,120 C150,110 250,50 350,90 C450,130 550,40 650,100 C750,160 850,70 1000,80 L1000,150 L0,150 Z" 
                                    fill="url(#trendGrad)"
                                />
                                {/* Pulsing Data Points */}
                                <circle cx="350" cy="90" r="6" fill="#4fd1c5" className="animate-ping" />
                                <circle cx="350" cy="90" r="6" fill="#4fd1c5" />
                                <circle cx="650" cy="100" r="6" fill="#ef4444" className="animate-ping" />
                                <circle cx="650" cy="100" r="6" fill="#ef4444" />
                            </svg>
                        </div>

                        <div className="relative z-10 flex justify-between items-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] pt-8 border-t border-gray-50/50">
                            <span>Week 28</span>
                            <span>Week 29</span>
                            <span>Week 30</span>
                            <span className="text-mamacare-teal">Current</span>
                        </div>
                    </div>
                </div>

                {/* Final Footer Actions */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-10 py-5 bg-white border-2 border-gray-100 rounded-full text-gray-500 font-bold hover:border-mamacare-teal hover:text-mamacare-teal transition-all flex items-center gap-3"
                    >
                        <LayoutDashboard size={20} />
                        Return to Dashboard
                    </button>
                    <button className="px-10 py-5 bg-mamacare-teal text-white rounded-full font-bold shadow-xl shadow-mamacare-teal/20 hover:bg-mamacare-teal-dark transition-all flex items-center gap-3 hover:scale-105 active:scale-95 duration-300">
                        <Share2 size={20} />
                        Share Summary with Doctor
                    </button>
                </div>
            </div>
        </TriageLayout>
    );
};

export default AnalysisResults;
