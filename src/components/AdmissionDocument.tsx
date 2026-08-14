'use client'

import { Admission } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface AdmissionDocumentProps {
  admission: Admission
}

export default function AdmissionDocument({ admission }: AdmissionDocumentProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  useEffect(() => {
    // Generate static QR code for phone number +252 68 6913144
    QRCode.toDataURL('+252 68 6913144', {
      width: 120,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    }).then(setQrCodeUrl)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div id="admission-document" className="bg-white w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 pb-4 mb-6 gap-4" style={{ borderColor: '#1e40af' }}>
        {/* Left Header */}
        <div className="text-left">
          <div className="flex items-center mb-2">
            {/* Qanciye Logo */}
            <img
              src="/Screenshot 2026-08-14 014030.png"
              alt="Qanciye Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain mr-3"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1e40af' }}>QANCIYE</h1>
              <p className="text-lg sm:text-xl font-semibold" style={{ color: '#374151' }}>ADMISSION</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm font-medium" style={{ color: '#6b7280' }}>YOUR FUTURE STARTS HERE</p>
        </div>

        {/* Right Header */}
        <div className="text-left sm:text-right">
          <div className="flex justify-start sm:justify-end gap-2 mb-2">
            {/* Somali and Turkish Flags */}
            <img
              src="/somalia-flag-combined-turkey-260nw-427541674.webp"
              alt="Somali and Turkish Flags"
              className="w-12 h-4 sm:w-16 sm:h-5 object-contain"
            />
          </div>
          <p className="text-base sm:text-lg font-bold" style={{ color: '#1e40af' }}>QANCIYE ADMISSION</p>
          <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>YOUR TRUSTED PARTNER</p>
          <p className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>FOR EDUCATION IN TURKEY</p>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <div className="h-1 w-12 sm:w-20" style={{ backgroundColor: '#1e40af' }}></div>
          <h2 className="text-lg sm:text-2xl font-bold mx-2 sm:mx-4" style={{ color: '#1f2937' }}>STUDENT INFORMATION FORM</h2>
          <div className="h-1 w-12 sm:w-20" style={{ backgroundColor: '#1e40af' }}></div>
        </div>
      </div>

      {/* Student Information Section */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-6">
        {/* Left: Information Fields */}
        <div className="flex-1 space-y-3 sm:space-y-4">
          {/* Full Name */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded flex items-center justify-center mr-3" style={{ backgroundColor: '#dbeafe' }}>
              <span className="text-sm">👤</span>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase" style={{ color: '#6b7280' }}>Full Name</p>
              <p className="font-semibold" style={{ color: '#111827' }}>{admission.full_name}</p>
            </div>
          </div>

          {/* Mother's Name */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded flex items-center justify-center mr-3" style={{ backgroundColor: '#dbeafe' }}>
              <span className="text-sm">👩</span>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase" style={{ color: '#6b7280' }}>Mother's Name</p>
              <p className="font-semibold" style={{ color: '#111827' }}>{admission.mother_name}</p>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded flex items-center justify-center mr-3" style={{ backgroundColor: '#dbeafe' }}>
              <span className="text-sm">📅</span>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase" style={{ color: '#6b7280' }}>Date of Birth</p>
              <p className="font-semibold" style={{ color: '#111827' }}>{formatDate(admission.date_of_birth)}</p>
            </div>
          </div>

          {/* Customer Number */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded flex items-center justify-center mr-3" style={{ backgroundColor: '#dbeafe' }}>
              <span className="text-sm">#</span>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase" style={{ color: '#6b7280' }}>Customer Number</p>
              <p className="font-semibold" style={{ color: '#111827' }}>{admission.customer_number}</p>
            </div>
          </div>

          {/* Gender */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded flex items-center justify-center mr-3" style={{ backgroundColor: '#dbeafe' }}>
              <span className="text-sm">⚧</span>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase" style={{ color: '#6b7280' }}>Gender</p>
              <p className="font-semibold" style={{ color: '#111827' }}>{admission.gender}</p>
            </div>
          </div>

          {/* Place of Birth */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded flex items-center justify-center mr-3" style={{ backgroundColor: '#dbeafe' }}>
              <span className="text-sm">📍</span>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase" style={{ color: '#6b7280' }}>Place of Birth</p>
              <p className="font-semibold" style={{ color: '#111827' }}>{admission.place_of_birth}</p>
            </div>
          </div>

          {/* National ID */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded flex items-center justify-center mr-3" style={{ backgroundColor: '#dbeafe' }}>
              <span className="text-sm">🆔</span>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase" style={{ color: '#6b7280' }}>National ID</p>
              <p className="font-semibold" style={{ color: '#111827' }}>{admission.national_id}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded flex items-center justify-center mr-3" style={{ backgroundColor: '#dbeafe' }}>
              <span className="text-sm">🏠</span>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase" style={{ color: '#6b7280' }}>Address</p>
              <p className="font-semibold" style={{ color: '#111827' }}>{admission.address}</p>
            </div>
          </div>

          {/* More Details */}
          {admission.more_details && (
            <div className="flex items-start">
              <div className="w-8 h-8 rounded flex items-center justify-center mr-3 mt-1" style={{ backgroundColor: '#dbeafe' }}>
                <span className="text-sm">📝</span>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase" style={{ color: '#6b7280' }}>More Details</p>
                <p className="font-semibold whitespace-pre-wrap" style={{ color: '#111827' }}>{admission.more_details}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Student Photo */}
        <div className="w-full lg:w-48 flex-shrink-0">
          <div className="border-4 rounded-lg p-2" style={{ borderColor: '#1e40af', backgroundColor: '#f9fafb' }}>
            {admission.student_photo_url ? (
              <img
                src={admission.student_photo_url}
                alt="Student Photo"
                className="w-full h-48 sm:h-56 object-cover rounded"
                onError={(e) => {
                  console.error('Failed to load student photo:', admission.student_photo_url)
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            {!admission.student_photo_url && (
              <div className="w-full h-48 sm:h-56 rounded flex items-center justify-center" style={{ backgroundColor: '#e5e7eb' }}>
                <span className="text-sm" style={{ color: '#9ca3af' }}>No Photo</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Box */}
      <div className="border-2 rounded-lg p-3 sm:p-4 mb-6" style={{ borderColor: '#1e40af', backgroundColor: '#eff6ff' }}>
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: '#1e40af' }}>
            <span className="text-white text-lg">✓</span>
          </div>
          <div>
            <p className="font-bold mb-1 text-sm sm:text-base" style={{ color: '#1e3a8a' }}>VERIFICATION INFORMATION</p>
            <p className="text-xs sm:text-sm" style={{ color: '#374151' }}>
              This admission document is officially issued by Qanciye Admission. All student information has been verified and recorded in our system.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="border-t-2 pt-4 mb-6" style={{ borderColor: '#e5e7eb' }}>
        <h3 className="font-bold mb-3 text-sm sm:text-base" style={{ color: '#1f2937' }}>CONTACT US</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <p style={{ color: '#4b5563' }}>📞 Phone: +252 68 6913144</p>
            <p style={{ color: '#4b5563' }}>📧 Email: info@qanciye.com</p>
          </div>
          <div>
            <p style={{ color: '#4b5563' }}>🌐 Website: www.qanciye.com</p>
            <p style={{ color: '#4b5563' }}>📍 Turkey & Somalia</p>
          </div>
        </div>
      </div>

      {/* Prepared By Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div className="flex-1">
          <h3 className="font-bold mb-2 text-sm sm:text-base" style={{ color: '#1f2937' }}>PREPARED BY</h3>
          <p className="font-semibold text-sm sm:text-base" style={{ color: '#111827' }}>Qanciye Admission</p>
          <p className="text-xs sm:text-sm mt-1" style={{ color: '#4b5563' }}>DATE: {formatDate(admission.created_at)}</p>
          <div className="mt-4 border-t pt-2" style={{ borderColor: '#d1d5db' }}>
            <p className="text-xs sm:text-sm" style={{ color: '#4b5563' }}>SIGNATURE & STAMP</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="text-center sm:text-right">
          {qrCodeUrl && (
            <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24 sm:w-32 sm:h-32 mx-auto sm:mx-0" />
          )}
          <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Scan to contact</p>
        </div>
      </div>

      {/* Bottom Service Bar */}
      <div className="rounded-lg p-3 sm:p-4 mb-6" style={{ backgroundColor: '#1e40af' }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center text-white">
          <div>
            <div className="text-xl sm:text-2xl mb-1">🎓</div>
            <p className="text-xs sm:text-sm font-semibold">UNIVERSITY ADMISSION</p>
          </div>
          <div>
            <div className="text-xl sm:text-2xl mb-1">🛂</div>
            <p className="text-xs sm:text-sm font-semibold">VISA SUPPORT</p>
          </div>
          <div>
            <div className="text-xl sm:text-2xl mb-1">🏨</div>
            <p className="text-xs sm:text-sm font-semibold">ACCOMMODATION SUPPORT</p>
          </div>
          <div>
            <div className="text-xl sm:text-2xl mb-1">✈️</div>
            <p className="text-xs sm:text-sm font-semibold">AIRPORT PICK-UP</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t-2 pt-4" style={{ borderColor: '#1e40af' }}>
        <p className="text-lg sm:text-xl font-bold" style={{ color: '#1e40af' }}>YOUR FUTURE STARTS HERE</p>
      </div>
    </div>
  )
}
