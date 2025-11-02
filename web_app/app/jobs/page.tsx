'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { FAQ } from '@/components/common/FAQ';
import { DiscoverMore } from '@/components/common/DiscoverMore';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryChips } from '@/components/common/CategoryChips';
import { SortDropdown } from '@/components/common/SortDropdown';
import { JobFilters } from '@/components/jobs/JobFilters';
import { JobCard } from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api';
import { Job, Internship, Scholarship } from '@/types';
import { Loader2 } from 'lucide-react';

type TabType = 'jobs' | 'internships' | 'fresherjobs';

const categories = ['Technology', 'Marketing', 'Sales', 'Design', 'Finance', 'Healthcare', 'Education'];

const jobTypes = [
  { label: 'Full Time', value: 'Full-time' },
  { label: 'Part Time', value: 'Part-time' },
  { label: 'Contract', value: 'Contract' },
  { label: 'Remote', value: 'Remote' },
];

const experienceLevels = [
  { label: 'Entry Level', value: 'Entry Level' },
  { label: 'Mid Level', value: 'Mid Level' },
  { label: 'Senior Level', value: 'Senior Level' },
  { label: 'Lead', value: 'Lead' },
];

const sortOptions = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Salary: High to Low', value: 'salary_desc' },
  { label: 'Salary: Low to High', value: 'salary_asc' },
  { label: 'Company Name', value: 'company' },
];

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  // Fetch data based on active tab
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [activeTab, searchQuery, selectedCategory, sortBy, filters],
    queryFn: async () => {
      const params: unknown = {
        search: searchQuery || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        sort: sortBy,
        limit: 50,
      };

      if (filters.jobTypes?.length > 0) {
        params.job_type = filters.jobTypes.join(',');
      }
      if (filters.experienceLevels?.length > 0) {
        params.experience_level = filters.experienceLevels.join(',');
      }

      switch (activeTab) {
        case 'jobs':
          return await apiClient.getJobs(params);
        case 'internships':
          return await apiClient.getInternships(params);
        case 'fresherjobs':
          return await apiClient.getJobs({ ...params, experience_level: 'Entry Level' });
      }
    },
  });

  const items = data?.data || [];

  const handleApplyFilters = (newFilters: unknown) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {activeTab === 'jobs' && 'Find Your Dream Job'}
            {activeTab === 'internships' && 'Explore Internships'}
            {activeTab === 'scholarships' && 'Discover Scholarships'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {activeTab === 'jobs' && 'Browse through 50,000+ job opportunities from top companies'}
            {activeTab === 'internships' && 'Gain valuable experience with internships from leading organizations'}
            {activeTab === 'scholarships' && 'Find scholarships to support your educational journey'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 justify-center">
          {(['jobs', 'internships', 'scholarships'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-semibold capitalize rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search ${activeTab}...`}
          />
        </div>

        {/* Category Chips */}
        <div className="mb-6">
          <CategoryChips
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center justify-between mb-6">
          <JobFilters
            jobTypes={jobTypes}
            experienceLevels={experienceLevels}
            onApplyFilters={handleApplyFilters}
            onReset={handleResetFilters}
          />
          <SortDropdown options={sortOptions} value={sortBy} onChange={setSortBy} />
        </div>

        {/* Content */}
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block">
            <JobFilters
              jobTypes={jobTypes}
              experienceLevels={experienceLevels}
              onApplyFilters={handleApplyFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600 mb-4">Failed to load {activeTab}</p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg mb-2">No {activeTab} found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Found {items.length} {activeTab}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item: unknown) => (
                    <JobCard key={item.id} job={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Discover More */}
      <DiscoverMore />

      {/* FAQ */}
      <FAQ items={[
        {
          question: 'How do I apply for jobs on CareerGuide?',
          answer: 'Browse through our job listings, click on any job that interests you, and follow the application instructions. Most jobs have direct application links to company career pages.'
        },
        {
          question: 'Are these job postings free to access?',
          answer: 'Yes! All job listings on CareerGuide are completely free to access. We partner with companies to bring you the latest opportunities.'
        },
        {
          question: 'How often are job listings updated?',
          answer: 'We update our job listings daily with fresh opportunities from top companies. Enable notifications to get alerts for new postings.'
        },
        {
          question: 'Can I filter jobs by location and experience level?',
          answer: 'Yes! Use our advanced filters to narrow down jobs by location, experience level, job type, and more to find the perfect match.'
        },
      ]} />

      <Footer />
    </div>
  );
}
