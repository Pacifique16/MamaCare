import { useState, useEffect, useMemo } from 'react'
import { Plus, Users, RefreshCw, Search, ArrowUpDown, Download, ChevronDown } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'
import PatientCard from '../components/PatientCard'
import PatientForm from '../components/PatientForm'
import { getAllPatients, deletePatient } from '../api/patientsApi'
import { mothersApi } from '../api/services'

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
      // Use mothersApi.getAll() for a more stable, cycle-free data fetch
      const res = await mothersApi.getAll()
      // Map gestationalWeek to weeksPregnant to satisfy existing UI components
      const mappedData = res.data.map(m => ({
        ...m,
        weeksPregnant: m.gestationalWeek
      }))
      setPatients(mappedData)
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

        {/* Restoration of Premium Branding */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10 font-poppins">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">PATIENT MANAGEMENT</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Patients</h1>
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
              onClick={() => { setEditingPatient(null); setShowForm(true) }}
              className="bg-mamacare-teal text-white px-8 py-3 rounded-xl font-bold text-xs shadow-lg shadow-mamacare-teal/10 transition-all hover:bg-mamacare-teal-dark active:scale-[0.98] flex items-center gap-2 font-poppins"
            >
              <Plus size={18} />
              Add Patient
            </button>
          </div>
        </div>

        {/* Professional Stats row */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-poppins">
            {[
              { label: 'Total Patients', value: patients.length, trend: 'stable', progress: '100%', color: 'text-mamacare-teal' },
              { label: 'Avg. Gestation', value: `${avgWeeks}w`, trend: '+1.2', progress: `${(avgWeeks/40)*100}%`, color: 'text-blue-500' },
              { label: 'Third Trimester', value: thirdTrimester, trend: 'active', progress: `${(thirdTrimester/patients.length)*100}%`, color: 'text-purple-500' },
              { label: 'High Risk', value: highRisk, trend: 'critical', progress: `${(highRisk/patients.length)*100}%`, color: 'text-red-500' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[12px] font-bold text-gray-700">{s.label}</span>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase  tracking-widest bg-gray-50 ${s.color}`}>
                      {s.trend}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{s.value}</h3>
                  <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-mamacare-teal rounded-full" style={{ width: s.progress }} />
                  </div>
                </div>
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
                placeholder="Find patients by name or phone… "
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-medium text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/10 font-poppins"
              />
            </div>

            <div className="relative">
              <select
                value={trimesterTab}
                onChange={(e) => setTrimesterTab(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-[11px] font-bold uppercase tracking-widest text-gray-500 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/10 font-poppins appearance-none cursor-pointer hover:border-mamacare-teal/20 transition-all pr-10"
              >
                {TRIMESTER_TABS.map((tab) => (
                  <option key={tab} value={tab}>
                    {tab === 'All' ? 'TRIMESTER: ALL' : tab.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-[11px] font-bold uppercase tracking-widest text-gray-500 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/10 font-poppins appearance-none cursor-pointer hover:border-mamacare-teal/20 transition-all pr-10"
              >
                <option value="All">RISK LEVEL: ALL</option>
                <option value="Low">RISK: LOW</option>
                <option value="Medium">RISK: MEDIUM</option>
                <option value="High">RISK: HIGH</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 font-poppins">
              <div className="relative flex-1">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-[11px] font-bold uppercase tracking-widest text-gray-500 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/10 appearance-none cursor-pointer hover:border-mamacare-teal/20 transition-all pr-10"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
