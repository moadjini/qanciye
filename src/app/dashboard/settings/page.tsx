'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <p className="text-gray-900 text-sm">{user?.id}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application</label>
            <p className="text-gray-900">Qanciye Admission Management System</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <p className="text-gray-900">1.0.0</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h2>
        <p className="text-gray-600 mb-4">
          If you need assistance with the Qanciye Admission Management System, please contact our support team.
        </p>
        <div className="space-y-2 text-sm">
          <p className="text-gray-900">📞 Phone: +252 68 6913144</p>
          <p className="text-gray-900">📧 Email: info@qanciye.com</p>
          <p className="text-gray-900">🌐 Website: www.qanciye.com</p>
        </div>
      </div>
    </div>
  )
}
