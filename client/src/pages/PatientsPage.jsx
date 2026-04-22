import { useState, useEffect, useMemo } from 'react'
import { Plus, Users, RefreshCw, Search, ArrowUpDown, Download, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'
import PatientCard from '../components/PatientCard'
import PatientForm from '../components/PatientForm'
import { mothersApi } from '../api/services'

const TRIMESTER_TABS = ['All', 'First (1-13w)', 'Second (14-27w)', 'Third (28w+)']
const SORT_OPTIONS = [
  { label: 'Name A-Z', value: 'name_asc' },
  { label: 'Name Z-A', value: 'name_desc' },
  // { label: 'Weeks ↑', value: 'weeks_asc' },
  // { label: 'Weeks ↓', value: 'weeks_desc' },
  // { label: 'Newest', value: 'newest' },
]
const PAGE_SIZE = 4

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
      const mappedData = res.data.map(m => ({
        ...m,
        weeksPregnant: m.gestationalWeek,
        phoneNumber: m.phoneNumber || null,
        address: m.address || m.location || null,
      }))
      setPatients(mappedData)
    } catch {
      setError('Failed to load patients. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPatients() }, [])

  const handleEdit = async (patient) => {
    try {
      const res = await mothersApi.getById(patient.id)
      setEditingPatient(res.data)
    } catch {
      setEditingPatient(patient)
    }
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient? This cannot be undone.')) return
    try {
      await mothersApi.delete(id)
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
              <div key={s.label} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[13px] font-medium text-gray-700">{s.label}</span>
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

        {/* Filters */}
        {!loading && !error && (
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-wrap">
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

            <div className="relative">
              <select
                value={trimesterTab}
                onChange={(e) => setTrimesterTab(e.target.value)}
                className="w-full px-6 py-3 bg-white border border-mamacare-teal/30 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20 font-poppins appearance-none cursor-pointer hover:border-mamacare-teal transition-all pr-12"
              >
                {TRIMESTER_TABS.map((tab) => (
                  <option key={tab} value={tab}>
                    {tab === 'All' ? 'ALL TRIMESTER' : tab.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-mamacare-teal pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full px-6 py-3 bg-white border border-mamacare-teal/30 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20 font-poppins appearance-none cursor-pointer hover:border-mamacare-teal transition-all pr-12"
              >
                <option value="All">ALL RISK LEVELS</option>
                <option value="Low">LOW RISK LEVEL</option>
                <option value="Medium">MEDIUM RISK LEVEL</option>
                <option value="High">HIGH RISK LEVEL</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-mamacare-teal pointer-events-none" />
            </div>

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

        {/* Table */}
        {!loading && !error && paginated.length > 0 && (() => {
          const BLOOD_TYPE_LABELS = {
            APositive: 'A+', ANegative: 'A-',
            BPositive: 'B+', BNegative: 'B-',
            OPositive: 'O+', ONegative: 'O-',
            ABPositive: 'AB+', ABNegative: 'AB-',
            Unknown: 'None',
          }
          const RISK_STYLES = {
            Low: 'bg-green-50 text-green-600',
            Medium: 'bg-orange-50 text-orange-500',
            High: 'bg-red-50 text-red-500',
          }
          const getAge = (dob) => {
            if (!dob) return null
            const d = new Date(dob), t = new Date()
            let age = t.getFullYear() - d.getFullYear()
            if (t.getMonth() - d.getMonth() < 0 || (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())) age--
            return age
          }

          return (
            <>
              <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="py-8 pl-12 pr-8 text-[14px] font-semibold text-gray-700">Patient</th>
                      <th className="p-8 text-[14px] font-semibold text-gray-700">Contact</th>
                      <th className="p-8 text-[14px] font-semibold text-gray-700">Blood</th>
                      <th className="p-8 text-[14px] font-semibold text-gray-700">Gestation</th>
                      <th className="p-8 text-[14px] font-semibold text-gray-700">Risk</th>
                      <th className="py-8 pl-8 pr-12 text-[14px] font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((patient) => {
                      const age = getAge(patient.dateOfBirth)
                      const bloodType = BLOOD_TYPE_LABELS[patient.bloodType] || 'None'
                      const riskStyle = RISK_STYLES[patient.riskLevel] || RISK_STYLES.Low
                      return (
                        <tr key={patient.id} className="group border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-all">
                          {/* Patient */}
                          <td className="py-8 pl-12 pr-8">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-mamacare-teal/5 border border-mamacare-teal/10 shrink-0">
                                {patient.profileImageUrl
                                  ? <img src={patient.profileImageUrl} alt={patient.fullName} className="w-full h-full object-cover" />
                                  : <div className="w-full h-full flex items-center justify-center text-mamacare-teal font-extrabold text-base">{patient.fullName?.charAt(0).toUpperCase()}</div>
                                }
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 group-hover:text-mamacare-teal transition-colors leading-tight">{patient.fullName}</p>
                                {age !== null && (
                                  <p className="text-[10px] font-bold text-gray-400 mt-0.5">{age} yrs old</p>
                                )}
                              </div>
                            </div>
                          </td>
                          {/* Contact */}
                          <td className="p-8">
                            <p className="text-sm font-medium text-gray-700">{patient.phoneNumber || 'None'}</p>
                            {patient.address && (
                              <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{patient.address}</p>
                            )}
                          </td>
                          {/* Blood Type */}
                          <td className="p-8">
                            <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-[12px] font-extrabold tracking-widest">
                              {bloodType}
                            </span>
                          </td>
                          {/* Gestation */}
                          <td className="p-8">
                            <span className="px-3 py-1 bg-mamacare-teal/5 text-mamacare-teal rounded-full text-[12px] font-extrabold tracking-widest">
                              {patient.weeksPregnant}w
                            </span>
                          </td>
                          {/* Risk */}
                          <td className="p-8">
                            <span className={`px-3 py-1 rounded-full text-[12px] font-extrabold tracking-widest ${riskStyle}`}>
                              {patient.riskLevel || 'None'}
                            </span>
                          </td>
                          {/* Actions */}
                          <td className="py-8 pl-8 pr-12">
                            <div className="flex items-center gap-2">

                              <button
                                onClick={() => handleEdit(patient)}
                                className="p-2.5 bg-mamacare-teal/5 hover:bg-mamacare-teal/10 text-mamacare-teal rounded-xl transition-all"
                                title="Edit"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button
                                onClick={() => handleDelete(patient.id)}
                                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-400 rounded-xl transition-all"
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <div className="p-8 bg-gray-50/50 flex items-center justify-between border-t border-gray-50">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                      Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-3 text-gray-300 hover:text-mamacare-teal transition-all disabled:opacity-30">
                        <ChevronLeft size={20} />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${p === page ? 'bg-mamacare-teal text-white' : 'text-gray-400 hover:bg-gray-100'}`}>
                          {p}
                        </button>
                      ))}
                      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-3 text-gray-400 hover:text-mamacare-teal transition-all disabled:opacity-30">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )
        })()}
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
