import React from 'react';
import { Calendar, MapPin, Clock, CheckCircle2 } from 'lucide-react';

const AppointmentCard = ({ date, time, location, clinic }) => {
  const isEmpty = !date && !clinic;

  if (isEmpty) {
    return (
      <div className="bg-[#4cafad]/5 rounded-[2.5rem] p-10 space-y-8 border border-[#005c5c]/10 flex flex-col justify-center items-center text-center group transition-all duration-500 hover:bg-[#4cafad]/10 min-h-[380px]">
        <div className="w-20 h-20 bg-mamacare-teal/10 rounded-[2rem] flex items-center justify-center text-mamacare-teal mb-2 transition-transform duration-500 group-hover:scale-110">
          <Calendar size={40} />
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-[#003e3d]">No Appointments</h3>
          <p className="text-gray-500 font-medium max-w-[200px] leading-relaxed">
            You don't have any upcoming medical visits scheduled.
          </p>
        </div>
        <button className="bg-mamacare-teal text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-mamacare-teal/10 hover:bg-mamacare-teal-dark transition-all mt-4">
          Book Now
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#4cafad]/5 rounded-[2.5rem] p-10 space-y-8 border border-[#005c5c]/10 flex flex-col group transition-all duration-500 hover:bg-[#4cafad]/10 h-full justify-between">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-mamacare-teal rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-mamacare-teal/20">
            <Calendar size={22} />
          </div>
          <h3 className="text-2xl font-bold text-[#003e3d]">Next Appointment</h3>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#005c5c]/10 space-y-6 transition-transform group-hover:scale-[1.02]">
          <div className="space-y-2">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FF8A8A]">{clinic || "General Checkup"}</p>
              <h4 className="text-4xl font-bold text-[#003e3d] leading-none">{date}</h4>
              <p className="text-lg font-bold text-[#005c5c]/70">{time}</p>
          </div>

          <div className="flex items-center gap-3 pt-2 text-[#006a68] border-t border-gray-50 mt-4">
              <MapPin size={16} className="text-[#FF8A8A]/60" />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{location || "Maternity Wing"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button className="w-full bg-mamacare-teal text-white py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 shadow-xl shadow-mamacare-teal/10 hover:bg-mamacare-teal-dark active:scale-[0.98] transition-all">
          <CheckCircle2 size={18} />
          Confirm Attendance
        </button>
        <button className="w-full py-2 text-[#006a68] font-bold hover:text-mamacare-teal transition-all text-sm uppercase tracking-widest">
          Reschedule
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;
