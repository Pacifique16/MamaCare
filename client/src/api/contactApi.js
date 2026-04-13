import api from './axios'

export const submitContactMessage = (data) => api.post('/contact-messages', data)
