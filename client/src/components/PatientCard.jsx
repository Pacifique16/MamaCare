import { Edit2, Trash2, Phone, MapPin, Droplets, AlertTriangle, UserCheck, FileText, CalendarDays } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const RISK_STYLES = {
  Low:    'bg-green-50 text-green-600',
  Medium: 'bg-orange-50 text-orange-500',
  High:   'bg-red-50 text-red-500',
}

const BLOOD_TYPE_LABELS = {
  APositive: 'A+', ANegative: 'A-',
  BPositive: 'B+', BNegative: 'B-',
  OPositive: 'O+', ONegative: 'O-',
  ABPositive: 'AB+', ABNegative: 'AB-',
  Unknown: '—',
}

function getAge(dateOfBirth) {
  if (!dateOfBirth) return null
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

function getWeeksLeft(weeksPregnant) {
  const weeksLeft = 40 - weeksPregnant
  if (weeksLeft <= 0) return { label: 'Due now', style: 'bg-red-50 text-red-500' }
  if (weeksLeft <= 4) return { label: `Due in ${weeksLeft}w`, style: 'bg-orange-50 text-orange-500' }
  if (weeksLeft <= 8) return { label: `Due in ${weeksLeft}w`, style: 'bg-blue-50 text-blue-500' }
  return null
}

function PatientCard({ patient, onEdit, onDelete }) {
  const navigate = useNavigate()
  const age = getAge(patient.dateOfBirth)
  const dueBadge = getWeeksLeft(patient.weeksPregnant)
  const riskStyle = RISK_STYLES[patient.riskLevel] || RISK_STYLES.Low
  const bloodType = BLOOD_TYPE_LABELS[patient.bloodType] || '—'

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card hover:shadow-2xl transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FCE4EC] flex items-center justify-center text-pink-400 font-bold text-lg shrink-0">
            {patient.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{patient.fullName}</h3>
            {age !== null && (
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{age} years old</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="px-3 py-1.5 bg-teal-50 text-mamacare-teal rounded-xl text-[10px] font-extrabold uppercase tracking-widest">
            {patient.weeksPregnant}w
          </span>
          {patient.riskLevel && patient.riskLevel !== 'Low' && (
            <span className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-widest ${riskStyle}`}>
              {patient.riskLevel} Risk
            </span>
          )}
          {dueBadge && (
            <span className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-widest ${dueBadge.style}`}>
              {dueBadge.label}
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        {patient.phoneNumber && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Phone size={14} className="text-gray-300 shrink-0" />
            <span className="font-medium">{patient.phoneNumber}</span>
          </div>
        )}
        {patient.address && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <MapPin size={14} className="text-gray-300 shrink-0" />
            <span className="font-medium">{patient.address}</span>
          </div>
        )}
        {bloodType !== '—' && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Droplets size={14} className="text-gray-300 shrink-0" />
            <span className="font-medium">Blood type: {bloodType}</span>
          </div>
        )}
        {patient.emergencyContactName && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <UserCheck size={14} className="text-gray-300 shrink-0" />
            <span className="font-medium">{patient.emergencyContactName}
              {patient.emergencyContactPhone && ` · ${patient.emergencyContactPhone}`}
            </span>
          </div>
        )}
        {patient.medicalNotes && (
          <div className="flex items-start gap-3 text-sm text-gray-500">
            <FileText size={14} className="text-gray-300 shrink-0 mt-0.5" />
            <span className="font-medium line-clamp-2">{patient.medicalNotes}</span>
          </div>
        )}
      </div>

      {/* View Appointments */}
      <button
        onClick={() => navigate(`/patient-appointments?patientId=${patient.id}&patientName=${encodeURIComponent(patient.fullName)}`)}
        className="w-full flex items-center justify-center gap-2 py-2.5 mb-3 bg-teal-50 text-mamacare-teal rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-mamacare-teal hover:text-white transition-all"
      >
        <CalendarDays size={13} />
        View Appointments
      </button>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
        <button
          onClick={() => onEdit(patient)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-teal-50 text-gray-400 hover:text-mamacare-teal rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
        >
          <Edit2 size={13} />
          Edit
        </button>
        <button
          onClick={() => onDelete(patient.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-400 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  )
}

export default PatientCard
