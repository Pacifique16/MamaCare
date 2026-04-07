import React from 'react';
import { useNavigate } from 'react-router-dom';
import CenteredLayout from '../components/auth/CenteredLayout';
import OTPInput from '../components/auth/OTPInput';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const OTPVerify = () => {
    const navigate = useNavigate();

    const handleComplete = (code) => {
        console.log("OTP Completed:", code);
    };

    return (
        <CenteredLayout>
            <div className="space-y-8 text-center">
                <div className="space-y-3">
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Check your inbox.</h2>
                    <p className="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
                        We've sent a 6-digit code to your email. Please enter it below to verify your account.
                    </p>
                </div>

                <div className="py-6">
                    <OTPInput onComplete={handleComplete} />
                </div>

                <div className="space-y-6">
                    <button 
                        onClick={() => navigate('/reset-password')}
                        className="w-full btn-primary py-4 text-lg shadow-xl shadow-mamacare-teal/20 group"
                    >
                        Verify & Continue
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </button>

                    <div className="flex flex-col items-center gap-4">
                        <p className="text-sm font-medium text-gray-500">
                            Didn't receive the code? {' '}
                            <button className="text-mamacare-teal font-bold hover:underline">Resend Code</button>
                        </p>
                        
                        <button 
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-2 text-gray-400 font-bold hover:text-mamacare-teal transition-all text-sm"
                        >
                            <ArrowLeft size={16} />
                            Back to login
                        </button>
                    </div>
                </div>
            </div>
        </CenteredLayout>
    );
};

export default OTPVerify;
