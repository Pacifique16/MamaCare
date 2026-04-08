import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import signinCharacter from '../assets/signin-character.png';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    const { role } = result.user;
    if (role === 'Mother') navigate('/dashboard');
    else if (role === 'Doctor') navigate('/doctor/dashboard');
    else if (role === 'Admin') navigate('/admin/dashboard');
  };

  const leftContent = {
    bgImage: null,
    title: "Welcome Back to Your Sanctuary",
    subtitle: "Your journey is uniquely yours. We're here to provide the peace of mind and clinical support you deserve, every step of the way.",
    extra: (
      <div className="relative mt-8 group">
        <div className="absolute -inset-4 bg-white/5 rounded-[2rem] blur-2xl group-hover:bg-white/10 transition-all duration-500"></div>
        <img src={signinCharacter} alt="MamaCare Journey" className="relative w-full rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" />
      </div>
    )
  };

  return (
    <AuthLayout leftContent={leftContent}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Sign In</h2>
          <p className="text-gray-500 font-medium">Continue your wellness journey</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Demo credentials hint */}
        <div className="bg-teal-50 border border-teal-100 text-mamacare-teal text-xs font-medium px-4 py-3 rounded-xl space-y-1">
          <p className="font-bold">Demo Accounts:</p>
          <p>Mother: aline@mamacare.app / hashed_pw_1</p>
          <p>Doctor: s.mitchell@mamacare.app / hashed_pw_6</p>
          <p>Admin: admin@mamacare.app / hashed_pw_9</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="form-label">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={18} /></div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="input-field pl-12 bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="form-label">Password</label>
              <Link to="/forgot-password" className="text-sm font-bold text-mamacare-teal hover:underline mb-2">Forgot Password?</Link>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={18} /></div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="input-field pl-12 pr-12 bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-mamacare-teal transition-colors">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-lg shadow-xl shadow-mamacare-teal/20 group">
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-gray-500 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-mamacare-teal font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
