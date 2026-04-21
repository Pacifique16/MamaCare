import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
    AlertCircle, Phone, Calendar as CalendarIcon, Clock,
    ChevronLeft, ChevronRight, CheckCircle2, Star,
    MapPin, User, ArrowRight, ShieldAlert, Sparkles,
    Stethoscope, Activity, HeartPulse
} from 'lucide-react';
import { appointmentsApi, doctorsApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

const typeLabel = (type) => type?.replace(/([A-Z])/g, ' $1').trim() || type;

const Appointments = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const motherId = user?.motherId || 1;

    // Wizard State
    const [bookingStep, setBookingStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const [confirming, setConfirming] = useState(false);

    // Calendar State
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('10:30 AM');
    const [selectedReason, setSelectedReason] = useState('RoutineCheckup');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);

    // Data State
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);

    const times = ['9:00 AM', '10:30 AM', '11:45 AM', '1:15 PM', '2:45 PM', '4:00 PM'];

    const timeToHour = (t) => {
        const [time, period] = t.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return { h, m };
    };

    const reasons = [
        { id: 'RoutineCheckup', label: 'Routine Check-up', icon: Star, color: 'text-amber-500', desc: 'Standard monthly prenatal visit' },
        { id: 'UltrasoundScan', label: 'Ultrasound Scan', icon: Activity, color: 'text-mamacare-teal', desc: 'Growth and development imaging' },
        { id: 'BirthPlanReview', label: 'Clinical Consultation', icon: Stethoscope, color: 'text-blue-500', desc: 'Speak with a specialist about concerns' },
        { id: 'UrgentFollowUp', label: 'Urgent Follow-up', icon: ShieldAlert, color: 'text-red-500', desc: 'Priority review of acute symptoms' }
    ];

    useEffect(() => {
        appointmentsApi.getAll({ motherId })
            .then(r => {
                const active = r.data.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled');
                setUpcoming(active);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
        doctorsApi.getAll().then(r => {
            const verified = r.data.filter(d => d.status === 'Verified');
            setDoctors(verified);
            if (verified.length > 0) setSelectedDoctorId(verified[0].id);
        }).catch(() => {});
    }, [motherId]);

    const handleConfirm = async () => {
        if (!selectedDoctorId) { alert('Please select a doctor.'); return; }
        setConfirming(true);
        try {
            const { h, m } = timeToHour(selectedTime);
            const scheduledAt = new Date(selectedDate);
            scheduledAt.setHours(h, m, 0, 0);
            await appointmentsApi.create({
                motherId,
                doctorId: selectedDoctorId,
                scheduledAt: scheduledAt.toISOString(),
                type: selectedReason,
            });
            navigate('/rest-monitor');
        } catch (err) {
            const msg = err?.response?.data?.message || err?.response?.data?.title || 'Failed to book appointment. Please try again.';
            alert(msg);
        }
        setConfirming(false);
    };

    const nextStep = () => {
        setDirection(1);
        setBookingStep(prev => prev + 1);
    };

    const prevStep = () => {
        setDirection(-1);
        setBookingStep(prev => prev - 1);
    };

    const borderColor = (type) => type === 'UrgentFollowUp' ? 'border-red-400' : 'border-mamacare-teal';
    const badgeColors = (type) => type === 'UrgentFollowUp'
        ? 'bg-red-50 text-red-500 border-red-100'
        : 'bg-teal-50 text-mamacare-teal border-teal-100';

    const variants = {
        enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 })
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-poppins pb-4 overflow-x-hidden">
            <Navbar />

            <main className="pt-24 px-6 md:px-12 max-w-6xl mx-auto space-y-10">

                {/* Editorial Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#005C5C] tracking-tighter">Your Journey</h1>
                    <p className="text-gray-500 font-medium max-w-xl mx-auto leading-relaxed text-sm">
                        Manage your maternity milestones. Schedule clinical visits or review your upcoming care profile.
                    </p>
                </div>

                {/* Wizard Container */}
                <div className="bg-white rounded-[2.5rem] shadow-card border border-gray-50 relative overflow-hidden">
                    <div className="p-8 md:p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-0.5">
                            <h2 className="text-2xl font-bold text-[#005C5C]">Book a Visit</h2>
                            <p className="text-gray-600 text-xs font-medium">Follow the steps to secure your next appointment.</p>
                        </div>
                        <BookingStepper currentStep={bookingStep} />
                    </div>

                    <div className="relative p-8 md:p-12 min-h-[400px]">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={bookingStep}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: "circOut" }}
                                className="w-full"
                            >
                                {bookingStep === 1 && (
                                    <DateStep
                                        calendarDate={calendarDate}
                                        setCalendarDate={setCalendarDate}
                                        selectedDate={selectedDate}
                                        onSelect={setSelectedDate}
                                        onNext={nextStep}
                                    />
                                )}
                                {bookingStep === 2 && (
                                    <TimeStep
                                        selectedTime={selectedTime}
                                        onSelect={setSelectedTime}
                                        onNext={nextStep}
                                        onBack={prevStep}
                                        times={times}
                                    />
                                )}
                                {bookingStep === 3 && (
                                    <ReasonStep
                                        reasons={reasons}
                                        selectedReason={selectedReason}
                                        onSelect={setSelectedReason}
                                        onNext={nextStep}
                                        onBack={prevStep}
                                    />
                                )}
                                {bookingStep === 4 && (
                                    <ReviewStep
                                        date={selectedDate}
                                        time={selectedTime}
                                        reason={reasons.find(r => r.id === selectedReason)}
                                        doctors={doctors}
                                        selectedDoctorId={selectedDoctorId}
                                        onSelectDoctor={setSelectedDoctorId}
                                        onBack={prevStep}
                                        confirming={confirming}
                                        onConfirm={handleConfirm}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Active Schedule Section */}
                <section className="space-y-8">
                    <div className="text-center md:text-left space-y-2">
                        <h2 className="text-3xl font-bold text-[#005C5C] tracking-tight">Upcoming Visits</h2>
                        <div className="w-16 h-1.5 bg-mamacare-teal rounded-full mx-auto md:mx-0" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pb-10">
                        <AnimatePresence>
                            {loading ? (
                                [...Array(2)].map((_, i) => (
                                    <div key={i} className="h-56 bg-white rounded-[2.5rem] animate-pulse shadow-sm" />
                                ))
                            ) : upcoming.length === 0 ? (
                                <div className="col-span-full py-16 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                                    <p className="text-gray-600 font-bold text-sm">No active appointments found.</p>
                                </div>
                            ) : (
                                upcoming.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`bg-white rounded-[2.5rem] p-10 border-l-[12px] ${borderColor(item.type)} shadow-card hover:shadow-xl transition-all duration-500 group relative overflow-hidden`}
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <span className={`px-4 py-1.5 border ${badgeColors(item.type)} text-[10px] font-bold uppercase tracking-[0.1em] rounded-full`}>
                                                {item.status}
                                            </span>
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
                                                <CalendarIcon size={18} />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#005C5C] tracking-tight mb-3">{typeLabel(item.type)}</h3>
                                        <div className="flex flex-wrap gap-4 text-gray-400 font-semibold text-xs mb-8">
                                            <div className="flex items-center gap-1.5"><CalendarIcon size={14} />{new Date(item.scheduledAt).toLocaleDateString()}</div>
                                            <div className="flex items-center gap-1.5"><Clock size={14} />{new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-mamacare-teal rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                    {item.doctorName?.[0] || 'D'}
                                                </div>
                                                <div>
                                                    <p className="text-base font-bold text-[#005C5C] leading-none">{item.doctorName}</p>
                                                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">Obstetrician</p>
                                                </div>
                                            </div>
                                            <button className="w-10 h-10 rounded-xl bg-[#E6F3F3] text-mamacare-teal flex items-center justify-center hover:bg-mamacare-teal hover:text-white transition-all">
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

/* --- Sub-Components --- */

const BookingStepper = ({ currentStep }) => {
    const totalSteps = 4;
    return (
        <div className="flex items-center gap-3">
            {[1, 2, 3, 4].map(s => (
                <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-500 ${s < currentStep ? 'w-6 bg-mamacare-teal' :
                            s === currentStep ? 'w-10 bg-mamacare-teal shadow-lg shadow-mamacare-teal/20' :
                                'w-6 bg-gray-100'
                        }`}
                />
            ))}
            <span className="ml-2 text-xs font-bold text-[#005C5C] tabular-nums">0{currentStep} / 04</span>
        </div>
    );
};

const DateStep = ({ calendarDate, setCalendarDate, selectedDate, onSelect, onNext }) => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const monthName = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const prevMonth = () => setCalendarDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCalendarDate(new Date(year, month + 1, 1));

    const isPast = (day) => new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isSelected = (day) => selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day;

    return (
        <div className="max-w-md mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-[#005C5C] tracking-tight">Select a Date</h3>
                <p className="text-gray-600 font-medium tracking-tight uppercase text-[10px]">Choose the day for your clinical visit</p>
            </div>
            <div className="bg-[#FAFAFA] rounded-[2rem] p-8 border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h4 className="font-bold text-lg text-[#005C5C] uppercase tracking-tight">{monthName}</h4>
                    <div className="flex gap-1">
                        <button onClick={prevMonth} className="p-1.5 hover:text-mamacare-teal transition-colors"><ChevronLeft size={18} /></button>
                        <button onClick={nextMonth} className="p-1.5 hover:text-mamacare-teal transition-colors"><ChevronRight size={18} /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-y-2 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <span key={i} className="text-[10px] font-bold text-gray-300 uppercase tracking-widest pb-3">{d}</span>
                    ))}
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                        <button
                            key={day}
                            onClick={() => !isPast(day) && onSelect(new Date(year, month, day))}
                            className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                                isPast(day) ? 'text-gray-300 cursor-default' :
                                isSelected(day) ? 'bg-[#005C5C] text-white shadow-xl scale-105' :
                                'text-gray-600 hover:bg-white hover:shadow-sm'
                            }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex justify-center">
                <button onClick={onNext} className="group bg-[#005C5C] text-white px-12 py-5 rounded-[1.5rem] font-bold shadow-2xl hover:scale-105 transition-all flex items-center gap-2 text-sm">
                    Continue to Time
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

const TimeStep = ({ selectedTime, onSelect, onNext, onBack, times }) => (
    <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-[#005C5C] tracking-tight">Preferred Time</h3>
            <p className="text-gray-400 font-medium tracking-tight uppercase text-[10px]">Pick a slot that works best for you</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {times.map(time => (
                <button
                    key={time}
                    onClick={() => onSelect(time)}
                    className={`p-6 rounded-[2rem] border-2 font-bold text-sm transition-all ${selectedTime === time ? 'bg-mamacare-teal text-white border-mamacare-teal shadow-xl scale-[1.03]' : 'bg-[#FAFAFA] border-transparent text-gray-400 hover:border-gray-200'
                        }`}
                >
                    <Clock className={`mx-auto mb-2 ${selectedTime === time ? 'text-white' : 'text-gray-200'}`} size={20} />
                    {time}
                </button>
            ))}
        </div>
        <div className="flex justify-between items-center pt-6">
            <button onClick={onBack} className="text-gray-400 font-bold text-sm flex items-center gap-1 hover:text-[#005C5C]"><ChevronLeft size={16} /> Back</button>
            <button onClick={onNext} className="bg-[#005C5C] text-white px-10 py-5 rounded-[1.5rem] font-bold shadow-xl hover:scale-105 transition-all text-sm">Next: Reason</button>
        </div>
    </div>
);

const ReasonStep = ({ reasons, selectedReason, onSelect, onNext, onBack }) => (
    <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-[#005C5C] tracking-tight">Visit Reason</h3>
            <p className="text-gray-400 font-medium tracking-tight uppercase text-[10px]">Help us prepare your clinical baseline</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
            {reasons.map(r => (
                <button
                    key={r.id}
                    onClick={() => onSelect(r.id)}
                    className={`p-8 rounded-[2rem] border-2 text-left transition-all group ${selectedReason === r.id ? 'bg-[#005C5C] border-[#005C5C] shadow-xl' : 'bg-[#FAFAFA] border-transparent hover:border-gray-100'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-xl ${selectedReason === r.id ? 'bg-white/10' : 'bg-white shadow-sm'} flex items-center justify-center ${r.color} mb-4 group-hover:scale-110 transition-transform`}>
                        <r.icon size={24} />
                    </div>
                    <h4 className={`text-lg font-bold ${selectedReason === r.id ? 'text-white' : 'text-[#005C5C]'}`}>{r.label}</h4>
                    <p className={`text-xs font-medium mt-1.5 leading-relaxed ${selectedReason === r.id ? 'text-white/60' : 'text-gray-400'}`}>{r.desc}</p>
                </button>
            ))}
        </div>
        <div className="flex justify-between items-center pt-6">
            <button onClick={onBack} className="text-gray-600 font-bold text-sm flex items-center gap-1 hover:text-[#005C5C]"><ChevronLeft size={16} /> Back</button>
            <button onClick={onNext} className="bg-[#005C5C] text-white px-10 py-5 rounded-[1.5rem] font-bold shadow-xl hover:scale-105 transition-all text-sm">Review Booking</button>
        </div>
    </div>
);

const ReviewStep = ({ date, time, reason, doctors, selectedDoctorId, onSelectDoctor, onBack, onConfirm, confirming }) => {
    const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);
    return (
    <div className="max-w-lg mx-auto space-y-8">
        <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-[#005C5C] tracking-tight">Confirm Visit</h3>
            <p className="text-gray-600 font-medium tracking-tight uppercase text-[10px]">Verify all details are correct</p>
        </div>
        <div className="bg-white rounded-[2.5rem] p-10 border-2 border-mamacare-teal/10 shadow-xl space-y-8">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-mamacare-teal rounded-[1.5rem] flex flex-col items-center justify-center text-white shadow-lg">
                    <span className="text-[10px] font-bold uppercase">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-2xl font-bold">{date.getDate()}</span>
                </div>
                <div className="space-y-0.5">
                    <h4 className="text-xl font-bold text-[#003E3D] tracking-tight">{reason?.label}</h4>
                    <p className="text-gray-600 font-semibold flex items-center gap-2 text-sm"><Clock size={14} /> @ {time}</p>
                </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-50">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Doctor</label>
                {doctors.length === 0 ? (
                    <p className="text-sm text-gray-400">No verified doctors available.</p>
                ) : (
                    <select
                        value={selectedDoctorId || ''}
                        onChange={e => onSelectDoctor(Number(e.target.value))}
                        className="w-full bg-gray-50 rounded-2xl p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20"
                    >
                        {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.fullName} — {d.specialty}</option>
                        ))}
                    </select>
                )}
            </div>

            <button
                onClick={onConfirm}
                disabled={confirming || !selectedDoctorId}
                className="w-full bg-[#005C5C] text-white py-6 rounded-[2rem] font-bold text-lg shadow-2xl hover:bg-mamacare-teal-dark transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
                <CheckCircle2 size={22} /> {confirming ? 'Booking...' : 'Confirm Booking'}
            </button>
        </div>
        <button onClick={onBack} className="w-full text-[#005C5C] font-bold underline underline-offset-8 text-sm">Need to change something?</button>
    </div>
    );
};

export default Appointments;
