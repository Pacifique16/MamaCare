import React from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

const AuthLayout = ({ children, leftContent }) => {
  return (
    <div className="min-h-screen flex flex-col font-outfit">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl w-full mx-auto grid md:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 min-h-[85vh]">
          {/* Left Section - Teal Accent */}
          <div className="relative hidden md:flex flex-col justify-center p-16 text-white overflow-hidden">
            {/* Background Texture/Image */}
            <div className="absolute inset-0 z-0">
              {leftContent.bgImage ? (
                <img 
                  src={leftContent.bgImage} 
                  alt="Background" 
                  className="w-full h-full object-cover opacity-60 scale-110"
                />
              ) : (
                <div className="w-full h-full bg-mamacare-teal"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-mamacare-teal/80 via-mamacare-teal/90 to-mamacare-teal-dark/95 z-10"></div>
            </div>

            {/* Content */}
            <div className="relative z-20 space-y-8 max-w-lg">
              {leftContent.logo && (
                <div className="flex items-center gap-2 mb-12">
                   <span className="text-3xl font-bold tracking-tight">MamaCare</span>
                </div>
              )}
              
              <h1 className="text-5xl font-bold leading-tight tracking-tight">
                {leftContent.title}
              </h1>
              <p className="text-xl text-white/80 leading-relaxed font-light">
                {leftContent.subtitle}
              </p>

              {/* Character Illustration for Sign In or Feature Cards for Sign Up */}
              <div className="pt-8">
                {leftContent.extra}
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="flex flex-col items-center justify-center p-8 md:p-16 bg-white">
            <div className="w-full max-w-md">
                {children}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthLayout;
