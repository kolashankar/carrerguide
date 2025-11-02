'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { FAQ } from '@/components/common/FAQ';
import { DiscoverMore } from '@/components/common/DiscoverMore';
import { ScholarshipCard } from '@/components/scholarships/ScholarshipCard';
import { SearchBar } from '@/components/common/SearchBar';
import { SortDropdown } from '@/components/common/SortDropdown';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { GraduationCap, TrendingUp } from 'lucide-react';
import { Scholarship } from '@/types';

const CATEGORIES = [
  'All',
  'Merit-Based',
  'Need-Based',
  'Athletic',
  'Academic Excellence',
  'Research',
  'Arts & Culture',
  'Community Service',
];

const EDUCATION_LEVELS = ['All', 'Undergraduate', 'Postgraduate', 'PhD', 'High School'];

const SORT_OPTIONS = [
  { label: 'Deadline: Closest First', value: 'deadline' },
  { label: 'Amount: High to Low', value: '-amount_max' },
  { label: 'Amount: Low to High', value: 'amount_max' },
  { label: 'Most Recent', value: '-created_at' },
];

export default function ScholarshipsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('deadline');

  const { data, isLoading, error } = useQuery({
    queryKey: ['scholarships', searchQuery, selectedCategory, selectedLevel, sortBy],
    queryFn: async () => {
      const params: unknown = {
        search: searchQuery || undefined,
        sort: sortBy,
      };

      if (selectedCategory !== 'All') {
        params.scholarship_type = selectedCategory;
      }

      if (selectedLevel !== 'All') {
        params.education_level = selectedLevel;
      }

      const response = await apiClient.getScholarships(params);
      return response;
    },
  });

  const scholarships: Scholarship[] = data?.data || [];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center mb-4">
                <GraduationCap className="w-8 h-8 mr-3" />
                <h1 className="text-4xl font-bold">Scholarships</h1>
              </div>
              <p className="text-xl text-purple-100">
                Find and apply for scholarships to fund your education and career growth
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Category Tabs */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-3 pb-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                  }`}
                  data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Education Level Filter */}
          <div className="mb-6">
            <div className="flex space-x-3">
              {EDUCATION_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedLevel === level
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  data-testid={`level-${level.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Sort Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search scholarships by title, provider, or field..."
              />
            </div>
            <SortDropdown
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={setSortBy}
            />
          </div>

          {/* Scholarships Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-96" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load scholarships</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : scholarships.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No scholarships found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Found {scholarships.length} scholarship{scholarships.length !== 1 ? 's' : ''}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships.map((scholarship) => (
                  <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Discover More */}
      <DiscoverMore />

      {/* FAQ */}
      <FAQ items={[
        {
          question: 'When will the scholarships section be available?',
          answer: 'We are working hard to launch the scholarships section soon. Stay tuned for updates!'
        },
        {
          question: 'What types of scholarships will be available?',
          answer: 'We will feature merit-based, need-based, and specialized scholarships for students across various fields and educational levels.'
        },
        {
          question: 'Will the scholarship search be free?',
          answer: 'Yes! All scholarship listings and applications through CareerGuide will be completely free for students.'
        },
        {
          question: 'Can I get notified when new scholarships are posted?',
          answer: 'Yes, once launched, you can enable notifications to receive alerts about new scholarship opportunities that match your profile.'
        },
      ]} />

      <Footer />
    </>
  );
}
