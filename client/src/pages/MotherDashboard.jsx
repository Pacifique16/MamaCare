import React from 'react';
import Navbar from '../components/layout/Navbar';
import DashboardHero from '../components/dashboard/DashboardHero';
import TriageCard from '../components/dashboard/TriageCard';
import MetricCard from '../components/dashboard/MetricCard';
import AppointmentCard from '../components/dashboard/AppointmentCard';
import LibraryResource from '../components/dashboard/LibraryResource';
import { ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const MotherDashboard = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-outfit pb-20">
      <Navbar />

      <main className="pt-32 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <DashboardHero userName="Aline" week={28} />

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Main Column (8/12) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid md:grid-cols-1 gap-8">
              <Link to="/triage/symptom-profile" className="block h-full group">
                <TriageCard />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <MetricCard
                title="WEIGHT GAIN"
                value="+12.4"
                unit="kg"
                status="Your progress is within normal range."
                chartType="bar"
              />
              <MetricCard
                title="BLOOD PRESSURE"
                value="118/76"
                unit="mmHg"
                status="Consistent and healthy readings."
                chartType="line"
              />
            </div>
          </div>

          {/* Sidebar Column (4/12) */}
          <div className="lg:col-span-4 space-y-8">
            <AppointmentCard />

            <div className="bg-white rounded-[2.5rem] p-8 space-y-8 border border-gray-50 flex flex-col shadow-card">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Library Resources</h3>
                <button className="text-mamacare-teal flex items-center gap-1 group">
                  <span className="text-xs font-bold uppercase tracking-widest group-hover:underline">Browse Full Library</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="space-y-4">
                <LibraryResource
                  title="The Third Trimester Diet: What to Eat"
                  category="NUTRITION"
                  image="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=200"
                />
                <LibraryResource
                  title="Pregnancy Safety: Gentle Movement Guide"
                  category="SAFETY"
                  image="https://images.unsplash.com/photo-1518611012118-2969c63b07b7?auto=format&fit=crop&q=80&w=200"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="pt-32 pb-12 px-8 border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-xl font-bold text-mamacare-teal tracking-tight">MamaCare</span>
          <div className="flex flex-wrap justify-center items-center gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="text-red-500 flex items-center gap-2">
              <Phone size={12} />
              Emergency Call
            </a>
            <a href="#" className="hover:text-mamacare-teal transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-mamacare-teal transition-colors">Help Center</a>
            <a href="#" className="hover:text-mamacare-teal transition-colors">Terms</a>
          </div>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            © 2026 MamaCare Maternal Health Platform. Providing clinical support with a human touch.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MotherDashboard;
