'use client'

import { useState } from 'react'
import { bulkApi } from '@/lib/api/client/config/interceptors/auth/token/analyticsApi'
import DashboardLayout from '@/components/ui/layout/sidebar/navigation/items/menu/handlers/DashboardLayout'

export default function BulkOperationsPage() {
  const [loading, setLoading] = useState(false)
  const [importType, setImportType] = useState<'jobs' | 'internships'>('jobs')

  const handleExport = async (type: 'jobs' | 'internships') => {
    try {
      setLoading(true)
      const blob = type === 'jobs' ? await bulkApi.exportJobs() : await bulkApi.exportInternships()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}_export_${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      alert(`${type} exported successfully!`)
    } catch (error) {
      console.error('Error exporting:', error)
      alert(`Failed to export ${type}`)
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const result = importType === 'jobs' 
        ? await bulkApi.importJobs(file)
        : await bulkApi.importInternships(file)
      
      alert(`Import completed!\nImported: ${result.imported}\nFailed: ${result.failed}${result.errors.length > 0 ? '\n\nErrors:\n' + result.errors.join('\n') : ''}`)
    } catch (error: any) {
      console.error('Error importing:', error)
      alert(error.response?.data?.detail || `Failed to import ${importType}`)
    } finally {
      setLoading(false)
      e.target.value = '' // Reset file input
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Operations</h1>
          <p className="text-gray-600 mt-1">Import and export data in bulk</p>
        </div>

        {/* Export Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📥</span> Export Data
          </h2>
          <p className="text-gray-600 mb-6">Download your data as CSV files</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleExport('jobs')}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-4 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 font-semibold flex items-center justify-center"
            >
              <span className="mr-2">💼</span> Export Jobs
            </button>
            <button
              onClick={() => handleExport('internships')}
              disabled={loading}
              className="bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-600 transition disabled:bg-gray-400 font-semibold flex items-center justify-center"
            >
              <span className="mr-2">🎓</span> Export Internships
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📤</span> Import Data
          </h2>
          <p className="text-gray-600 mb-6">Upload CSV files to import data</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Import Type
              </label>
              <select
                value={importType}
                onChange={(e) => setImportType(e.target.value as 'jobs' | 'internships')}
                className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="jobs">Jobs</option>
                <option value="internships">Internships</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                disabled={loading}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Make sure your CSV file has the correct column headers
              </p>
            </div>
          </div>
        </div>

        {/* CSV Format Info */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📝 CSV Format Guidelines</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <strong>Jobs CSV Headers:</strong>
              <p className="font-mono text-xs bg-white p-2 rounded mt-1">
                title, company, location, description, job_type, category, experience_level, salary_min, salary_max, skills, qualifications, responsibilities, benefits
              </p>
            </div>
            <div>
              <strong>Internships CSV Headers:</strong>
              <p className="font-mono text-xs bg-white p-2 rounded mt-1">
                title, company, location, description, internship_type, category, duration, stipend_amount, skills, qualifications, learning_outcomes, requirements
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              ⚠️ For array fields (skills, qualifications, etc.), separate items with semicolons (;)
            </p>
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="text-gray-700 font-semibold">Processing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
