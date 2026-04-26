import React, {heart, useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DashboardHero from '../components/dashboard/DashboardHero';
import TriageCard from '../components/dashboard/TriageCard';
import AppointmentCard from '../components/dashboard/AppointmentCard';
import LibraryResource from '../components/dashboard/LibraryResource';
import { ArrowRight, Phone, ChevronRight, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mothersApi, vitalsApi, appointmentsApi, libraryApi, triageApi } from '../api/services';

import PregnancyChatbot from '../components/PregnancyChatbot';

const MotherDashboard = () => {
  const { user } = useAuth();
  const motherId = user?.motherId || 1;

  const [mother, setMother] = useState(() => {
    const cached = sessionStorage.getItem(`mother_${user?.motherId || 1}`);
    return cached ? JSON.parse(cached) : null;
  });
  const [vitals, setVitals] = useState([]);
  const [nextAppt, setNextAppt] = useState(null);
  const [articles, setArticles] = useState([]);
  const [triageHistory, setTriageHistory] = useState([]);
  const [showAllTriage, setShowAllTriage] = useState(false);
  const [expandedTriage, setExpandedTriage] = useState(null);

  useEffect(() => {
    const MOTHER_KEY = `mother_${motherId}`;
    const cachedMother = sessionStorage.getItem(MOTHER_KEY);
    if (cachedMother) {
      setMother(JSON.parse(cachedMother));
    } else {
      mothersApi.getById(motherId)
        .then(r => { setMother(r.data); sessionStorage.setItem(MOTHER_KEY, JSON.stringify(r.data)); })
        .catch(() => {});
    }
    triageApi.getAll({ motherId }).then(r => setTriageHistory(r.data || [])).catch(() => {});
    appointmentsApi.getAll({ motherId }).then(r => {
      const upcoming = r.data.find(a => a.status !== 'Completed' && a.status !== 'Cancelled');
      setNextAppt(upcoming || null);
    }).catch(() => {});
    const CACHE_KEY = 'library_articles';
    const cachedArticles = sessionStorage.getItem(CACHE_KEY);
    if (cachedArticles) {
      setArticles(JSON.parse(cachedArticles).slice(0, 2));
    } else {
      libraryApi.getAll({ status: 'Published' })
        .then(r => { setArticles(r.data.slice(0, 2)); sessionStorage.setItem(CACHE_KEY, JSON.stringify(r.data)); })
        .catch(() => {});
    }
  }, [motherId]);

  // No metrics display, only keeping minimal data fetching

  return (
    <div className="min-h-screen bg-[#fafafa] font-poppins pb-4">
      <Navbar />
      <main className="pt-32 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        <DashboardHero userName={mother?.fullName?.split(' ')[0] || ''} week={mother?.gestationalWeek || 28} />

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

        {/* Triage History */}
        {triageHistory.length > 0 && (
          <section className="space-y-6">
            <div className="flex justify-between items-end px-2">
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 font-headline leading-none">Your Triage History</h2>
                <p className="text-gray-500 font-medium mt-2">Your recent symptom assessments</p>
              </div>
              <Link to="/triage" className="group flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-mamacare-teal hover:opacity-70 transition-all">
                New Assessment <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="space-y-2">
              {(showAllTriage ? triageHistory : triageHistory.slice(0, 5)).map(t => {
                const riskColor = t.riskLevel === 'High' ? 'text-red-500 bg-red-50 border-red-100'
                  : t.riskLevel === 'Medium' ? 'text-orange-400 bg-orange-50 border-orange-100'
                  : 'text-teal-600 bg-teal-50 border-teal-100';
                const isExpanded = expandedTriage === t.id;
                return (
                  <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button onClick={() => setExpandedTriage(isExpanded ? null : t.id)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0 ${riskColor}`}>{t.riskLevel} Risk</span>
                        <span className="text-xs text-gray-500 font-medium truncate">{t.aiRecommendation}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold shrink-0">{new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-50 space-y-1">
                        <p className="text-sm text-gray-600 leading-relaxed">{t.aiRecommendation}</p>
                        {t.bloodPressureSystolic && (
                          <p className="text-[10px] text-gray-400 font-bold">BP: {t.bloodPressureSystolic}/{t.bloodPressureDiastolic} mmHg{t.temperature ? ` · Temp: ${t.temperature}°C` : ''}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {triageHistory.length > 5 && (
              <button onClick={() => setShowAllTriage(p => !p)}
                className="mt-3 w-full text-center text-xs font-bold text-mamacare-teal hover:underline">
                {showAllTriage ? 'Show less' : `View all ${triageHistory.length} sessions`}
              </button>
            )}
          </section>
        )}

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
      <PregnancyChatbot />
    </div>
  );
};

export default MotherDashboard;
