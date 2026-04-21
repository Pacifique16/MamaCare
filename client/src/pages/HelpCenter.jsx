import { ChevronLeft, ChevronDown, ChevronUp, Search, MessageSquare, BookOpen, Calendar, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const faqs = [
  { q: 'How do I book an appointment?', a: 'Go to the Appointments page, select a date, time, visit reason, and choose a verified doctor. Click "Confirm Booking" to save your appointment.' },
  { q: 'How do I know if my appointment was confirmed?', a: 'After booking, your appointment will show as "Scheduled". Once the doctor reviews and approves it, the status changes to "Confirmed". You will also see a notification in the bell icon if it gets cancelled.' },
  { q: 'Can I cancel an appointment?', a: 'Currently, you can contact your doctor directly through the messaging feature to request a cancellation. The doctor can then update the appointment status.' },
  { q: 'How do I use the Triage feature?', a: 'Click "Triage" in the navigation. Select your symptoms, rate their severity, enter your vitals if available, and our system will provide a clinical recommendation.' },
  { q: 'How do I update my profile?', a: 'Click your avatar in the top right corner and select "Settings". You can update your name, email, phone number, profile photo, and password.' },
  { q: 'Is my health data private?', a: 'Yes. Your data is encrypted and only accessible to you and the healthcare providers you choose. We never sell your data. See our Privacy Policy for full details.' },
  { q: 'How do I contact a doctor?', a: 'Use the Messaging feature available in your dashboard to send secure messages to your assigned doctor.' },
  { q: 'What should I do in a medical emergency?', a: 'Call our emergency line immediately at +250 788 000 911. Do not rely on the app for emergencies — call for help first.' },
];

const FAQ = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-50 last:border-0">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between py-5 text-left gap-4">
        <span className="font-bold text-gray-900">{q}</span>
        {open ? <ChevronUp size={18} className="text-mamacare-teal shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
      </button>
      {open && <p className="pb-5 text-gray-600 font-medium leading-relaxed text-sm">{a}</p>}
    </div>
  );
};

const HelpCenter = () => (
  <div className="min-h-screen bg-[#FAFAFA] font-poppins">
    <Navbar />
    <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto space-y-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-mamacare-teal transition-colors">
        <ChevronLeft size={16} /> Back to Home
      </Link>

      <div className="space-y-2">
        <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">Support</span>
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Help Center</h1>
        <p className="text-gray-500 font-medium">Find answers to common questions about MamaCare.</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: 'Appointments', color: 'bg-teal-50 text-mamacare-teal' },
          { icon: Shield, label: 'Triage', color: 'bg-red-50 text-red-500' },
          { icon: MessageSquare, label: 'Messaging', color: 'bg-blue-50 text-blue-500' },
          { icon: BookOpen, label: 'Library', color: 'bg-purple-50 text-purple-500' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-2xl p-6 border border-white shadow-card flex flex-col items-center gap-3 text-center">
            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
              <item.icon size={22} />
            </div>
            <p className="font-bold text-gray-900 text-sm">{item.label}</p>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-white shadow-card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="divide-y divide-gray-50">
          {faqs.map((faq, i) => <FAQ key={i} {...faq} />)}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-mamacare-teal rounded-[2.5rem] p-10 text-white text-center space-y-4">
        <h3 className="text-2xl font-bold">Still need help?</h3>
        <p className="text-teal-100 font-medium">Our support team is available Monday–Friday, 8am–6pm.</p>
        <a href="mailto:support@mamacare.app" className="inline-block bg-white text-mamacare-teal font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-lg">
          Email Support
        </a>
      </div>
    </main>
    <Footer />
  </div>
);

export default HelpCenter;
