'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { Upload, X } from 'lucide-react'

export default function NewAdmissionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    full_name: '',
    mother_name: '',
    date_of_birth: '',
    customer_number: '',
    gender: '',
    place_of_birth: '',
    national_id: '',
    address: '',
    more_details: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a JPG, JPEG, PNG, or WEBP image')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required'
    if (!formData.mother_name.trim()) newErrors.mother_name = 'Mother\'s name is required'
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required'
    if (!formData.customer_number.trim()) newErrors.customer_number = 'Customer number is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.place_of_birth.trim()) newErrors.place_of_birth = 'Place of birth is required'
    if (!formData.national_id.trim()) newErrors.national_id = 'National ID is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      let photoUrl: string | null = null

      // Upload photo if provided
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        console.log('Uploading photo:', { fileName, filePath, fileSize: photoFile.size })

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('student-photos')
          .upload(filePath, photoFile)

        if (uploadError) {
          console.error('Photo upload error:', uploadError)
          throw new Error(`Photo upload failed: ${uploadError.message}`)
        }

        console.log('Photo uploaded successfully:', uploadData)

        const { data: { publicUrl } } = supabase.storage
          .from('student-photos')
          .getPublicUrl(filePath)

        console.log('Public URL:', publicUrl)
        photoUrl = publicUrl
      }

      // Insert admission record
      const { error: insertError, data: insertData } = await supabase
        .from('admissions')
        .insert({
          full_name: formData.full_name,
          mother_name: formData.mother_name,
          date_of_birth: formData.date_of_birth,
          customer_number: formData.customer_number,
          gender: formData.gender,
          place_of_birth: formData.place_of_birth,
          national_id: formData.national_id,
          address: formData.address,
          student_photo_url: photoUrl,
          more_details: formData.more_details || null,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Insert error:', insertError)
        throw insertError
      }

      console.log('Admission saved:', insertData)
      toast.success('Admission saved successfully')

      // Navigate to admissions list
      router.push('/dashboard/admissions')
    } catch (error: any) {
      console.error('Error saving admission:', error)
      toast.error(error.message || 'Failed to save admission')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <style>{`
        input::placeholder {
          color: #A9A9A9 !important;
          opacity: 1 !important;
        }
        textarea::placeholder {
          color: #A9A9A9 !important;
          opacity: 1 !important;
        }
        select {
          color: #111827 !important;
        }
        select option {
          color: #111827 !important;
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Admission</h1>
          <p className="text-gray-600">Create a new admission record</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Student Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Photo
          </label>
          <div className="flex items-start space-x-4">
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">No photo</span>
              </div>
            )}
            <div className="flex-1">
              <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-sm text-gray-700">Upload Photo</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                JPG, JPEG, PNG, or WEBP. Max 5MB.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.full_name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
          </div>

          {/* Mother's Name */}
          <div>
            <label htmlFor="mother_name" className="block text-sm font-medium text-gray-700 mb-2">
              Mother's Name *
            </label>
            <input
              id="mother_name"
              name="mother_name"
              type="text"
              value={formData.mother_name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.mother_name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.mother_name && <p className="text-red-500 text-sm mt-1">{errors.mother_name}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
          </div>

          {/* Customer Number */}
          <div>
            <label htmlFor="customer_number" className="block text-sm font-medium text-gray-700 mb-2">
              Customer Number *
            </label>
            <input
              id="customer_number"
              name="customer_number"
              type="text"
              value={formData.customer_number}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.customer_number ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.customer_number && <p className="text-red-500 text-sm mt-1">{errors.customer_number}</p>}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          {/* Place of Birth */}
          <div>
            <label htmlFor="place_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
              Place of Birth *
            </label>
            <input
              id="place_of_birth"
              name="place_of_birth"
              type="text"
              value={formData.place_of_birth}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.place_of_birth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.place_of_birth && <p className="text-red-500 text-sm mt-1">{errors.place_of_birth}</p>}
          </div>

          {/* National ID */}
          <div>
            <label htmlFor="national_id" className="block text-sm font-medium text-gray-700 mb-2">
              National ID *
            </label>
            <input
              id="national_id"
              name="national_id"
              type="text"
              value={formData.national_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.national_id ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.national_id && <p className="text-red-500 text-sm mt-1">{errors.national_id}</p>}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>
        </div>

        {/* More Details */}
        <div>
          <label htmlFor="more_details" className="block text-sm font-medium text-gray-700 mb-2">
            More Details
          </label>
          <textarea
            id="more_details"
            name="more_details"
            value={formData.more_details}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-normal"
            placeholder="Additional information about the student..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {loading ? 'Saving...' : 'Save Admission'}
          </button>
        </div>
      </form>
    </div>
  )
}
