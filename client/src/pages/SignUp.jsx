import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Heart, Stethoscope, Baby } from 'lucide-react';
import signupBg from '../assets/signup-bg.png';
import { mothersApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState('mother');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!fullName.trim()) return setError('Full name is required.');
    if (!email.trim()) return setError('Email is required.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    // Only mothers go through signup → onboarding for now
    if (userRole !== 'mother') {
      setError('Doctor and Admin accounts are created by the system administrator.');
      return;
    }

    setLoading(true);
    try {
      const res = await mothersApi.create({
        fullName,
        email,
        password,
        dateOfBirth: '1990-01-01',   // placeholder — collected in onboarding
        expectedDueDate: '2026-12-01', // placeholder — collected in onboarding
        gestationalWeek: 1,
        currentTrimester: 'First',
        weightKg: 60,
        hasGestationalDiabetes: false,
        hasHypertension: false,
      });

      // Auto-login after signup
      const loginResult = await login(email, password);
      if (loginResult.success) {
        navigate('/onboarding/step-1');
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Signup error:', err);
      console.error('Response:', err.response);
      console.error('Message:', err.message);
      const msg = err.response?.data?.title || err.response?.data || err.message || 'Account creation failed.';
      setError(typeof msg === 'string' ? msg : 'Account creation failed.');
    } finally {
      setLoading(false);
    }
  };

  const leftContent = {
    bgImage: signupBg,
    title: "Empowering Mothers, Every Step of the Way.",
    subtitle: "Experience a digital sanctuary designed for your peace of mind. Get expert insights, personalized tracking, and a community that cares.",
    extra: (
      <div className="space-y-6">
        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 transition-all hover:bg-white/20">
          <div className="p-3 bg-mamacare-teal/30 rounded-xl text-white"><ShieldCheck size={24} /></div>
          <div>
            <h3 className="font-semibold text-white">Clinically Verified</h3>
            <p className="text-white/70 text-sm">Support backed by maternal health experts.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 transition-all hover:bg-white/20">
          <div className="p-3 bg-mamacare-teal/30 rounded-xl text-white"><Heart size={24} /></div>
          <div>
            <h3 className="font-semibold text-white">Personalized Care</h3>
            <p className="text-white/70 text-sm">Tailored logs for your unique journey.</p>
          </div>
        </div>
      </div>
    )
  };

  return (
    <AuthLayout leftContent={leftContent}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Start Your Journey</h2>
          <p className="text-gray-500 font-medium">Join thousands of mothers receiving expert support.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Enter your name"
              required
              className="input-field bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20"
            />
          </div>

          <div className="space-y-2">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="input-field bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20"
            />
          </div>

          <div className="space-y-2">
            <label className="form-label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a strong password (min. 6 characters)"
                required
                className="input-field bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-mamacare-teal transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="form-label">I am signing up as:</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { role: 'mother', label: 'Mother', Icon: Baby },
                { role: 'doctor', label: 'Doctor', Icon: Stethoscope },
                { role: 'admin',  label: 'Admin',  Icon: ShieldCheck },
              ].map(({ role, label, Icon }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setUserRole(role)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                    userRole === role
                      ? 'border-mamacare-teal bg-mamacare-teal/5 text-mamacare-teal ring-4 ring-mamacare-teal/5'
                      : 'border-gray-100/50 bg-gray-50 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-3 rounded-xl mb-3 ${userRole === role ? 'bg-mamacare-teal text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                    <Icon size={28} />
                  </div>
                  <span className="font-bold text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 text-lg shadow-xl shadow-mamacare-teal/20 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-mamacare-teal font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
