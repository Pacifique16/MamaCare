import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import signinCharacter from '../assets/signin-character.png';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const leftContent = {
    bgImage: null, 
    title: "Secure Your Journey",
    subtitle: "Reset your password to regain access to your personal digital sanctuary and expert support.",
    extra: (
        <div className="relative mt-8 group">
          <div className="absolute -inset-4 bg-white/5 rounded-[2rem] blur-2xl group-hover:bg-white/10 transition-all duration-500"></div>
          <img 
            src={signinCharacter} 
            alt="MamaCare Journey" 
            className="relative w-full rounded-3xl shadow-2xl opacity-80"
          />
        </div>
      )
  };

  return (
    <AuthLayout leftContent={leftContent} compact={true}>
      <div className="space-y-6">
        <div className="space-y-2">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-mamacare-teal font-bold hover:gap-3 transition-all mb-4 text-base"
          >
            <ArrowLeft size={20} />
            Back to Sign In
          </button>
          <h2 className="text-5xl font-bold text-gray-900 tracking-tight">
            {isSubmitted ? "Check Your Email" : "Reset Password"}
          </h2>
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            {isSubmitted 
              ? "We've sent a password reset link to your email address. Please check your inbox."
              : "Enter the email address associated with your account and we'll send you a link to reset your password."
            }
          </p>
        </div>

        {!isSubmitted ? (
          <form 
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/verify-otp');
            }}
          >
            <div className="space-y-2">
              <label className="form-label text-base">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com" 
                  className="input-field pl-12 bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20"
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-4 text-xl shadow-xl shadow-mamacare-teal/20 group">
              Send Reset Link
              <Send size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <button 
               onClick={() => setIsSubmitted(false)}
               className="w-full btn-secondary py-4"
            >
              Didn't receive email? Resend
            </button>
          </div>
        )}

        <div className="text-center pt-4">
          <p className="text-lg text-gray-500 font-medium">
            Remembered your password? {' '}
            <a href="/login" className="text-mamacare-teal font-bold hover:underline">Sign In</a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
