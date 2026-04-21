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

const TermsOfService = () => (
  <div className="min-h-screen bg-[#FAFAFA] font-poppins">
    <Navbar />
    <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto space-y-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-mamacare-teal transition-colors">
        <ChevronLeft size={16} /> Back to Home
      </Link>

      <div className="space-y-2">
        <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">Legal</span>
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Terms of Service</h1>
        <p className="text-gray-400 text-sm">Last updated: April 2026</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 border border-white shadow-card space-y-8">
        <Section title="1. Acceptance of Terms">
          <p>By creating an account and using MamaCare, you agree to these Terms of Service. If you do not agree, please do not use the platform.</p>
        </Section>

        <Section title="2. Medical Disclaimer">
          <p>MamaCare is a digital health support platform and is <strong>not a substitute for professional medical advice, diagnosis, or treatment.</strong></p>
          <p>Always seek the advice of your physician or qualified health provider with any questions you may have regarding a medical condition. In case of emergency, call your local emergency services immediately.</p>
        </Section>

        <Section title="3. User Accounts">
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.</p>
          <p>Mothers register directly. Doctor and Admin accounts are created by system administrators only.</p>
        </Section>

        <Section title="4. Acceptable Use">
          <p>You agree not to misuse the platform, including but not limited to: providing false health information, impersonating healthcare professionals, or attempting to access other users' data.</p>
        </Section>

        <Section title="5. Healthcare Provider Responsibilities">
          <p>Doctors using MamaCare must hold valid medical licenses and are solely responsible for the clinical advice they provide. MamaCare verifies credentials but does not guarantee the accuracy of medical advice given by providers.</p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>All content, design, and technology on MamaCare is owned by MamaCare and protected by copyright law. You may not reproduce or distribute any part of the platform without written permission.</p>
        </Section>

        <Section title="7. Termination">
          <p>We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a risk to other users.</p>
        </Section>

        <Section title="8. Changes to Terms">
          <p>We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
        </Section>

        <Section title="9. Contact">
          <p>For legal inquiries, contact us at <span className="text-mamacare-teal font-bold">legal@mamacare.app</span></p>
        </Section>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;
