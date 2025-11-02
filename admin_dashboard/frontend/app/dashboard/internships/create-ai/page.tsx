'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ModernDashboardLayout from '@/components/ui/layout/sidebar/navigation/items/menu/handlers/ModernDashboardLayout'
import { internshipsApi } from '@/lib/api/client/config/interceptors/auth/token/internshipsApi'
import { GraduationCap, Building2, MapPin, Clock, Tag, Sparkles, ArrowLeft } from 'lucide-react'

export default function CreateInternshipAIPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    duration: '3 months',
    category: 'technology',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await internshipsApi.generateWithAI(formData)
      alert('Internship generated and created successfully!')
      router.push('/dashboard/internships/list')
    } catch (error: any) {
      console.error('Error generating internship:', error)
      alert(`Failed to generate internship: ${error.response?.data?.detail || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModernDashboardLayout>
      <div className="space-y-6">
        {/* Header with gradient */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Generate Internship with AI
            </h1>
            <p className="text-slate-600 mt-1">
              Provide basic information and let AI generate a complete internship listing
            </p>
          </div>
        </div>

        {/* AI Info Card */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-purple-900 mb-1">AI-Powered Generation</h3>
              <p className="text-sm text-purple-800">
                Our AI will analyze your inputs and generate a complete internship listing including:
                detailed description, responsibilities, required skills, qualifications, and benefits.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <GraduationCap className="w-4 h-4 mr-2 text-purple-600" />
                Internship Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g., Software Engineering Intern"
              />
            </div>

            {/* Company */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <Building2 className="w-4 h-4 mr-2 text-purple-600" />
                Company *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g., Google"
              />
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g., Mountain View, CA"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Duration */}
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Clock className="w-4 h-4 mr-2 text-purple-600" />
                  Duration *
                </label>
                <select
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="2 months">2 Months</option>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                  <option value="12 months">12 Months</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Tag className="w-4 h-4 mr-2 text-purple-600" />
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="technology">Technology</option>
                  <option value="marketing">Marketing</option>
                  <option value="finance">Finance</option>
                  <option value="design">Design</option>
                  <option value="engineering">Engineering</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all font-medium text-slate-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/50 font-semibold"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModernDashboardLayout>
  )
}
