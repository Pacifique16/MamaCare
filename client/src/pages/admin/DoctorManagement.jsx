import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import AdminFooter from '../../components/layout/AdminFooter';
import { Users, ShieldCheck, Heart, Search, Filter, Download, Edit2, Ban, ChevronLeft, ChevronRight, Trash2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doctorsApi, adminApi } from '../../api/services';

const DoctorManagement = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    doctorsApi.getAll().then(r => setDoctors(r.data)).catch(() => {});
    adminApi.getStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const handleVerify = async (id) => {
    await doctorsApi.verify(id);
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: 'Verified' } : d));
  };

  const handleSuspend = async (id) => {
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

  const handleExport = () => {
    const headers = ['Full Name', 'Specialty', 'License Number', 'Status'];
    const rows = filtered.map(d => [d.fullName, d.specialty, d.licenseNumber, d.status]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `doctors-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = doctors.filter(d => {
    const matchSearch = d.fullName.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-12 animate-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-end gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">STAFF DIRECTORY</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Doctor Management</h1>
            <p className="text-gray-400 font-medium">Verify credentials and manage clinical staff access.</p>
          </div>
          <button onClick={() => navigate('/admin/add-doctor')} className="bg-[#005C5C] text-white px-10 py-5 rounded-2xl font-bold text-sm shadow-xl shadow-mamacare-teal/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            + Add New Doctor
          </button>
        </div>

        {/* Live KPI Cards */}
        <div className="grid md:grid-cols-3 gap-8 pt-4">
          <div className="bg-white rounded-[2.5rem] p-10 border border-white shadow-card flex items-center justify-between">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Practitioners</p>
              <h3 className="text-6xl font-extrabold text-gray-900 tracking-tighter">{stats?.totalDoctors ?? '—'}</h3>
            </div>
            <div className="w-16 h-16 bg-teal-50 text-mamacare-teal rounded-3xl flex items-center justify-center"><Users size={32} /></div>
          </div>
          <div className="bg-red-50/50 rounded-[2.5rem] p-10 border border-white shadow-card flex items-center justify-between">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Verification</p>
              <h3 className="text-6xl font-extrabold text-gray-900 tracking-tighter">{stats?.pendingDoctors ?? '—'}</h3>
            </div>
            <div className="w-16 h-16 bg-red-100 text-red-400 rounded-3xl flex items-center justify-center"><ShieldCheck size={32} /></div>
          </div>
          <div className="bg-blue-50/50 rounded-[2.5rem] p-10 border border-white shadow-card flex items-center justify-between">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Sessions</p>
              <h3 className="text-6xl font-extrabold text-gray-900 tracking-tighter">{stats?.activeSessions ?? '—'}</h3>
            </div>
            <div className="w-16 h-16 bg-blue-100 text-blue-400 rounded-3xl flex items-center justify-center"><Heart size={32} /></div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 p-4 rounded-[2rem]">
          <div className="relative w-full md:w-[600px] group">
            <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or medical ID..."
              className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-16 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-mamacare-teal/5 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white border border-gray-100 px-8 py-5 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-50">
              <Filter size={18} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent font-bold text-sm text-gray-500 focus:outline-none cursor-pointer">
                <option value="All">All</option>
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-gray-100 px-8 py-5 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-50"><Download size={18} />Export</button>
          </div>
        </div>

        {/* Doctors Table — live from API */}
        <div className="bg-white rounded-[3rem] overflow-hidden border border-white shadow-card">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Doctor Details</th>
                <th className="p-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Specialty</th>
                <th className="p-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} className="group border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-all">
                  <td className="p-10">
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
                  <td className="p-10"><p className="text-sm font-bold text-gray-600">{doc.specialty}</p></td>
                  <td className="p-10">
                    <span className={`flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                      doc.status === 'Verified' ? 'bg-teal-50 text-mamacare-teal' :
                      doc.status === 'Inactive' ? 'bg-gray-100 text-gray-400' :
                      'bg-orange-50 text-orange-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${doc.status === 'Verified' ? 'bg-mamacare-teal' : doc.status === 'Inactive' ? 'bg-gray-400' : 'bg-orange-400'}`}></div>
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-10">
                    <div className="flex items-center gap-4">
                      {doc.status === 'Pending' ? (
                        <>
                          <button onClick={() => handleVerify(doc.id)} className="bg-mamacare-teal text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-mamacare-teal-dark transition-all">
                            Verify
                          </button>
                          <button onClick={() => handleReject(doc.id)} className="bg-red-50 text-red-400 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-1">
                            <XCircle size={13} /> Reject
                          </button>
                        </>
                      ) : (
                        <button onClick={() => navigate(`/admin/edit-doctor/${doc.id}`)} className="p-2.5 text-gray-300 hover:text-mamacare-teal bg-gray-50 rounded-xl transition-all">
                          <Edit2 size={16} />
                        </button>
                      )}
                      <button onClick={() => handleSuspend(doc.id)} className="p-2.5 text-gray-300 hover:text-red-400 bg-gray-50 rounded-xl transition-all">
                        <Ban size={16} />
                      </button>
                      <button onClick={() => handleDelete(doc.id)} className="p-2.5 text-gray-300 hover:text-red-500 bg-gray-50 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-10 bg-gray-50/50 flex items-center justify-between border-t border-gray-50">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Showing {filtered.length} of {doctors.length} doctors</p>
            <div className="flex items-center gap-2">
              <button className="p-3 text-gray-300 hover:text-mamacare-teal transition-all"><ChevronLeft size={20} /></button>
              <button className="w-10 h-10 bg-mamacare-teal text-white rounded-xl font-bold text-sm">1</button>
              <button className="p-3 text-gray-400 hover:text-mamacare-teal transition-all"><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>

        <AdminFooter />
      </div>
    </AdminLayout>
  );
};

export default DoctorManagement;
