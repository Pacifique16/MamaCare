const CLOUD_NAME = 'dulvd1yek'
const UPLOAD_PRESET = 'mamacare_uploads'

export async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('Image upload failed')
  const data = await res.json()
  return data.secure_url
}
