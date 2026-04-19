import React from 'react';
import { Calendar, MapPin, Clock, CheckCircle2 } from 'lucide-react';

const AppointmentCard = ({ date = "Oct 15, 2026", time = "10:00 AM", location = "Level 3, Maternity Wing", clinic = "Clinic A - General Checkup" }) => {
  return (
    <div className="bg-[#4cafad]/5 rounded-[2.5rem] p-8 space-y-8 border border-[#005c5c]/10 flex flex-col group transition-all duration-500 hover:bg-[#4cafad]/10">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-mamacare-teal rounded-xl flex items-center justify-center text-white shadow-lg shadow-mamacare-teal/20">
          <Calendar size={20} />
        </div>
        <h3 className="text-xl font-bold text-[#003e3d]">Next Appointment</h3>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#005c5c]/10 space-y-4 transition-transform group-hover:scale-[1.02]">
        <div className="space-y-1">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-mamacare-teal">{clinic}</p>
            <h4 className="text-2xl font-bold text-[#003e3d]">{date}</h4>
            <p className="text-sm font-bold text-[#005c5c]/80">{time}</p>
        </div>

        <div className="flex items-center gap-2 pt-2 text-[#006a68]">
            <MapPin size={14} />
            <span className="text-[10px] font-bold uppercase tracking-tight">{location}</span>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-mamacare-teal text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-mamacare-teal/10 hover:bg-mamacare-teal-dark transition-all">
          <CheckCircle2 size={18} />
          Confirm Attendance
        </button>
        <button className="w-full py-4 text-[#006a68] font-bold hover:text-mamacare-teal transition-all text-sm">
          Reschedule
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;
