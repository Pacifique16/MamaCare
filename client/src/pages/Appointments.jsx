import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { AlertCircle, Phone, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { appointmentsApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

const typeLabel = (type) => type?.replace(/([A-Z])/g, ' $1').trim() || type;

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const motherId = user?.motherId || 1;

  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  const times = ['9:00 AM', '10:30 AM', '11:45 AM', '1:15 PM', '2:45 PM', '4:00 PM'];

  useEffect(() => {
    appointmentsApi.getAll({ motherId })
      .then(r => {
        const active = r.data.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled');
        setUpcoming(active);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [motherId]);

  const borderColor = (type) => type === 'UrgentFollowUp' ? 'border-red-300' : 'border-mamacare-teal';
  const badgeBg = (type) => type === 'UrgentFollowUp' ? 'bg-red-50 text-red-500' : 'bg-teal-50 text-mamacare-teal';

  return (
    <div className="min-h-screen bg-[#F5F7F8] font-outfit pb-20 overflow-x-hidden">
      <Navbar />

      <div className="flex h-full pt-20">
        <main className="flex-1 p-8 md:p-12 space-y-10">

          {/* Emergency Alert Banner */}
          <div className="bg-[#BA1A1A] rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md animate-pulse">
                <AlertCircle size={28} />
              </div>
              <div className="space-y-1">
                <p className="text-lg md:text-xl font-bold uppercase tracking-tight leading-tight">
                  RED - EMERGENCY: POTENTIAL PREECLAMPSIA SYMPTOMS DETECTED.
                </p>
                <p className="text-white/70 text-sm font-medium">Critical risk identified by triage. Immediate protocol activated.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
              <button className="bg-white text-red-600 px-10 py-5 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all">
                <Phone size={18} />CALL DOCTOR
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-5 rounded-full font-bold text-sm transition-all whitespace-nowrap">
                VIEW NEAREST EMERGENCY ROOM
              </button>
            </div>
          </div>

          {/* Booking Hero */}
          <div className="bg-[#007F80] rounded-[3rem] p-12 md:p-20 text-white space-y-8 shadow-2xl shadow-mamacare-teal/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <CalendarIcon size={240} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-2xl tracking-tighter relative z-10">
              Schedule Your Next Check-up
            </h1>
            <p className="text-white/60 text-lg font-medium max-w-xl leading-relaxed relative z-10">
              Regular prenatal visits are key to a healthy pregnancy. Choose a date and time that works for you.
            </p>
          </div>

          {/* Booking System Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Step 1: Select Date */}
            <div className="lg:col-span-5 bg-white rounded-[3rem] p-10 md:p-12 shadow-card border border-gray-50 space-y-10 h-full">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-mamacare-teal rounded-xl flex items-center justify-center text-white">
                  <CalendarIcon size={20} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">1. Select Date</h3>
              </div>
              <div className="max-w-sm mx-auto space-y-8">
                <div className="flex justify-between items-center bg-[#FAFAFA] rounded-2xl p-4">
                  <h4 className="font-bold text-gray-900">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h4>
                  <div className="flex gap-4">
                    <ChevronLeft size={20} className="text-gray-400 cursor-pointer hover:text-mamacare-teal" />
                    <ChevronRight size={20} className="text-gray-400 cursor-pointer hover:text-mamacare-teal" />
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-y-6 text-center">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <span key={i} className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest">{day}</span>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                    const isSelected = selectedDate === day;
                    const isInactive = day < new Date().getDate();
                    return (
                      <button
                        key={day}
                        onClick={() => !isInactive && setSelectedDate(day)}
                        className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                          isInactive ? 'text-gray-200 cursor-default' :
                          isSelected ? 'bg-mamacare-teal text-white shadow-lg shadow-mamacare-teal/20 scale-110' :
                          'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2: Time & Details */}
            <div className="lg:col-span-7 bg-white rounded-[3rem] p-10 md:p-12 shadow-card border border-gray-50 space-y-12">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-mamacare-teal rounded-xl flex items-center justify-center text-white">
                  <Clock size={20} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">2. Select Time & Details</h3>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason for Visit</label>
                <div className="bg-[#E5EAEB] rounded-2xl p-6 flex justify-between items-center cursor-pointer group">
                  <span className="font-bold text-gray-900">Routine Check-up</span>
                  <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="space-y-6">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Times</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {times.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-6 rounded-2xl font-bold transition-all border-2 ${
                        selectedTime === time
                          ? 'bg-mamacare-teal text-white border-mamacare-teal shadow-xl'
                          : 'bg-[#F2F5F6] border-transparent text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => navigate('/rest-monitor')}
                className="w-full bg-[#005C5C] text-white py-6 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-mamacare-teal-dark shadow-2xl shadow-mamacare-teal/20 active:scale-[0.98] transition-all"
              >
                <CheckCircle2 size={24} />
                Confirm Appointment
              </button>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <section className="space-y-10 pt-10">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Upcoming Appointments</h2>
                <p className="text-gray-400 font-medium">Manage your scheduled healthcare visits</p>
              </div>
              <button className="text-mamacare-teal font-bold flex items-center gap-2 group text-sm uppercase tracking-widest">
                View History
                <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-8">
                {[...Array(2)].map((_, i) => <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse" />)}
              </div>
            ) : upcoming.length === 0 ? (
              <p className="text-gray-400 font-medium text-sm">No upcoming appointments.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {upcoming.map(item => (
                  <div key={item.id} className={`bg-white rounded-[2.5rem] p-10 border-l-[12px] ${borderColor(item.type)} shadow-card hover:shadow-2xl transition-all duration-500 group relative`}>
                    <div className="flex items-start justify-between">
                      <span className={`px-4 py-1.5 ${badgeBg(item.type)} text-[10px] font-extrabold uppercase tracking-widest rounded-full`}>
                        {item.status}
                      </span>
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
                        <CalendarIcon size={20} />
                      </div>
                    </div>

                    <div className="mt-8 space-y-6">
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-mamacare-teal transition-colors">
                        {typeLabel(item.type)}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-500 font-medium">
                          <CalendarIcon size={18} className="text-gray-300" />
                          <span>{new Date(item.scheduledAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-500 font-medium">
                          <Clock size={18} className="text-gray-300" />
                          <span>{new Date(item.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg">
                          {item.doctorName?.split(' ').slice(-1)[0]?.[0] || 'D'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.doctorName}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Primary Care</p>
                        </div>
                      </div>

                      {item.notes && (
                        <p className="text-sm text-gray-400 font-medium italic">{item.notes}</p>
                      )}

                      <div className="pt-4 flex gap-4">
                        <button className="flex-1 py-4 text-mamacare-teal font-extrabold text-sm hover:underline">Reschedule</button>
                        <button className="flex-1 py-4 text-gray-400 font-extrabold text-sm hover:text-red-500">Cancel</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Appointments;
