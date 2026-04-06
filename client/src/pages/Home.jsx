import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Home() {
  const [status, setStatus] = useState('')

  useEffect(() => {
    api.get('/test')
      .then(res => setStatus(res.data.message))
      .catch(() => setStatus('Could not connect to API'))
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>MamaCare</h1>
      <p>API Status: <strong>{status || 'Loading...'}</strong></p>
    </div>
  )
}
