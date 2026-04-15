import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ContactForm from '../components/contact/ContactForm';
import FAQCard from '../components/contact/FAQCard';
import QuickContact from '../components/contact/QuickContact';
import { ShieldCheck, HelpCircle, Download, ExternalLink, Plus, Baby } from 'lucide-react';
import contactHero from '../assets/contact-hero.png';

const Contact = () => {
  const navigate = useNavigate();
  const faqs = [
    { icon: Plus, question: "How can I join?", answer: "Joining MamaCare is simple. Download our app or sign up through our portal to begin your personalized maternal health journey within minutes." },
    { icon: ShieldCheck, question: "Is it free?", answer: "We offer a comprehensive free tier that includes basic health logging and community access. Our Premium Sanctuary provides advanced AI insights and 1:1 specialist care." },
    { icon: HelpCircle, question: "How does AI work?", answer: "Our AI analyzes your health logs, mood patterns, and vitals to provide non-clinical insights and timely reminders, keeping you ahead of potential health trends." }
  ];

  return (
    <div className="antialiased min-h-screen bg-[#FDFDFD] font-outfit selection:bg-primary-lp/30">
      {/* TopNavBar — same as LandingPage */}
      <nav className="fixed top-0 w-full z-50 bg-stone-50/70 backdrop-blur-md">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-mamacare-teal">
            <Baby size={26} />
            MamaCare
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/#features" className="font-headline tracking-tight text-base font-medium text-stone-600 hover:text-primary-lp transition-colors">Features</Link>
            <Link to="/#how-it-works" className="font-headline tracking-tight text-base font-medium text-stone-600 hover:text-primary-lp transition-colors">How it Works</Link>
            <Link to="/contact" className="font-headline tracking-tight text-base font-medium text-stone-600 hover:text-primary-lp transition-colors">Contact Support</Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="font-headline tracking-tight text-base font-medium text-primary-lp hover:opacity-80 transition-opacity"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-primary-lp text-on-primary-lp px-6 py-2 rounded-xl font-headline tracking-tight text-base font-medium hover:opacity-90 transition-opacity"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="px-4 py-1.5 bg-red-100 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
              Support Sanctuary
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-mamacare-teal tracking-tighter leading-[1.1]">
              Contact our <br />
              <span className="text-[#A0522D]">care team</span>
            </h1>
            <p className="text-xl text-on-surface-variant-lp leading-relaxed max-w-lg">
              We're here to support your journey. Whether you have questions about our AI health logs or need guidance on maternal wellness, our sanctuary is always open.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-mamacare-teal/5 rounded-[3rem] blur-3xl transition-all duration-500 group-hover:bg-mamacare-teal/10"></div>
            <img
              src={contactHero}
              alt="Care Team"
              className="relative w-full rounded-[2.5rem] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {/* Verified Care Card */}
            <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 max-w-[200px] animate-bounce-slow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-mamacare-teal/10 rounded-lg flex items-center justify-center text-mamacare-teal">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-[10px] font-bold uppercase text-mamacare-teal">Verified Care</span>
              </div>
              <p className="text-[10px] font-medium text-gray-500 leading-relaxed">
                Our response team consists of certified maternal health specialists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Sidebars */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto bg-gray-50/50 rounded-[3rem] border border-gray-100/50 mb-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
          <div className="lg:col-span-1">
            <QuickContact />
          </div>
        </div>
      </section>

      {/* FAQ Section
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-mamacare-teal mb-4">Frequently Asked Questions</h2>
        <div className="w-24 h-1 bg-[#A0522D] mx-auto rounded-full mb-16"></div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {faqs.map((faq, i) => (
             <FAQCard key={i} {...faq} />
          ))}
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="bg-mamacare-teal rounded-[3rem] p-16 md:p-24 text-center text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10 space-y-10 group-hover:scale-[1.01] transition-all duration-700">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
              Ready to prioritize your wellbeing?
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-lg mx-auto">
              Join thousands of mothers who have found their digital sanctuary with MamaCare.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <button className="bg-white text-mamacare-teal px-10 py-4 rounded-full font-bold shadow-xl hover:bg-gray-100 transition-all flex items-center gap-3">
                <Download size={20} />
                Download App
              </button>
              <button className="border-2 border-white/30 px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all flex items-center gap-3">
                Learn More
                <ExternalLink size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer — same as LandingPage */}
      <footer className="bg-background-lp w-full py-12 px-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-headline font-semibold text-lg text-mamacare-teal">MamaCare</span>
            <p className="text-sm text-on-surface-variant-lp"> © 2026 MamaCare Digital Sanctuary. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <a className="text-sm text-on-surface-variant-lp hover:text-primary-lp transition-colors" href="#">Privacy Policy</a>
            <a className="text-sm text-on-surface-variant-lp hover:text-primary-lp transition-colors" href="#">Terms of Service</a>
            <Link to="/contact" className="text-gray-500 hover:text-mamacare-teal text-sm transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
