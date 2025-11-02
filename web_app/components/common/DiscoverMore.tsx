'use client'

import Link from 'next/link'
import { Briefcase, Code, BookOpen, FileText, TrendingUp, Users, MapIcon, Target, Calculator } from 'lucide-react'

interface QuickLink {
  name: string
  href: string
  icon: unknown
  description?: string
}

interface DiscoverMoreProps {
  links?: QuickLink[]
}

const defaultLinks: QuickLink[] = [
  {
    name: 'Find Jobs',
    href: '/jobs',
    icon: Briefcase,
    description: '50,000+ opportunities'
  },
  {
    name: 'Freshers Jobs',
    href: '/jobs?type=fresher',
    icon: Users,
    description: 'Entry-level positions'
  },
  {
    name: 'Find Internships',
    href: '/jobs?type=internship',
    icon: Target,
    description: 'Gain experience'
  },
  {
    name: 'Coding Practice',
    href: '/dsa',
    icon: Code,
    description: '3000+ problems'
  },
  {
    name: 'Career Roadmaps',
    href: '/roadmaps',
    icon: MapIcon,
    description: 'Guide your journey'
  },
  {
    name: 'Tech Articles',
    href: '/learning',
    icon: BookOpen,
    description: 'Learn & grow'
  },
  {
    name: 'Resume Review',
    href: '/career-tools/resume-review',
    icon: FileText,
    description: 'AI-powered feedback'
  },
  {
    name: 'My Profile',
    href: '/profile',
    icon: TrendingUp,
    description: 'Track progress'
  },
]

export function DiscoverMore({ links = defaultLinks }: DiscoverMoreProps) {
  return (
    <section className="py-16 bg-white" data-testid="discover-more-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover More
          </h2>
          <p className="text-lg text-gray-600">
            Explore all the features to accelerate your career growth
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all"
                data-testid={`discover-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                    {link.name}
                  </h3>
                  {link.description && (
                    <p className="text-xs text-gray-500">
                      {link.description}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
