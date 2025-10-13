'use client'

import { useEffect, useState } from 'react'
import { analyticsApi, type AnalyticsDashboard } from '@/lib/api/client/config/interceptors/auth/token/analyticsApi'
import DashboardLayout from '@/components/ui/layout/sidebar/navigation/items/menu/handlers/DashboardLayout'

export default function AnalyticsDashboardPage() {
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const response = await analyticsApi.getDashboard()
      setDashboard(response.data)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
      alert('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform insights and metrics</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : dashboard ? (
          <>
            {/* Users Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">👥</span> Users
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{dashboard.users.total}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Active Users</p>
                  <p className="text-3xl font-bold text-green-600">{dashboard.users.active}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">New This Month</p>
                  <p className="text-3xl font-bold text-purple-600">{dashboard.users.new_this_month}</p>
                </div>
              </div>
            </div>

            {/* Jobs & Internships */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💼</span> Jobs
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Jobs</span>
                    <span className="text-2xl font-bold text-blue-600">{dashboard.jobs.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Jobs</span>
                    <span className="text-2xl font-bold text-green-600">{dashboard.jobs.active}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Applications</span>
                    <span className="text-2xl font-bold text-purple-600">{dashboard.jobs.applications}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🎓</span> Internships
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Internships</span>
                    <span className="text-2xl font-bold text-blue-600">{dashboard.internships.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Internships</span>
                    <span className="text-2xl font-bold text-green-600">{dashboard.internships.active}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Applications</span>
                    <span className="text-2xl font-bold text-purple-600">{dashboard.internships.applications}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Articles Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">📚</span> Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Total Articles</p>
                  <p className="text-3xl font-bold text-blue-600">{dashboard.articles.total}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Published</p>
                  <p className="text-3xl font-bold text-green-600">{dashboard.articles.published}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Total Views</p>
                  <p className="text-3xl font-bold text-purple-600">{dashboard.articles.total_views}</p>
                </div>
              </div>
            </div>

            {/* Career Tools & Gemini AI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🛠️</span> Career Tools
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Usage</span>
                    <span className="text-2xl font-bold text-blue-600">{dashboard.career_tools.total_usage}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Popular Tool</span>
                    <span className="text-lg font-bold text-green-600">{dashboard.career_tools.popular_tool}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow p-6 text-white">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span> Gemini AI Usage
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-100">Total Calls</span>
                    <span className="text-2xl font-bold">{dashboard.gemini_usage.total_calls}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-100">Total Tokens</span>
                    <span className="text-2xl font-bold">{dashboard.gemini_usage.total_tokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-100">Est. Cost</span>
                    <span className="text-2xl font-bold">${dashboard.gemini_usage.cost_estimate.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">No analytics data available</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
