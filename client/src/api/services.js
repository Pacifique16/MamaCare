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
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  verify: (id) => api.patch(`/doctors/${id}/verify`),
  suspend: (id) => api.patch(`/doctors/${id}/suspend`),
  delete: (id) => api.delete(`/doctors/${id}`),
}

export const appointmentsApi = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
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

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getVerificationQueue: () => api.get('/admin/verification-queue'),
}
