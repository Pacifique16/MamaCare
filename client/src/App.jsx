import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import OTPVerify from './pages/OTPVerify';
import ResetPassword from './pages/ResetPassword';
import ResetSuccess from './pages/ResetSuccess';
import Contact from './pages/Contact';
import OnboardingStep1 from './pages/OnboardingStep1';
import OnboardingSummary from './pages/OnboardingSummary';
import MotherDashboard from './pages/MotherDashboard';
import SymptomProfile from './pages/triage/SymptomProfile';
import SeverityDuration from './pages/triage/SeverityDuration';
import VitalsClinical from './pages/triage/VitalsClinical';
import AnalysisResults from './pages/triage/AnalysisResults';
import Library from './pages/Library';
import Appointments from './pages/Appointments';
import RestMonitor from './pages/RestMonitor';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorManagement from './pages/admin/DoctorManagement';
import EditDoctor from './pages/admin/EditDoctor';
import AddDoctor from './pages/admin/AddDoctor';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientRoster from './pages/doctor/PatientRoster';
import PatientProfile from './pages/doctor/PatientProfile';
import DoctorAppointments from './pages/doctor/Appointments';
import Messaging from './pages/doctor/Messaging'
import PatientsPage from './pages/PatientsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OTPVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<ResetSuccess />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/onboarding/step-1" element={<OnboardingStep1 />} />
        <Route path="/onboarding/complete" element={<OnboardingSummary />} />
        <Route path="/dashboard" element={<MotherDashboard />} />

        {/* Triage Flow */}
        <Route path="/triage/symptom-profile" element={<SymptomProfile />} />
        <Route path="/triage/severity-duration" element={<SeverityDuration />} />
        <Route path="/triage/vitals-clinical" element={<VitalsClinical />} />
        <Route path="/triage/analysis-results" element={<AnalysisResults />} />
        <Route path="/triage/rest-monitor" element={<RestMonitor />} />

        {/* Library & Appointments */}
        <Route path="/library" element={<Library />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/rest-monitor" element={<RestMonitor />} />

        {/* Admin Portal */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctors" element={<DoctorManagement />} />
        <Route path="/admin/edit-doctor" element={<EditDoctor />} />
        <Route path="/admin/add-doctor" element={<AddDoctor />} />

        {/* Doctor Portal */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/patients" element={<PatientRoster />} />
        <Route path="/doctor/patients/:id" element={<PatientProfile />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/messaging" element={<Messaging />} />

        <Route path="/patients" element={<PatientsPage />} />

        <Route path="/" element={<Navigate to="/signup" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
