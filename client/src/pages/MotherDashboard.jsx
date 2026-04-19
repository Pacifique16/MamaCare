import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import DashboardHero from '../components/dashboard/DashboardHero';
import TriageCard from '../components/dashboard/TriageCard';
import MetricCard from '../components/dashboard/MetricCard';
import AppointmentCard from '../components/dashboard/AppointmentCard';
import LibraryResource from '../components/dashboard/LibraryResource';
import { ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mothersApi, vitalsApi, appointmentsApi, libraryApi } from '../api/services';

const MotherDashboard = () => {
  const { user } = useAuth();
  const motherId = user?.motherId || 1;

  const [mother, setMother] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [nextAppt, setNextAppt] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    mothersApi.getById(motherId).then(r => setMother(r.data)).catch(() => {});
    vitalsApi.getAll({ motherId }).then(r => setVitals(r.data)).catch(() => {});
    appointmentsApi.getAll({ motherId }).then(r => {
      const upcoming = r.data.find(a => a.status !== 'Completed' && a.status !== 'Cancelled');
      setNextAppt(upcoming || null);
    }).catch(() => {});
    libraryApi.getAll({ status: 'Published' }).then(r => setArticles(r.data.slice(0, 2))).catch(() => {});
  }, [motherId]);

  const latestVital = vitals[0];
  const bp = latestVital ? `${latestVital.bloodPressureSystolic}/${latestVital.bloodPressureDiastolic}` : '—';
  const weight = latestVital?.weightKg ?? '—';

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-outfit pb-20">
      <Navbar />
      <main className="pt-32 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        <DashboardHero userName={mother?.fullName?.split(' ')[0] || 'Aline'} week={mother?.gestationalWeek || 28} />

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <Link to="/triage/symptom-profile" className="block h-full group">
              <TriageCard />
            </Link>
            <div className="grid md:grid-cols-2 gap-8">
              <MetricCard
                title="WEIGHT"
                value={weight}
                unit="kg"
                status="Your progress is within normal range."
                chartType="bar"
              />
              <MetricCard
                title="BLOOD PRESSURE"
                value={bp}
                unit="mmHg"
                status={latestVital?.notes || 'Latest reading.'}
                chartType="line"
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            {nextAppt ? (
              <AppointmentCard
                date={new Date(nextAppt.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                time={new Date(nextAppt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                clinic={nextAppt.type}
                location="Maternity Wing"
              />
            ) : (
              <AppointmentCard />
            )}

            <div className="bg-white rounded-[2.5rem] p-8 space-y-8 border border-gray-50 flex flex-col shadow-card">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#003e3d]">Library Resources</h3>
                <Link to="/library" className="text-mamacare-teal flex items-center gap-1 group">
                  <span className="text-xs font-bold uppercase tracking-widest group-hover:underline">Browse Full Library</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="space-y-4">
                {articles.length > 0 ? articles.map(a => (
                  <LibraryResource key={a.id} title={a.title} category={a.category.toUpperCase()} image={a.imageUrl} />
                )) : (
                  <>
                    <LibraryResource title="The Third Trimester Diet: What to Eat" category="NUTRITION" image="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=200" />
                    <LibraryResource title="Pregnancy Safety: Gentle Movement Guide" category="SAFETY" image="https://images.unsplash.com/photo-1518611012118-2969c63b07b7?auto=format&fit=crop&q=80&w=200" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="pt-32 pb-12 px-8 border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-xl font-bold text-mamacare-teal tracking-tight">MamaCare</span>
          <div className="flex flex-wrap justify-center items-center gap-8 text-[10px] font-bold text-[#006a68] uppercase tracking-widest">
            <a href="#" className="text-red-500 flex items-center gap-2"><Phone size={12} />Emergency Call</a>
            <a href="#" className="hover:text-mamacare-teal transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-mamacare-teal transition-colors">Help Center</a>
          </div>
          <p className="text-[10px] font-bold text-[#005c5c]/60 uppercase tracking-widest">© 2026 MamaCare Maternal Health Platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default MotherDashboard;
