import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DashboardHero from '../components/dashboard/DashboardHero';
import TriageCard from '../components/dashboard/TriageCard';
import AppointmentCard from '../components/dashboard/AppointmentCard';
import LibraryResource from '../components/dashboard/LibraryResource';
import { ArrowRight, Phone, ChevronRight } from 'lucide-react';
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
            <Link to="/triage" className="block h-full group">
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
        <section className="space-y-10 pt-10">
          <div className="flex justify-between items-end px-2">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 font-headline leading-none">Resources for You</h2>
              <p className="text-gray-500 font-medium mt-2">Curated healthcare guidance for your healthy pregnancy</p>
            </div>
            <Link to="/library" className="group flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-mamacare-teal hover:opacity-70 transition-all">
              View All Resources
              <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-10">
            {articles.length > 0 ? articles.map((a, i) => (
              <LibraryResource 
                key={a.id} 
                title={a.title} 
                category={a.category.toUpperCase()} 
                image={a.imageUrl} 
                index={i}
              />
            )) : (
              <>
                <LibraryResource 
                  title="The Third Trimester Diet: What to Eat" 
                  category="NUTRITION" 
                  image="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600" 
                  index={0}
                />
                <LibraryResource 
                  title="Pregnancy Safety: Gentle Movement Guide" 
                  category="SAFETY" 
                  image="https://images.unsplash.com/photo-1518611012118-2969c63b07b7?auto=format&fit=crop&q=80&w=600" 
                  index={1}
                />
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
