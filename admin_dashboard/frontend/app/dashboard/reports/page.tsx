'use client'

import { useState } from 'react'
import { Download, FileText, Calendar, Filter } from 'lucide-react'

export default function Reports() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [reportType, setReportType] = useState('jobs')

  const handleGenerateReport = () => {
    alert('Report generation feature coming soon!')
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
          <FileText size={32} className="mb-2" />
          <div className="text-3xl font-bold">247</div>
          <div className="text-lg">Total Reports</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
          <Calendar size={32} className="mb-2" />
          <div className="text-3xl font-bold">52</div>
          <div className="text-lg">This Month</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
          <Download size={32} className="mb-2" />
          <div className="text-3xl font-bold">1,234</div>
          <div className="text-lg">Downloads</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Generate Custom Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="jobs">Jobs Report</option>
              <option value="internships">Internships Report</option>
              <option value="users">Users Report</option>
              <option value="analytics">Analytics Report</option>
              <option value="revenue">Revenue Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Download size={20} />
          Generate Report
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Reports</h2>
        
        <div className="space-y-3">
          {[
            { name: 'Jobs Report - October 2024', date: '2024-10-13', type: 'PDF', size: '2.4 MB' },
            { name: 'User Analytics - Q3 2024', date: '2024-09-30', type: 'Excel', size: '1.8 MB' },
            { name: 'Internships Report - September 2024', date: '2024-09-15', type: 'PDF', size: '1.2 MB' },
            { name: 'Revenue Report - August 2024', date: '2024-08-31', type: 'CSV', size: '856 KB' }
          ].map((report, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <FileText size={24} className="text-blue-500" />
                <div>
                  <div className="font-medium">{report.name}</div>
                  <div className="text-sm text-gray-500">{report.date} • {report.type} • {report.size}</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                <Download size={16} />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
