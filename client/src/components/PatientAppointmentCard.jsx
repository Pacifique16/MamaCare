import { Edit2, Trash2, User, Stethoscope, Calendar, FileText, Clock, Tag, XCircle } from 'lucide-react'

const STATUS_STYLES = {
  Scheduled: 'bg-teal-50 text-mamacare-teal',
  Confirmed: 'bg-blue-50 text-blue-500',
  Waiting:   'bg-orange-50 text-orange-500',
  Completed: 'bg-green-50 text-green-600',
  Cancelled: 'bg-red-50 text-red-500',
}

const TYPE_LABELS = {
  RoutineCheckup: 'Routine Checkup',
  UltrasoundScan: 'Ultrasound Scan',
  GlucoseScreening: 'Glucose Screening',
  BirthPlanReview: 'Birth Plan Review',
  UrgentFollowUp: 'Urgent Follow-Up',
  Postpartum: 'Postpartum',
  Other: 'Other',
}

function getProximityBadge(dateStr) {
  const appt = new Date(dateStr)
  const now = new Date()

  const apptDay = new Date(Date.UTC(appt.getUTCFullYear(), appt.getUTCMonth(), appt.getUTCDate()))
  const todayDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  const diff = (apptDay - todayDay) / (1000 * 60 * 60 * 24)

  if (diff === 0) return { label: 'Today', style: 'bg-orange-50 text-orange-500' }
  if (diff === 1) return { label: 'Tomorrow', style: 'bg-blue-50 text-blue-500' }
  if (diff < 0) return null
  return null
}

function PatientAppointmentCard({ appointment, onEdit, onDelete }) {
  const formattedDate = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
      })
    : '—'

  const formattedTime = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit'
      })
    : ''

  const statusStyle = STATUS_STYLES[appointment.status] || 'bg-gray-50 text-gray-400'
  const proximityBadge = appointment.appointmentDate ? getProximityBadge(appointment.appointmentDate) : null

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card hover:shadow-2xl transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E0F2F1] flex items-center justify-center text-mamacare-teal shrink-0">
            <Stethoscope size={22} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{appointment.doctorName}</h3>
            <p className="text-[10px] font-semibold text-gray-400 mt-0.5">{appointment.doctorSpecialty}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest ${statusStyle}`}>
            {appointment.status}
          </span>
          {proximityBadge && (
            <span className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-widest ${proximityBadge.style}`}>
              {proximityBadge.label}
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <User size={14} className="text-mamacare-teal shrink-0" />
          <span className="font-medium">{appointment.patientName}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Calendar size={14} className="text-blue-500 shrink-0" />
          <span className="font-medium">{formattedDate}</span>
        </div>
        {formattedTime && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Clock size={14} className="text-purple-500 shrink-0" />
            <span className="font-medium">{formattedTime}</span>
          </div>
        )}
        {appointment.type && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Tag size={14} className="text-orange-500 shrink-0" />
            <span className="font-medium">{TYPE_LABELS[appointment.type] || appointment.type}</span>
          </div>
        )}
        {appointment.notes && (
          <div className="flex items-start gap-3 text-sm text-gray-500">
            <FileText size={14} className="text-green-600 shrink-0 mt-0.5" />
            <span className="font-medium">{appointment.notes}</span>
          </div>
        )}
        {appointment.status === 'Cancelled' && appointment.cancellationReason && (
          <div className="flex items-start gap-3 text-sm text-red-400">
            <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
            <span className="font-medium">{appointment.cancellationReason}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
        <button
          onClick={() => onEdit(appointment)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-teal-50/50 hover:bg-teal-50 text-mamacare-teal rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
        >
          <Edit2 size={13} />
          Edit 
        </button>
        <button
          onClick={() => onDelete(appointment.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50/50 hover:bg-red-50 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  )
}

export default PatientAppointmentCard
