import api from './axios'

export const getAllAppointments = () => api.get('/patient-appointments')

export const getAppointmentById = (id) => api.get(`/patient-appointments/${id}`)

export const getAppointmentsByPatient = (patientId) =>
  api.get(`/patient-appointments/patient/${patientId}`)

export const getVerifiedDoctors = () => api.get('/patient-appointments/doctors')

export const getAvailableSlots = (doctorId, date, excludeId = null) => {
  const params = { date }
  if (excludeId) params.exclude = excludeId
  return api.get(`/patient-appointments/doctors/${doctorId}/slots`, { params })
}

export const createAppointment = (data) => api.post('/patient-appointments', data)

export const updateAppointment = (id, data) => api.put(`/patient-appointments/${id}`, data)

export const deleteAppointment = (id) => api.delete(`/patient-appointments/${id}`)
