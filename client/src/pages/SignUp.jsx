import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Heart, Stethoscope, Baby } from 'lucide-react';
import signupBg from '../assets/signup-bg.png';

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState('mother');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userRole === 'doctor') {
      navigate('/doctor/dashboard');
    } else if (userRole === 'mother') {
      navigate('/onboarding/step-1');
    } else if (userRole === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  const leftContent = {
    bgImage: signupBg,
    title: "Empowering Mothers, Every Step of the Way.",
    subtitle: "Experience a digital sanctuary designed for your peace of mind. Get expert insights, personalized tracking, and a community that cares.",
    extra: (
      <div className="space-y-6">
        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 transition-all hover:bg-white/20">
          <div className="p-3 bg-mamacare-teal/30 rounded-xl text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-white">Clinically Verified</h3>
            <p className="text-white/70 text-sm">Support backed by maternal health experts.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 transition-all hover:bg-white/20">
          <div className="p-3 bg-mamacare-teal/30 rounded-xl text-white">
            <Heart size={24} />
          </div>
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

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your name" 
              className="input-field bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20"
            />
          </div>

          <div className="space-y-2">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="input-field bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20"
            />
          </div>

          <div className="space-y-2">
            <label className="form-label">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Create a strong password" 
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
              <button 
                type="button"
                onClick={() => setUserRole('mother')}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                  userRole === 'mother' 
                    ? 'border-mamacare-teal bg-mamacare-teal/5 text-mamacare-teal ring-4 ring-mamacare-teal/5' 
                    : 'border-gray-100/50 bg-gray-50 text-gray-400 hover:border-gray-300'
                }`}
              >
                <div className={`p-3 rounded-xl mb-3 ${userRole === 'mother' ? 'bg-mamacare-teal text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                  <Baby size={28} />
                </div>
                <span className="font-bold text-xs">Mother</span>
              </button>

              <button 
                type="button"
                onClick={() => setUserRole('doctor')}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                  userRole === 'doctor' 
                    ? 'border-mamacare-teal bg-mamacare-teal/5 text-mamacare-teal ring-4 ring-mamacare-teal/5' 
                    : 'border-gray-100/50 bg-gray-50 text-gray-400 hover:border-gray-300'
                }`}
              >
                <div className={`p-3 rounded-xl mb-3 ${userRole === 'doctor' ? 'bg-mamacare-teal text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                  <Stethoscope size={28} />
                </div>
                <span className="font-bold text-xs">Doctor</span>
              </button>

              <button 
                type="button"
                onClick={() => setUserRole('admin')}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                  userRole === 'admin' 
                    ? 'border-mamacare-teal bg-mamacare-teal/5 text-mamacare-teal ring-4 ring-mamacare-teal/5' 
                    : 'border-gray-100/50 bg-gray-50 text-gray-400 hover:border-gray-300'
                }`}
              >
                <div className={`p-3 rounded-xl mb-3 ${userRole === 'admin' ? 'bg-mamacare-teal text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                  <ShieldCheck size={28} />
                </div>
                <span className="font-bold text-xs">Admin</span>
              </button>
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-4 text-lg shadow-xl shadow-mamacare-teal/20 group">
            Create Account
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-gray-500 font-medium">
            Already have an account? {' '}
            <a href="/login" className="text-mamacare-teal font-bold hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
