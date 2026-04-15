import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : `${import.meta.env.VITE_API_URL}/api`,
  // baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const user = localStorage.getItem('mamacare_user')
  if (user) {
    const parsed = JSON.parse(user)
    if (parsed?.token) config.headers.Authorization = `Bearer ${parsed.token}`
  }
  return config
})

export default api
