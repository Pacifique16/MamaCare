import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { settingsApi, mothersApi, doctorsApi } from '../api/services';
import { uploadToCloudinary, uploadCertToCloudinary } from '../api/cloudinary';
import { Camera, Save, Lock, User, Phone, Mail, Eye, EyeOff, MapPin, Heart, Droplets, X, Upload } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import DoctorLayout from '../components/layout/DoctorLayout';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BLOOD_TYPES = ['Unknown','APositive','ANegative','BPositive','BNegative','OPositive','ONegative','ABPositive','ABNegative'];

const SettingsPage = () => {
    const { user } = useAuth();
    const role = user?.role;
    const isMother = role === 'Mother';

    const isDoctor = role === 'Doctor';

    const tabs = isMother
        ? ['Profile', 'Personal Details', 'Security']
        : isDoctor
        ? ['Profile', 'Professional Profile', 'Security']
        : ['Profile', 'Security'];
    const [activeTab, setActiveTab] = useState('Profile');

    // --- Profile ---
    const [profile, setProfile] = useState({ fullName: '', email: '', phoneNumber: '', profileImageUrl: '' });
    const [originalProfile, setOriginalProfile] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const photoInputRef = useRef(null);

    // --- Mother Profile ---
    const [motherProfile, setMotherProfile] = useState({ address: '', dateOfBirth: '', emergencyContactName: '', emergencyContactPhone: '', bloodType: 'Unknown', medicalNotes: '' });
    const [originalMotherProfile, setOriginalMotherProfile] = useState(null);
    const [savingMother, setSavingMother] = useState(false);
    const [motherSaved, setMotherSaved] = useState(false);
    const [motherError, setMotherError] = useState('');

    // --- Doctor Profile ---
    const [doctorProfile, setDoctorProfile] = useState({ specialty: '', licenseNumber: '', institution: '', yearsOfExperience: '', bio: '', languages: [] });
    const [originalDoctorProfile, setOriginalDoctorProfile] = useState(null);
    const [savingDoctor, setSavingDoctor] = useState(false);
    const [doctorSaved, setDoctorSaved] = useState(false);
    const [doctorError, setDoctorError] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [certs, setCerts] = useState([]);
    const [uploadingCert, setUploadingCert] = useState(false);
    const [certName, setCertName] = useState('');
    const certInputRef = useRef(null);

    // --- Password ---
    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        settingsApi.getProfile().then(r => {
            const p = { fullName: r.data.fullName || '', email: r.data.email || '', phoneNumber: r.data.phoneNumber || '', profileImageUrl: r.data.profileImageUrl || '' };
            setProfile(p);
            setOriginalProfile(p);
        }).catch(() => {});

        if (isMother && user?.motherId) {
            mothersApi.getById(user.motherId).then(r => {
                const m = {
                    address: r.data.address || '',
                    dateOfBirth: r.data.dateOfBirth ? r.data.dateOfBirth.split('T')[0] : '',
                    emergencyContactName: r.data.emergencyContactName || '',
                    emergencyContactPhone: r.data.emergencyContactPhone || '',
                    bloodType: r.data.bloodType || 'Unknown',
                    medicalNotes: r.data.medicalNotes || '',
                };
                setMotherProfile(m);
                setOriginalMotherProfile(m);
            }).catch(() => {});
        }

        if (isDoctor && user?.doctorId) {
            doctorsApi.getById(user.doctorId).then(r => {
                const d = {
                    specialty: r.data.specialty || '',
                    licenseNumber: r.data.licenseNumber || '',
                    institution: r.data.institution || '',
                    yearsOfExperience: r.data.yearsOfExperience ?? '',
                    bio: r.data.bio || '',
                    languages: r.data.languages || [],
                };
                setDoctorProfile(d);
                setOriginalDoctorProfile(d);
                setCerts(r.data.certifications || []);
            }).catch(() => {});
        }
    }, []);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const handleSaveProfile = async () => {
        setSavingProfile(true); setProfileError('');
        try {
            let profileImageUrl = profile.profileImageUrl;
            if (photoFile) { setUploadingPhoto(true); profileImageUrl = await uploadToCloudinary(photoFile); setUploadingPhoto(false); }
            await settingsApi.updateProfile({ fullName: profile.fullName.trim(), email: profile.email.trim(), phoneNumber: profile.phoneNumber.trim() || null, profileImageUrl });
            const updated = { ...profile, profileImageUrl };
            setProfile(updated); setOriginalProfile(updated);
            setPhotoFile(null); setProfileSaved(true);
            // Clear mother cache so dashboard reflects updated info
            if (isMother && user?.motherId) sessionStorage.removeItem(`mother_${user.motherId}`);
            setTimeout(() => setProfileSaved(false), 3000);
        } catch (err) { setProfileError(err?.response?.data?.message || 'Failed to save profile.'); }
        setSavingProfile(false);
    };

    const handleAddCert = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCertName(file.name);
        setUploadingCert(true);
        try {
            const url = await uploadCertToCloudinary(file);
            const res = await doctorsApi.addMyCertification({ fileName: file.name, url });
            setCerts(prev => [res.data, ...prev]);
        } catch (err) {
            if (!err?.response) {
                const r = await doctorsApi.getCertifications(user.doctorId);
                setCerts(r.data);
            } else {
                alert('Failed to upload certificate.');
            }
        }
        setCertName('');
        setUploadingCert(false);
        e.target.value = '';
    };

    const handleDeleteCert = async (certId) => {
        if (!window.confirm('Remove this certificate?')) return;
        try {
            await doctorsApi.deleteMyCertification(certId);
            setCerts(prev => prev.filter(c => c.id !== certId));
        } catch (err) {
            if (!err?.response) setCerts(prev => prev.filter(c => c.id !== certId));
            else alert('Failed to delete certificate.');
        }
    };

    const handleSaveDoctorProfile = async () => {
        setSavingDoctor(true); setDoctorError('');
        try {
            await doctorsApi.updateMe({
                specialty: doctorProfile.specialty || null,
                licenseNumber: doctorProfile.licenseNumber || null,
                institution: doctorProfile.institution || null,
                yearsOfExperience: doctorProfile.yearsOfExperience ? parseInt(doctorProfile.yearsOfExperience) : null,
                bio: doctorProfile.bio || null,
                languages: doctorProfile.languages,
            });
            setOriginalDoctorProfile({ ...doctorProfile });
            setDoctorSaved(true);
            setTimeout(() => setDoctorSaved(false), 3000);
        } catch { setDoctorError('Failed to save. Please try again.'); }
        setSavingDoctor(false);
    };

    const handleSaveMotherProfile = async () => {
        setSavingMother(true); setMotherError('');
        try {
            await mothersApi.update(user.motherId, {
                address: motherProfile.address || null,
                emergencyContactName: motherProfile.emergencyContactName || null,
                emergencyContactPhone: motherProfile.emergencyContactPhone || null,
                dateOfBirth: motherProfile.dateOfBirth ? new Date(motherProfile.dateOfBirth).toISOString() : null,
                bloodType: motherProfile.bloodType || null,
                medicalNotes: motherProfile.medicalNotes || null,
            });
            setOriginalMotherProfile({ ...motherProfile });
            if (user?.motherId) sessionStorage.removeItem(`mother_${user.motherId}`);
            setMotherSaved(true);
            setTimeout(() => setMotherSaved(false), 3000);
        } catch { setMotherError('Failed to save. Please try again.'); }
        setSavingMother(false);
    };

    const handleChangePassword = async () => {
        if (!passwords.current) { toast.error('Enter your current password.'); return; }
        if (passwords.newPass.length < 6) { toast.error('New password must be at least 6 characters.'); return; }
        if (passwords.newPass !== passwords.confirm) { toast.error('Passwords do not match.'); return; }
        setSavingPassword(true);
        try {
            await settingsApi.changePassword({ currentPassword: passwords.current, newPassword: passwords.newPass });
            setPasswords({ current: '', newPass: '', confirm: '' });
            setPasswordSaved(true);
            setTimeout(() => setPasswordSaved(false), 3000);
        } catch (err) { setPasswordError(err?.response?.data?.message || 'Failed to change password.'); }
        setSavingPassword(false);
    };

    const inputClass = "w-full bg-gray-50 rounded-2xl p-4 pl-11 font-bold text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20";

    const content = (
        <div className="max-w-4xl mx-auto py-8 space-y-6">
            <div className="space-y-1">
                <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">Account</span>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Settings</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'Profile' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
                    {/* Photo */}
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                            <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl overflow-hidden ring-4 ring-gray-50">
                                {photoPreview || profile.profileImageUrl ? (
                                    <img src={photoPreview || profile.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-mamacare-teal flex items-center justify-center text-white font-bold text-xl">
                                        {profile.fullName?.charAt(0) || <User size={24} />}
                                    </div>
                                )}
                            </div>
                            <button onClick={() => photoInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-6 h-6 bg-mamacare-teal text-white rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                                <Camera size={12} />
                            </button>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{profile.fullName}</p>
                            <p className="text-xs text-gray-400">{role}</p>
                            <button onClick={() => photoInputRef.current?.click()} className="text-xs text-mamacare-teal font-bold mt-0.5 hover:underline">
                                {uploadingPhoto ? 'Uploading...' : 'Change photo'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Full Name', key: 'fullName', type: 'text', icon: User, placeholder: 'Your full name' },
                            { label: 'Phone Number', key: 'phoneNumber', type: 'tel', icon: Phone, placeholder: '+250 788 000 000' },
                            { label: 'Email Address', key: 'email', type: 'email', icon: Mail, placeholder: 'your@email.com' },
                        ].map(({ label, key, type, icon: Icon, placeholder }) => (
                            <div key={key} className={`space-y-1.5 ${key === 'email' ? 'col-span-2' : ''}`}>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
                                <div className="relative">
                                    <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                    <input type={type} value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                                        placeholder={placeholder} className={inputClass} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {profileError && <p className="text-sm text-red-400 font-semibold">{profileError}</p>}

                    <div className="flex gap-3 pt-2">
                        <button onClick={() => { setProfile(originalProfile); setPhotoFile(null); setPhotoPreview(null); }}
                            className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                            <X size={15} /> Discard
                        </button>
                        <button onClick={handleSaveProfile} disabled={savingProfile}
                            className="flex-1 py-3 bg-mamacare-teal text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 hover:scale-[1.01] transition-all">
                            <Save size={15} />
                            {savingProfile ? 'Saving...' : profileSaved ? '✓ Saved!' : 'Save Profile'}
                        </button>
                    </div>
                </div>
            )}

            {/* Personal Details Tab (Mother only) */}
            {activeTab === 'Personal Details' && isMother && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth</label>
                            <DatePicker
                                selected={motherProfile.dateOfBirth ? new Date(motherProfile.dateOfBirth) : null}
                                onChange={(date) => {
                                    const val = date ? `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}` : '';
                                    setMotherProfile(p => ({ ...p, dateOfBirth: val }));
                                }}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select your date of birth"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                maxDate={new Date()}
                                className="w-full bg-gray-50 rounded-2xl p-3.5 font-bold text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20"
                                wrapperClassName="w-full"
                                popperPlacement="bottom-start"
                            />
                            <p className="text-[10px] text-orange-400 font-semibold">⚠ Affects gestational age calculations.</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blood Type</label>
                            <div className="relative">
                                <Droplets size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                <select value={motherProfile.bloodType} onChange={e => setMotherProfile(p => ({ ...p, bloodType: e.target.value }))}
                                    className="w-full bg-gray-50 rounded-2xl p-3.5 pl-10 font-bold text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20 appearance-none">
                                    {BLOOD_TYPES.map(bt => (
                                        <option key={bt} value={bt}>{bt.replace('Positive', '+').replace('Negative', '-')}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address</label>
                            <div className="relative">
                                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input type="text" value={motherProfile.address} onChange={e => setMotherProfile(p => ({ ...p, address: e.target.value }))}
                                    placeholder="e.g. Kigali, Rwanda" className={inputClass} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Emergency Contact Name</label>
                            <div className="relative">
                                <Heart size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input type="text" value={motherProfile.emergencyContactName} onChange={e => setMotherProfile(p => ({ ...p, emergencyContactName: e.target.value }))}
                                    placeholder="e.g. Jean Pierre" className={inputClass} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Emergency Contact Phone</label>
                            <div className="relative">
                                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input type="tel" value={motherProfile.emergencyContactPhone} onChange={e => setMotherProfile(p => ({ ...p, emergencyContactPhone: e.target.value }))}
                                    placeholder="+250 788 000 000" className={inputClass} />
                            </div>
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medical Notes</label>
                            <textarea value={motherProfile.medicalNotes} onChange={e => setMotherProfile(p => ({ ...p, medicalNotes: e.target.value }))}
                                placeholder="Any allergies, conditions, or notes relevant to your care..."
                                rows={3}
                                className="w-full bg-gray-50 rounded-2xl p-4 font-bold text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20 resize-none" />
                        </div>
                    </div>

                    {motherError && <p className="text-sm text-red-400 font-semibold">{motherError}</p>}

                    <div className="flex gap-3 pt-2">
                        <button onClick={() => setMotherProfile(originalMotherProfile)}
                            className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                            <X size={15} /> Discard
                        </button>
                        <button onClick={handleSaveMotherProfile} disabled={savingMother}
                            className="flex-1 py-3 bg-mamacare-teal text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 hover:scale-[1.01] transition-all">
                            <Save size={15} />
                            {savingMother ? 'Saving...' : motherSaved ? '✓ Saved!' : 'Save Details'}
                        </button>
                    </div>
                </div>
            )}

            {/* Professional Profile Tab (Doctor only) */}
            {activeTab === 'Professional Profile' && isDoctor && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Specialty</label>
                            <input type="text" value={doctorProfile.specialty} onChange={e => setDoctorProfile(p => ({ ...p, specialty: e.target.value }))}
                                placeholder="e.g. Obstetrics & Gynecology" className={inputClass} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medical License Number</label>
                            <input type="text" value={doctorProfile.licenseNumber} onChange={e => setDoctorProfile(p => ({ ...p, licenseNumber: e.target.value }))}
                                placeholder="e.g. MD-49022-OB" className={inputClass} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Institution</label>
                            <input type="text" value={doctorProfile.institution} onChange={e => setDoctorProfile(p => ({ ...p, institution: e.target.value }))}
                                placeholder="e.g. Johns Hopkins" className={inputClass} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Years of Experience</label>
                            <input type="number" min={0} value={doctorProfile.yearsOfExperience} onChange={e => setDoctorProfile(p => ({ ...p, yearsOfExperience: e.target.value }))}
                                placeholder="e.g. 10" className={inputClass} />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Doctor's Bio</label>
                            <textarea value={doctorProfile.bio} onChange={e => setDoctorProfile(p => ({ ...p, bio: e.target.value }))}
                                placeholder="Brief professional bio..."
                                rows={3} className="w-full bg-gray-50 rounded-2xl p-4 font-bold text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20 resize-none" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Language Proficiency</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {doctorProfile.languages.map((lang, i) => (
                                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-bold rounded-full">
                                        {lang}
                                        <button onClick={() => setDoctorProfile(p => ({ ...p, languages: p.languages.filter((_, j) => j !== i) }))} className="hover:text-red-500 transition-colors">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input type="text" value={newLanguage} onChange={e => setNewLanguage(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && newLanguage.trim()) { setDoctorProfile(p => ({ ...p, languages: [...p.languages, newLanguage.trim()] })); setNewLanguage(''); e.preventDefault(); }}}
                                    placeholder="Type a language and press Enter"
                                    className="flex-1 bg-gray-50 rounded-2xl p-3.5 font-bold text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20" />
                                <button onClick={() => { if (newLanguage.trim()) { setDoctorProfile(p => ({ ...p, languages: [...p.languages, newLanguage.trim()] })); setNewLanguage(''); }}}
                                    className="px-4 py-2 bg-mamacare-teal text-white text-xs font-bold rounded-2xl hover:bg-[#004848] transition-all">Add</button>
                            </div>
                        </div>
                    </div>
                    {doctorError && <p className="text-sm text-red-400 font-semibold">{doctorError}</p>}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medical Certifications</label>
                            <label className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                uploadingCert ? 'bg-gray-100 text-gray-400' : 'bg-teal-50 text-mamacare-teal hover:bg-teal-100'
                            }`}>
                                <Upload size={13} />
                                {uploadingCert ? `Uploading ${certName}...` : 'Upload Certificate'}
                                <input ref={certInputRef} type="file" accept=".pdf,image/*" onChange={handleAddCert} className="hidden" disabled={uploadingCert} />
                            </label>
                        </div>
                        {certs.length === 0 && !uploadingCert ? (
                            <div className="bg-gray-50 rounded-2xl p-6 text-center text-gray-400 text-sm font-medium">
                                No certificates uploaded yet.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {certs.map(cert => (
                                    <div key={cert.id} className="flex items-center justify-between bg-teal-50/50 border border-mamacare-teal/10 rounded-2xl px-5 py-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 bg-mamacare-teal/10 rounded-xl flex items-center justify-center shrink-0">
                                                <Upload size={14} className="text-mamacare-teal" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm text-gray-900 truncate max-w-[200px]">{cert.fileName}</p>
                                                <p className="text-[10px] text-gray-400">{new Date(cert.uploadedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <a href={cert.url} target="_blank" rel="noopener noreferrer"
                                                className="px-3 py-1.5 text-[10px] font-bold text-mamacare-teal bg-white border border-mamacare-teal/20 rounded-xl hover:bg-mamacare-teal hover:text-white transition-all">
                                                View
                                            </a>
                                            <button onClick={() => handleDeleteCert(cert.id)}
                                                className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                <X size={13} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={() => setDoctorProfile(originalDoctorProfile)}
                            className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                            <X size={15} /> Discard
                        </button>
                        <button onClick={handleSaveDoctorProfile} disabled={savingDoctor}
                            className="flex-1 py-3 bg-mamacare-teal text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 hover:scale-[1.01] transition-all">
                            <Save size={15} />
                            {savingDoctor ? 'Saving...' : doctorSaved ? '✓ Saved!' : 'Save Profile'}
                        </button>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'Security' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
                    <div className="space-y-4">
                        {[
                            { label: 'Current Password', key: 'current', show: showCurrent, toggle: () => setShowCurrent(s => !s) },
                            { label: 'New Password', key: 'newPass', show: showNew, toggle: () => setShowNew(s => !s) },
                            { label: 'Confirm New Password', key: 'confirm', show: showNew, toggle: () => setShowNew(s => !s) },
                        ].map(({ label, key, show, toggle }) => (
                            <div key={key} className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                    <input type={show ? 'text' : 'password'} value={passwords[key]}
                                        onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 rounded-2xl p-3.5 pl-10 pr-12 font-bold text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20" />
                                    <button type="button" onClick={toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                                        {show ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {passwords.newPass && passwords.confirm && passwords.newPass !== passwords.confirm && (
                        <p className="text-xs text-red-400 font-semibold">Passwords do not match.</p>
                    )}
                    {passwordError && <p className="text-sm text-red-400 font-semibold">{passwordError}</p>}

                    <div className="flex gap-3 pt-2">
                        <button onClick={() => setPasswords({ current: '', newPass: '', confirm: '' })}
                            className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                            <X size={15} /> Discard
                        </button>
                        <button onClick={handleChangePassword} disabled={savingPassword}
                            className="flex-1 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 hover:scale-[1.01] transition-all">
                            <Lock size={15} />
                            {savingPassword ? 'Updating...' : passwordSaved ? '✓ Updated!' : 'Update Password'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    if (role === 'Admin') return <AdminLayout>{content}</AdminLayout>;
    if (role === 'Doctor') return <DoctorLayout>{content}</DoctorLayout>;
    return (
        <div className="min-h-screen bg-[#FAFAFA] font-poppins flex flex-col">
            <Navbar />
            <main className="flex-1 pt-28 px-6 max-w-4xl mx-auto w-full">{content}</main>
            <Footer />
        </div>
    );
};

export default SettingsPage;
