import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createPatient, updatePatient } from '../api/patientsApi'

function PatientForm({ patient, onSuccess, onCancel }) {
  const isEdit = Boolean(patient)

  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    weeksPregnant: '',
    dateOfBirth: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (patient) {
      setForm({
        fullName: patient.fullName || '',
        phoneNumber: patient.phoneNumber || '',
        address: patient.address || '',
        weeksPregnant: patient.weeksPregnant ?? '',
        dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.substring(0, 10) : '',
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
    }

    try {
      if (isEdit) {
        await updatePatient(patient.id, payload)
      } else {
        await createPatient(payload)
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl">
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
          <div>
            <label className="form-label">Full Name *</label>
            <input
              autoFocus
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
              className={`input-field ${errors.fullName ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors.fullName && <p className="text-red-400 text-xs font-semibold mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="form-label">Phone Number</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="e.g. +250 788 000 000"
              className="input-field"
            />
          </div>

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

          <div>
            <label className="form-label">Weeks Pregnant *</label>
            <input
              type="number"
              name="weeksPregnant"
              value={form.weeksPregnant}
              onChange={handleChange}
              min={0}
              max={45}
              placeholder="e.g. 24"
              className={`input-field ${errors.weeksPregnant ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors.weeksPregnant && <p className="text-red-400 text-xs font-semibold mt-1">{errors.weeksPregnant}</p>}
          </div>

          <div>
            <label className="form-label">Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className={`input-field ${errors.dateOfBirth ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors.dateOfBirth && <p className="text-red-400 text-xs font-semibold mt-1">{errors.dateOfBirth}</p>}
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
