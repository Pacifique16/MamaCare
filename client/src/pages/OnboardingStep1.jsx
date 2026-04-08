import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/onboarding/StepIndicator';
import TrimesterSelector from '../components/onboarding/TrimesterSelector';
import PrivacyBanner from '../components/onboarding/PrivacyBanner';
import { User, Calendar, Baby, Activity, ShieldCheck, Stethoscope, ChevronLeft, ArrowRight, UserPlus, Droplets } from 'lucide-react';
import { mothersApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

const OnboardingStep1 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    dateOfBirth: '',
    location: '',
    expectedDueDate: '',
    weightKg: '',
    trimester: 'Second',
    gestationalWeek: '',
    hasGestationalDiabetes: false,
    hasHypertension: false,
    allergies: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleNext = async () => {
    setError('');
    if (!form.dateOfBirth) return setError('Date of birth is required.');
    if (!form.expectedDueDate) return setError('Expected due date is required.');
    if (!form.weightKg || isNaN(form.weightKg)) return setError('Valid weight is required.');

    setLoading(true);
    try {
      await mothersApi.update(user.motherId, {
        location: form.location || null,
        expectedDueDate: new Date(form.expectedDueDate).toISOString(),
        gestationalWeek: form.gestationalWeek ? parseInt(form.gestationalWeek) : null,
        currentTrimester: form.trimester,
        weightKg: parseFloat(form.weightKg),
        hasGestationalDiabetes: form.hasGestationalDiabetes,
        hasHypertension: form.hasHypertension,
        allergies: form.allergies || null,
        onboardingComplete: false,
      });

      // Pass form data to summary via location state
      navigate('/onboarding/complete', { state: { form, name: user?.name } });
    } catch {
      setError('Failed to save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-outfit pb-20">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-2xl font-bold text-[#005C5C] tracking-tight">MamaCare</span>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <User size={18} />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 px-4 md:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-5">
          <span className="px-5 py-1.5 bg-[#FF69B4]/10 text-[#FF69B4] text-[10px] font-bold uppercase tracking-widest rounded-full">
            ONBOARDING JOURNEY
          </span>
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Tailoring your care journey.</h1>
          <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
            Let's create your pregnancy profile. This helps us provide the most relevant medical insights and reminders.
          </p>
        </div>

        <StepIndicator currentStep={1} />

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Personal Information */}
          <section className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-card border border-gray-50/50 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-mamacare-teal/5 rounded-2xl flex items-center justify-center text-mamacare-teal">
                <UserPlus size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your basic identity for hospital registration.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  readOnly
                  className="input-field bg-gray-50 border-none py-4 text-gray-400 font-bold cursor-not-allowed"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date of Birth *</label>
                <div className="relative">
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={e => set('dateOfBirth', e.target.value)}
                    className="input-field bg-gray-50 focus:bg-white border-none py-4 text-gray-900 font-bold"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => set('location', e.target.value)}
                    placeholder="City, Country"
                    className="input-field bg-gray-50 focus:bg-white border-none py-4 text-gray-900 font-bold"
                  />
                  <Activity className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </section>

          {/* Pregnancy Details */}
          <section className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-card border border-gray-50/50 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FF69B4]/5 rounded-2xl flex items-center justify-center text-[#FF69B4]">
                <Baby size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pregnancy Details</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">How far along are you in this journey?</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Trimester</span>
                <TrimesterSelector
                  defaultValue="Second"
                  onChange={val => set('trimester', val)}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-8 pt-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Expected Due Date *</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={form.expectedDueDate}
                      onChange={e => set('expectedDueDate', e.target.value)}
                      className="input-field bg-gray-50 focus:bg-white border-none py-4 text-gray-900 font-bold"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Gestational Week</label>
                  <input
                    type="number"
                    min="1" max="42"
                    value={form.gestationalWeek}
                    onChange={e => set('gestationalWeek', e.target.value)}
                    placeholder="e.g. 20"
                    className="input-field bg-gray-50 focus:bg-white border-none py-4 text-gray-900 font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Weight (kg) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="30" max="200"
                      value={form.weightKg}
                      onChange={e => set('weightKg', e.target.value)}
                      placeholder="68"
                      className="input-field bg-gray-50 focus:bg-white border-none py-4 text-gray-900 font-bold pr-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">kg</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Medical History */}
          <section className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-card border border-gray-50/50 space-y-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-400">
                <Stethoscope size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Medical History</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pre-existing conditions for personalized risk assessment.</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { field: 'hasGestationalDiabetes', label: 'Gestational Diabetes', desc: 'History or current concerns with blood sugar levels.', Icon: Droplets, color: 'text-red-300' },
                { field: 'hasHypertension', label: 'Hypertension', desc: 'History of high blood pressure or preeclampsia.', Icon: Activity, color: 'text-blue-300' },
              ].map(({ field, label, desc, Icon, color }) => (
                <div key={field} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center ${color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{label}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => set(field, !form[field])}
                    className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${form[field] ? 'bg-mamacare-teal' : 'bg-gray-200'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${form[field] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              ))}

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Allergies (optional)</label>
                <input
                  type="text"
                  value={form.allergies}
                  onChange={e => set('allergies', e.target.value)}
                  placeholder="e.g. Penicillin, Latex"
                  className="input-field bg-gray-50 focus:bg-white border-none py-4 text-gray-900 font-bold"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-12 gap-8">
          <button className="flex items-center gap-2 text-gray-400 font-bold hover:text-mamacare-teal transition-all text-sm group">
            <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            Save and finish later
          </button>
          <button
            onClick={handleNext}
            disabled={loading}
            className="px-10 py-4 bg-mamacare-teal text-white font-bold rounded-[1.25rem] shadow-xl shadow-mamacare-teal/20 transition-all hover:bg-mamacare-teal-dark flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Next Step'}
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="pt-20">
          <PrivacyBanner />
        </div>
      </main>
    </div>
  );
};

export default OnboardingStep1;
