'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Admission } from '@/lib/supabase'
import Link from 'next/link'
import { PlusCircle, Users, Calendar, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisMonth: 0,
  })
  const [recentAdmissions, setRecentAdmissions] = useState<Admission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const thisMonth = new Date()
      thisMonth.setDate(1)
      thisMonth.setHours(0, 0, 0, 0)

      // Fetch total count
      const { count: totalCount } = await supabase
        .from('admissions')
        .select('*', { count: 'exact', head: true })

      // Fetch today's count
      const { count: todayCount } = await supabase
        .from('admissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

      // Fetch this month's count
      const { count: monthCount } = await supabase
        .from('admissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonth.toISOString())

      // Fetch recent admissions
      const { data: recentData } = await supabase
        .from('admissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        total: totalCount || 0,
        today: todayCount || 0,
        thisMonth: monthCount || 0,
      })
      setRecentAdmissions(recentData || [])
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to Qanciye Admission Management</p>
        </div>
        <Link
          href="/dashboard/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Admission
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Admissions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Admissions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.today}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.thisMonth}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Admissions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Admissions</h2>
        </div>
        {recentAdmissions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No admissions yet</p>
            <Link
              href="/dashboard/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Admission
            </Link>
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
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentAdmissions.map((admission) => (
                  <tr key={admission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {admission.student_photo_url && (
                          <img
                            src={admission.student_photo_url}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{admission.full_name}</p>
                          <p className="text-sm text-gray-500">{admission.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {admission.customer_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {new Date(admission.date_of_birth).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(admission.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
