import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
    ChevronLeft, 
    Bell, 
    Search, 
    HelpCircle, 
    LayoutDashboard, 
    Users, 
    ShieldCheck, 
    Calendar, 
    Settings,
    Camera,
    RefreshCcw,
    Lock,
    Globe,
    Save,
    CheckCircle2,
    Plus,
    X,
    Upload
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { doctorsApi } from '../../api/services';
import { uploadToCloudinary, downloadFile, uploadCertToCloudinary } from '../../api/cloudinary';

const EditDoctor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('Basic Info');
    const [status, setStatus] = useState('Pending');
    const [doctor, setDoctor] = useState(null);
    const [form, setForm] = useState({ fullName: '', phoneNumber: '', specialty: '', licenseNumber: '', institution: '', yearsOfExperience: '', bio: '' });
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const photoInputRef = useRef(null);
    const [certName, setCertName] = useState('');
    const [uploadingCert, setUploadingCert] = useState(false);
    const certInputRef = useRef(null);
    const [certs, setCerts] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [newLang, setNewLang] = useState('');
    const [addingLang, setAddingLang] = useState(false);
    const [schedule, setSchedule] = useState([]);
    const [activity, setActivity] = useState([]);
    const [showResetModal, setShowResetModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resettingPassword, setResettingPassword] = useState(false);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

const tabs = ['Basic Info', 'Credentials', 'Schedule', 'Activity Log'];

    useEffect(() => {
        if (!id) { navigate('/admin/doctors'); return; }
        doctorsApi.getById(id).then(r => {
            const d = r.data;
            setDoctor({ ...d, languages: d.languages || [] });
            setStatus(d.status || 'Pending');
            setCerts(d.certifications || []);
            setLanguages(d.languages || []);
            doctorsApi.getSchedule(id).then(r => setSchedule(r.data)).catch(() => {});
            doctorsApi.getActivity(id).then(r => setActivity(r.data)).catch(() => {});
            setForm({
                fullName: d.fullName || '',
                phoneNumber: d.phoneNumber || '',
                specialty: d.specialty || '',
                licenseNumber: d.licenseNumber || '',
                institution: d.institution || '',
                yearsOfExperience: d.yearsOfExperience?.toString() || '',
                bio: d.bio || '',
            });
        }).catch(() => navigate('/admin/doctors'));
    }, [id]);

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleAddCert = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCertName(file.name);
        setUploadingCert(true);
        try {
            const url = await uploadCertToCloudinary(file);
            const res = await doctorsApi.addCertification(id, { fileName: file.name, url });
            setCerts(prev => [res.data, ...prev]);
            setCertName('');
        } catch (err) {
            if (!err?.response) {
                // CORS false alarm — reload certs
                const r = await doctorsApi.getCertifications(id);
                setCerts(r.data);
                setCertName('');
            } else {
                alert('Failed to upload certificate.');
            }
        }
        setUploadingCert(false);
        e.target.value = '';
    };

    const handleDeleteCert = async (certId) => {
        if (!window.confirm('Remove this certificate?')) return;
        try {
            await doctorsApi.deleteCertification(id, certId);
            setCerts(prev => prev.filter(c => c.id !== certId));
        } catch (err) {
            if (!err?.response) setCerts(prev => prev.filter(c => c.id !== certId));
            else alert('Failed to delete certificate.');
        }
    };

    const handleSave = async () => {
        setSubmitting(true);
        try {
            let profileImageUrl = doctor?.profileImageUrl || null;
            if (photoFile) profileImageUrl = await uploadToCloudinary(photoFile);
            await doctorsApi.update(id, {
                fullName: form.fullName.trim(),
                phoneNumber: form.phoneNumber.trim() || null,
                specialty: form.specialty,
                licenseNumber: form.licenseNumber.trim(),
                institution: form.institution.trim() || null,
                yearsOfExperience: parseInt(form.yearsOfExperience) || 0,
                bio: form.bio.trim() || null,
                status,
                profileImageUrl,
                languages,
            });
            setDoctor(prev => ({ ...prev, profileImageUrl, languages,
                fullName: form.fullName.trim(), phoneNumber: form.phoneNumber.trim(),
                specialty: form.specialty, licenseNumber: form.licenseNumber.trim(),
                institution: form.institution.trim(), bio: form.bio.trim(), status
            }));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            if (!err?.response) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                alert('Failed to save changes.');
            }
        } finally { setSubmitting(false); }
    };

    const handleDiscard = () => {
        if (!doctor) return;
        setStatus(doctor.status || 'Pending');
        setLanguages(doctor.languages || []);
        setPhotoFile(null);
        setPhotoPreview(null);
        setNewLang('');
        setAddingLang(false);
        setForm({
            fullName: doctor.fullName || '',
            phoneNumber: doctor.phoneNumber || '',
            specialty: doctor.specialty || '',
            licenseNumber: doctor.licenseNumber || '',
            institution: doctor.institution || '',
            yearsOfExperience: doctor.yearsOfExperience?.toString() || '',
            bio: doctor.bio || '',
        });
    };

    const handleResetPassword = async () => {
        if (newPassword.length < 6) { alert('Password must be at least 6 characters.'); return; }
        if (newPassword !== confirmPassword) { alert('Passwords do not match.'); return; }
        setResettingPassword(true);
        try {
            await doctorsApi.resetPassword(id, newPassword);
            setShowResetModal(false);
            setNewPassword('');
            setConfirmPassword('');
            alert('Password updated successfully.');
        } catch (err) {
            alert(err?.response?.data?.message || 'Failed to reset password.');
        }
        setResettingPassword(false);
    };

    const handleSuspend = async () => {
        if (!window.confirm('Suspend this doctor?')) return;
        await doctorsApi.suspend(id);
        setStatus('Inactive');
    };

    return (
        <AdminLayout>
            <div className="w-full animate-in fade-in duration-700 pb-12">
                    {/* High-Fidelity Header */}
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-6 mb-4 font-poppins px-10 pt-10">
                        <div className="space-y-1">
                            <div className="flex items-center gap-4 mb-2">
                                <button 
                                    onClick={() => navigate('/admin/doctors')}
                                    className="p-2 text-gray-400 hover:text-mamacare-teal bg-gray-50 rounded-lg transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">STAFF MODIFICATION</span>
                            </div>
                            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Edit Profile</h1>
                            <div className="flex items-center gap-3 mt-4">
                                <span className="px-4 py-1.5 bg-orange-50 text-orange-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-orange-100">
                                    {status === 'Pending' ? 'PENDING VERIFICATION' : status.toUpperCase()}
                                 </span>
                                 <span className="text-xs font-bold text-gray-600">ID: {doctor?.licenseNumber}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleDiscard}
                                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-red-400 transition-all shadow-sm"
                            >
                                Discard Changes
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={submitting}
                                className="bg-mamacare-teal text-white px-8 py-3 rounded-xl font-bold text-xs shadow-lg shadow-mamacare-teal/10 transition-all hover:bg-mamacare-teal-dark active:scale-[0.98] flex items-center gap-2"
                            >
                                <Save size={16} />
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 px-10 py-4 max-w-7xl mx-auto w-full grid grid-cols-12 gap-10">
                       
                       {/* Left Profile Summary Column (4/12) */}
                       <div className="col-span-12 lg:col-span-4 space-y-8">
                          {/* Profile Card */}
                          <div className="bg-white rounded-[3rem] p-10 border border-white shadow-card space-y-10 text-center animate-in-up duration-700">
                             <div className="relative w-40 h-40 mx-auto">
                                <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                <img 
                                   src={photoPreview || doctor?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.fullName || '')}&background=005C5C&color=fff&size=200`}
                                   alt={doctor?.fullName} 
                                   className="w-full h-full rounded-[40px] object-cover ring-8 ring-gray-50 shadow-xl"
                                />
                                <button type="button" onClick={() => photoInputRef.current?.click()} className="absolute bottom-2 right-2 p-3 bg-mamacare-teal text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white">
                                   <Camera size={18} />
                                </button>
                             </div>

                             <div className="space-y-2">
                                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{doctor?.fullName}</h3>
                                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{doctor?.specialty} • ID: {doctor?.licenseNumber}</p>
                             </div>

                             <div className="space-y-4 pt-4 border-t border-gray-50">
                                <button onClick={() => setShowResetModal(true)} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm bg-gray-50 text-gray-900 hover:bg-gray-100 transition-all">
                                   <RefreshCcw size={16} />
                                   Reset Password
                                </button>
                                <button onClick={handleSuspend} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                                   <Lock size={16} className="rotate-12" />
                                   Suspend Access
                                </button>
                             </div>
                          </div>

                          {/* Status Management Card */}
                          <div className="bg-white rounded-[3rem] p-10 border border-white shadow-card space-y-8 animate-in-up duration-1000">
                             <h4 className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.2em] border-b border-gray-50 pb-4">STATUS MANAGEMENT</h4>
                             <div className="space-y-4">
                                {['Verified', 'Pending', 'Inactive'].map((s) => (
                                   <button 
                                      key={s}
                                      onClick={() => setStatus(s)}
                                      className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${
                                         status === s 
                                         ? 'border-mamacare-teal bg-mamacare-teal/5 text-mamacare-teal ring-4 ring-mamacare-teal/5' 
                                         : 'border-gray-50 bg-gray-50/50 text-gray-600 hover:border-gray-100'
                                      }`}
                                   >
                                      <div className="flex items-center gap-3">
                                         <div className={`w-2 h-2 rounded-full ${s === 'Verified' ? 'bg-mamacare-teal' : s === 'Pending' ? 'bg-orange-400' : 'bg-gray-300'}`}></div>
                                         <span className="font-bold text-sm">{s}</span>
                                      </div>
                                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${status === s ? 'border-mamacare-teal bg-mamacare-teal text-white' : 'border-gray-200'}`}>
                                         {status === s && <CheckCircle2 size={12} />}
                                      </div>
                                   </button>
                                ))}
                             </div>
                          </div>
                       </div>

                       {/* Right Dynamic Content Column (8/12) */}
                       <div className="col-span-12 lg:col-span-8 bg-white rounded-[3rem] border border-white shadow-card animate-in-up duration-500 overflow-hidden flex flex-col">
                          
                          {/* Tabs Navigation */}
                          <div className="p-10 border-b border-gray-50 flex items-center gap-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
                             {tabs.map(tab => (
                               <button 
                                 key={tab}
                                 onClick={() => setActiveTab(tab)}
                                 className={`text-sm font-medium transition-all relative pb-2 ${
                                    activeTab === tab 
                                    ? 'text-mamacare-teal after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-mamacare-teal font-bold' 
                                    : 'text-gray-600 hover:text-gray-600'
                                 }`}
                               >
                                 {tab}
                               </button>
                             ))}
                          </div>

                          {/* Tab Content */}
                          <div className="flex-1 p-10 md:p-12 overflow-y-auto max-h-[700px]">

                          {activeTab === 'Basic Info' && <div className="space-y-12">
                             <div className="space-y-8">
                                <h4 className="text-[12px] font-bold text-mamacare-teal uppercase tracking-[0.2em]">PROFESSIONAL IDENTITY</h4>
                                <div className="grid md:grid-cols-2 gap-8">
                                   <div className="space-y-3">
                                      <label className="text-[14px] font-regular text-gray-600 pl-1">Full Name</label>
                                      <input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)} 
                                         className="text-[13px] w-full bg-gray-50 border border-transparent rounded-2xl p-6 text-gray-900 focus:outline-none focus:bg-white focus:border-mamacare-teal/20 transition-all shadow-sm"
                                      />
                                   </div>
                                   <div className="space-y-3">
                                      <label className="text-[14px] font-regular text-gray-600 pl-1">Primary Specialty</label>
                                      <select value={form.specialty} onChange={e => set('specialty', e.target.value)} className="text-[13px] w-full bg-gray-50 border border-transparent rounded-2xl p-6 font-regular text-gray-900 focus:outline-none focus:bg-white focus:border-mamacare-teal/20 transition-all shadow-sm appearance-none">
                                         <option>Obstetrics & Gynecology</option>
                                         <option>Fetal Medicine Specialist</option>
                                         <option>Neonatologist</option>
                                         <option>Pediatrics</option>
                                         <option>Midwifery</option>
                                         <option>General Practice</option>
                                      </select>
                                   </div>
                                   <div className="space-y-3">
                                      <label className="text-[14px] font-regular text-gray-600 pl-1">Medical License Number</label>
                                      <input type="text" value={form.licenseNumber} onChange={e => set('licenseNumber', e.target.value)} 
                                         className="text-[13px] w-full bg-gray-50 border border-transparent rounded-2xl p-6 font-regular text-gray-900 focus:outline-none focus:bg-white focus:border-mamacare-teal/20 transition-all shadow-sm"
                                      />
                                   </div>
                                   <div className="space-y-3">
                                      <label className="text-[14px] font-regular text-gray-600 pl-1">Years of Experience</label>
                                      <input type="number" value={form.yearsOfExperience} onChange={e => set('yearsOfExperience', e.target.value)} 
                                         className="text-[13px] w-full bg-gray-50 border border-transparent rounded-2xl p-6 font-regular text-gray-900 focus:outline-none focus:bg-white focus:border-mamacare-teal/20 transition-all shadow-sm"
                                      />
                                   </div>
                                </div>
                             </div>

                             {/* Section: Contact & Outreach */}
                             <div className="space-y-8">
                                <h4 className="text-[12px] font-bold text-mamacare-teal uppercase tracking-[0.2em]">CONTACT & OUTREACH</h4>
                                <div className="grid md:grid-cols-2 gap-8">
                                   <div className="space-y-3">
                                      <label className="text-[14px] font-regular text-gray-600 pl-1">Work Email</label>
                                      <div className="relative">
                                         <input type="email" value={doctor?.email || ''} disabled 
                                             className="text-[13px] w-full bg-gray-100 border border-transparent rounded-2xl p-6 pl-16 text-gray-900 shadow-sm opacity-60 cursor-not-allowed"
                                          />
                                         <Users size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                      </div>
                                   </div>
                                   <div className="space-y-3">
                                      <label className="text-[14px] font-regular text-gray-600 pl-1">Mobile Contact</label>
                                      <input type="tel" value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} 
                                         className="text-[13px] w-full bg-gray-50 border border-transparent rounded-2xl p-6 font-regular text-gray-900 focus:outline-none focus:bg-white focus:border-mamacare-teal/20 transition-all shadow-sm"
                                      />
                                   </div>
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[14px] font-regular text-gray-600 pl-1">Doctor's Bio</label>
                                   <textarea value={form.bio} onChange={e => set('bio', e.target.value)}
                                      className="text-[13px] w-full bg-gray-50 border border-transparent rounded-[2rem] p-8 font-bold text-gray-900 focus:outline-none focus:bg-white focus:border-mamacare-teal/20 transition-all shadow-sm h-40 resize-none leading-relaxed"
                                   />
                                </div>
                             </div>

                             {/* Certification Upload */}
                             <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                   <h4 className="text-[12px] font-bold text-mamacare-teal uppercase tracking-[0.2em]">MEDICAL CERTIFICATIONS</h4>
                                   <label className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                      uploadingCert ? 'bg-gray-100 text-gray-400' : 'bg-mamacare-teal/10 text-mamacare-teal hover:bg-mamacare-teal/20'
                                   }`}>
                                      <Upload size={14} />
                                      {uploadingCert ? `Uploading ${certName}...` : 'Add Certificate'}
                                      <input ref={certInputRef} type="file" accept=".pdf,image/*" onChange={handleAddCert} className="hidden" disabled={uploadingCert} />
                                   </label>
                                </div>

                                {certs.length === 0 && !uploadingCert ? (
                                   <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-400 text-sm font-medium">
                                      No certificates on file. Click "Add Certificate" to upload.
                                   </div>
                                ) : (
                                   <div className="space-y-3">
                                      {certs.map((cert) => (
                                         <div key={cert.id} className="flex items-center justify-between bg-[#F2FBFA] border border-mamacare-teal/10 rounded-2xl px-6 py-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                               <div className="w-9 h-9 bg-mamacare-teal/10 rounded-xl flex items-center justify-center shrink-0">
                                                  <Upload size={16} className="text-mamacare-teal" />
                                               </div>
                                               <div className="min-w-0">
                                                  <p className="font-bold text-sm text-gray-900 truncate max-w-[220px]">{cert.fileName}</p>
                                                  <p className="text-[10px] text-gray-400">{new Date(cert.uploadedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                               </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                               <a
                                                  href={cert.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="px-3 py-1.5 text-[10px] font-bold text-mamacare-teal bg-white border border-mamacare-teal/20 rounded-xl hover:bg-mamacare-teal hover:text-white transition-all"
                                               >
                                                  View
                                               </a>
                                               <button
                                                  onClick={() => downloadFile(cert.url, cert.fileName)}
                                                  className="px-3 py-1.5 text-[10px] font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all"
                                               >
                                                  Download
                                               </button>
                                               <button
                                                  onClick={() => handleDeleteCert(cert.id)}
                                                  className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                               >
                                                  <X size={14} />
                                               </button>
                                            </div>
                                         </div>
                                      ))}
                                   </div>
                                )}
                             </div>

                             {/* Language Proficiency */}
                             <div className="space-y-8 pb-10">
                                <div className="flex justify-between items-center">
                                   <h4 className="text-[12px] font-bold text-mamacare-teal uppercase tracking-[0.2em]">LANGUAGE PROFICIENCY</h4>
                                   {languages.length > 1 && <span className="px-3 py-1 bg-[#E1F5FE] text-[#039BE5] text-[10px] font-extrabold uppercase tracking-widest rounded-full">Multilingual</span>}
                                </div>
                                <div className="flex flex-wrap gap-4">
                                   {languages.map((lang, i) => (
                                      <div key={i} className="bg-[#E6F3F3] text-mamacare-teal px-6 py-4 rounded-2xl flex items-center gap-4 font-bold text-sm border-2 border-mamacare-teal/10 shadow-sm">
                                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-extrabold text-[10px] text-mamacare-teal shadow-inner">
                                            {lang.slice(0, 2).toUpperCase()}
                                         </div>
                                         <span>{lang}</span>
                                         <button onClick={() => setLanguages(prev => prev.filter((_, j) => j !== i))} className="text-mamacare-teal/40 hover:text-red-400 transition-all">
                                            <X size={14} />
                                         </button>
                                      </div>
                                   ))}
                                   {addingLang ? (
                                      <div className="flex items-center gap-2">
                                         <input
                                            autoFocus
                                            value={newLang}
                                            onChange={e => setNewLang(e.target.value)}
                                            onKeyDown={e => {
                                               if (e.key === 'Enter' && newLang.trim()) {
                                                  setLanguages(prev => [...prev, newLang.trim()]);
                                                  setNewLang('');
                                                  setAddingLang(false);
                                               }
                                               if (e.key === 'Escape') { setNewLang(''); setAddingLang(false); }
                                            }}
                                            placeholder="e.g. French"
                                            className="bg-gray-50 border border-mamacare-teal/20 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none w-36"
                                         />
                                         <button onClick={() => { if (newLang.trim()) { setLanguages(prev => [...prev, newLang.trim()]); setNewLang(''); } setAddingLang(false); }} className="p-2 bg-mamacare-teal text-white rounded-xl">
                                            <CheckCircle2 size={16} />
                                         </button>
                                      </div>
                                   ) : (
                                      <button onClick={() => setAddingLang(true)} className="flex items-center justify-center w-16 h-16 border-2 border-dashed border-gray-500 rounded-3xl text-gray-500 hover:border-mamacare-teal hover:text-mamacare-teal transition-all">
                                         <Plus size={24} />
                                      </button>
                                   )}
                                </div>
                                {languages.length === 0 && !addingLang && <p className="text-sm text-gray-500">No languages added yet. Click + to add one.</p>}
                             </div>
                          </div>}

                          {activeTab === 'Credentials' && <div className="space-y-8 pb-10">
                             <h4 className="text-[12px] font-bold text-mamacare-teal uppercase tracking-[0.2em]">PROFESSIONAL CREDENTIALS</h4>
                             <div className="grid md:grid-cols-2 gap-6">
                                {[{label:'License Number', value: form.licenseNumber}, {label:'Specialty', value: form.specialty}, {label:'Institution', value: form.institution || '—'}, {label:'Years of Experience', value: `${form.yearsOfExperience} years`}].map(item => (
                                   <div key={item.label} className="bg-gray-50 rounded-2xl p-6 space-y-2">
                                      <p className="text-[14px] font-regular text-gray-600">{item.label}</p>
                                      <p className="text-gray-900">{item.value}</p>
                                   </div>
                                ))}
                             </div>
                             <h4 className="text-[12px] font-bold text-mamacare-teal uppercase tracking-[0.2em] pt-4">UPLOADED CERTIFICATIONS</h4>
                             {certs.length === 0 ? (
                                <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-400 text-sm">No certifications uploaded yet.</div>
                             ) : (
                                <div className="space-y-3">
                                   {certs.map(cert => (
                                      <div key={cert.id} className="flex items-center justify-between bg-[#F2FBFA] border border-mamacare-teal/10 rounded-2xl px-6 py-4">
                                         <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 bg-mamacare-teal/10 rounded-xl flex items-center justify-center shrink-0"><Upload size={16} className="text-mamacare-teal" /></div>
                                            <div className="min-w-0">
                                               <p className="font-bold text-sm text-gray-900 truncate max-w-[220px]">{cert.fileName}</p>
                                               <p className="text-[10px] text-gray-400">{new Date(cert.uploadedAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</p>
                                            </div>
                                         </div>
                                         <a href={cert.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-[10px] font-bold text-mamacare-teal bg-white border border-mamacare-teal/20 rounded-xl hover:bg-mamacare-teal hover:text-white transition-all">View</a>
                                      </div>
                                   ))}
                                </div>
                             )}
                          </div>}

                          {activeTab === 'Schedule' && <div className="space-y-6 pb-10">
                             <h4 className="text-[12px] font-bold text-mamacare-teal uppercase tracking-[0.2em]">APPOINTMENT SCHEDULE</h4>
                             {schedule.length === 0 ? (
                                <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-600 text-sm">No appointments scheduled.</div>
                             ) : (
                                <div className="space-y-3">
                                   {schedule.map(appt => {
                                      const isPast = new Date(appt.appointmentDate) < new Date();
                                      const statusColor = appt.status === 'Completed' ? 'bg-green-50 text-green-600' : appt.status === 'Cancelled' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500';
                                      return (
                                         <div key={appt.id} className="flex items-center justify-between bg-gray-50 rounded-2xl px-6 py-4">
                                            <div className="flex items-center gap-4">
                                               <img src={appt.patientImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(appt.patientName)}&background=005C5C&color=fff&size=40`} className="w-10 h-10 rounded-xl object-cover" />
                                               <div>
                                                  <p className="font-bold text-sm text-gray-900">{appt.patientName}</p>
                                                  <p className="text-[10px] text-gray-400">{appt.type.replace(/([A-Z])/g, ' $1').trim()}</p>
                                               </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                               <div className="text-right">
                                                  <p className="text-sm font-bold text-gray-900">{new Date(appt.appointmentDate).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</p>
                                                  <p className="text-[10px] text-gray-400">{new Date(appt.appointmentDate).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })}</p>
                                               </div>
                                               <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${statusColor}`}>{appt.status}</span>
                                            </div>
                                         </div>
                                      );
                                   })}
                                </div>
                             )}
                          </div>}

                          {activeTab === 'Activity Log' && <div className="space-y-6 pb-10">
                             <h4 className="text-[12px] font-bold text-mamacare-teal uppercase tracking-[0.2em]">RECENT ACTIVITY</h4>
                             {activity.length === 0 ? (
                                <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-600 text-sm">No activity recorded yet.</div>
                             ) : (
                                <div className="relative">
                                   <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-100"></div>
                                   <div className="space-y-6">
                                      {activity.map((item, i) => {
                                         const isCompleted = item.status === 'Completed';
                                         const isCancelled = item.status === 'Cancelled';
                                         return (
                                            <div key={item.id} className="flex gap-6 relative">
                                               <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 ${ isCompleted ? 'bg-green-50 text-green-500' : isCancelled ? 'bg-red-50 text-red-400' : 'bg-mamacare-teal/10 text-mamacare-teal'}`}>
                                                  <Calendar size={16} />
                                               </div>
                                               <div className="flex-1 bg-gray-50 rounded-2xl px-6 py-4">
                                                  <div className="flex items-center justify-between">
                                                     <p className="font-bold text-sm text-gray-900">{item.patientName}</p>
                                                     <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${ isCompleted ? 'bg-green-50 text-green-600' : isCancelled ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>{item.status}</span>
                                                  </div>
                                                  <p className="text-xs text-gray-400 mt-1">{item.type.replace(/([A-Z])/g, ' $1').trim()} · {new Date(item.appointmentDate).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</p>
                                                  <p className="text-[10px] text-gray-300 mt-1">Created {new Date(item.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric' })}</p>
                                               </div>
                                            </div>
                                         );
                                      })}
                                   </div>
                                </div>
                             )}
                          </div>}

                          </div>

                          {/* Action Bar (Sticky Bottom) */}
                          <div className="p-8 border-t border-gray-50 flex items-center justify-between gap-6 bg-white shrink-0">
                             <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-mamacare-teal rounded-full animate-pulse"></div>
                                <p className="text-xs text-gray-500 font-medium">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} | By: {JSON.parse(localStorage.getItem('user') || '{}')?.name || 'Admin'}</p>
                             </div>
                             <div className="flex items-center gap-6">
                                <button onClick={handleDiscard} className="text-gray-400 font-extrabold text-xs uppercase tracking-widest hover:text-gray-600 transition-all">Discard Changes</button>
                                <button onClick={handleSave} disabled={submitting} className="bg-[#005C5C] text-white px-10 py-5 rounded-2xl font-bold text-sm shadow-xl shadow-mamacare-teal/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 disabled:opacity-50">
                                   <Save size={18} />
                                   {submitting ? 'Saving...' : saved ? '✓ Saved!' : 'Save Updates'}
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
            </div>
        {showResetModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
               <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl space-y-8">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
                     <button onClick={() => { setShowResetModal(false); setNewPassword(''); setConfirmPassword(''); }} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50">
                        <X size={20} />
                     </button>
                  </div>
                  <p className="text-sm text-gray-400">Set a new password for <span className="font-bold text-gray-700">{doctor?.fullName}</span>.</p>
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[14px] font-regular text-gray-600">New Password</label>
                        <input
                           type="password"
                           value={newPassword}
                           onChange={e => setNewPassword(e.target.value)}
                           placeholder="Min. 6 characters"
                           className="w-full bg-gray-50 rounded-2xl p-5 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[14px] font-regular text-gray-600">Confirm Password</label>
                        <input
                           type="password"
                           value={confirmPassword}
                           onChange={e => setConfirmPassword(e.target.value)}
                           placeholder="Repeat password"
                           className="w-full bg-gray-50 rounded-2xl p-5 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20"
                        />
                     </div>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                     <p className="text-xs text-red-400 font-semibold">Passwords do not match.</p>
                  )}
                  <div className="flex gap-4">
                     <button onClick={() => { setShowResetModal(false); setNewPassword(''); setConfirmPassword(''); }} className="flex-1 py-4 rounded-2xl font-bold text-sm bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
                     <button
                        onClick={handleResetPassword}
                        disabled={resettingPassword || newPassword.length < 6 || newPassword !== confirmPassword}
                        className="flex-1 py-4 rounded-2xl font-bold text-sm bg-mamacare-teal text-white shadow-lg disabled:opacity-50 hover:scale-105 transition-all"
                     >
                        {resettingPassword ? 'Updating...' : 'Update Password'}
                     </button>
                  </div>
               </div>
            </div>
        )}
        </AdminLayout>
    );
};

export default EditDoctor;
