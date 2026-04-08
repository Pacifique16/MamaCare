import React from 'react';
import { Calendar, MapPin, Clock, CheckCircle2 } from 'lucide-react';

const AppointmentCard = ({ date = "Oct 15, 2026", time = "10:00 AM", location = "Level 3, Maternity Wing", clinic = "Clinic A - General Checkup" }) => {
  return (
    <div className="bg-gray-100/50 rounded-[2.5rem] p-8 space-y-8 border border-gray-100 flex flex-col group transition-all duration-500 hover:bg-gray-100">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-mamacare-teal rounded-xl flex items-center justify-center text-white shadow-lg shadow-mamacare-teal/20">
          <Calendar size={20} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Next Appointment</h3>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4 transition-transform group-hover:scale-[1.02]">
        <div className="space-y-1">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-mamacare-teal">{clinic}</p>
            <h4 className="text-2xl font-bold text-gray-900">{date}</h4>
            <p className="text-sm font-bold text-gray-500">{time}</p>
        </div>

        <div className="flex items-center gap-2 pt-2 text-gray-400">
            <MapPin size={14} />
            <span className="text-[10px] font-bold uppercase tracking-tight">{location}</span>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-mamacare-teal text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-mamacare-teal/10 hover:bg-mamacare-teal-dark transition-all">
          <CheckCircle2 size={18} />
          Confirm Attendance
        </button>
        <button className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-all text-sm">
          Reschedule
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;
