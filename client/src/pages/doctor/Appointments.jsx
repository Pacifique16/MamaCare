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
  Scheduled: 'bg-teal-50 text-mamacare-teal',
  Confirmed: 'bg-blue-50 text-blue-600',
  Completed: 'bg-green-50 text-green-600',
  Cancelled: 'bg-red-50 text-red-400',
  Waiting: 'bg-orange-50 text-orange-500',
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
const PAGE_SIZE = 9;

const DoctorAppointments = () => {
  const { user } = useAuth();
  const doctorId = user?.doctorId;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
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

  return (
    <DoctorLayout title="My Appointments" subtitle="Review, approve or reject patient appointment requests.">
      <div className="space-y-10">

        {/* Stats */}
        {!loading && (
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: 'Scheduled', value: scheduled, icon: CalendarDays, color: 'bg-teal-50 text-mamacare-teal' },
              { label: 'Completed', value: completed, icon: CheckCircle, color: 'bg-green-50 text-green-500' },
              { label: 'Cancelled', value: cancelled, icon: XCircle, color: 'bg-red-50 text-red-400' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                  <h3 className="text-5xl font-extrabold text-gray-900 tracking-tighter">{s.value}</h3>
                </div>
                <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center`}>
                  <s.icon size={24} />
                </div>
              </div>
            ))}
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
                    const name = appt.patientName || appt.motherName || 'Unknown';
                    return (
                      <tr key={appt.id} className={`hover:bg-gray-50/50 transition-colors ${isUrgent ? 'bg-red-50/30' : ''}`}>
                        <td className="px-8 py-6">
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

          <div className="px-8 pt-6 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500 font-medium">
            <p>Showing {filtered.length} appointment{filtered.length !== 1 ? 's' : ''} for today</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient or type..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-mamacare-teal shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                {tab}
              </button>
            ))}
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-500 focus:outline-none">
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-gray-400" />
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-500 focus:outline-none">
              <option value="date_asc">Date ↑</option>
              <option value="date_desc">Date ↓</option>
              <option value="status">Status</option>
              <option value="patient">Patient</option>
            </select>
          </div>
          <button onClick={handleExport}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-mamacare-teal transition-all">
            <Download size={14} /> Export CSV
          </button>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map(appt => {
                const formattedDate = new Date(appt.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                const formattedTime = new Date(appt.appointmentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const isScheduled = appt.status === 'Scheduled' || appt.status === 'Waiting';
                return (
                  <div key={appt.id} className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card hover:shadow-2xl transition-all">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#E0F2F1] flex items-center justify-center text-mamacare-teal shrink-0">
                          <Stethoscope size={22} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base leading-tight">{appt.patientName}</h3>
                          <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Patient</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest ${STATUS_STYLES[appt.status] || 'bg-gray-50 text-gray-400'}`}>
                        {appt.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <CalendarDays size={14} className="text-gray-300 shrink-0" />
                        <span className="font-medium">{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <Clock size={14} className="text-gray-300 shrink-0" />
                        <span className="font-medium">{formattedTime}</span>
                      </div>
                      {appt.type && (
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <Tag size={14} className="text-gray-300 shrink-0" />
                          <span className="font-medium">{TYPE_LABELS[appt.type] || appt.type}</span>
                        </div>
                      )}
                      {appt.notes && (
                        <div className="flex items-start gap-3 text-sm text-gray-500">
                          <FileText size={14} className="text-gray-300 shrink-0 mt-0.5" />
                          <span className="font-medium">{appt.notes}</span>
                        </div>
                      )}
                      {appt.status === 'Cancelled' && appt.cancellationReason && (
                        <div className="flex items-start gap-3 text-sm text-red-400">
                          <XCircle size={14} className="shrink-0 mt-0.5" />
                          <span className="font-medium">{appt.cancellationReason}</span>
                        </div>
                      )}
                    </div>

                    {isScheduled && (
                      <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
                        <button onClick={() => handleApprove(appt)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-teal-50 hover:bg-mamacare-teal text-mamacare-teal hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button onClick={() => { setRejectTarget(appt); setRejectReason(''); }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    )}
                    {!isScheduled && (
                      <div className="pt-6 border-t border-gray-50 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        {appt.status === 'Completed' ? '✓ Visit completed' : appt.status === 'Confirmed' ? '✓ Appointment confirmed' : '✗ Appointment cancelled'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-gray-400 hover:text-mamacare-teal disabled:opacity-40 transition-all">
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-[11px] font-bold transition-all ${page === p ? 'bg-mamacare-teal text-white' : 'bg-white border border-gray-100 text-gray-400 hover:text-mamacare-teal'}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-gray-400 hover:text-mamacare-teal disabled:opacity-40 transition-all">
                    Next
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
