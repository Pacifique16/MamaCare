import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
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
import TriageWizard from './pages/triage/TriageWizard';
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
import PatientAppointmentsPage from './pages/PatientAppointmentsPage';

import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OTPVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<ResetSuccess />} />
        <Route path="/contact" element={<Contact />} />

        {/* Mother Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Mother']} />}>
          <Route path="/onboarding/step-1" element={<OnboardingStep1 />} />
          <Route path="/onboarding/complete" element={<OnboardingSummary />} />
          <Route path="/dashboard" element={<MotherDashboard />} />
          
          {/* Triage Flow */}
          <Route path="/triage" element={<TriageWizard />} />
          <Route path="/triage/rest-monitor" element={<RestMonitor />} />

          {/* Library & Appointments */}
          <Route path="/library" element={<Library />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/rest-monitor" element={<RestMonitor />} />
        </Route>

        {/* Admin Protected Portal */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/doctors" element={<DoctorManagement />} />
          <Route path="/admin/edit-doctor/:id" element={<EditDoctor />} />
          <Route path="/admin/add-doctor" element={<AddDoctor />} />
        </Route>

        {/* Doctor Protected Portal */}
        <Route element={<ProtectedRoute allowedRoles={['Doctor']} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/patients" element={<PatientRoster />} />
          <Route path="/doctor/patients/:id" element={<PatientProfile />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/messaging" element={<Messaging />} />
        </Route>

        {/* Shared Management Portal (Admin & Doctor) */}
        <Route element={<ProtectedRoute allowedRoles={['Admin', 'Doctor']} />}>
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patient-appointments" element={<PatientAppointmentsPage />} />
        </Route>

        {/* Fallback routing */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
