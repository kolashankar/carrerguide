'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ModernDashboardLayout from '@/components/ui/layout/sidebar/navigation/items/menu/handlers/ModernDashboardLayout'
import { dsaApi } from '@/lib/api/client/config/interceptors/auth/token/dsaApi'
import { Code2, Target, Building2, Lightbulb, Sparkles, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateQuestionAI() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'Medium',
    companies: '',
    focus_area: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await dsaApi.questions.generateAI(formData)
      toast.success('Question generated successfully')
      
      if (response.data._id) {
        router.push(`/dashboard/dsa/questions/edit/${response.data._id}`)
      } else {
        router.push('/dashboard/dsa/questions/list')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to generate question')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModernDashboardLayout>
      <div className="space-y-6">
        {/* Header with gradient */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Generate DSA Question with AI
            </h1>
            <p className="text-slate-600 mt-1">
              Let AI create a comprehensive DSA question for you
            </p>
          </div>
        </div>

        {/* AI Info Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">AI-Powered Generation</h3>
              <p className="text-sm text-green-800">
                The AI will create a comprehensive DSA question including problem statement, 
                solution approach, code in multiple languages, hints, and complexity analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <Code2 className="w-4 h-4 mr-2 text-green-600" />
                Topic *
              </label>
              <input
                type="text"
                required
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g. Binary Search, Dynamic Programming, Graph Algorithms"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Difficulty */}
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Target className="w-4 h-4 mr-2 text-green-600" />
                  Difficulty *
                </label>
                <select
                  required
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Companies */}
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Building2 className="w-4 h-4 mr-2 text-green-600" />
                  Companies (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.companies}
                  onChange={(e) => setFormData({ ...formData, companies: e.target.value })}
                  placeholder="e.g. Google, Amazon, Microsoft"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Focus Area */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <Lightbulb className="w-4 h-4 mr-2 text-green-600" />
                Focus Area (optional)
              </label>
              <textarea
                value={formData.focus_area}
                onChange={(e) => setFormData({ ...formData, focus_area: e.target.value })}
                placeholder="e.g. Focus on edge cases, optimization techniques, time complexity"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                rows={3}
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
                className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/50 font-semibold"
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
