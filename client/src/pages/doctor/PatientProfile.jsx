import React, { useEffect, useState } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import DoctorLayout from '../../components/layout/DoctorLayout';
import {
  ChevronRight, Phone, Mail, AlertTriangle, HeartPulse,
  Scale, Calendar, MessageSquare, TrendingUp, User, MapPin,
  Droplets, Activity, Pill, X, Plus
} from 'lucide-react';
import { mothersApi, vitalsApi, prescriptionsApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const riskStyle = {
  High:   { badge: 'bg-red-50 text-red-600',    dot: 'bg-red-500' },
  Medium: { badge: 'bg-orange-50 text-orange-600', dot: 'bg-orange-400' },
  Low:    { badge: 'bg-teal-50 text-teal-600',   dot: 'bg-teal-500' },
};

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const doctorId = user?.doctorId || 1;

  const [mother, setMother] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [prescriptions, setPrescriptions] = useState([]);
  const [showPrescribeModal, setShowPrescribeModal] = useState(false);
  const [prescribeForm, setPrescribeForm] = useState({ medicineName: '', dosage: '', frequency: '', duration: '', notes: '' });
  const [prescribing, setPrescribing] = useState(false);

  useEffect(() => {
    Promise.all([
      mothersApi.getById(id),
      mothersApi.getVitals(id),
      mothersApi.getAppointments(id),
      prescriptionsApi.getAll({ motherId: id }),
    ]).then(([mRes, vRes, aRes, pRes]) => {
      setMother(mRes.data);
      setVitals(vRes.data || []);
      setAppointments(aRes.data || []);
      setPrescriptions(pRes.data || []);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrescribe = async (e) => {
    e.preventDefault();
    setPrescribing(true);
    try {
      const res = await prescriptionsApi.create({ motherId: Number(id), ...prescribeForm });
      setPrescriptions(prev => [res.data, ...prev]);
      setShowPrescribeModal(false);
      setPrescribeForm({ medicineName: '', dosage: '', frequency: '', duration: '', notes: '' });
    } catch { alert('Failed to save prescription.'); }
    setPrescribing(false);
  };

  if (loading) return (
    <DoctorLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-[#005C5C] rounded-full animate-spin" />
      </div>
    </DoctorLayout>
  );

  if (!mother) return (
    <DoctorLayout>
      <div className="text-center py-20 text-gray-400">
        <p className="text-xl font-bold">Patient not found.</p>
        <NavLink to="/doctor/patients" className="text-[#005C5C] font-bold hover:underline mt-2 block">← Back to Patients</NavLink>
      </div>
    </DoctorLayout>
  );

  const latestVital = vitals[0];
  const risk = riskStyle[mother.riskLevel] || riskStyle.Low;
  const initials = mother.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2);

  const bpColor = latestVital?.bloodPressureSystolic >= 140 ? 'text-red-600' : 'text-gray-900';

  return (
    <DoctorLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 pb-8 border-b border-gray-100">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <NavLink to="/doctor/patients" className="hover:text-[#005C5C] transition-colors">Patients</NavLink>
            <ChevronRight size={12} />
            <span className="text-[#005C5C]">Profile View</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{mother.fullName}</h1>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${risk.badge}`}>
              {mother.riskLevel === 'High' && <AlertTriangle size={12} />}
              {mother.riskLevel} Risk
            </span>
          </div>
          <p className="text-gray-500 font-medium">
            Gestational Age: <span className="font-bold text-[#005C5C]">{mother.gestationalWeek} Weeks</span>
            {' • '}Due: <span className="font-bold text-gray-700">{new Date(mother.expectedDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </p>
        </div>
        <div className="flex gap-3 mt-6 md:mt-0">
          <button onClick={() => navigate(`/doctor/messaging?motherId=${id}`)}
            className="px-5 py-3 bg-[#005C5C] text-white rounded-full font-bold text-sm hover:bg-[#004848] shadow-lg transition-all flex items-center gap-2">
            <MessageSquare size={16} /> Message
          </button>
          {mother.phoneNumber && (
            <a href={`tel:${mother.phoneNumber}`}
              className="px-5 py-3 bg-green-50 text-green-700 rounded-full font-bold text-sm hover:bg-green-100 transition-all flex items-center gap-2">
              <Phone size={16} /> Call
            </a>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-3xl mb-3 ring-4 ring-gray-50">
                {mother.profileImageUrl
                  ? <img src={mother.profileImageUrl} alt={mother.fullName} className="w-full h-full object-cover" />
                  : initials
                }
              </div>
              <p className="font-bold text-gray-900">{mother.fullName}</p>
              <p className="text-xs text-gray-400">ID: #{mother.id}</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Contact</p>
                {mother.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} className="text-[#005C5C] shrink-0" />
                    <span className="truncate">{mother.email}</span>
                  </div>
                )}
                {mother.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="text-[#005C5C] shrink-0" />
                    {mother.phoneNumber}
                  </div>
                )}
                {mother.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} className="text-[#005C5C] shrink-0" />
                    {mother.location}
                  </div>
                )}
              </div>

              {(mother.emergencyContactName || mother.emergencyContactPhone) && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Emergency Contact</p>
                  {mother.emergencyContactName && <p className="font-bold text-gray-900 text-sm">{mother.emergencyContactName}</p>}
                  {mother.emergencyContactPhone && <p className="text-gray-500 text-sm">{mother.emergencyContactPhone}</p>}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Medical Info</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {mother.bloodType !== 'Unknown' && (
                    <div className="bg-gray-50 rounded-xl p-2 text-center">
                      <p className="text-gray-400 font-bold">Blood Type</p>
                      <p className="font-black text-gray-900">{mother.bloodType}</p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl p-2 text-center">
                    <p className="text-gray-400 font-bold">Trimester</p>
                    <p className="font-black text-gray-900">{mother.currentTrimester}</p>
                  </div>
                  {mother.hasHypertension && (
                    <div className="bg-red-50 rounded-xl p-2 text-center col-span-2">
                      <p className="text-red-600 font-bold text-[10px]">⚠ Hypertension</p>
                    </div>
                  )}
                  {mother.hasGestationalDiabetes && (
                    <div className="bg-orange-50 rounded-xl p-2 text-center col-span-2">
                      <p className="text-orange-600 font-bold text-[10px]">⚠ Gestational Diabetes</p>
                    </div>
                  )}
                </div>
              </div>

              {mother.allergies && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">Allergies</p>
                  <p className="text-sm text-red-600 font-semibold">{mother.allergies}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center — appointments timeline */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8 pb-4 border-b border-gray-50">Appointment History</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No appointments recorded.</p>
          ) : (
            <div className="relative pl-6 space-y-8">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-100" />
              {appointments.slice(0, 8).map(appt => {
                const isUrgent = appt.type === 'UrgentFollowUp';
                const dotColor = isUrgent ? 'bg-red-500' : appt.status === 'Confirmed' ? 'bg-[#005C5C]' : 'bg-orange-400';
                return (
                  <div key={appt.id} className="relative pl-6">
                    <div className={`absolute left-[-5px] top-1.5 w-3 h-3 rounded-full ring-4 ring-white ${dotColor}`} />
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isUrgent ? 'text-red-600' : 'text-[#005C5C]'}`}>
                        {appt.type?.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-xs font-bold text-gray-400">
                        {new Date(appt.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        appt.status === 'Confirmed' ? 'bg-teal-50 text-teal-700' :
                        appt.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                        'bg-gray-100 text-gray-500'}`}>
                        {appt.status}
                      </span>
                    </div>
                    {appt.notes && <p className="text-gray-500 text-sm mt-1">{appt.notes}</p>}
                    {appt.cancellationReason && <p className="text-red-400 text-xs mt-1">Reason: {appt.cancellationReason}</p>}
                  </div>
                );
              })}
            </div>
          )}

          {mother.medicalNotes && (
            <div className="mt-8 pt-6 border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Medical Notes</p>
              <p className="text-sm text-gray-600 leading-relaxed">{mother.medicalNotes}</p>
            </div>
          )}

          {/* Prescriptions */}
          <div className="mt-8 pt-6 border-t border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prescriptions</p>
              <button onClick={() => setShowPrescribeModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#005C5C] text-white text-xs font-bold rounded-xl hover:bg-[#004848] transition-all">
                <Plus size={13} /> New
              </button>
            </div>
            {prescriptions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No prescriptions issued yet.</p>
            ) : (
              <div className="space-y-3">
                {prescriptions.map(p => (
                  <div key={p.id} className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Pill size={14} className="text-purple-600 shrink-0" />
                        <p className="font-bold text-gray-900 text-sm">{p.medicineName}</p>
                      </div>
                      <span className="text-[10px] text-gray-400">{new Date(p.issuedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-purple-700 font-semibold mt-1 ml-5">{p.dosage} — {p.frequency}{p.duration ? ` for ${p.duration}` : ''}</p>
                    {p.notes && <p className="text-xs text-gray-500 mt-1 ml-5">{p.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — vitals */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
              <Activity className="text-[#005C5C]" size={20} />
              <h3 className="text-xl font-bold text-gray-900">Latest Vitals</h3>
            </div>
            {!latestVital ? (
              <p className="text-gray-400 text-sm text-center py-6">No vitals recorded.</p>
            ) : (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between border border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blood Pressure</p>
                    <h4 className={`text-2xl font-extrabold ${bpColor}`}>
                      {latestVital.bloodPressureSystolic}/{latestVital.bloodPressureDiastolic}
                    </h4>
                    <p className="text-[10px] text-gray-400">mmHg</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${latestVital.bloodPressureSystolic >= 140 ? 'bg-red-100 text-red-500' : 'bg-teal-100 text-[#005C5C]'}`}>
                    <TrendingUp size={18} />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between border border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Weight</p>
                    <h4 className="text-2xl font-extrabold text-gray-900">{latestVital.weightKg}</h4>
                    <p className="text-[10px] text-gray-400">kg</p>
                  </div>
                  <div className="w-10 h-10 bg-teal-100 text-[#005C5C] rounded-full flex items-center justify-center">
                    <Scale size={18} />
                  </div>
                </div>

                {latestVital.fetalHeartRate && (
                  <div className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between border border-gray-100">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fetal Heart Rate</p>
                      <h4 className="text-2xl font-extrabold text-gray-900">{latestVital.fetalHeartRate}</h4>
                      <p className="text-[10px] text-gray-400">bpm</p>
                    </div>
                    <div className="w-10 h-10 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center">
                      <HeartPulse size={18} />
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-gray-400 text-center italic">
                  Recorded: {new Date(latestVital.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
                {latestVital.notes && <p className="text-xs text-gray-500 text-center">{latestVital.notes}</p>}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-gray-50 rounded-3xl p-6 space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</p>
            <button onClick={() => navigate(`/doctor/messaging?motherId=${id}`)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-2xl text-sm font-bold text-gray-700 hover:bg-[#005C5C] hover:text-white transition-all shadow-sm">
              <MessageSquare size={16} /> Send Message
            </button>
            {mother.phoneNumber && (
              <a href={`tel:${mother.phoneNumber}`}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-2xl text-sm font-bold text-gray-700 hover:bg-green-600 hover:text-white transition-all shadow-sm">
                <Phone size={16} /> Call Patient
              </a>
            )}
            <button onClick={() => navigate('/doctor/appointments')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-2xl text-sm font-bold text-gray-700 hover:bg-[#005C5C] hover:text-white transition-all shadow-sm">
              <Calendar size={16} /> View Appointments
            </button>
            <button onClick={() => setShowPrescribeModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-2xl text-sm font-bold text-gray-700 hover:bg-purple-600 hover:text-white transition-all shadow-sm">
              <Pill size={16} /> Prescribe Meds
            </button>
          </div>
        </div>
      </div>
      {showPrescribeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Pill size={18} className="text-purple-600" />
                <h2 className="text-xl font-black text-gray-900">New Prescription</h2>
              </div>
              <button onClick={() => setShowPrescribeModal(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handlePrescribe} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Medicine Name *</label>
                  <input required value={prescribeForm.medicineName}
                    onChange={e => setPrescribeForm(p => ({ ...p, medicineName: e.target.value }))}
                    placeholder="e.g. Ferrous Sulfate"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Dosage *</label>
                  <input required value={prescribeForm.dosage}
                    onChange={e => setPrescribeForm(p => ({ ...p, dosage: e.target.value }))}
                    placeholder="e.g. 200mg"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Frequency *</label>
                  <input required value={prescribeForm.frequency}
                    onChange={e => setPrescribeForm(p => ({ ...p, frequency: e.target.value }))}
                    placeholder="e.g. Twice daily"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Duration</label>
                  <input value={prescribeForm.duration}
                    onChange={e => setPrescribeForm(p => ({ ...p, duration: e.target.value }))}
                    placeholder="e.g. 30 days"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Notes</label>
                  <textarea value={prescribeForm.notes}
                    onChange={e => setPrescribeForm(p => ({ ...p, notes: e.target.value }))}
                    placeholder="e.g. Take after meals, avoid dairy..."
                    rows={2} className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm resize-none" />
                </div>
              </div>
              <p className="text-xs text-gray-400">💬 The patient will be automatically notified via message.</p>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowPrescribeModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={prescribing}
                  className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 disabled:opacity-60">
                  {prescribing ? 'Saving...' : 'Issue Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DoctorLayout>
  );
};

export default PatientProfile;
