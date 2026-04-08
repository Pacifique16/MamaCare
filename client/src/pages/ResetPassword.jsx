import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CenteredLayout from '../components/auth/CenteredLayout';
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter';
import { Eye, EyeOff, ArrowRight, ArrowLeft, RefreshCcw, Lock, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <CenteredLayout>
            <div className="space-y-8">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="w-16 h-16 bg-mamacare-teal/10 rounded-full flex items-center justify-center text-mamacare-teal">
                        <RefreshCcw size={32} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Set your new password</h2>
                        <p className="text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">
                            Choose a strong password to protect your health sanctuary.
                        </p>
                    </div>
                </div>

                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="form-label">New Password</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Lock size={18} />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••••••" 
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

                    <PasswordStrengthMeter strength={3} />

                    <div className="space-y-2">
                        <label className="form-label">Confirm New Password</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <CheckCircle2 size={18} />
                            </div>
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="••••••••••••" 
                                className="input-field pl-12 pr-12 bg-gray-100 focus:bg-white border-2 border-transparent focus:border-mamacare-teal/20"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-mamacare-teal transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="button"
                        onClick={() => navigate('/reset-success')}
                        className="w-full btn-primary py-4 text-lg shadow-xl shadow-mamacare-teal/20 group"
                    >
                        Save Password & Log In
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </form>

                <div className="flex justify-center">
                    <button 
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 text-gray-400 font-bold hover:text-mamacare-teal transition-all text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to login
                    </button>
                </div>
            </div>
        </CenteredLayout>
    );
};

export default ResetPassword;
