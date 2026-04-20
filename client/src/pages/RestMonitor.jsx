import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { mothersApi } from '../api/services';
import { 
  AlertCircle, Phone, MessageSquare, BookOpen, Clock, Activity, 
  Scale, ShieldAlert, Utensils, Bell, Users, ChevronRight, 
  BarChart3, Heart, Sparkles, Zap, ShieldCheck
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const RestMonitor = () => {
    const { user } = useAuth();
    const motherId = user?.motherId || 1;
    const [mother, setMother] = React.useState(null);

    React.useEffect(() => {
        mothersApi.getById(motherId).then(r => setMother(r.data)).catch(() => {});
    }, [motherId]);

    // Stagger container for entrance animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-poppins pb-8 overflow-x-hidden">
            {/* Premium Safety Banner (Glassmorphism) */}
            {/* Premium Safety Banner (Commented out for future AI integration) */}
            {/* 
            <motion.div 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl"
            >
                <div className="bg-[#BA1A1A]/90 backdrop-blur-xl text-white py-4 px-8 rounded-full flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_20px_50px_rgba(186,26,26,0.3)] border border-white/20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                            <AlertCircle size={18} />
                        </div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] leading-tight">
                            Safety Alert: Elevated Risk Detected. Follow protocol below.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-[10px] font-bold uppercase tracking-widest hover:underline decoration-white/30 underline-offset-4 transition-all">Emergency Help</button>
                        <button className="bg-white text-[#BA1A1A] px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg">
                            <Phone size={14} fill="currentColor" />
                            Call Doctor
                        </button>
                    </div>
                </div>
            </motion.div>
            */}

            <Navbar />

            <main className="pt-28 px-6 md:px-12 max-w-7xl mx-auto space-y-20">
                {/* Editorial Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                   
                    <h1 className="text-5xl md:text-6xl font-black text-[#003e3d] tracking-tighter leading-tight">
                        Rest & Monitor, <span className="text-mamacare-teal italic">{mother?.fullName?.split(' ')[0] || 'Mama'}.</span>
                    </h1>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed italic">
                        Your clinical team has been updated. Focus on gentle recovery while we track your health markers in real-time.
                    </p>
                </motion.div>

                {/* Hero Action Cards */}
                <motion.section 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid lg:grid-cols-2 gap-10"
                >
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white rounded-[3.5rem] p-12 md:p-14 space-y-10 shadow-card border border-gray-50 group hover:shadow-3xl transition-all duration-700 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                             <Zap size={200} />
                        </div>
                        <div className="flex justify-between items-start relative z-10">
                            <div className="w-16 h-16 bg-mamacare-teal/5 rounded-[1.5rem] flex items-center justify-center text-mamacare-teal ring-8 ring-mamacare-teal/5">
                                <MessageSquare size={32} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-mamacare-teal bg-mamacare-teal/5 px-4 py-2 rounded-full border border-mamacare-teal/10">Action Required</span>
                        </div>
                        <div className="space-y-3 relative z-10">
                            <h2 className="text-xl font-bold text-[#005C5C] tracking-tight">Symptom Log</h2>
                            <p className="text-gray-400 font-medium leading-relaxed text-sm">
                                Log any physiological changes every 4 hours. This helps our AI refine your stability baseline.
                            </p>
                        </div>
                        <button className="w-full bg-[#005C5C] text-white py-7 rounded-[2.5rem] font-bold text-xl hover:bg-mamacare-teal-dark shadow-3xl shadow-mamacare-teal/20 transition-all active:scale-[0.98] relative z-10 group overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            <span className="relative z-10">Update Status Now</span>
                        </button>
                    </motion.div>

                    <motion.div 
                        variants={itemVariants}
                        className="bg-[#E6F3F3] rounded-[3.5rem] p-12 md:p-14 space-y-10 shadow-card border border-[#DCECEC] group hover:shadow-3xl transition-all duration-700 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                             <BookOpen size={200} />
                        </div>
                        <div className="flex justify-between items-start relative z-10">
                            <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-gray-900 shadow-sm ring-8 ring-white/30">
                                <BookOpen size={32} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#003e3d]/50">Resources</span>
                        </div>
                        <div className="space-y-3 relative z-10">
                            <h2 className="text-xl font-bold text-[#003e3d] tracking-tight">Clinical Care Support</h2>
                            <p className="text-[#003e3d]/60 font-medium leading-relaxed text-sm">
                                Expert-reviewed guidance on managing preeclampsia symptoms and maintaining low-stress environments.
                            </p>
                        </div>
                        <button className="w-full bg-white text-[#003e3d] py-7 rounded-[2.5rem] font-bold text-xl hover:bg-gray-50 shadow-xl transition-all active:scale-[0.98] relative z-10 border border-gray-100 flex items-center justify-center gap-3">
                            Explore Library <ChevronRight size={24} />
                        </button>
                    </motion.div>
                </motion.section>

                {/* Vitals Grid - High Fidelity */}
                <motion.section 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-10 pt-10"
                >
                    <div className="flex items-center gap-6">
                        <div className="h-[2px] bg-mamacare-teal w-12 opacity-30"></div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-mamacare-teal">Health Stability Metrics</h3>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Blood Pressure - Premium Focus */}
                        <motion.div variants={itemVariants} className="bg-white rounded-[3rem] p-10 border-2 border-gray-50 shadow-card relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#BA1A1A]/5 rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#BA1A1A]/10 rounded-full flex items-center justify-center text-[#BA1A1A]">
                                        <Heart size={16} fill="currentColor" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Blood Pressure</p>
                                </div>
                                <div className="space-y-0">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-5xl font-black text-[#003e3d] tracking-tighter">140/90</span>
                                        <span className="text-base font-bold text-gray-300 uppercase">mmHg</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <div className="px-5 py-2 bg-[#FBE9E7] text-[#BA1A1A] rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-[#BA1A1A]/10">
                                            Stage 1 Hypertension
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Target: Below 130/80</p>
                                    <Sparkles size={14} className="text-amber-400" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Weight Stability */}
                        <motion.div variants={itemVariants} className="bg-[#005C5C] rounded-[3rem] p-10 shadow-card text-white relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-10 opacity-10">
                                <Scale size={120} />
                             </div>
                             <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                        <Scale size={16} />
                                    </div>
                                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Gestational Weight</p>
                                </div>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-5xl font-black text-white tracking-tighter">68.4</span>
                                    <span className="text-base font-bold text-white/30 uppercase">kg</span>
                                </div>
                                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-mamacare-teal rounded-xl flex items-center justify-center">
                                            <Activity size={18} />
                                        </div>
                                        <p className="text-xs font-bold leading-tight">+0.5kg <br/><span className="text-white/40 uppercase text-[8px] tracking-widest">Weekly Change</span></p>
                                    </div>
                                    <CheckCircle2 size={24} className="text-mamacare-teal" />
                                </div>
                             </div>
                        </motion.div>

                        {/* Health Stability Bar Chart */}
                        <motion.div variants={itemVariants} className="bg-[#E6F3F3] rounded-[3rem] p-10 shadow-card border border-[#DCECEC] flex flex-col justify-between group">
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#003e3d]">Daily Stability Flow</span>
                                <BarChart3 size={20} className="text-mamacare-teal" />
                            </div>
                            <div className="flex items-end justify-between h-32 gap-3">
                                {[40, 60, 90, 70, 85, 95].map((h, i) => (
                                    <div key={i} className="flex-1 relative group/bar">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.1, duration: 1 }}
                                            className={`w-full rounded-t-2xl transition-all duration-300 ${i === 5 ? 'bg-mamacare-teal shadow-[0_0_20px_rgba(0,127,128,0.3)]' : 'bg-mamacare-teal/20 group-hover/bar:bg-mamacare-teal/40'}`}
                                        ></motion.div>
                                        {i === 5 && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full border-2 border-mamacare-teal animate-ping"></div>}
                                    </div>
                                ))}
                            </div>
                            <p className="mt-6 text-[10px] font-bold text-[#003e3d]/40 uppercase tracking-widest text-center">Stability: High (95%)</p>
                        </motion.div>
                    </div>
                </motion.section>

                <motion.section 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-10 pt-10 pb-8"
                >
                    <div className="flex items-center gap-6">
                        <div className="h-[2px] bg-mamacare-teal w-12 opacity-30"></div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-mamacare-teal">Recommended Protocol</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Utensils, label: 'Rest & Nutrition', text: 'Low-sodium intake and left-side resting to improve placental blood flow.', color: 'bg-teal-50 text-mamacare-teal' },
                            { icon: Bell, label: 'Early Warning Signs', text: 'Call immediately if you see spots, feel upper gastric pain, or have severe headaches.', color: 'bg-amber-50 text-amber-500' },
                            { icon: Users, label: 'Support Network', text: 'Your primary OB-GYN and local labor unit have been flagged with your status.', color: 'bg-red-50 text-red-500' }
                        ].map((proto, idx) => (
                            <motion.div 
                                key={idx}
                                variants={itemVariants}
                                className="bg-white rounded-[3rem] p-10 border border-gray-50 shadow-card group hover:shadow-2xl transition-all duration-500"
                            >
                                <div className={`w-14 h-14 ${proto.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <proto.icon size={28} />
                                </div>
                                <h4 className="text-xl font-bold text-[#005C5C] mb-4 tracking-tight">{proto.label}</h4>
                                <p className="text-gray-500 font-medium leading-relaxed text-sm">{proto.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            </main>
            <Footer />
        </div>
    );
};

// Internal CheckCircle2 Mock for safety
const CheckCircle2 = ({ className, size }) => (
    <div className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
    </div>
);

export default RestMonitor;
