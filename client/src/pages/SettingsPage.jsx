import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { settingsApi } from '../api/services';
import { uploadToCloudinary } from '../api/cloudinary';
import { Camera, Save, Lock, User, Phone, Mail, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import DoctorLayout from '../components/layout/DoctorLayout';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const SettingsPage = () => {
    const { user, login } = useAuth();
    const role = user?.role;

    const [profile, setProfile] = useState({ fullName: '', email: '', phoneNumber: '', profileImageUrl: '' });
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);
    const [profileError, setProfileError] = useState('');
    const photoInputRef = useRef(null);

    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        settingsApi.getProfile().then(r => {
            setProfile({
                fullName: r.data.fullName || '',
                email: r.data.email || '',
                phoneNumber: r.data.phoneNumber || '',
                profileImageUrl: r.data.profileImageUrl || '',
            });
        }).catch(() => {});
    }, []);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        setProfileError('');
        try {
            let profileImageUrl = profile.profileImageUrl;
            if (photoFile) {
                setUploadingPhoto(true);
                profileImageUrl = await uploadToCloudinary(photoFile);
                setUploadingPhoto(false);
            }
            await settingsApi.updateProfile({
                fullName: profile.fullName.trim(),
                email: profile.email.trim(),
                phoneNumber: profile.phoneNumber.trim() || null,
                profileImageUrl,
            });
            setProfile(prev => ({ ...prev, profileImageUrl }));
            setPhotoFile(null);
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 3000);
        } catch (err) {
            setProfileError(err?.response?.data?.message || 'Failed to save profile.');
        }
        setSavingProfile(false);
    };

    const handleChangePassword = async () => {
        setPasswordError('');
        if (!passwords.current) { setPasswordError('Enter your current password.'); return; }
        if (passwords.newPass.length < 6) { setPasswordError('New password must be at least 6 characters.'); return; }
        if (passwords.newPass !== passwords.confirm) { setPasswordError('Passwords do not match.'); return; }
        setSavingPassword(true);
        try {
            await settingsApi.changePassword({ currentPassword: passwords.current, newPassword: passwords.newPass });
            setPasswords({ current: '', newPass: '', confirm: '' });
            setPasswordSaved(true);
            setTimeout(() => setPasswordSaved(false), 3000);
        } catch (err) {
            setPasswordError(err?.response?.data?.message || 'Failed to change password.');
        }
        setSavingPassword(false);
    };

    const content = (
        <div className="max-w-2xl mx-auto space-y-8 py-8">
            <div className="space-y-1">
                <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">Account</span>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Settings</h1>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-white shadow-card space-y-8">
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Profile Information</h2>

                {/* Photo */}
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-gray-50">
                            {photoPreview || profile.profileImageUrl ? (
                                <img src={photoPreview || profile.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-mamacare-teal flex items-center justify-center text-white font-bold text-xl">
                                    {profile.fullName?.charAt(0) || <User size={28} />}
                                </div>
                            )}
                        </div>
                        <button onClick={() => photoInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 bg-mamacare-teal text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                            <Camera size={14} />
                        </button>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{profile.fullName}</p>
                        <p className="text-sm text-gray-400">{role}</p>
                        <button onClick={() => photoInputRef.current?.click()} className="text-xs text-mamacare-teal font-bold mt-1 hover:underline">
                            {uploadingPhoto ? 'Uploading...' : 'Change photo'}
                        </button>
                    </div>
                </div>

                {/* Fields */}
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                        <div className="relative">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input type="text" value={profile.fullName} onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
                                className="w-full bg-gray-50 rounded-2xl p-4 pl-10 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                                className="w-full bg-gray-50 rounded-2xl p-4 pl-10 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input type="tel" value={profile.phoneNumber} onChange={e => setProfile(p => ({ ...p, phoneNumber: e.target.value }))}
                                placeholder="+250 788 000 000"
                                className="w-full bg-gray-50 rounded-2xl p-4 pl-10 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20" />
                        </div>
                    </div>
                </div>

                {profileError && <p className="text-sm text-red-400 font-semibold">{profileError}</p>}

                <button onClick={handleSaveProfile} disabled={savingProfile}
                    className="w-full bg-mamacare-teal text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 hover:scale-[1.01] transition-all">
                    <Save size={16} />
                    {savingProfile ? 'Saving...' : profileSaved ? '✓ Saved!' : 'Save Profile'}
                </button>
            </div>

            {/* Password Card */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-white shadow-card space-y-8">
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Change Password</h2>

                <div className="space-y-5">
                    {[
                        { label: 'Current Password', key: 'current', show: showCurrent, toggle: () => setShowCurrent(s => !s) },
                        { label: 'New Password', key: 'newPass', show: showNew, toggle: () => setShowNew(s => !s) },
                        { label: 'Confirm New Password', key: 'confirm', show: showNew, toggle: () => setShowNew(s => !s) },
                    ].map(({ label, key, show, toggle }) => (
                        <div key={key} className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input
                                    type={show ? 'text' : 'password'}
                                    value={passwords[key]}
                                    onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 rounded-2xl p-4 pl-10 pr-12 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-mamacare-teal/20"
                                />
                                <button type="button" onClick={toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {passwords.newPass && passwords.confirm && passwords.newPass !== passwords.confirm && (
                    <p className="text-xs text-red-400 font-semibold">Passwords do not match.</p>
                )}
                {passwordError && <p className="text-sm text-red-400 font-semibold">{passwordError}</p>}

                <button onClick={handleChangePassword} disabled={savingPassword}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 hover:scale-[1.01] transition-all">
                    <Lock size={16} />
                    {savingPassword ? 'Updating...' : passwordSaved ? '✓ Password Updated!' : 'Update Password'}
                </button>
            </div>
        </div>
    );

    if (role === 'Admin') return <AdminLayout>{content}</AdminLayout>;
    if (role === 'Doctor') return <DoctorLayout>{content}</DoctorLayout>;
    return (
        <div className="min-h-screen bg-[#FAFAFA] font-poppins">
            <Navbar />
            <main className="pt-28 px-6 max-w-2xl mx-auto">{content}</main>
            <Footer />
        </div>
    );
};

export default SettingsPage;
