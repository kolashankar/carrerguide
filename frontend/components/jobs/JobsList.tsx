import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import SearchBar from '../common/SearchBar';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import CategoryChips from '../common/CategoryChips';
import JobsFilterModal, { JobFilters } from './JobsFilterModal';
import SortModal, { SortOption } from '../common/SortModal';
import { toggleBookmark, isBookmarked } from '../../lib/bookmarks';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  category: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  is_active: boolean;
}

const CATEGORIES = [
  'All',
  'Technology',
  'Marketing',
  'Sales',
  'Finance',
  'Healthcare',
  'Education',
  'Engineering',
];

const SORT_OPTIONS: SortOption[] = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Salary: High to Low', value: 'salary_desc' },
  { label: 'Salary: Low to High', value: 'salary_asc' },
  { label: 'Company Name: A-Z', value: 'company_asc' },
];

export default function JobsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<JobFilters>({
    jobTypes: [],
    experienceLevels: [],
    salaryMin: 0,
    salaryMax: 200000,
    location: '',
    postedDate: '',
  });
  const router = useRouter();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['jobs', searchQuery, selectedCategory, filters, sortBy],
    queryFn: async () => {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (filters.jobTypes.length > 0) params.job_type = filters.jobTypes.join(',');
      if (filters.experienceLevels.length > 0)
        params.experience_level = filters.experienceLevels.join(',');
      if (filters.location) params.location = filters.location;
      if (filters.salaryMin > 0) params.salary_min = filters.salaryMin;
      if (filters.salaryMax < 200000) params.salary_max = filters.salaryMax;
      if (sortBy) params.sort = sortBy;

      const response = await api.get('/user/jobs', { params });
      return response.data.jobs || [];
    },
  });

  // Load bookmarks on mount
  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const bookmarkedIds = new Set<string>();
    if (data) {
      for (const job of data) {
        if (await isBookmarked(job._id)) {
          bookmarkedIds.add(job._id);
        }
      }
      setBookmarkedJobs(bookmarkedIds);
    }
  };

  const handleJobPress = (jobId: string) => {
    router.push(`/(tabs)/jobs/${jobId}`);
  };

  const handleBookmark = async (job: Job, e: any) => {
    e.stopPropagation();
    const success = await toggleBookmark(job._id, 'job', job);
    if (success) {
      setBookmarkedJobs((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(job._id)) {
          newSet.delete(job._id);
        } else {
          newSet.add(job._id);
        }
        return newSet;
      });
    }
  };

  const handleApplyFilters = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortSelect = (sort: string) => {
    setSortBy(sort);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading jobs..." />;
  }

  if (isError) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Error Loading Jobs"
        message="Failed to load jobs. Please try again."
      />
    );
  }

  return (
    <View className="flex-1">
      {/* Search Bar */}
      <View className="pt-3">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search jobs by title..."
        />
      </View>

      {/* Filter and Sort Buttons */}
      <View className="flex-row px-4 py-2 bg-gray-50">
        <TouchableOpacity
          className="flex-row items-center bg-white border border-gray-200 px-4 py-2.5 rounded-xl mr-2 shadow-sm min-h-[44px]"
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options-outline" size={18} color="#374151" />
          <Text className="text-gray-700 ml-2 font-semibold text-sm">Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm min-h-[44px]"
          onPress={() => setShowSort(true)}
        >
          <Ionicons name="swap-vertical-outline" size={18} color="#374151" />
          <Text className="text-gray-700 ml-2 font-semibold text-sm">Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Category Chips */}
      <CategoryChips
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      <ScrollView
        className="flex-1 px-4 bg-gray-50"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#2563eb"
          />
        }
      >
        {data && data.length === 0 ? (
          <EmptyState
            icon="briefcase-outline"
            title="No Jobs Found"
            message="No jobs available at the moment. Check back later!"
          />
        ) : (
          data?.map((job: Job) => (
            <TouchableOpacity
              key={job._id}
              className="bg-white rounded-2xl border border-gray-100 p-4 mb-3 shadow-sm"
              onPress={() => handleJobPress(job._id)}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-3">
                  <Text className="text-gray-900 text-base font-bold leading-5" numberOfLines={2}>
                    {job.title}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1.5">{job.company}</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="bg-blue-600 px-3 py-1.5 rounded-full mr-2">
                    <Text className="text-white text-xs font-semibold">{job.job_type}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={(e) => handleBookmark(job, e)}
                    className="p-1"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={bookmarkedJobs.has(job._id) ? 'bookmark' : 'bookmark-outline'}
                      size={22}
                      color={bookmarkedJobs.has(job._id) ? '#2563eb' : '#9ca3af'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row flex-wrap mt-2">
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="location-outline" size={16} color="#6b7280" />
                  <Text className="text-gray-600 text-xs ml-1.5">{job.location}</Text>
                </View>
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="briefcase-outline" size={16} color="#6b7280" />
                  <Text className="text-gray-600 text-xs ml-1.5">{job.experience_level}</Text>
                </View>
                {job.salary_min && job.salary_max && (
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="cash-outline" size={16} color="#6b7280" />
                    <Text className="text-gray-600 text-xs ml-1.5">
                      ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-gray-600 text-sm mt-2.5 leading-5" numberOfLines={2}>
                {job.description}
              </Text>

              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <View className="bg-gray-100 px-3 py-1.5 rounded-full">
                  <Text className="text-gray-700 text-xs font-medium">{job.category}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Filter Modal */}
      <JobsFilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />

      {/* Sort Modal */}
      <SortModal
        visible={showSort}
        onClose={() => setShowSort(false)}
        onSelect={handleSortSelect}
        currentSort={sortBy}
        options={SORT_OPTIONS}
      />
    </View>
  );
}
