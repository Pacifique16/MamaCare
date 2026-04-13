import { useState, useEffect } from 'react'
import { Plus, CalendarDays, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'
import PatientAppointmentCard from '../components/PatientAppointmentCard'
import PatientAppointmentForm from '../components/PatientAppointmentForm'
import { getAllAppointments, deleteAppointment } from '../api/patientAppointmentsApi'

function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)

  const fetchAppointments = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAllAppointments()
      setAppointments(res.data)
    } catch {
      setError('Failed to load appointments. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAppointments() }, [])

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment? This cannot be undone.')) return
    try {
      await deleteAppointment(id)
      setAppointments((prev) => prev.filter((a) => a.id !== id))
    } catch {
      alert('Failed to delete appointment. Please try again.')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingAppointment(null)
    fetchAppointments()
  }

  const scheduled = appointments.filter((a) => a.status === 'Scheduled').length
  const completed = appointments.filter((a) => a.status === 'Completed').length
  const cancelled = appointments.filter((a) => a.status === 'Cancelled').length

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">

        {/* Page Header */}
        <div className="flex justify-between items-end gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">
              Appointment Management
            </span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Appointments</h1>
          </div>
          <button
            onClick={() => { setEditingAppointment(null); setShowForm(true) }}
            className="bg-mamacare-teal text-white px-10 py-5 rounded-2xl font-bold text-sm shadow-xl shadow-mamacare-teal/20 transition-all hover:bg-mamacare-teal-dark active:scale-[0.98] flex items-center gap-3"
          >
            <Plus size={18} />
            Book Appointment
          </button>
        </div>

        {/* Stats Bar */}
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scheduled</p>
                <h3 className="text-5xl font-extrabold text-gray-900 tracking-tighter">{scheduled}</h3>
              </div>
              <div className="w-14 h-14 bg-teal-50 text-mamacare-teal rounded-2xl flex items-center justify-center">
                <CalendarDays size={24} />
              </div>
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completed</p>
                <h3 className="text-5xl font-extrabold text-gray-900 tracking-tighter">{completed}</h3>
              </div>
              <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
                <CheckCircle size={24} />
              </div>
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cancelled</p>
                <h3 className="text-5xl font-extrabold text-gray-900 tracking-tighter">{cancelled}</h3>
              </div>
              <div className="w-14 h-14 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center">
                <XCircle size={24} />
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-mamacare-teal rounded-full animate-spin" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading appointments…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-[2.5rem] p-10 border border-red-100 shadow-card flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Error</p>
              <p className="font-bold text-gray-900">{error}</p>
            </div>
            <button
              onClick={fetchAppointments}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && appointments.length === 0 && (
          <div className="bg-white rounded-[2.5rem] p-16 border border-white shadow-card flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 text-mamacare-teal flex items-center justify-center">
              <CalendarDays size={28} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-bold text-gray-900 text-lg">No appointments yet</h3>
              <p className="text-sm text-gray-400 font-medium">Click "Book Appointment" to schedule the first one.</p>
            </div>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={16} />
              Book Appointment
            </button>
          </div>
        )}

        {/* Appointments Grid */}
        {!loading && !error && appointments.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((a) => (
              <PatientAppointmentCard
                key={a.id}
                appointment={a}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <PatientAppointmentForm
          appointment={editingAppointment}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditingAppointment(null) }}
        />
      )}
    </AdminLayout>
  )
}

export default PatientAppointmentsPage
