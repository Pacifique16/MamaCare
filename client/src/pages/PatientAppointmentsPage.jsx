import { useState, useEffect, useMemo } from 'react'
import { Plus, CalendarDays, RefreshCw, CheckCircle, XCircle, Search, ArrowUpDown, Download, ChevronDown } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import PatientAppointmentCard from '../components/PatientAppointmentCard'
import PatientAppointmentForm from '../components/PatientAppointmentForm'
import { deleteAppointment } from '../api/patientAppointmentsApi'
import { appointmentsApi } from '../api/services'

const TABS = ['All', 'Upcoming', 'Past']
const SORT_OPTIONS = [
  { label: 'Date ↑', value: 'date_asc' },
  { label: 'Date ↓', value: 'date_desc' },
  // { label: 'Status', value: 'status' },
  // { label: 'Patient', value: 'patient' },
]
const PAGE_SIZE = 9

function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)

  // Filters
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sort, setSort] = useState('date_asc')
  const [page, setPage] = useState(1)

  // Pre-filter by patient if navigated from PatientCard
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const patientName = searchParams.get('patientName')
    if (patientName) setSearch(patientName)
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    setError('')
    try {
      // Use the Mothers-linked appointments endpoint for stability and seeded data
      const res = await appointmentsApi.getAll()
      
      // Map Mother-based fields to the UI-expected field names
      const mapped = res.data.map(a => ({
        ...a,
        patientId: a.motherId,
        patientName: a.motherName,
        appointmentDate: a.scheduledAt
      }))
      
      setAppointments(mapped)
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
      // Use appointmentsApi.delete to target System A (Mothers)
      await appointmentsApi.delete(id)
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

  const now = new Date()

  const filtered = useMemo(() => {
    let list = [...appointments]

    // Tab filter
    if (activeTab === 'Upcoming') list = list.filter((a) => new Date(a.appointmentDate) >= now)
    if (activeTab === 'Past') list = list.filter((a) => new Date(a.appointmentDate) < now)

    // Status filter
    if (statusFilter !== 'All') list = list.filter((a) => a.status === statusFilter)



    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((a) =>
        a.patientName?.toLowerCase().includes(q) ||
        a.doctorName?.toLowerCase().includes(q) ||
        a.doctorSpecialty?.toLowerCase().includes(q)
      )
    }

    // Sort
    list.sort((a, b) => {
      if (sort === 'date_asc') return new Date(a.appointmentDate) - new Date(b.appointmentDate)
      if (sort === 'date_desc') return new Date(b.appointmentDate) - new Date(a.appointmentDate)
      if (sort === 'status') return a.status.localeCompare(b.status)
      if (sort === 'patient') return a.patientName.localeCompare(b.patientName)
      return 0
    })

    return list
  }, [appointments, activeTab, statusFilter, search, sort])

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Reset page when filters change
  useEffect(() => { setPage(1) }, [search, activeTab, statusFilter, sort])

  // CSV Export
  const handleExport = () => {
    const headers = ['Patient', 'Doctor', 'Specialty', 'Type', 'Date', 'Time', 'Status', 'Cancellation Reason', 'Notes']
    const rows = filtered.map((a) => [
      a.patientName,
      a.doctorName,
      a.doctorSpecialty,
      a.type ?? '',
      new Date(a.appointmentDate).toLocaleDateString('en-US', { timeZone: 'UTC' }),
      new Date(a.appointmentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
      a.status,
      a.cancellationReason ?? '',
      a.notes ?? '',
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `appointments-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const scheduled = appointments.filter((a) => a.status === 'Scheduled').length
  const completed = appointments.filter((a) => a.status === 'Completed').length
  const cancelled = appointments.filter((a) => a.status === 'Cancelled').length

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-10 animate-in fade-in duration-700">

        {/* High-Fidelity Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10 font-poppins">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">APPOINTMENT MANAGEMENT</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Appointments</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-mamacare-teal hover:border-mamacare-teal/30 transition-all font-poppins shadow-sm"
            >
              <Download size={14} />
              Export
            </button>
            <button
              onClick={() => { setEditingAppointment(null); setShowForm(true) }}
              className="bg-mamacare-teal text-white px-8 py-3 rounded-xl font-bold text-xs shadow-lg shadow-mamacare-teal/10 transition-all hover:bg-mamacare-teal-dark active:scale-[0.98] flex items-center gap-2 font-poppins"
            >
              <Plus size={18} />
              Book Appointment
            </button>
          </div>
        </div>

        {/* Professional SaaS Stats Row */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins">
            {[
              { label: 'Scheduled', value: scheduled, trend: 'upcoming', progress: `${(scheduled/appointments.length)*100}%`, color: 'text-mamacare-teal' },
              { label: 'Completed', value: completed, trend: 'success', progress: `${(completed/appointments.length)*100}%`, color: 'text-green-500' },
              { label: 'Cancelled', value: cancelled, trend: 'attention', progress: `${(cancelled/appointments.length)*100}%`, color: 'text-red-500' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[12px] font-bold text-gray-700">{s.label}</span>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-gray-50 ${s.color}`}>
                      {s.trend}
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 tracking-tight">{s.value}</h3>
                  <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-mamacare-teal rounded-full" style={{ width: s.progress }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search + Filters + Sort */}
        {!loading && !error && (
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by patient, doctor or specialty…"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20"
              />
            </div>

            {/* Tabs (Converted to Dropdown) */}
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-6 py-3 bg-white border border-mamacare-teal/30 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20 font-poppins appearance-none cursor-pointer hover:border-mamacare-teal transition-all pr-12"
              >
                {TABS.map((tab) => (
                  <option key={tab} value={tab}>
                    {tab === 'All' ? 'ALL PERIOD' : tab.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-mamacare-teal pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-6 py-3 bg-white border border-mamacare-teal/30 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20 appearance-none cursor-pointer hover:border-mamacare-teal transition-all pr-12"
              >
                <option value="All">ALL STATUSES</option>
                <option value="Scheduled">SCHEDULED</option>
                <option value="Confirmed">CONFIRMED</option>
                <option value="Waiting">WAITING</option>
                <option value="Completed">COMPLETED</option>
                <option value="Cancelled">CANCELLED</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-mamacare-teal pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-6 py-3 bg-white border border-mamacare-teal/30 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20 appearance-none cursor-pointer hover:border-mamacare-teal transition-all pr-12"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-mamacare-teal pointer-events-none" />
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
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-[2.5rem] p-16 border border-white shadow-card flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 text-mamacare-teal flex items-center justify-center">
              <CalendarDays size={28} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-bold text-gray-900 text-lg">
                {search || statusFilter !== 'All' || activeTab !== 'All' ? 'No appointments match your filters' : 'No appointments yet'}
              </h3>
              <p className="text-sm text-gray-400 font-medium">
                {search || statusFilter !== 'All' || activeTab !== 'All' ? 'Try adjusting your search or filters.' : 'Click "Book Appointment" to schedule the first one.'}
              </p>
            </div>
            {!search && statusFilter === 'All' && activeTab === 'All' && (
              <button onClick={() => setShowForm(true)} className="btn-primary">
                <Plus size={16} />
                Book Appointment
              </button>
            )}
          </div>
        )}

        {/* Appointments Grid */}
        {!loading && !error && paginated.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((a) => (
                <PatientAppointmentCard
                  key={a.id}
                  appointment={a}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-gray-400 hover:text-mamacare-teal disabled:opacity-40 transition-all"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-[11px] font-bold transition-all ${
                        page === p ? 'bg-mamacare-teal text-white' : 'bg-white border border-gray-100 text-gray-400 hover:text-mamacare-teal'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-gray-400 hover:text-mamacare-teal disabled:opacity-40 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
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
