'use client'

import DashboardLayout from '@/components/ui/layout/sidebar/navigation/items/menu/handlers/DashboardLayout'
import JobForm from '@/components/ui/forms/job/create/fields/input/validation/JobForm'

export default function CreateJobPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
          <p className="text-gray-600 mt-1">Fill in the details to create a new job listing manually</p>
        </div>
        <JobForm />
      </div>
    </DashboardLayout>
  )
}
