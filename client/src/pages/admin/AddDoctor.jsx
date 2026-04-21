import React, { useState, useRef } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import {
   ChevronRight,
   Upload,
   Camera,
   ShieldCheck,
   Info,
   CheckCircle2,
   HelpCircle,
   ArrowRight,
   ArrowLeft,
   Trash2,
   FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doctorsApi } from '../../api/services';
import { uploadToCloudinary, uploadCertToCloudinary } from '../../api/cloudinary';

const AddDoctor = () => {
   const navigate = useNavigate();
   const [form, setForm] = useState({
      fullName: '', specialty: 'Obstetrics & Gynecology',
      email: '', phoneNumber: '', password: '',
      licenseNumber: '', institution: '', yearsOfExperience: '', bio: '',
   });
   const [submitting, setSubmitting] = useState(false);
   const [error, setError] = useState('');
   const [photoFile, setPhotoFile] = useState(null);
   const [photoPreview, setPhotoPreview] = useState(null);
   const [uploadingPhoto, setUploadingPhoto] = useState(false);
   const photoInputRef = useRef(null);
   const [certFile, setCertFile] = useState(null);
   const [certName, setCertName] = useState('');
   const [uploadingCert, setUploadingCert] = useState(false);
   const certInputRef = useRef(null);

   const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

   const handlePhotoChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
   };

   const handleCertChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setCertFile(file);
      setCertName(file.name);
   };

   const handleSubmit = async () => {
      if (!form.fullName || !form.email || !form.licenseNumber || !form.password) {
         setError('Full name, email, license number and password are required.');
         return;
      }
      if (form.password.length < 6) {
         setError('Password must be at least 6 characters.');
         return;
      }
      setSubmitting(true);
      setError('');
      try {
         let profileImageUrl = null;
         if (photoFile) {
            setUploadingPhoto(true);
            profileImageUrl = await uploadToCloudinary(photoFile);
            setUploadingPhoto(false);
         }
         let certificationUrl = null;
         if (certFile) {
            setUploadingCert(true);
            certificationUrl = await uploadCertToCloudinary(certFile);
            setUploadingCert(false);
         }
         const res = await doctorsApi.create({
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            password: form.password,
            phoneNumber: form.phoneNumber.trim() || null,
            specialty: form.specialty,
            licenseNumber: form.licenseNumber.trim(),
            institution: form.institution.trim() || null,
            yearsOfExperience: parseInt(form.yearsOfExperience) || 0,
            bio: form.bio.trim() || null,
            profileImageUrl,
            certificationUrl: null,
         });
         // Save cert as a DoctorCertification record if uploaded
         if (certFile && certificationUrl && res?.data?.id) {
            await doctorsApi.addCertification(res.data.id, { fileName: certFile.name, url: certificationUrl });
         }
         navigate('/admin/doctors');
      } catch (err) {
         if (!err?.response) {
            navigate('/admin/doctors');
            return;
         }
         setError(err?.response?.data?.title || 'Failed to add doctor. Please try again.');
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <AdminLayout>
         <div className="max-w-7xl mx-auto p-10 space-y-12 animate-in fade-in duration-700">

            <div className="max-w-4xl mx-auto space-y-8 py-10 font-poppins">

               {/* High-Fidelity Form Header */}
               <div className="space-y-1 border-b border-gray-100 pb-6">
                  <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">STAFF ONBOARDING</span>
                  <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Add Practitioner</h1>
               </div>

               {/* Section 1: Personal Information */}
               <div className="space-y-10 animate-in-up duration-500">
                  <div className="space-y-1">
                     <span className="text-[9px] font-black text-mamacare-teal uppercase tracking-[0.2em]">CORE IDENTITY</span>
                     <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Personal Information</h2>
                     <p className="text-gray-600 font-light">Essential identification details for the new medical professional.</p>
                  </div>

                  <div className="bg-white rounded-[3.5rem] p-12 md:p-16 border border-white shadow-card space-y-12">
                     <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="relative group" onClick={() => photoInputRef.current?.click()} style={{ cursor: 'pointer' }}>
                           <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                           {photoPreview ? (
                              <img src={photoPreview} alt="Preview" className="w-44 h-44 rounded-full object-cover border-4 border-mamacare-teal/30" />
                           ) : (
                              <div className="w-44 h-44 rounded-full border-3 border-dashed border-mamacare-teal/30 flex items-center justify-center flex-col gap-2 group-hover:border-mamacare-teal transition-all bg-mamacare-teal/10">
                                 <Camera size={32} className="text-mamacare-teal group-hover:text-mamacare-teal" />
                                 <p className="text-[10px] font-bold text-mamacare-teal uppercase tracking-widest">Upload Photo</p>
                              </div>
                           )}
                           <p className="text-[9px] font-bold text-gray-700  tracking-widest text-center mt-6">
                              {uploadingPhoto ? 'Uploading...' : 'JPG, PNG or GIF. Max size 2MB'}
                           </p>
                        </div>

                        <div className="flex-1 grid md:grid-cols-1 gap-8 w-full">
                           <div className="grid md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                 <label className="text-[14px] font-medium text-gray-700 pl-1 font-poppins">Full Name</label>
                                 <input
                                    type="text"
                                    value={form.fullName}
                                    onChange={e => set('fullName', e.target.value)}
                                    placeholder="Dr. Sarah Johnson"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-mamacare-teal focus:ring-1 focus:ring-mamacare-teal/20 transition-all shadow-sm"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[14px] font-medium text-gray-700 pl-1">Specialization</label>
                                 <select value={form.specialty} onChange={e => set('specialty', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-mamacare-teal focus:ring-1 focus:ring-mamacare-teal/20 transition-all shadow-sm appearance-none">
                                    <option>Obstetrics & Gynecology</option>
                                    <option>Fetal Medicine Specialist</option>
                                    <option>Neonatologist</option>
                                    <option>Pediatrics</option>
                                    <option>Midwifery</option>
                                    <option>General Practice</option>
                                 </select>
                              </div>
                           </div>
                           <div className="grid md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                 <label className="text-[14px] font-medium text-gray-700 pl-1">Email Address</label>
                                 <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => set('email', e.target.value)}
                                    placeholder="sarah.j@mamacare.app"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-mamacare-teal focus:ring-1 focus:ring-mamacare-teal/20 transition-all shadow-sm"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[14px] font-medium text-gray-700 pl-1">Phone Number</label>
                                 <input
                                    type="tel"
                                    value={form.phoneNumber}
                                    onChange={e => set('phoneNumber', e.target.value)}
                                    placeholder="+250 *** *** ***"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-mamacare-teal focus:ring-1 focus:ring-mamacare-teal/20 transition-all shadow-sm"
                                 />
                              </div>
                           </div>
                           <div className="grid md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                 <label className="text-[14px] font-medium text-gray-700 pl-1">Password</label>
                                 <input
                                    type="password"
                                    value={form.password}
                                    onChange={e => set('password', e.target.value)}
                                    placeholder="Min. 6 characters"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-mamacare-teal focus:ring-1 focus:ring-mamacare-teal/20 transition-all shadow-sm"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[14px] font-medium text-gray-700 pl-1">Years of Experience</label>
                                 <input
                                    type="number"
                                    value={form.yearsOfExperience}
                                    onChange={e => set('yearsOfExperience', e.target.value)}
                                    placeholder="e.g. 5"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-mamacare-teal focus:ring-1 focus:ring-mamacare-teal/20 transition-all shadow-sm"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Section 2: Credentials & Verification */}
               <div className="space-y-10 animate-in-up duration-700">
                  <div className="space-y-1">
                     <span className="text-[9px] font-black text-mamacare-teal uppercase tracking-[0.2em]">PROFESSIONAL RECORD</span>
                     <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Credentials & Verification</h2>
                     <p className="text-gray-700 font-light">Medical credentials required for system-wide prescription and surgery access.</p>
                  </div>

                  <div className="bg-white rounded-[3.5rem] p-12 md:p-16 border border-white shadow-card space-y-12">
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[14px] font-medium text-gray-700 pl-1">Medical License ID</label>
                           <input
                              type="text"
                              value={form.licenseNumber}
                              onChange={e => set('licenseNumber', e.target.value)}
                              placeholder="MD-8829-XJ"
                              className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-mamacare-teal focus:ring-1 focus:ring-mamacare-teal/20 transition-all shadow-sm"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[14px] font-medium text-gray-700 pl-1">University / Training Institution</label>
                           <input
                              type="text"
                              value={form.institution}
                              onChange={e => set('institution', e.target.value)}
                              placeholder="Johns Hopkins School of Medicine"
                              className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-mamacare-teal focus:ring-1 focus:ring-mamacare-teal/20 transition-all shadow-sm"
                           />
                        </div>
                     </div>

                     {/* Upload Zone */}
                     <div className="space-y-4">
                        <label className="text-[14px] font-medium text-gray-700 pl-1">Medical Certifications (PDF/Image)</label>
                        <input ref={certInputRef} type="file" accept=".pdf,image/*" onChange={handleCertChange} className="hidden" />
                        <div onClick={() => certInputRef.current?.click()} className="bg-[#F2FBFA] border-2 border-dashed border-mamacare-teal/30 rounded-[2.5rem] p-16 text-center group hover:bg-mamacare-teal/5 hover:border-mamacare-teal transition-all cursor-pointer">
                           <div className="w-16 h-16 bg-mamacare-teal text-white rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-mamacare-teal/20 group-hover:scale-110 transition-transform">
                              <Upload size={28} />
                           </div>
                           {certName ? (
                              <>
                                 <h4 className="text-xl font-bold text-mamacare-teal mb-2">✓ {certName}</h4>
                                 <p className="text-sm font-medium text-gray-400">Click to change file</p>
                              </>
                           ) : (
                              <>
                                 <h4 className="text-xl font-bold text-gray-900 mb-2">Click to upload or drag and drop</h4>
                                 <p className="text-sm font-medium text-gray-500">Medical Board Certification, Residency Diploma, and DEA Registration</p>
                              </>
                           )}
                        </div>
                     </div>

                     {/* Manual Review Alert */}
                     <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex items-start gap-4">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-orange-400 mt-1 shadow-sm">
                           <Info size={18} />
                        </div>
                        <div className="space-y-1">
                           <p className="text-sm font-bold text-orange-800">
                              Manual Review: <span className="font-medium text-orange-700/80">All documents will be reviewed by the chief medical officer within 24 hours. The account will remain in "Pending" status until verified.</span>
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Main Action Bar (Matches Image 4) */}
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-gray-100">
               <button
                  onClick={() => navigate('/admin/doctors')}
                  className="text-gray-900 font-extrabold text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3"
               >
                  <ArrowLeft size={16} />
                  Cancel Process
               </button>

               <div className="flex items-center gap-6 w-full md:w-auto">
                  {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}
                  <button className="flex-1 md:flex-none px-12 py-5 rounded-2xl text-gray-500 font-bold bg-gray-200 transition-all active:scale-95">
                     Save as Draft
                  </button>
                  <button
                     onClick={handleSubmit}
                     disabled={submitting}
                     className="flex-1 md:flex-none px-12 py-5 rounded-3xl bg-[#005C5C] text-white font-bold shadow-xl shadow-mamacare-teal/20 flex items-center justify-center gap-3 hover:bg-mamacare-teal-dark hover:scale-105 active:scale-95 transition-all text-lg disabled:opacity-50"
                  >
                     {submitting ? (uploadingPhoto ? 'Uploading photo...' : uploadingCert ? 'Uploading cert...' : 'Adding...') : 'Save'}
                     <ArrowRight size={20} />
                  </button>
               </div>
            </div>
         </div>
      </AdminLayout>
   );
};

export default AddDoctor;
