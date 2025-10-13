'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Trash2, Edit, Plus, Search, Sparkles, Eye } from 'lucide-react'

interface Sheet {
  _id: string
  name: string
  description: string
  level: string
  tags: string[]
  questions_count: number
  is_published: boolean
  difficulty_breakdown: { easy: number; medium: number; hard: number }
}

export default function DSASheetsList() {
  const [sheets, setSheets] = useState<Sheet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSheets()
  }, [searchTerm])

  const fetchSheets = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)

      const response = await axios.get(`/api/admin/dsa/sheets?${params.toString()}`)
      setSheets(response.data.data || [])
    } catch (error) {
      console.error('Error fetching sheets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sheet?')) return

    try {
      await axios.delete(`/api/admin/dsa/sheets/${id}`)
      fetchSheets()
    } catch (error) {
      console.error('Error deleting sheet:', error)
      alert('Failed to delete sheet')
    }
  }

  const handleTogglePublish = async (id: string) => {
    try {
      await axios.post(`/api/admin/dsa/sheets/${id}/toggle-publish`)
      fetchSheets()
    } catch (error) {
      console.error('Error toggling publish status:', error)
      alert('Failed to update publish status')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="text-lg text-gray-600">Loading sheets...</div></div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">DSA Sheets</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/dsa/sheets/create-ai" className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2">
            <Sparkles size={20} />
            AI Generate
          </Link>
          <Link href="/dashboard/dsa/sheets/create" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Plus size={20} />
            Create Sheet
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search sheets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sheets.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-lg shadow text-center text-gray-500">
            No sheets found. Create your first sheet!
          </div>
        ) : (
          sheets.map((sheet) => (
            <div key={sheet._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800">{sheet.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  sheet.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {sheet.is_published ? 'Published' : 'Draft'}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{sheet.description}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{sheet.level}</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                  {sheet.questions_count} problems
                </span>
              </div>

              {sheet.difficulty_breakdown && (
                <div className="flex gap-2 text-xs mb-4">
                  <span className="text-green-600">{sheet.difficulty_breakdown.easy}E</span>
                  <span className="text-yellow-600">{sheet.difficulty_breakdown.medium}M</span>
                  <span className="text-red-600">{sheet.difficulty_breakdown.hard}H</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleTogglePublish(sheet._id)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    sheet.is_published
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {sheet.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <div className="flex gap-2">
                  <Link href={`/dashboard/dsa/sheets/edit/${sheet._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => handleDelete(sheet._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
