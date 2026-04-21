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
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all font-poppins">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-mamacare-teal/5 flex items-center justify-center text-mamacare-teal font-extrabold text-xl shrink-0 border border-mamacare-teal/10">
            {patient.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg tracking-tight leading-tight">{patient.fullName}</h3>
            {age !== null && (
              <p className="text-[10px] font-bold text-gray-400 mt-1">{age} Years Old</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="px-2 py-0.5 bg-mamacare-teal/5 text-mamacare-teal rounded text-[9px] font-black uppercase tracking-widest">
            {patient.weeksPregnant}w Gestation
          </span>
          {patient.riskLevel && patient.riskLevel !== 'Low' && (
            <span className={`px-2 py-0.5 rounded text-[9px]  ${riskStyle}`}>
              {patient.riskLevel} Risk
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-8">
        {patient.phoneNumber && (
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <Phone size={14} />
            </div>
            <span>{patient.phoneNumber}</span>
          </div>
        )}
        {patient.address && (
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <MapPin size={14} />
            </div>
            <span className="line-clamp-1">{patient.address}</span>
          </div>
        )}
        {bloodType !== '—' && (
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <Droplets size={14} />
            </div>
            <span>Blood Type: {bloodType}</span>
          </div>
        )}
      </div>

      {/* Secondary Badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        {dueBadge && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${dueBadge.style}`}>
            <CalendarDays size={12} />
            {dueBadge.label}
          </div>
        )}
        {patient.emergencyContactName && (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] font-bold">
            <UserCheck size={12} />
            EC: {patient.emergencyContactName}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-50">
        <button
          onClick={() => navigate(`/patient-appointments?patientId=${patient.id}&patientName=${encodeURIComponent(patient.fullName)}`)}
          className="col-span-2 flex items-center justify-center gap-2 py-3 bg-mamacare-teal text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-mamacare-teal-dark transition-all shadow-lg shadow-mamacare-teal/10 mb-2"
        >
          Manage Appointments
        </button>
        <button
          onClick={() => onEdit(patient)}
          className="flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
        >
          <Edit2 size={13} />
          Edit
        </button>
        <button
          onClick={() => onDelete(patient.id)}
          className="flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  )
}

export default PatientCard
