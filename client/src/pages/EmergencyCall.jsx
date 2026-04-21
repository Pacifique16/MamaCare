import { Phone, AlertCircle, Heart, MapPin, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const EmergencyCall = () => (
  <div className="min-h-screen bg-[#FAFAFA] font-poppins">
    <Navbar />
    <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto space-y-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-mamacare-teal transition-colors">
        <ChevronLeft size={16} /> Back to Home
      </Link>

      <div className="space-y-2">
        <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.25em]">Urgent Care</span>
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Emergency Call</h1>
        <p className="text-gray-500 font-medium">If you are experiencing a medical emergency, call immediately.</p>
      </div>

      {/* Emergency Banner */}
      <a href="tel:+250789534491" className="bg-red-500 rounded-[2.5rem] p-10 text-white flex items-center justify-between gap-6 hover:bg-red-600 transition-all">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-red-100">Emergency Hotline</p>
          <h2 className="text-5xl font-black tracking-tight">+250 789 534 491</h2>
          <p className="text-red-100 font-medium text-sm">Available 24/7 · Maternal Emergency Line</p>
        </div>
        <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center shrink-0">
          <Phone size={36} className="text-white" fill="white" />
        </div>
      </a>

      {/* Warning Signs */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-white shadow-card space-y-6">
        <div className="flex items-center gap-3">
          <AlertCircle size={20} className="text-red-500" />
          <h3 className="text-xl font-bold text-gray-900">Call immediately if you experience:</h3>
        </div>
        <ul className="space-y-3">
          {[
            'Severe headache that won\'t go away',
            'Sudden swelling of face, hands, or feet',
            'Blurred or double vision',
            'Heavy vaginal bleeding',
            'Severe abdominal pain or cramping',
            'Baby not moving for more than 2 hours',
            'High fever above 38.5°C (101.3°F)',
            'Difficulty breathing or chest pain',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700 font-medium">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Other Contacts */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { label: 'Kigali University Hospital', number: '+250 788 301 000', icon: Heart, color: 'bg-teal-50 text-mamacare-teal' },
          { label: 'Rwanda Emergency Services', number: '912', icon: MapPin, color: 'bg-orange-50 text-orange-500' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-[2rem] p-8 border border-white shadow-card flex items-center gap-5">
            <div className={`w-14 h-14 ${c.color} rounded-2xl flex items-center justify-center shrink-0`}>
              <c.icon size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">{c.label}</p>
              <p className="text-mamacare-teal font-black text-lg">{c.number}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default EmergencyCall;
