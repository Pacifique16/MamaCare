import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Section = ({ title, children }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    <div className="text-gray-600 font-medium leading-relaxed space-y-2">{children}</div>
  </div>
);

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-[#FAFAFA] font-poppins">
    <Navbar />
    <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto space-y-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-mamacare-teal transition-colors">
        <ChevronLeft size={16} /> Back to Home
      </Link>

      <div className="space-y-2">
        <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">Legal</span>
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Privacy Policy</h1>
        <p className="text-gray-400 text-sm">Last updated: April 2026</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 border border-white shadow-card space-y-8">
        <Section title="1. Information We Collect">
          <p>We collect personal information you provide during registration, including your full name, email address, phone number, and health-related data such as gestational week, weight, and medical history.</p>
          <p>We also collect usage data to improve our services, including pages visited and features used.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>Your information is used to provide personalized maternal healthcare support, connect you with verified doctors, and send appointment reminders and health alerts.</p>
          <p>We do not sell your personal data to third parties under any circumstances.</p>
        </Section>

        <Section title="3. Data Security">
          <p>All data is encrypted in transit using TLS and at rest using industry-standard encryption. Passwords are hashed using BCrypt and never stored in plain text.</p>
          <p>Access to your health data is restricted to you and the healthcare providers you choose to share it with.</p>
        </Section>

        <Section title="4. Your Rights">
          <p>You have the right to access, correct, or delete your personal data at any time through your account settings. You may also request a full export of your data by contacting our support team.</p>
        </Section>

        <Section title="5. Cookies">
          <p>We use session cookies to keep you logged in. We do not use tracking or advertising cookies.</p>
        </Section>

        <Section title="6. Contact Us">
          <p>For privacy-related inquiries, contact us at <span className="text-mamacare-teal font-bold">privacy@mamacare.app</span></p>
        </Section>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
