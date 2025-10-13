'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateTopic() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📚',
    color: '#3B82F6',
    parent_topic: '',
    is_active: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/admin/dsa/topics', formData)
      alert('Topic created successfully!')
      router.push('/dashboard/dsa/topics/list')
    } catch (error: any) {
      console.error('Error creating topic:', error)
      alert(error.response?.data?.detail || 'Failed to create topic')
    } finally {
      setLoading(false)
    }
  }

  const iconOptions = ['📚', '💻', '🔢', '🌳', '📊', '🔍', '🧩', '⚡', '🎯', '🚀']
  const colorOptions = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/dsa/topics/list" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Create DSA Topic</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`p-4 text-3xl rounded-lg border-2 hover:bg-gray-50 ${
                    formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="grid grid-cols-8 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-12 h-12 rounded-lg border-2 ${
                    formData.color === color ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-800' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {loading ? 'Creating...' : 'Create Topic'}
          </button>
        </div>
      </form>
    </div>
  )
}
