'use client'

import { useState } from 'react'
import { FileText, Tag, FolderOpen, Image, Upload } from 'lucide-react'
import Link from 'next/link'

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('media')

  const tabs = [
    { id: 'media', name: 'Media Library', icon: <Image size={20} /> },
    { id: 'files', name: 'File Manager', icon: <FolderOpen size={20} /> },
    { id: 'tags', name: 'Tags', icon: <Tag size={20} /> },
    { id: 'categories', name: 'Categories', icon: <FileText size={20} /> }
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Content Management</h1>

      <div className="flex gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
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
        {activeTab === 'media' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Media Library</h2>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                <Upload size={20} />
                Upload Media
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, idx) => (
                <div key={idx} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer">
                  <Image size={32} className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">File Manager</h2>
            <div className="space-y-2">
              {['Documents', 'Images', 'Videos', 'Downloads'].map((folder) => (
                <div key={folder} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <FolderOpen size={24} className="text-blue-500" />
                  <span className="font-medium">{folder}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tags' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Tags Management</h2>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add Tag</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['React', 'JavaScript', 'Python', 'AI/ML', 'DSA', 'Career', 'Interview', 'Frontend', 'Backend', 'Database'].map((tag) => (
                <span key={tag} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg cursor-pointer hover:bg-blue-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Categories Management</h2>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add Category</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Technology', 'Career', 'Programming', 'Design', 'Business', 'Data Science'].map((category) => (
                <div key={category} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <p className="text-sm text-gray-600">12 articles</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
