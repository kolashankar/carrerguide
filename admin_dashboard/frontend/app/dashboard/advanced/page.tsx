'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Zap, Clock, Activity, Database, AlertTriangle } from 'lucide-react'

export default function AdvancedFeatures() {
  const [activeTab, setActiveTab] = useState('templates')

  const tabs = [
    { id: 'templates', name: 'Email Templates', icon: <Mail size={20} /> },
    { id: 'sms', name: 'SMS Templates', icon: <MessageSquare size={20} /> },
    { id: 'automation', name: 'Automation', icon: <Zap size={20} /> },
    { id: 'scheduled', name: 'Scheduled Tasks', icon: <Clock size={20} /> },
    { id: 'monitoring', name: 'System Health', icon: <Activity size={20} /> },
    { id: 'backup', name: 'Backup', icon: <Database size={20} /> }
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Advanced Features</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'templates' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Email Templates</h2>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Create Template</button>
            </div>
            <div className="space-y-3">
              {['Welcome Email', 'Job Application Confirmation', 'Interview Invitation', 'Scholarship Approval'].map((template) => (
                <div key={template} className="flex justify-between items-center p-4 border rounded-lg hover:shadow transition-shadow">
                  <div>
                    <div className="font-medium">{template}</div>
                    <div className="text-sm text-gray-500">Last updated: 2 days ago</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg">Edit</button>
                    <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sms' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">SMS Templates</h2>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Create Template</button>
            </div>
            <div className="space-y-3">
              {['OTP Verification', 'Job Alert', 'Interview Reminder'].map((template) => (
                <div key={template} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{template}</div>
                    <div className="text-sm text-gray-500">160 characters</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg">Edit</button>
                    <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'automation' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Automation Rules</h2>
            <div className="space-y-4">
              {[
                { name: 'Auto-approve verified users', status: 'Active' },
                { name: 'Send welcome email on signup', status: 'Active' },
                { name: 'Archive old jobs after 90 days', status: 'Inactive' }
              ].map((rule, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{rule.name}</div>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                      rule.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg">Configure</button>
                    <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg">Toggle</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Scheduled Tasks</h2>
            <div className="space-y-3">
              {[
                { task: 'Database backup', schedule: 'Daily at 2:00 AM', next: 'Tomorrow, 2:00 AM' },
                { task: 'Send weekly newsletter', schedule: 'Every Monday 9:00 AM', next: 'Mon, 9:00 AM' },
                { task: 'Clean temp files', schedule: 'Every Sunday 3:00 AM', next: 'Sun, 3:00 AM' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="font-medium">{item.task}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Schedule: {item.schedule} • Next run: {item.next}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">System Health Monitoring</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { service: 'API Server', status: 'Healthy', uptime: '99.9%' },
                { service: 'Database', status: 'Healthy', uptime: '99.8%' },
                { service: 'Cache Server', status: 'Warning', uptime: '98.5%' },
                { service: 'File Storage', status: 'Healthy', uptime: '99.7%' },
                { service: 'Email Service', status: 'Healthy', uptime: '99.6%' },
                { service: 'Background Jobs', status: 'Healthy', uptime: '99.4%' }
              ].map((service) => (
                <div key={service.service} className={`p-4 rounded-lg border-2 ${
                  service.status === 'Healthy' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{service.service}</div>
                    {service.status === 'Healthy' ? (
                      <Activity size={20} className="text-green-600" />
                    ) : (
                      <AlertTriangle size={20} className="text-yellow-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Uptime: {service.uptime}</div>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    service.status === 'Healthy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Database Backup & Restore</h2>
            
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <Database size={20} />
                <span className="font-medium">Last Backup</span>
              </div>
              <div className="text-sm text-blue-700">October 13, 2024 at 2:00 AM • Size: 245 MB</div>
            </div>

            <div className="flex gap-4 mb-8">
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                <Database size={20} />
                Create Backup Now
              </button>
              <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center gap-2">
                Restore from Backup
              </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Backup History</h3>
            <div className="space-y-2">
              {[
                { date: 'Oct 13, 2024 2:00 AM', size: '245 MB', status: 'Success' },
                { date: 'Oct 12, 2024 2:00 AM', size: '243 MB', status: 'Success' },
                { date: 'Oct 11, 2024 2:00 AM', size: '241 MB', status: 'Success' }
              ].map((backup, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{backup.date}</div>
                    <div className="text-sm text-gray-500">{backup.size}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{backup.status}</span>
                    <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm">Restore</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
