'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ModernDashboardLayout from '@/components/ui/layout/sidebar/navigation/items/menu/handlers/ModernDashboardLayout'
import { articlesApi } from '@/lib/api/client/config/interceptors/auth/token/articlesApi'
import { FileText, Tag, User, MessageSquare, BarChart3, Sparkles, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateArticleAI() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    category: '',
    author: '',
    tone: 'professional',
    length: 'medium',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await articlesApi.generateAI(formData)
      toast.success('Article generated successfully')
      
      if (response.data._id) {
        router.push(`/dashboard/learning/articles/edit/${response.data._id}`)
      } else {
        router.push('/dashboard/learning/articles/list')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to generate article')
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/50">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Generate Article with AI
            </h1>
            <p className="text-slate-600 mt-1">
              Let AI create a comprehensive article for you
            </p>
          </div>
        </div>

        {/* AI Info Card */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-rose-900 mb-1">AI-Powered Generation</h3>
              <p className="text-sm text-rose-800">
                The AI will create a comprehensive article based on your inputs, 
                including proper formatting, headings, and structure.
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
                <FileText className="w-4 h-4 mr-2 text-rose-600" />
                Topic *
              </label>
              <input
                type="text"
                required
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g. How to ace technical interviews"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Tag className="w-4 h-4 mr-2 text-rose-600" />
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Category</option>
                  <option value="Career Guidance">Career Guidance</option>
                  <option value="Interview Tips">Interview Tips</option>
                  <option value="Technology">Technology</option>
                  <option value="Skill Development">Skill Development</option>
                </select>
              </div>

              {/* Author */}
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-rose-600" />
                  Author *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tone */}
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <MessageSquare className="w-4 h-4 mr-2 text-rose-600" />
                  Tone
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="friendly">Friendly</option>
                </select>
              </div>

              {/* Length */}
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <BarChart3 className="w-4 h-4 mr-2 text-rose-600" />
                  Length
                </label>
                <select
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                >
                  <option value="short">Short (500-800 words)</option>
                  <option value="medium">Medium (1000-1500 words)</option>
                  <option value="long">Long (2000-3000 words)</option>
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
                className="flex items-center px-8 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-rose-500/50 font-semibold"
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
