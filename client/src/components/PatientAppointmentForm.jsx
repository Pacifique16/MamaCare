import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Clock } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getVerifiedDoctors, getAvailableSlots } from '../api/patientAppointmentsApi'
import { mothersApi, appointmentsApi } from '../api/services'

const STATUSES = ['Scheduled', 'Completed', 'Cancelled']

const APPOINTMENT_TYPES = [
  { value: 'RoutineCheckup', label: 'Routine Checkup' },
  { value: 'UltrasoundScan', label: 'Ultrasound Scan' },
  { value: 'GlucoseScreening', label: 'Glucose Screening' },
  { value: 'BirthPlanReview', label: 'Birth Plan Review' },
  { value: 'UrgentFollowUp', label: 'Urgent Follow-Up' },
  { value: 'Postpartum', label: 'Postpartum' },
  { value: 'Other', label: 'Other' },
]

const EMPTY_FORM = {
  patientId: '',
  doctorId: '',
  date: '',
  time: '',
  type: 'RoutineCheckup',
  notes: '',
  status: 'Scheduled',
  cancellationReason: '',
}

function PatientAppointmentForm({ appointment, onSuccess, onCancel }) {
  const isEdit = Boolean(appointment)

  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    mothersApi.getAll().then((res) => setPatients(res.data)).catch(() => {})
    getVerifiedDoctors().then((res) => setDoctors(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!appointment) return
    const dt = new Date(appointment.appointmentDate)
    const date = dt.toISOString().slice(0, 10)
    const h = dt.getUTCHours().toString().padStart(2, '0')
    const m = dt.getUTCMinutes() < 30 ? '00' : '30'
    setForm({
      patientId: appointment.patientId ?? '',
      doctorId: appointment.doctorId ?? '',
      date,
      time: `${h}:${m}`,
      type: appointment.type || 'RoutineCheckup',
      notes: appointment.notes || '',
      status: appointment.status || 'Scheduled',
      cancellationReason: appointment.cancellationReason || '',
    })
  }, [appointment])

  useEffect(() => {
    if (!form.doctorId || !form.date) { setSlots([]); return }
    setSlotsLoading(true)
    const excludeId = isEdit ? appointment.id : null
    getAvailableSlots(form.doctorId, form.date, excludeId)
      .then((res) => setSlots(res.data))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false))
  }, [form.doctorId, form.date])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value, ...(name === 'doctorId' || name === 'date' ? { time: '' } : {}) }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSlotSelect = (time) => {
    setForm((prev) => ({ ...prev, time }))
    setErrors((prev) => ({ ...prev, time: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.patientId) errs.patientId = 'Patient is required'
    if (!form.doctorId) errs.doctorId = 'Doctor is required'
    if (!form.date) errs.date = 'Date is required'
    if (!form.time) errs.time = 'Please select a time slot'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    setSubmitError('')

    const isSystemA = true // We are transitioning to System A (Mothers)

    try {
      if (isEdit) {
        // Update payload for Mothers System (UpdateAppointmentDto)
        const updatePayload = {
          scheduledAt: new Date(`${form.date}T${form.time}:00Z`).toISOString(),
          type: form.type,
          notes: form.notes.trim() || null,
          status: form.status,
        }
        await appointmentsApi.update(appointment.id, updatePayload)
      } else {
        // Create payload for Mothers System (CreateAppointmentDto)
        const createPayload = {
          motherId: parseInt(form.patientId, 10),
          doctorId: parseInt(form.doctorId, 10),
          scheduledAt: new Date(`${form.date}T${form.time}:00Z`).toISOString(),
          type: form.type,
          notes: form.notes.trim() || null
        }
        await appointmentsApi.create(createPayload)
      }
      onSuccess()
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        'Something went wrong. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const selectedDoctor = doctors.find((d) => d.id === parseInt(form.doctorId, 10))

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={onCancel}
    >
      {/* stopPropagation prevents clicks inside the modal from reaching the overlay */}
      <div
        style={{ backgroundColor: 'white', borderRadius: '2.5rem', padding: '2.5rem', width: '100%', maxWidth: '32rem', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">
              {isEdit ? 'Update Record' : 'New Appointment'}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
              {isEdit ? 'Edit Appointment' : 'Book Appointment'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-10 h-10 rounded-2xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Patient */}
          <div>
            <label className="form-label">Patient *</label>
            <select
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              className={`input-field ${errors.patientId ? 'ring-2 ring-red-400' : ''}`}
            >
              <option value="">Select a patient…</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} — {p.gestationalWeek}w
                </option>
              ))}
            </select>
            {errors.patientId && <p className="text-red-400 text-xs font-semibold mt-1">{errors.patientId}</p>}
          </div>

          {/* Doctor */}
          <div>
            <label className="form-label">Doctor *</label>
            <select
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              className={`input-field ${errors.doctorId ? 'ring-2 ring-red-400' : ''}`}
            >
              <option value="">Select a doctor…</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName} — {d.specialty}
                </option>
              ))}
            </select>
            {errors.doctorId && <p className="text-red-400 text-xs font-semibold mt-1">{errors.doctorId}</p>}
          </div>

          {/* Appointment Type */}
          <div>
            <label className="form-label">Appointment Type *</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="input-field"
            >
              {APPOINTMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="form-label">Appointment Date *</label>
            <DatePicker
              selected={form.date ? new Date(form.date) : null}
              onChange={(date) => {
                const val = date
                  ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                  : ''
                setForm((prev) => ({ ...prev, date: val, time: '' }))
                setErrors((prev) => ({ ...prev, date: '' }))
              }}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              className={`input-field w-full ${errors.date ? 'ring-2 ring-red-400' : ''}`}
              wrapperClassName="w-full"
              popperPlacement="bottom-start"
            />
            {errors.date && <p className="text-red-400 text-xs font-semibold mt-1">{errors.date}</p>}
          </div>

          {/* Time Slots */}
          {form.doctorId && form.date && (
            <div>
              <label className="form-label flex items-center gap-2">
                <Clock size={13} className="text-mamacare-teal" />
                Available Slots *
                {selectedDoctor && (
                  <span className="font-normal text-gray-400 normal-case tracking-normal text-[11px]">
                    — {selectedDoctor.fullName}
                  </span>
                )}
              </label>

              {slotsLoading ? (
                <div className="flex items-center gap-3 py-4 text-gray-400 text-xs font-semibold">
                  <div className="w-4 h-4 border-2 border-gray-200 border-t-mamacare-teal rounded-full animate-spin" />
                  Loading slots…
                </div>
              ) : slots.length === 0 ? (
                <p className="text-xs text-gray-400 font-medium py-3">No slots available for this date.</p>
              ) : (
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => slot.available && handleSlotSelect(slot.time)}
                      className={`
                        py-2.5 rounded-xl text-[11px] font-bold tracking-wide transition-all
                        ${!slot.available
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                          : form.time === slot.time
                            ? 'bg-mamacare-teal text-white shadow-lg shadow-mamacare-teal/25'
                            : 'bg-gray-50 text-gray-600 hover:bg-teal-50 hover:text-mamacare-teal'}
                      `}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
              {errors.time && <p className="text-red-400 text-xs font-semibold mt-1">{errors.time}</p>}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="form-label">Notes</label>
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional notes…"
              className="input-field"
            />
          </div>

          {/* Status (edit only) */}
          {isEdit && (
            <div>
              <label className="form-label">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* Cancellation Reason */}
          {isEdit && form.status === 'Cancelled' && (
            <div>
              <label className="form-label">Cancellation Reason</label>
              <input
                name="cancellationReason"
                value={form.cancellationReason}
                onChange={handleChange}
                placeholder="Reason for cancellation…"
                className="input-field"
              />
            </div>
          )}

          {submitError && (
            <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-red-400 text-sm font-semibold">
              {submitError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="btn-secondary flex-1" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={submitting}>
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default PatientAppointmentForm
