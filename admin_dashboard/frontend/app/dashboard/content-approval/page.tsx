'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Check, X, Eye, Clock } from 'lucide-react'

interface Submission {
  _id: string
  content_type: string
  content_title: string
  submitted_by: string
  submitted_at: string
  status: string
  reviewer: string
}

export default function ContentApproval() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    fetchSubmissions()
  }, [filter])

  const fetchSubmissions = async () => {
    try {
      const url = filter === 'pending' 
        ? '/api/admin/content/pending'
        : '/api/admin/content?status=' + filter
      
      const response = await axios.get(url)
      setSubmissions(response.data.data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await axios.post(`/api/admin/content/${id}/approve`)
      fetchSubmissions()
      alert('Content approved successfully!')
    } catch (error) {
      console.error('Error approving content:', error)
      alert('Failed to approve content')
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Please provide a rejection reason:')
    if (!reason) return

    try {
      await axios.post(`/api/admin/content/${id}/reject`, { reason })
      fetchSubmissions()
      alert('Content rejected successfully!')
    } catch (error) {
      console.error('Error rejecting content:', error)
      alert('Failed to reject content')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="text-lg text-gray-600">Loading submissions...</div></div>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Content Approval Workflow</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {submissions.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            No {filter} submissions found.
          </div>
        ) : (
          submissions.map((submission) => (
            <div key={submission._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{submission.content_title}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {submission.content_type}
                    </span>
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      submission.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : submission.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div>Submitted by: {submission.submitted_by}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={14} />
                      {new Date(submission.submitted_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                {submission.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(submission._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                    >
                      <Check size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(submission._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
