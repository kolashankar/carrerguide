'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function CreateQuestion() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    topics: [] as string[],
    companies: [] as string[],
    examples: [{ input: '', output: '', explanation: '' }],
    code_solutions: [{ language: 'python', code: '' }],
    hints: [''],
    time_complexity: '',
    space_complexity: ''
  })

  const [topicInput, setTopicInput] = useState('')
  const [companyInput, setCompanyInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/admin/dsa/questions', {
        ...formData,
        hints: formData.hints.filter(h => h.trim() !== ''),
        complexity_analysis: {
          time: formData.time_complexity,
          space: formData.space_complexity
        }
      })
      alert('Question created successfully!')
      router.push('/dashboard/dsa/questions/list')
    } catch (error: any) {
      console.error('Error creating question:', error)
      alert(error.response?.data?.detail || 'Failed to create question')
    } finally {
      setLoading(false)
    }
  }

  const addTopic = () => {
    if (topicInput.trim() && !formData.topics.includes(topicInput.trim())) {
      setFormData({ ...formData, topics: [...formData.topics, topicInput.trim()] })
      setTopicInput('')
    }
  }

  const removeTopic = (index: number) => {
    setFormData({ ...formData, topics: formData.topics.filter((_, i) => i !== index) })
  }

  const addCompany = () => {
    if (companyInput.trim() && !formData.companies.includes(companyInput.trim())) {
      setFormData({ ...formData, companies: [...formData.companies, companyInput.trim()] })
      setCompanyInput('')
    }
  }

  const removeCompany = (index: number) => {
    setFormData({ ...formData, companies: formData.companies.filter((_, i) => i !== index) })
  }

  const addExample = () => {
    setFormData({ ...formData, examples: [...formData.examples, { input: '', output: '', explanation: '' }] })
  }

  const removeExample = (index: number) => {
    setFormData({ ...formData, examples: formData.examples.filter((_, i) => i !== index) })
  }

  const updateExample = (index: number, field: string, value: string) => {
    const newExamples = [...formData.examples]
    newExamples[index] = { ...newExamples[index], [field]: value }
    setFormData({ ...formData, examples: newExamples })
  }

  const addSolution = () => {
    setFormData({ ...formData, code_solutions: [...formData.code_solutions, { language: 'python', code: '' }] })
  }

  const removeSolution = (index: number) => {
    setFormData({ ...formData, code_solutions: formData.code_solutions.filter((_, i) => i !== index) })
  }

  const updateSolution = (index: number, field: string, value: string) => {
    const newSolutions = [...formData.code_solutions]
    newSolutions[index] = { ...newSolutions[index], [field]: value }
    setFormData({ ...formData, code_solutions: newSolutions })
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/dsa/questions/list" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Create DSA Question</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topics</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                  placeholder="Add topic"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={addTopic} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.topics.map((topic, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2">
                    {topic}
                    <button type="button" onClick={() => removeTopic(idx)} className="hover:text-red-600">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Companies</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompany())}
                placeholder="Add company"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={addCompany} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.companies.map((company, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full flex items-center gap-2">
                  {company}
                  <button type="button" onClick={() => removeCompany(idx)} className="hover:text-red-600">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Examples</label>
            {formData.examples.map((example, idx) => (
              <div key={idx} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Example {idx + 1}</span>
                  {formData.examples.length > 1 && (
                    <button type="button" onClick={() => removeExample(idx)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Input"
                    value={example.input}
                    onChange={(e) => updateExample(idx, 'input', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Output"
                    value={example.output}
                    onChange={(e) => updateExample(idx, 'output', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Explanation"
                    value={example.explanation}
                    onChange={(e) => updateExample(idx, 'explanation', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
            <button type="button" onClick={addExample} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center gap-2">
              <Plus size={16} />
              Add Example
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Code Solutions</label>
            {formData.code_solutions.map((solution, idx) => (
              <div key={idx} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <select
                    value={solution.language}
                    onChange={(e) => updateSolution(idx, 'language', e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                  {formData.code_solutions.length > 1 && (
                    <button type="button" onClick={() => removeSolution(idx)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <MonacoEditor
                  height="200px"
                  language={solution.language === 'cpp' ? 'cpp' : solution.language}
                  value={solution.code}
                  onChange={(value) => updateSolution(idx, 'code', value || '')}
                  theme="vs-dark"
                  options={{ minimap: { enabled: false }, fontSize: 14 }}
                />
              </div>
            ))}
            <button type="button" onClick={addSolution} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center gap-2">
              <Plus size={16} />
              Add Solution
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Complexity</label>
              <input
                type="text"
                value={formData.time_complexity}
                onChange={(e) => setFormData({ ...formData, time_complexity: e.target.value })}
                placeholder="O(n)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Space Complexity</label>
              <input
                type="text"
                value={formData.space_complexity}
                onChange={(e) => setFormData({ ...formData, space_complexity: e.target.value })}
                placeholder="O(1)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {loading ? 'Creating...' : 'Create Question'}
          </button>
        </div>
      </form>
    </div>
  )
}
