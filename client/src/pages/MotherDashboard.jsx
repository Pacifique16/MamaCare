import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DashboardHero from '../components/dashboard/DashboardHero';
import TriageCard from '../components/dashboard/TriageCard';
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
    appointmentsApi.getAll({ motherId }).then(r => {
      const upcoming = r.data.find(a => a.status !== 'Completed' && a.status !== 'Cancelled');
      setNextAppt(upcoming || null);
    }).catch(() => {});
    libraryApi.getAll({ status: 'Published' }).then(r => setArticles(r.data.slice(0, 2))).catch(() => {});
  }, [motherId]);

  // No metrics display, only keeping minimal data fetching

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-poppins pb-4">
      <Navbar />
      <main className="pt-32 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        <DashboardHero userName={mother?.fullName?.split(' ')[0] || 'Aline'} week={mother?.gestationalWeek || 28} />

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Action Center: Triage & Appointment */}
          <div className="lg:col-span-8">
            <Link to="/triage/symptom-profile" className="block h-full group">
              <TriageCard />
            </Link>
          </div>

          <div className="lg:col-span-4">
            <AppointmentCard
              date={nextAppt ? new Date(nextAppt.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null}
              time={nextAppt ? new Date(nextAppt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null}
              clinic={nextAppt?.type ? (nextAppt.type.replace(/([A-Z])/g, ' $1').trim()) : null}
              location={nextAppt?.location || (nextAppt ? "Maternity Wing" : null)}
            />
          </div>
        </div>

        {/* Resources Section Moved Below for better focus */}
        <section className="space-y-8">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-headline">Resources for You</h2>
            <Link to="/library" className="text-sm font-bold uppercase tracking-[0.2em] text-mamacare-teal hover:opacity-70 transition-opacity">
              View All
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {articles.length > 0 ? articles.map(a => (
              <LibraryResource key={a.id} title={a.title} category={a.category.toUpperCase()} image={a.imageUrl} />
            )) : (
              <>
                <LibraryResource title="The Third Trimester Diet: What to Eat" category="NUTRITION" image="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=200" />
                <LibraryResource title="Pregnancy Safety: Gentle Movement Guide" category="SAFETY" image="https://images.unsplash.com/photo-1518611012118-2969c63b07b7?auto=format&fit=crop&q=80&w=200" />
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MotherDashboard;
