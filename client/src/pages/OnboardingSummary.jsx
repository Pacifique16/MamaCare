import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Stethoscope, ChevronLeft, FileText, CheckCircle2 } from 'lucide-react';
import geometricImg from '../assets/geometric-confirm.png';
import { mothersApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

const OnboardingSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const form = location.state?.form || {};
  const name = location.state?.name || user?.name || '—';

  const [confirmations, setConfirmations] = useState({ accuracy: false, privacy: false, medical: false });
  const [loading, setLoading] = useState(false);

  const isComplete = confirmations.accuracy && confirmations.privacy && confirmations.medical;

  const toggle = (key) => setConfirmations(prev => ({ ...prev, [key]: !prev[key] }));

  const handleComplete = async () => {
    setLoading(true);
    try {
      await mothersApi.update(user.motherId, { onboardingComplete: true });
      navigate('/dashboard');
    } catch {
      navigate('/dashboard'); // still proceed even if patch fails
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: 'Personal Info',
      icon: User,
      bg: 'bg-pink-50',
      text: 'text-pink-400',
      data: [
        { label: 'Name',     value: name },
        { label: 'DOB',      value: form.dateOfBirth || '—' },
        { label: 'Location', value: form.location || '—' },
      ],
    },
    {
      title: 'Pregnancy Details',
      icon: FileText,
      bg: 'bg-teal-50',
      text: 'text-teal-500',
      data: [
        { label: 'Trimester', value: form.trimester || '—' },
        { label: 'Due Date',  value: form.expectedDueDate || '—' },
        { label: 'Weight',    value: form.weightKg ? `${form.weightKg} kg` : '—' },
      ],
    },
    {
      title: 'Medical History',
      icon: Stethoscope,
      bg: 'bg-red-50',
      text: 'text-red-400',
      data: [
        { label: 'Gestational Diabetes', value: form.hasGestationalDiabetes ? 'Yes' : 'No' },
        { label: 'Hypertension',         value: form.hasHypertension ? 'Yes' : 'No' },
        { label: 'Allergies',            value: form.allergies || 'None reported' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white font-outfit pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white pt-6">
        <div className="max-w-3xl mx-auto px-4">
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="w-full h-full bg-[#005C5C] shadow-lg shadow-mamacare-teal/20 transition-all duration-1000"></div>
          </div>
          <div className="text-center mt-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mamacare-teal">Step 2 of 2</span>
          </div>
        </div>
      </div>

      <main className="pt-32 px-4 md:px-8 max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-medium text-gray-900 tracking-tight">Confirm Your Profile</h1>
          <p className="text-gray-500 font-medium text-lg">One final look to ensure your journey starts with accuracy.</p>
        </div>

        {/* Summary Cards */}
        <div className="space-y-12">
          <h2 className="text-2xl font-bold text-gray-900 ml-2">Profile Summary</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-12 h-12 ${section.bg} rounded-2xl flex items-center justify-center ${section.text}`}>
                    <section.icon size={24} />
                  </div>
                  <button
                    onClick={() => navigate('/onboarding/step-1')}
                    className="text-[10px] font-bold uppercase tracking-widest text-mamacare-teal hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">{section.title}</h3>
                <div className="space-y-4 flex-1">
                  {section.data.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-medium">{item.label}:</span>
                      <span className="text-gray-900 font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmations */}
        <section className="bg-gray-50 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-16 border border-gray-100">
          <div className="w-full md:w-1/2">
            <img src={geometricImg} alt="Confirm" className="w-full rounded-[2rem] shadow-2xl" />
          </div>
          <div className="w-full md:w-1/2 space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">Final Confirmations</h2>
            <div className="space-y-6">
              {[
                { id: 'accuracy', text: 'I confirm that all medical and personal information provided is accurate to the best of my knowledge.' },
                { id: 'privacy',  text: "I agree to the Privacy Policy regarding the secure processing of my health data." },
                { id: 'medical',  text: 'I understand that MamaCare is a support tool and not a substitute for professional medical advice.' },
              ].map(item => (
                <label key={item.id} className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative mt-1">
                    <input type="checkbox" className="peer sr-only" checked={confirmations[item.id]} onChange={() => toggle(item.id)} />
                    <div className="w-6 h-6 border-2 border-gray-200 rounded-md transition-all duration-300 peer-checked:border-mamacare-teal peer-checked:bg-mamacare-teal"></div>
                    <CheckCircle2 size={16} className={`absolute top-1 left-1 text-white transition-all duration-300 ${confirmations[item.id] ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                  </div>
                  <span className="text-gray-500 font-medium leading-relaxed group-hover:text-gray-700 transition-colors">{item.text}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-12 gap-8">
          <button onClick={() => navigate('/onboarding/step-1')} className="flex items-center gap-2 text-gray-400 font-bold hover:text-mamacare-teal transition-all text-sm group">
            <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            Previous Step
          </button>
          <button
            disabled={!isComplete || loading}
            onClick={handleComplete}
            className={`px-12 py-5 rounded-full font-bold shadow-xl transition-all flex items-center gap-3 duration-500 ${
              isComplete
                ? 'bg-mamacare-teal text-white shadow-mamacare-teal/20 hover:bg-mamacare-teal-dark hover:scale-105'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
            }`}
          >
            {loading ? 'Completing...' : 'Complete Profile'}
            {isComplete && <CheckCircle2 size={24} />}
          </button>
        </div>
      </main>
    </div>
  );
};

export default OnboardingSummary;
