import React, { useEffect, useState } from 'react';
import DoctorLayout from '../../components/layout/DoctorLayout';
import {
  Search,
  AlertTriangle,
  Activity,
  Clock,
  CheckCircle2,
  Calendar,
  Bell,
  Plus,
  Sparkles
} from 'lucide-react';
import { appointmentsApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const statusDot = (status) => ({
  Waiting:   'bg-orange-400',
  Scheduled: 'bg-gray-400',
  Confirmed: 'bg-teal-500',
  Completed: 'bg-blue-400',
  Cancelled: 'bg-red-400',
}[status] || 'bg-gray-300');

const typeBadge = (type) => ({
  RoutineCheckup:    'bg-teal-50 text-[#005C5C]',
  UltrasoundScan:    'bg-blue-50 text-blue-600',
  GlucoseScreening:  'bg-red-50 text-[#C62828]',
  BirthPlanReview:   'bg-orange-50 text-orange-600',
  UrgentFollowUp:    'bg-red-100 text-[#C62828]',
}[type] || 'bg-gray-50 text-gray-500');

const typeLabel = (type) => type?.replace(/([A-Z])/g, ' $1').trim() || type;

const DoctorAppointments = () => {
  const { user } = useAuth();
  const doctorId = user?.doctorId || 1;

  const [todayAppts, setTodayAppts] = useState([]);
  const [allAppts, setAllAppts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      appointmentsApi.getAll({ doctorId, today: true }),
      appointmentsApi.getAll({ doctorId }),
    ]).then(([todayRes, allRes]) => {
      setTodayAppts(todayRes.data);
      setAllAppts(allRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [doctorId]);

  const highRiskAppts = allAppts.filter(a => a.status === 'Waiting' || a.type === 'UrgentFollowUp');

  const filtered = todayAppts.filter(a =>
    !search || a.motherName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DoctorLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-8 border-b border-gray-100">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Appointments</h1>
          <p className="text-gray-500 font-medium text-lg">Manage your prenatal visit schedule with calm efficiency.</p>
        </div>
        <div className="flex bg-gray-50 rounded-full p-1 border border-gray-100 mt-6 md:mt-0 shadow-sm">
          <button className="px-6 py-2 bg-white text-[#005C5C] font-bold text-sm rounded-full shadow-sm">Schedule Visit</button>
          <button className="px-6 py-2 text-gray-500 font-bold text-sm rounded-full hover:bg-gray-100 transition-colors">Calendar View</button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="relative w-full md:max-w-xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name..."
            className="w-full h-12 bg-gray-100 border border-transparent rounded-2xl pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-gray-200 focus:outline-none transition-colors"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-6 py-3 bg-white border border-gray-200 text-gray-900 font-bold text-sm rounded-2xl shadow-sm">All</button>
          <button className="px-6 py-3 bg-gray-50 text-gray-500 font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors">High Risk</button>
          <button className="px-6 py-3 bg-gray-50 text-gray-500 font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors">Routine</button>
        </div>
      </div>

      {/* Priority Alerts */}
      {highRiskAppts.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <AlertTriangle className="text-[#C62828]" size={24} fill="currentColor" />
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Priority Alerts</h2>
            <span className="bg-red-50 text-[#C62828] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-red-100">
              {highRiskAppts.length} REQUIRES ACTION
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {highRiskAppts.slice(0, 2).map(appt => (
              <div key={appt.id} className="bg-white rounded-[2.5rem] p-8 border-2 border-red-50 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#C62828]"></div>
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-red-100 text-[#C62828] rounded-full flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                      {appt.motherName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{appt.motherName}</h3>
                      <p className="text-xs font-bold text-gray-500 tracking-wide mt-1">
                        {new Date(appt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <span className="bg-red-50 text-[#C62828] px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest shadow-sm">URGENT</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-[#C62828]">
                    <Activity size={16} />
                    <span className="text-xs font-bold">{typeLabel(appt.type)}</span>
                  </div>
                  <button className="bg-[#005C5C] text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-teal-800 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Today's Schedule</h2>
          <p className="text-sm font-bold text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] pb-4">
          {loading ? (
            <div className="p-10 space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-10 text-gray-400 font-medium text-sm text-center">No appointments scheduled for today.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.15em]">PATIENT</th>
                    <th className="px-8 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.15em]">TIME</th>
                    <th className="px-8 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.15em]">VISIT TYPE</th>
                    <th className="px-8 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.15em]">STATUS</th>
                    <th className="px-8 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.15em] text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(appt => {
                    const isUrgent = appt.type === 'UrgentFollowUp';
                    return (
                      <tr key={appt.id} className={`hover:bg-gray-50/50 transition-colors ${isUrgent ? 'bg-red-50/30' : ''}`}>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${isUrgent ? 'bg-red-100 text-[#C62828] border-2 border-red-200' : 'bg-teal-50 text-teal-600'}`}>
                              {appt.motherName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className={`font-bold ${isUrgent ? 'text-[#C62828]' : 'text-gray-900'}`}>{appt.motherName}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">ID: #{appt.motherId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`flex items-center gap-2 text-sm font-bold ${isUrgent ? 'text-[#C62828]' : 'text-gray-900'}`}>
                            <Clock size={16} className={isUrgent ? 'text-[#C62828]' : 'text-[#005C5C]'} />
                            {new Date(appt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest rounded-full ${typeBadge(appt.type)}`}>
                            {typeLabel(appt.type)}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${statusDot(appt.status)} ${isUrgent ? 'animate-pulse' : ''}`}></div>
                            <span className={`text-sm font-bold ${isUrgent ? 'text-[#C62828]' : 'text-gray-900'}`}>
                              {isUrgent ? 'URGENT' : appt.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-4 text-gray-400">
                            <CheckCircle2 size={16} className="text-[#005C5C] hover:scale-110 transition-transform cursor-pointer" />
                            <Calendar size={16} className="hover:text-gray-900 hover:scale-110 transition-transform cursor-pointer" />
                            <Bell size={16} className="hover:text-gray-900 hover:scale-110 transition-transform cursor-pointer" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-8 pt-6 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500 font-medium">
            <p>Showing {filtered.length} appointment{filtered.length !== 1 ? 's' : ''} for today</p>
          </div>
        </div>
      </div>

      {/* Bottom Action Cards */}
      <div className="grid md:grid-cols-3 gap-6 pb-12">
        <div className="bg-[#007373] text-white rounded-3xl p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">Next Multi-Visit</h3>
            <p className="text-sm text-teal-100 font-medium mb-8">Bulk scheduling for clinics</p>
          </div>
          <button className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3.5 rounded-xl text-sm transition-colors border border-white/20">
            Start Batching
          </button>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Total Scheduled</h3>
            <p className="text-sm text-gray-500 font-medium mb-8">All upcoming appointments</p>
          </div>
          <span className="text-5xl font-extrabold text-[#005C5C] tracking-tighter">{allAppts.length}</span>
        </div>
        <div className="bg-gray-50 rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-[#005C5C]">
            <Sparkles size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">AI Optimization</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[200px]">
            Schedule is optimized based on patient risk levels.
          </p>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorAppointments;
