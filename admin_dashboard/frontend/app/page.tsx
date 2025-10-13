import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            CareerGuide Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Manage jobs, internships, scholarships, and more
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Link href="/dashboard/analytics" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-2xl">
                📊
              </div>
              <h2 className="text-2xl font-semibold ml-4 text-gray-800">Analytics</h2>
            </div>
            <p className="text-gray-600">View platform insights, user engagement and statistics</p>
          </Link>

          <Link href="/dashboard/jobs/list" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl">
                💼
              </div>
              <h2 className="text-2xl font-semibold ml-4 text-gray-800">Jobs</h2>
            </div>
            <p className="text-gray-600">Manage job listings, create new jobs manually or with AI</p>
          </Link>
          
          <Link href="/dashboard/internships/list" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-2xl">
                🎓
              </div>
              <h2 className="text-2xl font-semibold ml-4 text-gray-800">Internships</h2>
            </div>
            <p className="text-gray-600">Create and manage internship opportunities</p>
          </Link>
          
          <Link href="/dashboard/scholarships/list" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white text-2xl">
                🏆
              </div>
              <h2 className="text-2xl font-semibold ml-4 text-gray-800">Scholarships</h2>
            </div>
            <p className="text-gray-600">Manage scholarship programs and applications</p>
          </Link>

          <Link href="/dashboard/roadmaps/list" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white text-2xl">
                🗺️
              </div>
              <h2 className="text-2xl font-semibold ml-4 text-gray-800">Roadmaps</h2>
            </div>
            <p className="text-gray-600">Create visual learning roadmaps manually or with AI</p>
          </Link>

          <Link href="/dashboard/career-tools/templates" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white text-2xl">
                🛠️
              </div>
              <h2 className="text-2xl font-semibold ml-4 text-gray-800">Career Tools</h2>
            </div>
            <p className="text-gray-600">Manage AI-powered career tools templates and usage</p>
          </Link>

          <Link href="/dashboard/bulk-operations" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center text-white text-2xl">
                📦
              </div>
              <h2 className="text-2xl font-semibold ml-4 text-gray-800">Bulk Operations</h2>
            </div>
            <p className="text-gray-600">Import and export data in bulk using CSV files</p>
          </Link>
          
          <div className="bg-gray-100 rounded-lg shadow-lg p-6 opacity-50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-2xl">
                📚
              </div>
              <h2 className="text-2xl font-semibold ml-4 text-gray-800">Learning</h2>
            </div>
            <p className="text-gray-600">Coming soon: Articles, DSA Corner management</p>
          </div>

          <Link href="/login" className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow text-white">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-2xl">
                🔐
              </div>
              <h2 className="text-2xl font-semibold ml-4">Login</h2>
            </div>
            <p className="text-blue-100">Sign in to your admin account</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
