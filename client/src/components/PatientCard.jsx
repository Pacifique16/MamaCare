import { Edit2, Trash2, Phone, MapPin, Calendar, Baby } from 'lucide-react'

function PatientCard({ patient, onEdit, onDelete }) {
  const formattedDob = patient.dateOfBirth
    ? new Date(patient.dateOfBirth).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : '—'

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card hover:shadow-2xl transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FCE4EC] flex items-center justify-center text-pink-400 font-bold text-lg shrink-0">
            {patient.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{patient.fullName}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Patient</p>
          </div>
        </div>
        <span className="px-3 py-1.5 bg-teal-50 text-mamacare-teal rounded-xl text-[10px] font-extrabold uppercase tracking-widest shrink-0">
          {patient.weeksPregnant}w
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Phone size={14} className="text-gray-300 shrink-0" />
          <span className="font-medium">{patient.phoneNumber || '—'}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Calendar size={14} className="text-gray-300 shrink-0" />
          <span className="font-medium">{formattedDob}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <MapPin size={14} className="text-gray-300 shrink-0" />
          <span className="font-medium">{patient.address || '—'}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Baby size={14} className="text-gray-300 shrink-0" />
          <span className="font-medium">{patient.weeksPregnant} weeks pregnant</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
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
