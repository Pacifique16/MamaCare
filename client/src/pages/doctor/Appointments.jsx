import React, { useEffect, useState, useMemo } from 'react';
import DoctorLayout from '../../components/layout/DoctorLayout';
import {
  Search, CalendarDays, CheckCircle, XCircle, Clock,
  ArrowUpDown, Download, Plus, User, Tag, FileText, Stethoscope,
  CheckCircle2, Calendar, Bell
} from 'lucide-react';
import { patientAppointmentsApi, appointmentsApi, messagesApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const STATUS_STYLES = {
  Scheduled: { badge: 'bg-teal-50 text-mamacare-teal', dot: 'bg-mamacare-teal' },
  Confirmed: { badge: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
  Completed: { badge: 'bg-green-50 text-green-600', dot: 'bg-green-500' },
  Cancelled: { badge: 'bg-red-50 text-red-400', dot: 'bg-red-400' },
  Waiting: { badge: 'bg-orange-50 text-orange-500', dot: 'bg-orange-500' },
};

const TYPE_LABELS = {
  RoutineCheckup: 'Routine Checkup',
  UltrasoundScan: 'Ultrasound Scan',
  GlucoseScreening: 'Glucose Screening',
  BirthPlanReview: 'Birth Plan Review',
  UrgentFollowUp: 'Urgent Follow-Up',
  Postpartum: 'Postpartum',
  Other: 'Other',
};

const TABS = ['All', 'Upcoming', 'Past'];
const PAGE_SIZE = 4;

const DoctorAppointments = () => {
  const { user } = useAuth();
  const doctorId = user?.doctorId;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const [sort, setSort] = useState('date_asc');
  const [page, setPage] = useState(1);

  // Reject modal
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  const fetchAppointments = async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const [patientRes, motherRes] = await Promise.all([
        patientAppointmentsApi.getAll({ doctorId }),
        appointmentsApi.getAll({ doctorId }),
      ]);
      // Normalize mother appointments to same shape
      const fromMother = motherRes.data.map(a => ({
        id: `m-${a.id}`,
        _rawId: a.id,
        _source: 'mother',
        patientId: a.motherId,
        patientName: a.motherName,
        doctorId: a.doctorId,
        appointmentDate: a.scheduledAt,
        type: a.type,
        status: a.status,
        notes: a.notes,
        cancellationReason: null,
      }));
      const fromPatient = patientRes.data.map(a => ({ ...a, _source: 'patient' }));
      setAppointments([...fromPatient, ...fromMother]
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)));
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, [doctorId]);

  const handleApprove = async (appt) => {
    try {
      if (appt._source === 'mother') {
        await appointmentsApi.update(appt._rawId, { status: 'Confirmed' });
        setAppointments(prev => prev.map(a => a.id === appt.id ? { ...a, status: 'Confirmed' } : a));
      } else {
        await patientAppointmentsApi.update(appt.id, {
          patientId: appt.patientId, doctorId: appt.doctorId,
          appointmentDate: appt.appointmentDate, type: appt.type,
          notes: appt.notes, status: 'Completed', cancellationReason: null,
        });
        setAppointments(prev => prev.map(a => a.id === appt.id ? { ...a, status: 'Completed' } : a));
      }
    } catch { alert('Failed to update appointment.'); }
  };

  const handleComplete = async (appt) => {
    try {
      if (appt._source === 'mother') {
        await appointmentsApi.update(appt._rawId, { status: 'Completed' });
        // Notify mother via message
        await messagesApi.send({
          motherId: appt.patientId,
          doctorId,
          content: `Your ${TYPE_LABELS[appt.type] || appt.type} appointment on ${new Date(appt.appointmentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} has been marked as completed. Thank you for your visit.`,
          sentByDoctor: true,
        });
      } else {
        await patientAppointmentsApi.update(appt.id, {
          patientId: appt.patientId, doctorId: appt.doctorId,
          appointmentDate: appt.appointmentDate, type: appt.type,
          notes: appt.notes, status: 'Completed', cancellationReason: null,
        });
      }
      setAppointments(prev => prev.map(a => a.id === appt.id ? { ...a, status: 'Completed' } : a));
    } catch { alert('Failed to mark as completed.'); }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) { alert('Please provide a reason.'); return; }
    setRejecting(true);
    try {
      if (rejectTarget._source === 'mother') {
        await appointmentsApi.update(rejectTarget._rawId, {
          status: 'Cancelled', cancellationReason: rejectReason.trim(),
        });
      } else {
        await patientAppointmentsApi.update(rejectTarget.id, {
          patientId: rejectTarget.patientId, doctorId: rejectTarget.doctorId,
          appointmentDate: rejectTarget.appointmentDate, type: rejectTarget.type,
          notes: rejectTarget.notes, status: 'Cancelled',
          cancellationReason: rejectReason.trim(),
        });
      }
      setAppointments(prev => prev.map(a => a.id === rejectTarget.id
        ? { ...a, status: 'Cancelled', cancellationReason: rejectReason.trim() } : a));
      setRejectTarget(null);
      setRejectReason('');
    } catch { alert('Failed to reject appointment.'); }
    setRejecting(false);
  };

  const handleExport = () => {
    const headers = ['Patient', 'Date', 'Time', 'Type', 'Status', 'Notes', 'Cancellation Reason'];
    const rows = filtered.map(a => [
      a.patientName,
      new Date(a.appointmentDate).toLocaleDateString('en-US'),
      new Date(a.appointmentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      TYPE_LABELS[a.type] || a.type,
      a.status,
      a.notes ?? '',
      a.cancellationReason ?? '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `my-appointments-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const typeBadge = (type) => TYPE_LABELS[type] ? 'bg-teal-50 text-teal-700' : 'bg-gray-100 text-gray-500';
  const typeLabel = (type) => TYPE_LABELS[type] || type || 'Unknown';
  const statusDot = (status) => ({
    Scheduled: 'bg-teal-500', Confirmed: 'bg-blue-500',
    Completed: 'bg-green-500', Cancelled: 'bg-red-400', Waiting: 'bg-orange-400'
  }[status] || 'bg-gray-400');

  const now = new Date();

  const filtered = useMemo(() => {
    let list = [...appointments];
    if (activeTab === 'Upcoming') list = list.filter(a => new Date(a.appointmentDate) >= now);
    if (activeTab === 'Past') list = list.filter(a => new Date(a.appointmentDate) < now);
    if (statusFilter !== 'All') list = list.filter(a => a.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.patientName?.toLowerCase().includes(q) || a.type?.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      if (sort === 'date_asc') return new Date(a.appointmentDate) - new Date(b.appointmentDate);
      if (sort === 'date_desc') return new Date(b.appointmentDate) - new Date(a.appointmentDate);
      if (sort === 'status') return a.status.localeCompare(b.status);
      if (sort === 'patient') return a.patientName.localeCompare(b.patientName);
      return 0;
    });
    return list;
  }, [appointments, activeTab, statusFilter, search, sort]);

  useEffect(() => { setPage(1); }, [search, activeTab, statusFilter, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

  const stats = [
    { label: 'Scheduled', value: scheduled, icon: CalendarDays, color: 'text-teal-600', bg: 'bg-teal-50', progress: `${(scheduled/(appointments.length||1))*100}%` },
    { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', progress: `${(completed/(appointments.length||1))*100}%` },
    { label: 'Cancelled', value: cancelled, icon: XCircle, color: 'text-red-400', bg: 'bg-red-50', progress: `${(cancelled/(appointments.length||1))*100}%` },
    { label: 'Total Visits', value: appointments.length, icon: Stethoscope, color: 'text-blue-500', bg: 'bg-blue-50', progress: '100%' },
  ];

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto space-y-12 font-poppins animate-in fade-in duration-1000">
        
        {/* Premium Branding Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">CLINICAL SCHEDULE</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">My Appointments</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-lg shadow-sm">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                Live Status Tracker
              </span>
            </div>
            <button className="bg-mamacare-teal text-white px-8 py-3 rounded-xl font-bold text-[13px] shadow-lg shadow-mamacare-teal/10 transition-all hover:bg-[#004848] active:scale-[0.98] flex items-center gap-2">
              <Plus size={18} />
              Book Appointment
            </button>
          </div>
        </div>

        {/* High-Fidelity Stat Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[14px] font-semibold text-gray-700">{s.label}</p>
                      <h3 className="text-4xl font-bold text-gray-900 tracking-tight">{s.value}</h3>
                    </div>
                  </div>
                  <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12`}>
                    <s.icon size={24} />
                  </div>
                </div>
                <div className="absolute bottom-2 left-0 h-1.5 bg-gray-50/50 w-full">
                  <div className={`h-full ${s.color.replace('text', 'bg')} rounded-r-full transition-all duration-1000`} style={{ width: s.progress }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Today's Schedule Table */}
        <div className="bg-white rounded-[2.5rem] border border-white shadow-card overflow-hidden">
          <div className="p-10 flex justify-between items-center border-b border-gray-50 bg-white">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-mamacare-teal uppercase tracking-[0.2em]">CURRENT VISITS</span>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Today's Schedule</h2>
            </div>
            <p className="bg-blue-50 text-blue-800 text-[10px] font-black  uppercase tracking-widest  px-4 py-2 rounded-lg">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {loading ? (
            <div className="p-10 space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />)}
            </div>
          ) : appointments.filter(a => new Date(a.appointmentDate).toDateString() === new Date().toDateString()).length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <CalendarDays size={48} className="text-gray-100 mx-auto" />
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No appointments scheduled for today.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="p-8 text-[14px] font-semibold text-gray-600">Patient</th>
                    <th className="p-8 text-[14px] font-semibold text-gray-600">Time</th>
                    <th className="p-8 text-[14px] font-semibold text-gray-600">Visit Type</th>
                    <th className="p-8 text-[14px] font-semibold text-gray-600">Status</th>
                    <th className="p-8 text-[14px] font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.filter(a => new Date(a.appointmentDate).toDateString() === new Date().toDateString()).map(appt => {
                    const isUrgent = appt.type === 'UrgentFollowUp';
                    const name = appt.patientName || appt.motherName || 'Unknown';
                    return (
                      <tr key={appt.id} className={`hover:bg-gray-50/50 transition-all group ${isUrgent ? 'bg-red-50/10' : ''}`}>
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${isUrgent ? 'bg-red-100 text-[#C62828] border-2 border-red-200' : 'bg-teal-50 text-teal-600'}`}>
                              {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className={`font-bold ${isUrgent ? 'text-[#C62828]' : 'text-gray-900'}`}>{name}</p>
                              <p className="text-[12px] font-bold text-gray-600 mt-0.5">ID: #{appt.patientId || appt.motherId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`flex items-center gap-2 text-sm font-bold ${isUrgent ? 'text-[#C62828]' : 'text-gray-900'}`}>
                            <Clock size={16} className={isUrgent ? 'text-[#C62828]' : 'text-[#005C5C]'} />
                            {new Date(appt.appointmentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="p-8">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${isUrgent ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-gray-50 text-gray-600 border border-gray-100'}`}>
                            {isUrgent && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                            {TYPE_LABELS[appt.type] || appt.type}
                          </span>
                        </td>
                        <td className="p-8">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${colors.badge}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
                            {appt.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-4 text-gray-400">
                            <button
                              onClick={() => handleComplete(appt)}
                              title="Mark as completed"
                              className="hover:scale-110 transition-transform cursor-pointer text-[#005C5C] hover:text-green-600">
                              <CheckCircle2 size={16} />
                            </button>
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
        </div>

      {/* Filters Section */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-white shadow-card flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mamacare-teal transition-colors" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient or visit type..."
            className="w-full pl-16 pr-8 py-5 bg-gray-50/50 border border-transparent rounded-[2rem] text-sm font-medium text-gray-900 focus:bg-white focus:border-mamacare-teal/20 focus:ring-4 focus:ring-mamacare-teal/5 transition-all outline-none"
          />
        </div>

        <div className="flex gap-4 items-center shrink-0 w-full md:w-auto">
          <select 
            value={activeTab} 
            onChange={e => setActiveTab(e.target.value)}
            className="flex-1 md:flex-none px-8 py-5 bg-gray-50/50 border border-transparent rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-gray-600 focus:bg-white focus:border-mamacare-teal/20 focus:ring-4 focus:ring-mamacare-teal/5 transition-all outline-none"
          >
            {TABS.map(tab => (
              <option key={tab} value={tab}>{tab === 'All' ? 'All Schedules' : tab}</option>
            ))}
          </select>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-none px-8 py-5 bg-gray-50/50 border border-transparent rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-gray-600 focus:bg-white focus:border-mamacare-teal/20 focus:ring-4 focus:ring-mamacare-teal/5 transition-all outline-none">
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button onClick={handleExport}
            className="px-8 py-5 bg-mamacare-teal/5 text-mamacare-teal rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-mamacare-teal hover:text-white transition-all flex items-center gap-2">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-mamacare-teal rounded-full animate-spin" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading appointments…</p>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-[2.5rem] p-16 border border-white shadow-card flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 text-mamacare-teal flex items-center justify-center">
              <CalendarDays size={28} />
            </div>
            <p className="font-bold text-gray-900">No appointments found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters.</p>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && paginated.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {paginated.map(appt => {
                const formattedDate = new Date(appt.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                const formattedTime = new Date(appt.appointmentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const isScheduled = appt.status === 'Scheduled' || appt.status === 'Waiting';
                const colors = STATUS_STYLES[appt.status] || { badge: 'bg-gray-50 text-gray-400', dot: 'bg-gray-400' };
                
                return (
                  <div key={appt.id} className="bg-white rounded-[2.5rem] p-10 border border-white shadow-card hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className="flex items-start justify-between mb-8 relative z-10">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[2rem] bg-teal-50 flex items-center justify-center text-mamacare-teal shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                          <Stethoscope size={28} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-mamacare-teal transition-colors">{appt.patientName}</h3>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">APPOINTMENT ID: {appt.id.toString().replace('m-', 'MA')}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${colors.badge}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
                        {appt.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600 font-bold">
                          <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><CalendarDays size={14} /></div>
                          {formattedDate}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 font-bold">
                          <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><Clock size={14} /></div>
                          {formattedTime}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600 font-bold">
                          <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><Tag size={14} /></div>
                          {TYPE_LABELS[appt.type] || appt.type}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 font-bold">
                          <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><FileText size={14} /></div>
                          {appt.notes || 'No clinical notes'}
                        </div>
                      </div>
                    </div>

                    {isScheduled && (
                      <div className="flex items-center gap-4 pt-8 border-t border-gray-50 relative z-10">
                        <button onClick={() => handleApprove(appt)}
                          className="flex-1 flex items-center justify-center gap-3 py-4 bg-mamacare-teal text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#004848] transition-all shadow-lg shadow-mamacare-teal/10 active:scale-[0.98]">
                          <CheckCircle size={16} /> Confirm Visit
                        </button>
                        <button onClick={() => { setRejectTarget(appt); setRejectReason(''); }}
                          className="flex-1 flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-[0.98]">
                          <XCircle size={16} /> Cancel
                        </button>
                      </div>
                    )}
                    
                    {!isScheduled && (
                      <div className="pt-8 border-t border-gray-50 text-center relative z-10">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                          {appt.status === 'Completed' ? 'Session finalized' : appt.status === 'Confirmed' ? 'Visit secured' : 'Engagement terminated'}
                        </span>
                      </div>
                    )}

                    {/* Subtle background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="p-8 bg-gray-50/50 flex items-center justify-between border-t border-gray-50 rounded-[2rem] mt-8">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-3 text-gray-300 hover:text-mamacare-teal transition-all disabled:opacity-30">
                    <ChevronLeft size={20} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${p === page ? 'bg-mamacare-teal text-white shadow-lg shadow-mamacare-teal/20' : 'text-gray-400 hover:bg-white'}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-3 text-gray-400 hover:text-mamacare-teal transition-all disabled:opacity-30">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Reject Appointment</h3>
              <p className="text-sm text-gray-400 mt-1">
                Rejecting <span className="font-bold text-gray-700">{rejectTarget.patientName}</span>'s appointment.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason for rejection</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Schedule conflict, patient needs to reschedule..."
                rows={4}
                className="w-full bg-gray-50 rounded-2xl p-4 font-medium text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setRejectTarget(null); setRejectReason(''); }}
                className="flex-1 py-4 rounded-2xl font-bold text-sm bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all">
                Cancel
              </button>
              <button onClick={handleRejectConfirm} disabled={rejecting || !rejectReason.trim()}
                className="flex-1 py-4 rounded-2xl font-bold text-sm bg-red-500 text-white shadow-lg disabled:opacity-50 hover:bg-red-600 transition-all">
                {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DoctorLayout>
  );
};

export default DoctorAppointments;
