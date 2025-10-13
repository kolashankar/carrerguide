'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Trash2, Edit, Plus, Search } from 'lucide-react'

interface Topic {
  _id: string
  name: string
  description: string
  icon: string
  color: string
  question_count: number
  is_active: boolean
}

export default function DSATopicsList() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTopics()
  }, [searchTerm])

  const fetchTopics = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)

      const response = await axios.get(`/api/admin/dsa/topics?${params.toString()}`)
      setTopics(response.data.data || [])
    } catch (error) {
      console.error('Error fetching topics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) return

    try {
      await axios.delete(`/api/admin/dsa/topics/${id}`)
      fetchTopics()
    } catch (error) {
      console.error('Error deleting topic:', error)
      alert('Failed to delete topic')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="text-lg text-gray-600">Loading topics...</div></div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">DSA Topics</h1>
        <Link href="/dashboard/dsa/topics/create" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <Plus size={20} />
          Create Topic
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-lg shadow text-center text-gray-500">
            No topics found. Create your first topic!
          </div>
        ) : (
          topics.map((topic) => (
            <div key={topic._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow" style={{ borderTop: `4px solid ${topic.color}` }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{topic.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{topic.name}</h3>
                    <span className="text-sm text-gray-500">{topic.question_count} questions</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${topic.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {topic.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{topic.description}</p>

              <div className="flex justify-end gap-2">
                <Link href={`/dashboard/dsa/topics/edit/${topic._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit size={18} />
                </Link>
                <button onClick={() => handleDelete(topic._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
