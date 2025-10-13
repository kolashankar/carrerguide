'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { BookOpen, Code, FileText, Building2, TrendingUp } from 'lucide-react'

export default function DSADashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [topics, questions, sheets, companies] = await Promise.all([
        axios.get('/api/admin/dsa/topics/stats'),
        axios.get('/api/admin/dsa/questions/stats/difficulty'),
        axios.get('/api/admin/dsa/sheets/stats'),
        axios.get('/api/admin/dsa/companies/stats')
      ])

      setStats({
        topics: topics.data.data,
        questions: questions.data.data,
        sheets: sheets.data.data,
        companies: companies.data.data
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="text-lg text-gray-600">Loading dashboard...</div></div>
  }

  const difficultyData = stats?.questions?.difficulty_breakdown ? [
    { name: 'Easy', value: stats.questions.difficulty_breakdown.easy || 0 },
    { name: 'Medium', value: stats.questions.difficulty_breakdown.medium || 0 },
    { name: 'Hard', value: stats.questions.difficulty_breakdown.hard || 0 }
  ] : []

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">DSA Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <BookOpen size={32} />
            <span className="text-3xl font-bold">{stats?.topics?.total_topics || 0}</span>
          </div>
          <div className="text-lg">Topics</div>
          <div className="text-sm opacity-80">{stats?.topics?.active_topics || 0} active</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <Code size={32} />
            <span className="text-3xl font-bold">{stats?.questions?.total_questions || 0}</span>
          </div>
          <div className="text-lg">Questions</div>
          <div className="text-sm opacity-80">{stats?.questions?.published_questions || 0} published</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <FileText size={32} />
            <span className="text-3xl font-bold">{stats?.sheets?.total_sheets || 0}</span>
          </div>
          <div className="text-lg">Sheets</div>
          <div className="text-sm opacity-80">{stats?.sheets?.published_sheets || 0} published</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <Building2 size={32} />
            <span className="text-3xl font-bold">{stats?.companies?.total_companies || 0}</span>
          </div>
          <div className="text-lg">Companies</div>
          <div className="text-sm opacity-80">{stats?.companies?.active_companies || 0} active</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions by Difficulty</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Total Problems</span>
              <span className="text-2xl font-bold text-blue-600">{stats?.questions?.total_questions || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Total Sheets</span>
              <span className="text-2xl font-bold text-green-600">{stats?.sheets?.total_sheets || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700">Active Topics</span>
              <span className="text-2xl font-bold text-purple-600">{stats?.topics?.active_topics || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700">Companies Listed</span>
              <span className="text-2xl font-bold text-orange-600">{stats?.companies?.active_companies || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
