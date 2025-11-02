'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ModernDashboardLayout from '@/components/ui/layout/sidebar/navigation/items/menu/handlers/ModernDashboardLayout'
import { jobsApi } from '@/lib/api/client/config/interceptors/auth/token/jobsApi'
import { Briefcase, Building2, MapPin, Clock, Tag, TrendingUp, Sparkles, ArrowLeft } from 'lucide-react'

export default function CreateJobAIPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    job_title: '',
    company: '',
    location: '',
    job_type: 'full-time',
    category: 'technology',
    experience_level: 'mid',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await jobsApi.generateWithAI(formData)
      alert('Job generated and created successfully!')
      router.push('/dashboard/jobs/list')
    } catch (error: any) {
      console.error('Error generating job:', error)
      alert(`Failed to generate job: ${error.response?.data?.detail || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModernDashboardLayout>
      <div className="space-y-6">
        {/* Header with gradient */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Generate Job with AI
            </h1>
            <p className="text-slate-600 mt-1">
              Provide basic information and let AI generate a complete job listing
            </p>
          </div>
        </div>

        {/* AI Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">AI-Powered Generation</h3>
              <p className="text-sm text-blue-800">
                Our AI will analyze your inputs and generate a complete job listing including:
                detailed description, responsibilities, required skills, qualifications, benefits, and realistic salary range.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>

            {/* Company */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                Company *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Google"
              />
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Mountain View, CA"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Job Type */}
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  Job Type *
                </label>
                <select
                  required
                  value={formData.job_type}
                  onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Tag className="w-4 h-4 mr-2 text-blue-600" />
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="technology">Technology</option>
                  <option value="marketing">Marketing</option>
                  <option value="finance">Finance</option>
                  <option value="sales">Sales</option>
                  <option value="design">Design</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                  Experience Level *
                </label>
                <select
                  required
                  value={formData.experience_level}
                  onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
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
                className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/50 font-semibold"
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
