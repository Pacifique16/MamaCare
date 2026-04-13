import React from 'react';
import { useNavigate } from 'react-router-dom';
import pregnantWoman from '../assets/pregnantwoman.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="antialiased min-h-screen font-body bg-background-lp text-on-background-lp selection:bg-primary-lp/30">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-stone-50/70 backdrop-blur-md">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <span className="text-2xl font-bold tracking-tighter text-primary-lp">MamaCare</span>
          <div className="hidden md:flex items-center gap-8">
            <a className="font-headline tracking-tight text-sm font-medium text-stone-600 hover:text-primary-lp transition-colors" href="#features">Features</a>
            <a className="font-headline tracking-tight text-sm font-medium text-stone-600 hover:text-primary-lp transition-colors" href="#how-it-works">How it Works</a>
            <a className="font-headline tracking-tight text-sm font-medium text-stone-600 hover:text-primary-lp transition-colors" href="#library">Library</a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="font-headline tracking-tight text-sm font-medium text-primary-lp hover:opacity-80 transition-opacity"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-primary-lp text-on-primary-lp px-6 py-2 rounded-xl font-headline tracking-tight text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container-lp text-on-secondary-container-lp text-xs font-semibold tracking-wider uppercase">
              AI-Powered Triage
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface-lp leading-[1.1] font-headline">
              Empowering Mothers, <br />
              <span className="text-primary-lp">Ensuring Safe Journeys</span>
            </h1>
            <p className="text-lg text-on-surface-variant-lp max-w-lg leading-relaxed">
              Personalized digital antenatal support and smart triage systems designed to guide you through every milestone of motherhood with medical precision and emotional care.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate('/signup')}
                className="hero-gradient text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-primary-lp/20 hover:scale-[1.02] transition-transform"
              >
                Start Your Journey
              </button>
              <button className="bg-surface-container-highest-lp text-on-primary-container-lp px-8 py-4 rounded-xl font-semibold text-lg hover:bg-surface-container-high-lp transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-secondary-container-lp/20 rounded-full blur-3xl"></div>
            <div className="rounded-[3rem] overflow-hidden shadow-2xl">
              <img
                alt="Empowering Motherhood"
                className="w-full h-auto object-cover scale-110"
                src={pregnantWoman}
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest-lp p-8 rounded-xl text-center transition-all duration-300 hover:bg-surface-container-low-lp">
              <div className="text-3xl font-extrabold text-primary-lp mb-2">10k+</div>
              <div className="text-sm font-medium text-on-surface-variant-lp uppercase tracking-widest">Mothers Supported</div>
            </div>
            <div className="bg-surface-container-lowest-lp p-8 rounded-xl text-center transition-all duration-300 hover:bg-surface-container-low-lp">
              <div className="text-3xl font-extrabold text-primary-lp mb-2">500+</div>
              <div className="text-sm font-medium text-on-surface-variant-lp uppercase tracking-widest">Verified Doctors</div>
            </div>
            <div className="bg-surface-container-lowest-lp p-8 rounded-xl text-center transition-all duration-300 hover:bg-surface-container-low-lp">
              <div className="text-3xl font-extrabold text-primary-lp mb-2">99%</div>
              <div className="text-sm font-medium text-on-surface-variant-lp uppercase tracking-widest">User Satisfaction</div>
            </div>
            <div className="bg-surface-container-lowest-lp p-8 rounded-xl text-center transition-all duration-300 hover:bg-surface-container-low-lp">
              <div className="text-3xl font-extrabold text-primary-lp mb-2">24/7</div>
              <div className="text-sm font-medium text-on-surface-variant-lp uppercase tracking-widest">AI Triage Support</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-8 py-24 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface-lp tracking-tight font-headline">Everything You Need for a Safe Pregnancy</h2>
            <div className="w-24 h-1 bg-primary-lp mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="group bg-surface-container-lowest-lp p-8 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl shadow-stone-200/50">
              <div className="w-12 h-12 bg-primary-lp/10 text-primary-lp rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">smart_toy</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-on-surface-lp font-headline">Smart Triage AI</h3>
              <p className="text-on-surface-variant-lp leading-relaxed">Instant medical guidance and symptom checking powered by advanced maternal health AI.</p>
            </div>
            {/* Card 2 */}
            <div className="group bg-surface-container-lowest-lp p-8 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl shadow-stone-200/50">
              <div className="w-12 h-12 bg-secondary-container-lp/30 text-secondary-lp rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">folder_shared</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-on-surface-lp font-headline">Digital Health Records</h3>
              <p className="text-on-surface-variant-lp leading-relaxed">Securely store and share your pregnancy documents and medical history in one place.</p>
            </div>
            {/* Card 3 */}
            <div className="group bg-surface-container-lowest-lp p-8 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl shadow-stone-200/50">
              <div className="w-12 h-12 bg-primary-lp/10 text-primary-lp rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">event_available</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-on-surface-lp font-headline">Appointment Automation</h3>
              <p className="text-on-surface-variant-lp leading-relaxed">Never miss a check-up with intelligent scheduling and automated reminders.</p>
            </div>
            {/* Card 4 */}
            <div className="group bg-surface-container-lowest-lp p-8 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl shadow-stone-200/50">
              <div className="w-12 h-12 bg-secondary-container-lp/30 text-secondary-lp rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">library_books</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-on-surface-lp font-headline">Bilingual Library</h3>
              <p className="text-on-surface-variant-lp leading-relaxed">Curated medical resources available in multiple languages for inclusive healthcare.</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-surface-container-low-lp py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface-lp mb-6 tracking-tight font-headline">Your Care Path, Simplified</h2>
                <p className="text-lg text-on-surface-variant-lp">We've streamlined the journey from your first positive test to postpartum care, ensuring you're never alone.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              {/* Step 1 */}
              <div className="relative space-y-6">
                <div className="text-[8rem] font-black text-on-surface-lp/5 absolute -top-16 -left-4 select-none">1</div>
                <div className="w-16 h-16 bg-primary-lp text-on-primary-lp rounded-2xl flex items-center justify-center relative z-10 shadow-lg shadow-primary-lp/20">
                  <span className="material-symbols-outlined text-3xl">person_add</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface-lp font-headline">Sign Up</h3>
                <p className="text-on-surface-variant-lp leading-relaxed">Create your profile and enter your pregnancy details to personalize your experience from day one.</p>
              </div>
              {/* Step 2 */}
              <div className="relative space-y-6">
                <div className="text-[8rem] font-black text-on-surface-lp/5 absolute -top-16 -left-4 select-none">2</div>
                <div className="w-16 h-16 bg-primary-lp text-on-primary-lp rounded-2xl flex items-center justify-center relative z-10 shadow-lg shadow-primary-lp/20">
                  <span className="material-symbols-outlined text-3xl">monitoring</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface-lp font-headline">Track Pregnancy</h3>
                <p className="text-on-surface-variant-lp leading-relaxed">Log symptoms, monitor milestones, and use our AI tools to stay informed about your baby's growth.</p>
              </div>
              {/* Step 3 */}
              <div className="relative space-y-6">
                <div className="text-[8rem] font-black text-on-surface-lp/5 absolute -top-16 -left-4 select-none">3</div>
                <div className="w-16 h-16 bg-primary-lp text-on-primary-lp rounded-2xl flex items-center justify-center relative z-10 shadow-lg shadow-primary-lp/20">
                  <span className="material-symbols-outlined text-3xl">medical_services</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface-lp font-headline">Get Care</h3>
                <p className="text-on-surface-variant-lp leading-relaxed">Connect with verified doctors instantly or follow AI-triaged paths to the right specialist for you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-8 py-32">
          <div className="hero-gradient rounded-[3rem] p-12 md:p-24 text-center text-white space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-container-lp/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight relative z-10 font-headline">Ready to start your <br />healthy pregnancy journey?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <button
                onClick={() => navigate('/signup')}
                className="bg-white text-primary-lp px-10 py-5 rounded-2xl font-bold text-xl shadow-xl hover:scale-105 transition-transform"
              >
                Get Started Free
              </button>
              <button className="border-2 border-white/30 text-white backdrop-blur-md px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 transition-colors">
                Talk to an Expert
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background-lp w-full py-12 px-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-headline font-semibold text-base text-on-surface-lp">MamaCare</span>
            <p className="text-xs text-on-surface-variant-lp">© 2024 MamaCare. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <a className="text-xs text-on-surface-variant-lp hover:text-primary-lp transition-colors" href="#">Privacy Policy</a>
            <a className="text-xs text-on-surface-variant-lp hover:text-primary-lp transition-colors" href="#">Terms of Service</a>
            <a className="text-xs text-on-surface-variant-lp hover:text-primary-lp transition-colors" href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
