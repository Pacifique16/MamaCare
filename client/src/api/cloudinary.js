const CLOUD_NAME = 'dulvd1yek'
const UPLOAD_PRESET = 'mamacare_uploads'
const CERT_UPLOAD_PRESET = 'mamacare_certs'

export async function uploadToCloudinary(file, resourceType = 'image') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error?.message || 'Upload failed')
  }
  const data = await res.json()
  return data.secure_url
}

export async function uploadCertToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CERT_UPLOAD_PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error?.message || 'Upload failed')
  }
  const data = await res.json()
  return data.secure_url
}

export function toViewableUrl(url) {
  return url ?? ''
}

export function downloadFile(url, fileName) {
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.target = '_blank'
  a.rel = 'noreferrer'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
