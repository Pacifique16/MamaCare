import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { submitContactMessage } from '../../api/contactApi'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_MESSAGE = 2000

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' }

const ContactForm = () => {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const errs = {}
    const name = form.name.trim()
    const email = form.email.trim()
    const subject = form.subject.trim()
    const message = form.message.trim()

    if (!name) errs.name = 'Name is required.'
    else if (name.length > 100) errs.name = 'Name cannot exceed 100 characters.'

    if (!email) errs.email = 'Email is required.'
    else if (!EMAIL_REGEX.test(email)) errs.email = 'Please enter a valid email address.'
    else if (email.length > 200) errs.email = 'Email cannot exceed 200 characters.'

    if (!subject) errs.subject = 'Subject is required.'
    else if (subject.length > 200) errs.subject = 'Subject cannot exceed 200 characters.'

    if (!message) errs.message = 'Message is required.'
    else if (message.length < 10) errs.message = 'Message must be at least 10 characters.'
    else if (message.length > MAX_MESSAGE) errs.message = `Message cannot exceed ${MAX_MESSAGE} characters.`

    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setSubmitError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    setSubmitError('')
    try {
      await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      })
      setSubmitted(true)
    } catch (err) {
      const apiErrors = err?.response?.data?.errors
      if (apiErrors) {
        // Map ASP.NET validation errors back to fields
        const mapped = {}
        if (apiErrors.Name) mapped.name = apiErrors.Name[0]
        if (apiErrors.Email) mapped.email = apiErrors.Email[0]
        if (apiErrors.Subject) mapped.subject = apiErrors.Subject[0]
        if (apiErrors.Message) mapped.message = apiErrors.Message[0]
        if (Object.keys(mapped).length > 0) { setErrors(mapped); return }
      }
      setSubmitError(
        err?.response?.data?.title ||
        'Something went wrong. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (field) =>
    `input-field bg-gray-100 focus:bg-white border-2 transition-colors ${
      errors[field]
        ? 'border-red-400 focus:border-red-400'
        : 'border-transparent focus:border-mamacare-teal/20'
    }`

  // ── Success State ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-card border border-gray-50 h-full flex flex-col items-center justify-center text-center gap-6 min-h-[420px]">
        <div className="w-20 h-20 rounded-3xl bg-teal-50 flex items-center justify-center text-mamacare-teal">
          <CheckCircle size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
          <p className="text-gray-500 font-medium max-w-sm">
            Thank you for reaching out. Our care team will get back to you within 24 hours.
          </p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setForm(EMPTY_FORM) }}
          className="text-[10px] font-bold text-mamacare-teal uppercase tracking-widest hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-card border border-gray-50 h-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="form-label">Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              maxLength={100}
              className={inputClass('name')}
            />
            {errors.name && <p className="text-red-400 text-xs font-semibold">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
              maxLength={200}
              className={inputClass('email')}
            />
            {errors.email && <p className="text-red-400 text-xs font-semibold">{errors.email}</p>}
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label className="form-label">Subject *</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="How can we help?"
            maxLength={200}
            className={inputClass('subject')}
          />
          {errors.subject && <p className="text-red-400 text-xs font-semibold">{errors.subject}</p>}
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="form-label flex justify-between">
            <span>Message *</span>
            <span className={`font-normal normal-case tracking-normal text-[11px] ${form.message.length > MAX_MESSAGE * 0.9 ? 'text-red-400' : 'text-gray-400'}`}>
              {form.message.length} / {MAX_MESSAGE}
            </span>
          </label>
          <textarea
            rows="5"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us more about your inquiry..."
            maxLength={MAX_MESSAGE}
            className={`${inputClass('message')} resize-none`}
          />
          {errors.message && <p className="text-red-400 text-xs font-semibold">{errors.message}</p>}
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-red-400 text-sm font-semibold">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-primary py-4 text-lg group disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Sending…' : 'Send Message'}
          {!submitting && (
            <Send size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          )}
        </button>
      </form>
    </div>
  )
}

export default ContactForm
