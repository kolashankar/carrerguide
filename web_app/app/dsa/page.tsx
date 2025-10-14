'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Dashboard } from '@/components/dsa/Dashboard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { Code, BookOpen, FileText, Building, ArrowRight } from 'lucide-react';

export default function DSAPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dsa-dashboard'],
    queryFn: async () => {
      const response = await apiClient.getDSADashboard();
      return response;
    },
  });

  const stats = data?.data || {
    problems_solved: 0,
    current_streak: 0,
    difficulty_breakdown: { easy: 0, medium: 0, hard: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center mb-4">
              <Code className="w-8 h-8 mr-3" />
              <h1 className="text-4xl font-bold">DSA Corner</h1>
            </div>
            <p className="text-xl text-blue-100">
              Master Data Structures & Algorithms for your dream tech career
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <Dashboard stats={stats} />
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dsa/questions">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Questions
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Practice problems sorted by difficulty and topics
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                Browse Questions
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link href="/dsa/topics">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                Topics
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Explore problems organized by data structure topics
              </p>
              <div className="flex items-center text-green-600 text-sm font-medium">
                Browse Topics
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link href="/dsa/sheets">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                Sheets
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Curated problem lists for systematic practice
              </p>
              <div className="flex items-center text-purple-600 text-sm font-medium">
                Browse Sheets
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link href="/dsa/companies">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <Building className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600">
                Companies
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Practice problems asked by top tech companies
              </p>
              <div className="flex items-center text-orange-600 text-sm font-medium">
                Browse Companies
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}