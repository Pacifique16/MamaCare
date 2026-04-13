import { useState, useEffect } from 'react'
import { Plus, Users, RefreshCw } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'
import PatientCard from '../components/PatientCard'
import PatientForm from '../components/PatientForm'
import { getAllPatients, deletePatient } from '../api/patientsApi'

function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)

  const fetchPatients = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAllPatients()
      setPatients(res.data)
    } catch {
      setError('Failed to load patients. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPatients() }, [])

  const handleEdit = (patient) => {
    setEditingPatient(patient)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient? This cannot be undone.')) return
    try {
      await deletePatient(id)
      setPatients((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('Failed to delete patient. Please try again.')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingPatient(null)
    fetchPatients()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingPatient(null)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">

        {/* Page Header */}
        <div className="flex justify-between items-end gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">
              Patient Management
            </span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Patients</h1>
          </div>
          <button
            onClick={() => { setEditingPatient(null); setShowForm(true) }}
            className="bg-mamacare-teal text-white px-10 py-5 rounded-2xl font-bold text-sm shadow-xl shadow-mamacare-teal/20 transition-all hover:bg-mamacare-teal-dark active:scale-[0.98] flex items-center gap-3"
          >
            <Plus size={18} />
            Add Patient
          </button>
        </div>

        {/* Stats Bar */}
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Patients</p>
                <h3 className="text-5xl font-extrabold text-gray-900 tracking-tighter">{patients.length}</h3>
              </div>
              <div className="w-14 h-14 bg-teal-50 text-mamacare-teal rounded-2xl flex items-center justify-center">
                <Users size={24} />
              </div>
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg. Weeks Pregnant</p>
                <h3 className="text-5xl font-extrabold text-gray-900 tracking-tighter">
                  {patients.length > 0
                    ? Math.round(patients.reduce((s, p) => s + p.weeksPregnant, 0) / patients.length)
                    : '—'}
                </h3>
              </div>
              <div className="w-14 h-14 bg-pink-50 text-pink-400 rounded-2xl flex items-center justify-center text-xl font-bold">
                w
              </div>
            </div>
            <div className="bg-[#FCE4EC] rounded-[2.5rem] p-8 border border-white shadow-card flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Third Trimester</p>
                <h3 className="text-5xl font-extrabold text-gray-900 tracking-tighter">
                  {patients.filter((p) => p.weeksPregnant >= 28).length}
                </h3>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-pink-400 font-bold text-xl shadow-sm">
                T3
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-mamacare-teal rounded-full animate-spin" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading patients…</p>
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
              onClick={fetchPatients}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && patients.length === 0 && (
          <div className="bg-white rounded-[2.5rem] p-16 border border-white shadow-card flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 text-mamacare-teal flex items-center justify-center">
              <Users size={28} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-bold text-gray-900 text-lg">No patients yet</h3>
              <p className="text-sm text-gray-400 font-medium">Click "Add Patient" to register your first patient.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <Plus size={16} />
              Add Patient
            </button>
          </div>
        )}

        {/* Patient Grid */}
        {!loading && !error && patients.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((p) => (
              <PatientCard
                key={p.id}
                patient={p}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <PatientForm
          patient={editingPatient}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </AdminLayout>
  )
}

export default PatientsPage
