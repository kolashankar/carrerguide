'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown, ChevronRight, X, Home, Briefcase, GraduationCap, BookOpen, Wrench, User, LogIn, LogOut, MapIcon } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  user: unknown
  logout: () => void
}

interface MenuItem {
  name: string
  icon: unknown
  href?: string
  children?: {
    name: string
    href: string
  }[]
}

export function Sidebar({ isOpen, onClose, user, logout }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const menuItems: MenuItem[] = [
    {
      name: 'Home',
      icon: Home,
      href: '/'
    },
    {
      name: 'Jobs',
      icon: Briefcase,
      children: [
        { name: 'Browse Jobs', href: '/jobs' },
        { name: 'Internships', href: '/jobs?type=internship' },
        { name: 'Fresher Jobs', href: '/jobs?type=fresher' },
      ]
    },
    {
      name: 'Scholarships',
      icon: GraduationCap,
      href: '/scholarships'
    },
    {
      name: 'Learning',
      icon: BookOpen,
      children: [
        { name: 'Articles', href: '/learning' },
        { name: 'DSA Corner', href: '/dsa' },
        { name: 'Roadmaps', href: '/roadmaps' },
      ]
    },
    {
      name: 'Career Tools',
      icon: Wrench,
      children: [
        { name: 'Resume Review', href: '/career-tools/resume-review' },
        { name: 'Cover Letter', href: '/career-tools/cover-letter' },
        { name: 'ATS Hack', href: '/career-tools/ats-hack' },
        { name: 'Cold Email', href: '/career-tools/cold-email' },
      ]
    },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        data-testid="sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <Link href="/" onClick={onClose}>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CareerGuide</h2>
            </Link>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-white transition-colors"
              data-testid="sidebar-close-btn"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isExpanded = expandedItems.includes(item.name)
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <li key={item.name}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`
                          w-full flex items-center px-4 py-3 rounded-lg transition-all
                          ${isActive
                            ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                            : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                        data-testid={`sidebar-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => toggleExpand(item.name)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                        data-testid={`sidebar-toggle-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex items-center">
                          <Icon className="w-5 h-5 mr-3" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                    )}
                    
                    {/* Dropdown Items */}
                    {isExpanded && item.children && (
                      <ul className="mt-1 ml-8 space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href || pathname.startsWith(child.href + '/')
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={onClose}
                                className={`
                                  block px-4 py-2 rounded-lg text-sm transition-all
                                  ${isChildActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                  }
                                `}
                                data-testid={`sidebar-sublink-${child.name.toLowerCase().replace(/\s+/g, '-')}`}
                              >
                                {child.name}
                              </Link>
                            </li>
                          )
                        })}  
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>

            {/* Divider */}
            <div className="my-4 border-t border-gray-200" />

            {/* User Actions */}
            <ul className="space-y-1">
              {user ? (
                <>
                  <li>
                    <Link
                      href="/profile"
                      onClick={onClose}
                      className={`
                        w-full flex items-center px-4 py-3 rounded-lg transition-all
                        ${pathname === '/profile'
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                      data-testid="sidebar-link-profile"
                    >
                      <User className="w-5 h-5 mr-3" />
                      <span className="font-medium">Profile</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout()
                        onClose()
                      }}
                      className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                      data-testid="sidebar-logout-btn"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                      data-testid="sidebar-link-login"
                    >
                      <LogIn className="w-5 h-5 mr-3" />
                      <span className="font-medium">Login</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      onClick={onClose}
                      className="w-full flex items-center px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
                      data-testid="sidebar-link-register"
                    >
                      <User className="w-5 h-5 mr-3" />
                      <span className="font-medium">Sign Up</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} CareerGuide. All rights reserved.
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
