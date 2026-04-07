import React from 'react';
import { useNavigate } from 'react-router-dom';
import CenteredLayout from '../components/auth/CenteredLayout';
import SupportCard from '../components/auth/SupportCard';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const ResetSuccess = () => {
    const navigate = useNavigate();

    return (
        <CenteredLayout hideHeader={false} hideFooter={false}>
            <div className="space-y-12 text-center py-6">
                <div className="flex flex-col items-center gap-8">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-mamacare-teal border-4 border-mamacare-teal/5 relative">
                        <div className="absolute -inset-4 bg-mamacare-teal/5 rounded-full blur-2xl animate-pulse"></div>
                        <CheckCircle2 size={48} className="relative z-10" />
                    </div>
                    
                    <div className="space-y-3">
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Password Reset Successful</h2>
                        <p className="text-gray-500 font-medium max-w-[280px] mx-auto leading-relaxed">
                            Your password has been updated. You can now log in to your account.
                        </p>
                    </div>
                </div>

                <div className="space-y-12">
                   <button 
                        onClick={() => navigate('/login')}
                        className="w-full btn-primary py-4 text-lg shadow-xl shadow-mamacare-teal/20 group"
                    >
                        Go to Login
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </button>

                    {/* Pagination Dots Indicator as seen in image */}
                    <div className="flex justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                        <div className="w-3 h-1.5 rounded-full bg-mamacare-teal/20"></div>
                    </div>
                </div>
            </div>

            <SupportCard />
        </CenteredLayout>
    );
};

export default ResetSuccess;
