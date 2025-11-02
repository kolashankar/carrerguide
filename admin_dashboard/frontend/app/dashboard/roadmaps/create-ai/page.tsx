'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ModernDashboardLayout from '@/components/ui/layout/sidebar/navigation/items/menu/handlers/ModernDashboardLayout'
import { roadmapsApi } from '@/lib/api/client/config/interceptors/auth/token/roadmapsApi'
import { Map, Tag, Target, Clock, Plus, X, Sparkles, ArrowLeft } from 'lucide-react'

export default function RoadmapCreateAIPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    level: 'Beginner',
    focus_areas: [''],
    estimated_duration: '3 months',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSubmit = {
        title: formData.title,
        category: formData.category,
        subcategory: formData.category,
        difficulty_level: formData.level.toLowerCase(),
        estimated_duration: formData.estimated_duration,
        focus_areas: formData.focus_areas.filter(area => area.trim() !== ''),
      }

      const response = await roadmapsApi.generateAI(dataToSubmit)
      alert('Roadmap with flowchart generated successfully with AI! 🎉')
      
      if (response.data._id) {
        router.push(`/dashboard/roadmaps/edit/${response.data._id}`)
      } else {
        router.push('/dashboard/roadmaps/list')
      }
    } catch (error: any) {
      console.error('Error generating roadmap:', error)
      alert(error.response?.data?.detail || 'Failed to generate roadmap with AI')
    } finally {
      setLoading(false)
    }
  }

  const addFocusArea = () => {
    setFormData({ ...formData, focus_areas: [...formData.focus_areas, ''] })
  }

  const removeFocusArea = (index: number) => {
    const newFocusAreas = formData.focus_areas.filter((_, i) => i !== index)
    setFormData({ ...formData, focus_areas: newFocusAreas })
  }

  const updateFocusArea = (index: number, value: string) => {
    const newFocusAreas = [...formData.focus_areas]
    newFocusAreas[index] = value
    setFormData({ ...formData, focus_areas: newFocusAreas })
  }

  return (
    <ModernDashboardLayout>
      <div className="space-y-6">
        {/* Header with gradient */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Generate Roadmap with AI
            </h1>
            <p className="text-slate-600 mt-1">
              Let AI create a comprehensive learning roadmap with flowchart
            </p>
          </div>
        </div>

        {/* AI Info Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-indigo-900 mb-1">AI-Powered Generation</h3>
              <p className="text-sm text-indigo-800">
                AI will generate a comprehensive roadmap with 15-25 interconnected nodes including topics, resources, and learning paths. 
                The flowchart will automatically include node connections, positions, and different node types.
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
                <Map className="w-4 h-4 mr-2 text-indigo-600" />
                Roadmap Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Full Stack Web Development Roadmap"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Tag className="w-4 h-4 mr-2 text-indigo-600" />
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Target className="w-4 h-4 mr-2 text-indigo-600" />
                  Level *
                </label>
                <select
                  required
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Clock className="w-4 h-4 mr-2 text-indigo-600" />
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={formData.estimated_duration}
                  onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                  placeholder="e.g., 3 months, 6 months"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Focus Areas */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <Target className="w-4 h-4 mr-2 text-indigo-600" />
                Focus Areas (Optional)
              </label>
              <div className="space-y-2">
                {formData.focus_areas.map((area, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => updateFocusArea(index, e.target.value)}
                      placeholder="e.g., React, Node.js, Database Design"
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {formData.focus_areas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFocusArea(index)}
                        className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFocusArea}
                  className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Focus Area
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/roadmaps/list')}
                className="flex items-center px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all font-medium text-slate-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/50 font-semibold"
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
                    Generate Roadmap
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
