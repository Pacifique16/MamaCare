import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { prescriptionsApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { Pill, Clock, User, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Prescriptions = () => {
  const { user } = useAuth();
  const motherId = user?.motherId;
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!motherId) return;
    prescriptionsApi.getAll({ motherId })
      .then(r => {
        setPrescriptions(r.data);
        // Mark all as seen
        localStorage.setItem(`seen_rx_${motherId}`, String(r.data.length));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [motherId]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-poppins flex flex-col">
      <Navbar />
      <main className="pt-32 pb-20 max-w-3xl mx-auto px-4 flex-1 w-full">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-[#005C5C] transition-colors mb-6">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Pill size={20} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">My Prescriptions</h1>
            <p className="text-gray-400 text-sm">Medicines prescribed by your doctor</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => <div key={i} className="h-28 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Pill size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="font-bold text-gray-400">No prescriptions yet.</p>
            <p className="text-sm text-gray-400 mt-1">Your doctor will add prescriptions here after your visit.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                      <Pill size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg">{p.medicineName}</h3>
                      <p className="text-purple-600 font-bold text-sm">{p.dosage}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(p.issuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Frequency</p>
                    <p className="text-sm font-bold text-gray-900">{p.frequency}</p>
                  </div>
                  {p.duration && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                      <p className="text-sm font-bold text-gray-900">{p.duration}</p>
                    </div>
                  )}
                </div>

                {p.notes && (
                  <div className="mt-3 bg-yellow-50 rounded-xl p-3 border border-yellow-100">
                    <p className="text-xs font-bold text-yellow-700">📋 Note: {p.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                  <User size={13} className="text-gray-400" />
                  <p className="text-xs text-gray-400 font-medium">Prescribed by <span className="font-bold text-gray-600">{p.doctorName}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Prescriptions;
