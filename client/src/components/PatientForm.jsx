import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { mothersApi } from '../api/services'

const BLOOD_TYPES = [
  { value: 'Unknown', label: 'Unknown' },
  { value: 'APositive', label: 'A+' },
  { value: 'ANegative', label: 'A-' },
  { value: 'BPositive', label: 'B+' },
  { value: 'BNegative', label: 'B-' },
  { value: 'OPositive', label: 'O+' },
  { value: 'ONegative', label: 'O-' },
  { value: 'ABPositive', label: 'AB+' },
  { value: 'ABNegative', label: 'AB-' },
]

const RISK_LEVELS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
]

function PatientForm({ patient, onSuccess, onCancel }) {
  const isEdit = Boolean(patient)
  const firstInputRef = useRef(null)

  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    weeksPregnant: '',
    dateOfBirth: '',
    bloodType: 'Unknown',
    riskLevel: 'Low',
    emergencyContactName: '',
    emergencyContactPhone: '',
    medicalNotes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    setTimeout(() => firstInputRef.current?.focus(), 50)
  }, [])

  useEffect(() => {
    if (patient) {
      setForm({
        fullName: patient.fullName || '',
        phoneNumber: patient.phoneNumber || '',
        address: patient.address || '',
        weeksPregnant: patient.weeksPregnant ?? '',
        dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.substring(0, 10) : '',
        bloodType: patient.bloodType || 'Unknown',
        riskLevel: patient.riskLevel || 'Low',
        emergencyContactName: patient.emergencyContactName || '',
        emergencyContactPhone: patient.emergencyContactPhone || '',
        medicalNotes: patient.medicalNotes || '',
      })
    }
  }, [patient])

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.dateOfBirth) errs.dateOfBirth = 'Date of birth is required'
    if (form.weeksPregnant === '' || Number(form.weeksPregnant) < 0)
      errs.weeksPregnant = 'Weeks pregnant must be 0 or more'
    return errs
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    setSubmitError('')
    const payload = {
      fullName: form.fullName.trim(),
      dateOfBirth: new Date(form.dateOfBirth).toISOString(),
      phoneNumber: form.phoneNumber.trim() || null,
      address: form.address.trim() || null,
      weeksPregnant: parseInt(form.weeksPregnant, 10),
      bloodType: form.bloodType,
      riskLevel: form.riskLevel,
      emergencyContactName: form.emergencyContactName.trim() || null,
      emergencyContactPhone: form.emergencyContactPhone.trim() || null,
      medicalNotes: form.medicalNotes.trim() || null,
    }

    try {
      if (isEdit) {
        await mothersApi.update(patient.id, {
          gestationalWeek: parseInt(form.weeksPregnant, 10),
          location: form.address || null,
          riskLevel: form.riskLevel,
          bloodType: form.bloodType,
          emergencyContactName: form.emergencyContactName || null,
          emergencyContactPhone: form.emergencyContactPhone || null,
          medicalNotes: form.medicalNotes || null,
          address: form.address || null,
        })
      } else {
        // Creating a new mother requires email/password — show a note
        alert('To add a new patient, please use the Sign Up flow or contact admin.')
        setSubmitting(false)
        return
      }
      onSuccess()
    } catch (err) {
      setSubmitError(
        err?.response?.data?.title || err?.response?.data || 'Something went wrong. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">
              {isEdit ? 'Update Record' : 'New Registration'}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
              {isEdit ? 'Edit Patient' : 'Add Patient'}
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

          {/* Full Name */}
          <div>
            <label className="form-label">Full Name *</label>
            <input
              ref={firstInputRef}
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
              className={`input-field ${errors.fullName ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors.fullName && <p className="text-red-400 text-xs font-semibold mt-1">{errors.fullName}</p>}
          </div>

          {/* Phone + Weeks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Phone Number</label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+250 788 000 000"
                className="input-field"
              />
            </div>
            <div>
              <label className="form-label">Weeks Pregnant *</label>
              <input
                type="number"
                name="weeksPregnant"
                value={form.weeksPregnant}
                onChange={handleChange}
                min={0} max={45}
                placeholder="e.g. 24"
                className={`input-field ${errors.weeksPregnant ? 'ring-2 ring-red-400' : ''}`}
              />
              {errors.weeksPregnant && <p className="text-red-400 text-xs font-semibold mt-1">{errors.weeksPregnant}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="form-label">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. Kigali, Rwanda"
              className="input-field"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="form-label">Date of Birth *</label>
            <DatePicker
              selected={form.dateOfBirth && !isNaN(new Date(form.dateOfBirth)) ? new Date(form.dateOfBirth) : null}
              onChange={(date) => {
                const val = date
                  ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                  : ''
                setForm((prev) => ({ ...prev, dateOfBirth: val }))
                setErrors((prev) => ({ ...prev, dateOfBirth: '' }))
              }}
              maxDate={new Date()}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select date of birth"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={80}
              className={`input-field w-full ${errors.dateOfBirth ? 'ring-2 ring-red-400' : ''}`}
              wrapperClassName="w-full"
              popperPlacement="bottom-start"
            />
            {errors.dateOfBirth && <p className="text-red-400 text-xs font-semibold mt-1">{errors.dateOfBirth}</p>}
          </div>

          {/* Blood Type + Risk Level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Blood Type</label>
              <select name="bloodType" value={form.bloodType} onChange={handleChange} className="input-field">
                {BLOOD_TYPES.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Risk Level</label>
              <select name="riskLevel" value={form.riskLevel} onChange={handleChange} className="input-field">
                {RISK_LEVELS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Emergency Contact Name</label>
              <input
                name="emergencyContactName"
                value={form.emergencyContactName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="input-field"
              />
            </div>
            <div>
              <label className="form-label">Emergency Contact Phone</label>
              <input
                name="emergencyContactPhone"
                value={form.emergencyContactPhone}
                onChange={handleChange}
                placeholder="+250 788 000 000"
                className="input-field"
              />
            </div>
          </div>

          {/* Medical Notes */}
          <div>
            <label className="form-label">Medical Notes</label>
            <textarea
              name="medicalNotes"
              value={form.medicalNotes}
              onChange={handleChange}
              placeholder="Any relevant medical history or notes…"
              rows={3}
              className="input-field resize-none"
            />
          </div>

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
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PatientForm
