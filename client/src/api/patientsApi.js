import api from './axios'

export const getAllPatients = () => api.get('/patients')

export const getPatientById = (id) => api.get(`/patients/${id}`)

export const createPatient = (data) => api.post('/patients', data)

export const updatePatient = (id, data) => api.put(`/patients/${id}`, data)

export const deletePatient = (id) => api.delete(`/patients/${id}`)
