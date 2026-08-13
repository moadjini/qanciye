'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Admission } from '@/lib/supabase'
import { Search, Eye, Edit, Trash2, Copy, FileText, Download, Printer } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function AdmissionsPage() {
  const router = useRouter()
  const [admissions, setAdmissions] = useState<Admission[]>([])
  const [filteredAdmissions, setFilteredAdmissions] = useState<Admission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchAdmissions()
  }, [])

  useEffect(() => {
    filterAdmissions()
  }, [admissions, searchQuery, genderFilter])

  const fetchAdmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAdmissions(data || [])
    } catch (error) {
      console.error('Error fetching admissions:', error)
      toast.error('Failed to load admissions')
    } finally {
      setLoading(false)
    }
  }

  const filterAdmissions = () => {
    let filtered = [...admissions]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(admission =>
        admission.full_name.toLowerCase().includes(query) ||
        admission.customer_number.toLowerCase().includes(query) ||
        admission.national_id.toLowerCase().includes(query) ||
        admission.place_of_birth.toLowerCase().includes(query)
      )
    }

    // Gender filter
    if (genderFilter) {
      filtered = filtered.filter(admission => admission.gender === genderFilter)
    }

    setFilteredAdmissions(filtered)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admissions')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Admission deleted successfully')
      setDeleteId(null)
      fetchAdmissions()
    } catch (error) {
      console.error('Error deleting admission:', error)
      toast.error('Failed to delete admission')
    }
  }

  const handleDuplicate = async (admission: Admission) => {
    try {
      const { error } = await supabase
        .from('admissions')
        .insert({
          full_name: admission.full_name,
          mother_name: admission.mother_name,
          date_of_birth: admission.date_of_birth,
          customer_number: admission.customer_number,
          gender: admission.gender,
          place_of_birth: admission.place_of_birth,
          national_id: admission.national_id,
          address: admission.address,
          student_photo_url: admission.student_photo_url,
          more_details: admission.more_details,
        })

      if (error) throw error

      toast.success('Admission duplicated successfully')
      fetchAdmissions()
    } catch (error) {
      console.error('Error duplicating admission:', error)
      toast.error('Failed to duplicate admission')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admissions</h1>
          <p className="text-gray-600">Manage all admission records</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, customer number, National ID, or place of birth..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white caret-gray-900 font-normal"
              style={{ WebkitTextFillColor: 'rgb(17, 24, 39)' }}
            />
          </div>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* Admissions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredAdmissions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">
              {admissions.length === 0 ? 'No admissions yet' : 'No admissions match your search'}
            </p>
            {admissions.length === 0 && (
              <button
                onClick={() => router.push('/dashboard/new')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Admission
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Place of Birth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAdmissions.map((admission) => (
                  <tr key={admission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {admission.student_photo_url ? (
                          <img
                            src={admission.student_photo_url}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-gray-500 text-xs">No photo</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{admission.full_name}</p>
                          <p className="text-sm text-gray-500">{admission.national_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {admission.customer_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {new Date(admission.date_of_birth).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {admission.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {admission.place_of_birth}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(admission.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => router.push(`/dashboard/admissions/${admission.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/admissions/${admission.id}/edit`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(admission)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(admission.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Admission?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this admission? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
