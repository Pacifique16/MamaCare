import { useState, useEffect, useMemo } from 'react'
import { Plus, Users, RefreshCw, Search, ArrowUpDown, Download } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'
import PatientCard from '../components/PatientCard'
import PatientForm from '../components/PatientForm'
import { getAllPatients, deletePatient } from '../api/patientsApi'

const TRIMESTER_TABS = ['All', 'First (1-13w)', 'Second (14-27w)', 'Third (28w+)']
const SORT_OPTIONS = [
  { label: 'Name A-Z', value: 'name_asc' },
  { label: 'Name Z-A', value: 'name_desc' },
  { label: 'Weeks ↑', value: 'weeks_asc' },
  { label: 'Weeks ↓', value: 'weeks_desc' },
  { label: 'Newest', value: 'newest' },
]
const PAGE_SIZE = 9

function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)

  const [search, setSearch] = useState('')
  const [trimesterTab, setTrimesterTab] = useState('All')
  const [riskFilter, setRiskFilter] = useState('All')
  const [sort, setSort] = useState('name_asc')
  const [page, setPage] = useState(1)

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

  const handleEdit = (patient) => { setEditingPatient(patient); setShowForm(true) }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient? This cannot be undone.')) return
    try {
      await deletePatient(id)
      setPatients((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('Failed to delete patient. Please try again.')
    }
  }

  const handleFormSuccess = () => { setShowForm(false); setEditingPatient(null); fetchPatients() }

  const filtered = useMemo(() => {
    let list = [...patients]

    if (trimesterTab === 'First (1-13w)') list = list.filter((p) => p.weeksPregnant >= 1 && p.weeksPregnant <= 13)
    if (trimesterTab === 'Second (14-27w)') list = list.filter((p) => p.weeksPregnant >= 14 && p.weeksPregnant <= 27)
    if (trimesterTab === 'Third (28w+)') list = list.filter((p) => p.weeksPregnant >= 28)

    if (riskFilter !== 'All') list = list.filter((p) => p.riskLevel === riskFilter)

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) =>
        p.fullName?.toLowerCase().includes(q) ||
        p.phoneNumber?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q)
      )
    }

    list.sort((a, b) => {
      if (sort === 'name_asc') return a.fullName.localeCompare(b.fullName)
      if (sort === 'name_desc') return b.fullName.localeCompare(a.fullName)
      if (sort === 'weeks_asc') return a.weeksPregnant - b.weeksPregnant
      if (sort === 'weeks_desc') return b.weeksPregnant - a.weeksPregnant
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      return 0
    })

    return list
  }, [patients, trimesterTab, riskFilter, search, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [search, trimesterTab, riskFilter, sort])

  const handleExport = () => {
    const headers = ['Full Name', 'Age', 'Phone', 'Address', 'Weeks Pregnant', 'Blood Type', 'Risk Level', 'Emergency Contact', 'Emergency Phone', 'Medical Notes']
    const getAge = (dob) => {
      if (!dob) return ''
      const d = new Date(dob), t = new Date()
      let age = t.getFullYear() - d.getFullYear()
      if (t.getMonth() - d.getMonth() < 0 || (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())) age--
      return age
    }
    const bloodLabels = { APositive:'A+',ANegative:'A-',BPositive:'B+',BNegative:'B-',OPositive:'O+',ONegative:'O-',ABPositive:'AB+',ABNegative:'AB-',Unknown:'Unknown' }
    const rows = filtered.map((p) => [
      p.fullName, getAge(p.dateOfBirth), p.phoneNumber ?? '', p.address ?? '',
      p.weeksPregnant, bloodLabels[p.bloodType] ?? '', p.riskLevel ?? '',
      p.emergencyContactName ?? '', p.emergencyContactPhone ?? '', p.medicalNotes ?? '',
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `patients-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const avgWeeks = patients.length > 0
    ? Math.round(patients.reduce((s, p) => s + p.weeksPregnant, 0) / patients.length)
    : '—'
  const thirdTrimester = patients.filter((p) => p.weeksPregnant >= 28).length
  const highRisk = patients.filter((p) => p.riskLevel === 'High').length

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-10 animate-in fade-in duration-700">

        {/* Header */}
        <div className="flex justify-between items-end gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">Patient Management</span>
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

        {/* Stats */}
        {!loading && !error && (
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Total Patients', value: patients.length, color: 'bg-teal-50 text-mamacare-teal', icon: <Users size={24} /> },
              { label: 'Avg. Weeks', value: avgWeeks, color: 'bg-pink-50 text-pink-400', icon: <span className="font-bold text-xl">w</span> },
              { label: 'Third Trimester', value: thirdTrimester, color: 'bg-purple-50 text-purple-400', icon: <span className="font-bold text-sm">T3</span> },
              { label: 'High Risk', value: highRisk, color: 'bg-red-50 text-red-400', icon: <span className="font-bold text-sm">!</span> },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-[2.5rem] p-8 border border-white shadow-card flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                  <h3 className="text-5xl font-extrabold text-gray-900 tracking-tighter">{s.value}</h3>
                </div>
                <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center`}>{s.icon}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        {!loading && !error && (
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone or address…"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20"
              />
            </div>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl">
              {TRIMESTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTrimesterTab(tab)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                    trimesterTab === tab ? 'bg-white text-mamacare-teal shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-500 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>

            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-gray-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-500 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-mamacare-teal hover:border-mamacare-teal/30 transition-all"
            >
              <Download size={14} />
              Export CSV
            </button>
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
            <button onClick={fetchPatients} className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-[2.5rem] p-16 border border-white shadow-card flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 text-mamacare-teal flex items-center justify-center">
              <Users size={28} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-bold text-gray-900 text-lg">
                {search || trimesterTab !== 'All' || riskFilter !== 'All' ? 'No patients match your filters' : 'No patients yet'}
              </h3>
              <p className="text-sm text-gray-400 font-medium">
                {search || trimesterTab !== 'All' || riskFilter !== 'All' ? 'Try adjusting your search or filters.' : 'Click "Add Patient" to register your first patient.'}
              </p>
            </div>
            {!search && trimesterTab === 'All' && riskFilter === 'All' && (
              <button onClick={() => setShowForm(true)} className="btn-primary">
                <Plus size={16} />
                Add Patient
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && paginated.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((p) => (
                <PatientCard key={p.id} patient={p} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-gray-400 hover:text-mamacare-teal disabled:opacity-40 transition-all">
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-[11px] font-bold transition-all ${page === p ? 'bg-mamacare-teal text-white' : 'bg-white border border-gray-100 text-gray-400 hover:text-mamacare-teal'}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-gray-400 hover:text-mamacare-teal disabled:opacity-40 transition-all">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showForm && (
        <PatientForm
          patient={editingPatient}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditingPatient(null) }}
        />
      )}
    </AdminLayout>
  )
}

export default PatientsPage
