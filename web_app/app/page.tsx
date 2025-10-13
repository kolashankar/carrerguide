import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/Button';
import { Briefcase, BookOpen, Code, MapIcon, TrendingUp, Users, Award } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Briefcase,
      title: 'Jobs & Internships',
      description: 'Discover thousands of job opportunities and internships from top companies worldwide.',
      href: '/jobs',
    },
    {
      icon: BookOpen,
      title: 'Learning Resources',
      description: 'Access comprehensive articles and guides to enhance your skills and knowledge.',
      href: '/learning',
    },
    {
      icon: Code,
      title: 'DSA Corner',
      description: 'Master data structures and algorithms with curated problems and solutions.',
      href: '/dsa',
    },
    {
      icon: MapIcon,
      title: 'Career Roadmaps',
      description: 'Follow structured learning paths to achieve your career goals.',
      href: '/roadmaps',
    },
  ];

  const stats = [
    { icon: Briefcase, value: '10,000+', label: 'Job Opportunities' },
    { icon: Users, value: '50,000+', label: 'Active Users' },
    { icon: BookOpen, value: '1,000+', label: 'Learning Articles' },
    { icon: Award, value: '500+', label: 'Scholarships' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Your Career Journey
                <span className="text-blue-600"> Starts Here</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Discover opportunities, learn new skills, and build your dream career with CareerGuide - your all-in-one platform for professional growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/jobs">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Jobs
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive tools and resources to help you at every stage of your career journey.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
                  >
                    <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center text-white">
                    <Icon className="h-8 w-8 mx-auto mb-3 opacity-80" />
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-blue-100">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of professionals who are already using CareerGuide to advance their careers.
            </p>
            <Link href="/register">
              <Button size="lg">
                Get Started Today
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
