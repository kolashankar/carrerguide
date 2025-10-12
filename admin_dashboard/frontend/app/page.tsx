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
          
          <div className="bg-gray-100 rounded-lg shadow-lg p-6 opacity-50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-2xl">
                📚
              </div>
              <h2 className="text-2xl font-semibold ml-4 text-gray-800">Learning</h2>
            </div>
            <p className="text-gray-600">Coming soon: Articles, DSA, Roadmaps</p>
          </div>
          
          <div className="bg-gray-100 rounded-lg shadow-lg p-6 opacity-50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white text-2xl">
                🛠️
              </div>
              <h2 className="text-2xl font-semibold ml-4 text-gray-800">Career Tools</h2>
            </div>
            <p className="text-gray-600">Coming soon: Resume, Cover Letter, ATS</p>
          </div>
          
          <div className="bg-gray-100 rounded-lg shadow-lg p-6 opacity-50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-2xl">
                📊
              </div>
              <h2 className="text-2xl font-semibold ml-4 text-gray-800">Analytics</h2>
            </div>
            <p className="text-gray-600">Coming soon: User engagement and stats</p>
          </div>
        </div>
      </div>
    </div>
  )
}
