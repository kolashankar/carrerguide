import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import SearchBar from '../common/SearchBar';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import CategoryChips from '../common/CategoryChips';
import InternshipsFilterModal, { InternshipFilters } from './InternshipsFilterModal';
import SortModal, { SortOption } from '../common/SortModal';
import { toggleBookmark, isBookmarked } from '../../lib/bookmarks';

interface Internship {
  _id: string;
  title: string;
  company: string;
  location: string;
  internship_type: string;
  category: string;
  duration: string;
  stipend_min?: number;
  stipend_max?: number;
  description: string;
  is_active: boolean;
}

const CATEGORIES = [
  'All',
  'Technology',
  'Marketing',
  'Design',
  'Finance',
  'Engineering',
  'Business',
  'Research',
];

const SORT_OPTIONS: SortOption[] = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Stipend: High to Low', value: 'stipend_desc' },
  { label: 'Stipend: Low to High', value: 'stipend_asc' },
  { label: 'Duration', value: 'duration' },
];

export default function InternshipsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [bookmarkedInternships, setBookmarkedInternships] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<InternshipFilters>({
    internshipTypes: [],
    durations: [],
    isPaid: 'all',
    locationTypes: [],
    stipendMin: 0,
    stipendMax: 5000,
    location: '',
  });
  const router = useRouter();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['internships', searchQuery, selectedCategory, filters, sortBy],
    queryFn: async () => {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (filters.internshipTypes.length > 0)
        params.internship_type = filters.internshipTypes.join(',');
      if (filters.location) params.location = filters.location;
      if (filters.stipendMin > 0) params.stipend_min = filters.stipendMin;
      if (filters.stipendMax < 5000) params.stipend_max = filters.stipendMax;
      if (sortBy) params.sort = sortBy;

      const response = await api.get('/user/internships', { params });
      return response.data.internships || [];
    },
  });

  useEffect(() => {
    loadBookmarks();
  }, [data]);

  const loadBookmarks = async () => {
    const bookmarkedIds = new Set<string>();
    if (data) {
      for (const internship of data) {
        if (await isBookmarked(internship._id)) {
          bookmarkedIds.add(internship._id);
        }
      }
      setBookmarkedInternships(bookmarkedIds);
    }
  };

  const handleBookmark = async (internship: Internship, e: any) => {
    e.stopPropagation();
    const success = await toggleBookmark(internship._id, 'internship', internship);
    if (success) {
      setBookmarkedInternships((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(internship._id)) {
          newSet.delete(internship._id);
        } else {
          newSet.add(internship._id);
        }
        return newSet;
      });
    }
  };

  const handleApplyFilters = (newFilters: InternshipFilters) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading internships..." />;
  }

  if (isError) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Error Loading Internships"
        message="Failed to load internships. Please try again."
      />
    );
  }

  return (
    <View className="flex-1">
      <View className="pt-3">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search internships..."
        />
      </View>

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

      <CategoryChips
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
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
            icon="school-outline"
            title="No Internships Found"
            message="No internships available at the moment. Check back later!"
          />
        ) : (
          data?.map((internship: Internship) => (
            <TouchableOpacity
              key={internship._id}
              className="bg-white rounded-2xl border border-gray-100 p-4 mb-3 shadow-sm"
              onPress={() => router.push(`/(tabs)/jobs/internship-${internship._id}`)}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-3">
                  <Text className="text-gray-900 text-base font-bold leading-5" numberOfLines={2}>
                    {internship.title}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1.5">{internship.company}</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="bg-green-600 px-3 py-1.5 rounded-full mr-2">
                    <Text className="text-white text-xs font-semibold">
                      {internship.internship_type}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={(e) => handleBookmark(internship, e)}
                    className="p-1"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={
                        bookmarkedInternships.has(internship._id)
                          ? 'bookmark'
                          : 'bookmark-outline'
                      }
                      size={22}
                      color={
                        bookmarkedInternships.has(internship._id) ? '#2563eb' : '#9ca3af'
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row flex-wrap mt-2">
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="location-outline" size={16} color="#6b7280" />
                  <Text className="text-gray-600 text-xs ml-1.5">{internship.location}</Text>
                </View>
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="time-outline" size={16} color="#6b7280" />
                  <Text className="text-gray-600 text-xs ml-1.5">{internship.duration}</Text>
                </View>
                {internship.stipend_min && internship.stipend_max && (
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="cash-outline" size={16} color="#6b7280" />
                    <Text className="text-gray-600 text-xs ml-1.5">
                      ${internship.stipend_min} - ${internship.stipend_max}/month
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-gray-600 text-sm mt-2.5 leading-5" numberOfLines={2}>
                {internship.description}
              </Text>

              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <View className="bg-gray-100 px-3 py-1.5 rounded-full">
                  <Text className="text-gray-700 text-xs font-medium">{internship.category}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <InternshipsFilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />

      <SortModal
        visible={showSort}
        onClose={() => setShowSort(false)}
        onSelect={setSortBy}
        currentSort={sortBy}
        options={SORT_OPTIONS}
      />
    </View>
  );
}
