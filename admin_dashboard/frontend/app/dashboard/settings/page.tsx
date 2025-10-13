'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Save, Key, Mail, Palette, Database, Bell } from 'lucide-react'

export default function Settings() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    general: {
      site_name: 'CareerGuide Admin',
      support_email: 'support@careerguide.com',
      timezone: 'UTC',
      language: 'en'
    },
    email: {
      smtp_host: '',
      smtp_port: '587',
      smtp_user: '',
      smtp_password: '',
      from_email: '',
      from_name: 'CareerGuide'
    },
    api_keys: {
      gemini_api_key: 'AIzaSyAP3N0jTzOMpLTRyy9d77Osq2gwpxZned4',
      firebase_key: '',
      aws_access_key: '',
      aws_secret_key: ''
    },
    theme: {
      primary_color: '#3B82F6',
      secondary_color: '#10B981',
      logo_url: ''
    }
  })

  const handleSave = async (section: string) => {
    setLoading(true)
    try {
      await axios.put(`/api/admin/settings/${section}`, settings[section as keyof typeof settings])
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: <Database size={20} /> },
    { id: 'email', name: 'Email', icon: <Mail size={20} /> },
    { id: 'api_keys', name: 'API Keys', icon: <Key size={20} /> },
    { id: 'theme', name: 'Theme', icon: <Palette size={20} /> }
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings & Configuration</h1>

      <div className="flex gap-6">
        <div className="w-64 bg-white rounded-lg shadow p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">General Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.general.site_name}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, site_name: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                <input
                  type="email"
                  value={settings.general.support_email}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, support_email: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, timezone: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Asia/Kolkata">Indian Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, language: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => handleSave('general')}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={20} />
                Save General Settings
              </button>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Email Configuration</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={settings.email.smtp_host}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtp_host: e.target.value }
                    })}
                    placeholder="smtp.gmail.com"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                  <input
                    type="text"
                    value={settings.email.smtp_port}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtp_port: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                <input
                  type="text"
                  value={settings.email.smtp_user}
                  onChange={(e) => setSettings({
                    ...settings,
                    email: { ...settings.email, smtp_user: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                <input
                  type="password"
                  value={settings.email.smtp_password}
                  onChange={(e) => setSettings({
                    ...settings,
                    email: { ...settings.email, smtp_password: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => handleSave('email')}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={20} />
                Save Email Settings
              </button>
            </div>
          )}

          {activeTab === 'api_keys' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">API Keys Management</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gemini API Key</label>
                <input
                  type="password"
                  value={settings.api_keys.gemini_api_key}
                  onChange={(e) => setSettings({
                    ...settings,
                    api_keys: { ...settings.api_keys, gemini_api_key: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Firebase API Key</label>
                <input
                  type="password"
                  value={settings.api_keys.firebase_key}
                  onChange={(e) => setSettings({
                    ...settings,
                    api_keys: { ...settings.api_keys, firebase_key: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => handleSave('api_keys')}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={20} />
                Save API Keys
              </button>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Theme Customization</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <input
                    type="color"
                    value={settings.theme.primary_color}
                    onChange={(e) => setSettings({
                      ...settings,
                      theme: { ...settings.theme, primary_color: e.target.value }
                    })}
                    className="w-full h-12 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                  <input
                    type="color"
                    value={settings.theme.secondary_color}
                    onChange={(e) => setSettings({
                      ...settings,
                      theme: { ...settings.theme, secondary_color: e.target.value }
                    })}
                    className="w-full h-12 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input
                  type="text"
                  value={settings.theme.logo_url}
                  onChange={(e) => setSettings({
                    ...settings,
                    theme: { ...settings.theme, logo_url: e.target.value }
                  })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => handleSave('theme')}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={20} />
                Save Theme Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
