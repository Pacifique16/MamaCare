import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

import { Users, ShieldCheck, CheckCircle2, Search, Filter, Download, Edit2, Ban, ChevronLeft, ChevronRight, Trash2, XCircle, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doctorsApi } from '../../api/services';

const PAGE_SIZE = 4;

const DoctorManagement = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [sortField, setSortField] = useState('fullName');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    doctorsApi.getAll().then(r => setDoctors(r.data)).catch(() => {});
  }, []);

  const handleVerify = async (id) => {
    await doctorsApi.verify(id);
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: 'Verified' } : d));
  };

  const handleSuspend = async (id) => {
    if (!window.confirm('Suspend this doctor?')) return;
    await doctorsApi.suspend(id);
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: 'Inactive' } : d));
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this doctor? They will be set to Inactive.')) return;
    await doctorsApi.suspend(id);
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: 'Inactive' } : d));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this doctor? This cannot be undone.')) return;
    try {
      await doctorsApi.delete(id);
      setDoctors(prev => prev.filter(d => d.id !== id));
    } catch { alert('Failed to delete doctor.'); }
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    setPage(1);
  };

  const specialties = ['All', ...Array.from(new Set(doctors.map(d => d.specialty)))];

  const filtered = doctors
    .filter(d => {
      const q = search.toLowerCase();
      const matchSearch = d.fullName.toLowerCase().includes(q) || d.licenseNumber.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || d.status === statusFilter;
      const matchSpecialty = specialtyFilter === 'All' || d.specialty === specialtyFilter;
      return matchSearch && matchStatus && matchSpecialty;
    })
    .sort((a, b) => {
      const av = (a[sortField] || '').toString().toLowerCase();
      const bv = (b[sortField] || '').toString().toLowerCase();
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExport = () => {
    const headers = ['Full Name', 'Specialty', 'License Number', 'Status'];
    const rows = filtered.map(d => [d.fullName, d.specialty, d.licenseNumber, d.status]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `doctors-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={12} className="text-gray-200" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-mamacare-teal" /> : <ChevronDown size={12} className="text-mamacare-teal" />;
  };

  const totalDoctors = doctors.length;
  const verifiedDoctors = doctors.filter(d => d.status === 'Verified').length;
  const pendingDoctors = doctors.filter(d => d.status === 'Pending').length;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-12 animate-in slide-in-from-bottom-4 duration-700">
        {/* High-Fidelity Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10 font-poppins">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">CLINICAL STAFF</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Staff Directory</h1>
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
              onClick={() => navigate('/admin/add-doctor')}
              className="bg-mamacare-teal text-white px-8 py-3 rounded-xl font-bold text-xs shadow-lg shadow-mamacare-teal/10 transition-all hover:bg-mamacare-teal-dark active:scale-[0.98] flex items-center gap-2 font-poppins"
            >
              <Plus size={18} />
              Add New Doctor
            </button>
          </div>
        </div>

        {/* Professional SaaS Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins pt-4">
          {[
            { label: 'Total Practitioners', value: totalDoctors, trend: 'stable', progress: '100%', color: 'text-mamacare-teal'},
            { label: 'Pending Verification', value: pendingDoctors, trend: 'attention', progress: `${(pendingDoctors/totalDoctors)*100}%`, color: 'text-red-500' },
            { label: 'Verified Doctors', value: verifiedDoctors, trend: 'active', progress: `${(verifiedDoctors/totalDoctors)*100}%`, color: 'text-cyan-600' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-3xl p-8 border border-gray-100/50 shadow-sm transition-all duration-300 hover:shadow-md`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] font-medium text-gray-700 ">{s.label}</span>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-white/60 ${s.color}`}>
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

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or medical ID..."
              className="w-full pl-16 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20"
            />
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <select 
                value={statusFilter} 
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }} 
                className="w-full px-6 py-3 bg-white border border-mamacare-teal/30 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20 font-poppins appearance-none cursor-pointer hover:border-mamacare-teal transition-all pr-12"
              >
                <option value="All">ALL STATUS</option>
                <option value="Verified">VERIFIED</option>
                <option value="Pending">PENDING</option>
                <option value="Inactive">INACTIVE</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-mamacare-teal pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                value={specialtyFilter} 
                onChange={e => { setSpecialtyFilter(e.target.value); setPage(1); }} 
                className="w-full px-6 py-3 bg-white border border-mamacare-teal/30 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20 font-poppins appearance-none cursor-pointer hover:border-mamacare-teal transition-all pr-12 min-w-[220px]"
              >
                <option value="All">ALL SPECIALISATION</option>
                {specialties.filter(s => s !== 'All').map(s => (
                  <option key={s} value={s}>{s.toUpperCase()}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-mamacare-teal pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[3rem] overflow-hidden border border-white shadow-card">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-8 text-[14px] font-semibold text-gray-700 cursor-pointer select-none" onClick={() => handleSort('fullName')}>
                  <div className="flex items-center gap-2">Doctor Details <SortIcon field="fullName" /></div>
                </th>
                <th className="p-8 text-[14px] font-semibold text-gray-700 cursor-pointer select-none" onClick={() => handleSort('specialty')}>
                  <div className="flex items-center gap-2">Specialty <SortIcon field="specialty" /></div>
                </th>
                <th className="p-8 text-[14px] font-semibold text-gray-700 cursor-pointer select-none" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-2">Status <SortIcon field="status" /></div>
                </th>
                <th className="p-8 text-[14px] font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto">
                        <Users size={28} className="text-gray-300" />
                      </div>
                      <p className="font-bold text-gray-400">No doctors found</p>
                      <p className="text-sm text-gray-300">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : paginated.map((doc) => (
                <tr key={doc.id} className="group border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-all">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <img
                        src={doc.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.fullName)}&background=005C5C&color=fff`}
                        alt={doc.fullName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-100"
                      />
                      <div className="space-y-1">
                        <p className="font-bold text-gray-900 group-hover:text-mamacare-teal transition-colors">{doc.fullName}</p>
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">ID: {doc.licenseNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8"><p className="text-sm  text-gray-900">{doc.specialty}</p></td>
                  <td className="p-8">
                    <span className={`flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                      doc.status === 'Verified' ? 'bg-teal-50 text-mamacare-teal' :
                      doc.status === 'Inactive' ? 'bg-gray-100 text-gray-400' :
                      'bg-orange-50 text-orange-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${doc.status === 'Verified' ? 'bg-mamacare-teal' : doc.status === 'Inactive' ? 'bg-gray-400' : 'bg-orange-400'}`}></div>
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-3">
                      {doc.status === 'Pending' && (
                        <>
                          <button onClick={() => handleVerify(doc.id)} className="bg-mamacare-teal text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-mamacare-teal-dark transition-all">
                            Verify
                          </button>
                          <button onClick={() => handleReject(doc.id)} className="bg-red-50 text-red-400 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-1">
                            <XCircle size={13} /> Reject
                          </button>
                        </>
                      )}
                      <button onClick={() => navigate(`/admin/edit-doctor/${doc.id}`)} className="p-2.5 text-mamacare-teal hover:bg-teal-50 bg-gray-50 rounded-xl transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleSuspend(doc.id)} className="p-2.5 text-orange-500 hover:bg-orange-50 bg-gray-50 rounded-xl transition-all">
                        <Ban size={16} />
                      </button>
                      <button onClick={() => handleDelete(doc.id)} className="p-2.5 text-red-500 hover:bg-red-50 bg-gray-50 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
      </div>
    </AdminLayout>
  );
};

export default DoctorManagement;
