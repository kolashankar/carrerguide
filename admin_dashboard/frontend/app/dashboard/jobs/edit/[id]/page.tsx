'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/ui/layout/sidebar/navigation/items/menu/handlers/DashboardLayout'
import JobForm from '@/components/ui/forms/job/create/fields/input/validation/JobForm'
import { jobsApi, type Job } from '@/lib/api/client/config/interceptors/auth/token/jobsApi'

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!params.id || typeof params.id !== 'string') {
          setError('Invalid job ID')
          setLoading(false)
          return
        }

        const jobData = await jobsApi.getById(params.id)
        setJob(jobData)
      } catch (err: any) {
        console.error('Error fetching job:', err)
        setError(err.response?.data?.detail || 'Failed to load job')
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [params.id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading job details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !job) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-4">❌ {error || 'Job not found'}</div>
          <button
            onClick={() => router.push('/dashboard/jobs/list')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Jobs List
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
          <p className="text-gray-600 mt-1">Update job listing details</p>
        </div>
        <JobForm initialData={job} isEditing={true} />
      </div>
    </DashboardLayout>
  )
}
