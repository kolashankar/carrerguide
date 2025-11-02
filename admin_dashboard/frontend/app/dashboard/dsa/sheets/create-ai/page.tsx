'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ModernDashboardLayout from '@/components/ui/layout/sidebar/navigation/items/menu/handlers/ModernDashboardLayout'
import { dsaApi } from '@/lib/api/client/config/interceptors/auth/token/dsaApi'
import { FileText, Target, Tag, User, Sparkles, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateDSASheetAI() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    level: 'beginner',
    focus_topics: '',
    author: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        focus_topics: formData.focus_topics.split(',').map(t => t.trim()).filter(t => t),
      }
      await dsaApi.sheets.generateAI(payload)
      toast.success('Sheet generated successfully with AI!')
      router.push('/dashboard/dsa/sheets/list')
    } catch (error: any) {
      console.error('Error generating sheet:', error)
      toast.error(error.response?.data?.detail || 'Failed to generate sheet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModernDashboardLayout>
      <div className="space-y-6">
        {/* Header with gradient */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/50">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Generate DSA Sheet with AI
            </h1>
            <p className="text-slate-600 mt-1">
              Let AI create a comprehensive problem sheet for you
            </p>
          </div>
        </div>

        {/* AI Info Card */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-violet-900 mb-1">AI-Powered Generation</h3>
              <p className="text-sm text-violet-800">
                Our AI will automatically create a comprehensive DSA sheet with 20-30 carefully selected problems,
                organized by topic and difficulty level, complete with descriptions and problem recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sheet Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <FileText className="w-4 h-4 mr-2 text-violet-600" />
                Sheet Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Complete SDE Preparation, Dynamic Programming Mastery"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Level */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <Target className="w-4 h-4 mr-2 text-violet-600" />
                Difficulty Level *
              </label>
              <select
                required
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Focus Topics */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <Tag className="w-4 h-4 mr-2 text-violet-600" />
                Focus Topics (comma separated)
              </label>
              <input
                type="text"
                value={formData.focus_topics}
                onChange={(e) => setFormData({ ...formData, focus_topics: e.target.value })}
                placeholder="e.g., arrays, strings, trees, graphs, dynamic-programming"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-slate-500 mt-1">Leave blank for AI to choose optimal topics</p>
            </div>

            {/* Author */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 mr-2 text-violet-600" />
                Author Name *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Your name or organization"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
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
                className="flex items-center px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/50 font-semibold"
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
