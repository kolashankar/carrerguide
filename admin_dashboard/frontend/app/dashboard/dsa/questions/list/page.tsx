'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Trash2, Edit, Plus, Search, Sparkles } from 'lucide-react'

interface Question {
  _id: string
  title: string
  difficulty: string
  topics: string[]
  companies: string[]
  submission_count: number
  acceptance_rate: number
}

export default function DSAQuestionsList() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('')

  useEffect(() => {
    fetchQuestions()
  }, [searchTerm, filterDifficulty])

  const fetchQuestions = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filterDifficulty) params.append('difficulty', filterDifficulty)

      const response = await axios.get(`/api/admin/dsa/questions?${params.toString()}`)
      setQuestions(response.data.data || [])
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      await axios.delete(`/api/admin/dsa/questions/${id}`)
      fetchQuestions()
    } catch (error) {
      console.error('Error deleting question:', error)
      alert('Failed to delete question')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="text-lg text-gray-600">Loading questions...</div></div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">DSA Questions</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/dsa/questions/create-ai" className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2">
            <Sparkles size={20} />
            AI Generate
          </Link>
          <Link href="/dashboard/dsa/questions/create" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Plus size={20} />
            Create Question
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {questions.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            No questions found. Create your first question!
          </div>
        ) : (
          questions.map((question) => (
            <div key={question._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{question.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    {question.topics.slice(0, 3).map((topic, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                  {question.companies.length > 0 && (
                    <div className="text-sm text-gray-600">
                      Companies: {question.companies.slice(0, 3).join(', ')}
                      {question.companies.length > 3 && ` +${question.companies.length - 3} more`}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/dsa/questions/edit/${question._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => handleDelete(question._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 text-sm text-gray-500">
                <span>{question.submission_count} submissions</span>
                <span>{question.acceptance_rate}% acceptance</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
