import api from './axios'

export const mothersApi = {
  getAll: () => api.get('/mothers'),
  getById: (id) => api.get(`/mothers/${id}`),
  getVitals: (id) => api.get(`/mothers/${id}/vitals`),
  getAppointments: (id) => api.get(`/mothers/${id}/appointments`),
  getTriage: (id) => api.get(`/mothers/${id}/triage`),
  create: (data) => api.post('/mothers', data),
  update: (id, data) => api.put(`/mothers/${id}`, data),
  delete: (id) => api.delete(`/mothers/${id}`),
}

export const doctorsApi = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  getPatients: (id) => api.get(`/doctors/${id}/patients`),
  getPatientsByPriority: (id) => api.get(`/doctors/${id}/patients/priority`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  verify: (id) => api.patch(`/doctors/${id}/verify`),
  suspend: (id) => api.patch(`/doctors/${id}/suspend`),
  delete: (id) => api.delete(`/doctors/${id}`),
  getCertifications: (id) => api.get(`/doctors/${id}/certifications`),
  addCertification: (id, data) => api.post(`/doctors/${id}/certifications`, data),
  deleteCertification: (id, certId) => api.delete(`/doctors/${id}/certifications/${certId}`),
  getSchedule: (id) => api.get(`/doctors/${id}/schedule`),
  getActivity: (id) => api.get(`/doctors/${id}/activity`),
  resetPassword: (id, password) => api.patch(`/doctors/${id}/reset-password`, JSON.stringify(password), { headers: { 'Content-Type': 'application/json' } }),
}

export const appointmentsApi = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
}

export const patientAppointmentsApi = {
  getAll: (params) => api.get('/patient-appointments', { params }),
  getById: (id) => api.get(`/patient-appointments/${id}`),
  getByPatientId: (patientId) => api.get(`/patient-appointments/patient/${patientId}`),
  getDoctors: () => api.get('/patient-appointments/doctors'),
  getSlots: (doctorId, date, exclude) => api.get(`/patient-appointments/doctors/${doctorId}/slots`, { params: { date, exclude } }),
  create: (data) => api.post('/patient-appointments', data),
  update: (id, data) => api.put(`/patient-appointments/${id}`, data),
  delete: (id) => api.delete(`/patient-appointments/${id}`),
}

export const triageApi = {
  getAll: (params) => api.get('/triage', { params }),
  getById: (id) => api.get(`/triage/${id}`),
  create: (data) => api.post('/triage', data),
}

export const vitalsApi = {
  getAll: (params) => api.get('/vitals', { params }),
  create: (data) => api.post('/vitals', data),
  delete: (id) => api.delete(`/vitals/${id}`),
}

export const messagesApi = {
  getConversation: (motherId, doctorId) =>
    api.get('/messages', { params: { motherId, doctorId } }),
  getConversations: (doctorId) => api.get(`/messages/conversations/${doctorId}`),
  getMotherConversation: (motherId) => api.get(`/messages/mother/${motherId}`),
  send: (data) => api.post('/messages', data),
  markRead: (id) => api.patch(`/messages/${id}/read`),
}

export const libraryApi = {
  getAll: (params) => api.get('/library', { params }),
  getById: (id) => api.get(`/library/${id}`),
  create: (data) => api.post('/library', data),
  update: (id, data) => api.put(`/library/${id}`, data),
  delete: (id) => api.delete(`/library/${id}`),
}

export const settingsApi = {
  getProfile: () => api.get('/settings/profile'),
  updateProfile: (data) => api.put('/settings/profile', data),
  changePassword: (data) => api.put('/settings/password', data),
}

export const prescriptionsApi = {
  getAll: (params) => api.get('/prescriptions', { params }),
  create: (data) => api.post('/prescriptions', data),
  delete: (id) => api.delete(`/prescriptions/${id}`),
}

export const articleRequestsApi = {
  getAll: () => api.get('/article-requests'),
  create: (data) => api.post('/article-requests', data),
  updateStatus: (id, status) => api.patch(`/article-requests/${id}/status`, JSON.stringify(status), { headers: { 'Content-Type': 'application/json' } }),
}

export const contactMessagesApi = {
  getAll: () => api.get('/contact-messages'),
  markRead: (id) => api.patch(`/contact-messages/${id}/read`),
}

export const authApi = {
  login: (data) => api.post('/auth/login', data),
}

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getVerificationQueue: () => api.get('/admin/verification-queue'),
}
