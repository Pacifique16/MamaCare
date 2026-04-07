import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import signinCharacter from '../assets/signin-character.png';

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd check if onboarding is complete
    navigate('/onboarding/step-1');
  };

  const leftContent = {
    bgImage: null, // We'll use a solid teal background or a subtle gradient
    title: "Welcome Back to Your Sanctuary",
    subtitle: "Your journey is uniquely yours. We're here to provide the peace of mind and clinical support you deserve, every step of the way.",
    extra: (
      <div className="relative mt-8 group">
        <div className="absolute -inset-4 bg-white/5 rounded-[2rem] blur-2xl group-hover:bg-white/10 transition-all duration-500"></div>
        <img 
          src={signinCharacter} 
          alt="MamaCare Journey" 
          className="relative w-full rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
        />
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

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="form-label">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                placeholder="name@example.com" 
                className="input-field pl-12 bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="form-label">Password</label>
              <a href="/forgot-password" size="sm" className="text-sm font-bold text-mamacare-teal hover:underline mb-2">
                 Forgot Password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                className="input-field pl-12 pr-12 bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20"
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

          <button type="submit" className="w-full btn-primary py-4 text-lg shadow-xl shadow-mamacare-teal/20 group">
            Sign In
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 font-medium">OR CONTINUE WITH</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="btn-secondary py-3 text-sm font-bold">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-2" alt="Google" />
            Google
          </button>
          <button className="btn-secondary py-3 text-sm font-bold">
            <img src="https://www.svgrepo.com/show/445831/apple-black.svg" className="w-5 h-5 mr-2" alt="Apple" />
            Apple
          </button>
        </div>

        <div className="text-center pt-4">
          <p className="text-gray-500 font-medium">
            Don't have an account? {' '}
            <a href="/signup" className="text-mamacare-teal font-bold hover:underline">Create Account</a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
