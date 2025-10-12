'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  name: string
  path: string
  icon: string
  disabled?: boolean
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '🏠' },
    { name: 'Jobs', path: '/dashboard/jobs/list', icon: '💼' },
    { name: 'Internships', path: '/dashboard/internships/list', icon: '🎓' },
    { name: 'Scholarships', path: '/dashboard/scholarships/list', icon: '🏆' },
    { name: 'Learning', path: '/dashboard/learning', icon: '📚', disabled: true },
    { name: 'Career Tools', path: '/dashboard/career-tools', icon: '🛠️', disabled: true },
    { name: 'Analytics', path: '/dashboard/analytics', icon: '📊', disabled: true },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">CareerGuide</h2>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.path
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`
                        flex items-center px-4 py-3 rounded-lg transition-colors
                        ${isActive
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      onClick={() => onClose()}
                    >
                      <span className="text-2xl mr-3">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-sm text-gray-500">
              Admin Dashboard v1.0
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
