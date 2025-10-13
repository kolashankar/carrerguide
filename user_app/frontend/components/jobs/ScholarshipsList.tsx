import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import SearchBar from '../common/SearchBar';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

interface Scholarship {
  _id: string;
  name: string;
  provider: string;
  scholarship_type: string;
  education_level: string;
  country: string;
  amount_min?: number;
  amount_max?: number;
  deadline: string;
  description: string;
  is_active: boolean;
}

export default function ScholarshipsList() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['scholarships', searchQuery],
    queryFn: async () => {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      
      const response = await api.get('/user/scholarships', { params });
      return response.data.scholarships || [];
    },
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading scholarships..." />;
  }

  if (isError) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Error Loading Scholarships"
        message="Failed to load scholarships. Please try again."
      />
    );
  }

  return (
    <View className="flex-1">
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search scholarships..."
      />

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#3b82f6"
          />
        }
      >
        {data && data.length === 0 ? (
          <EmptyState
            icon="school-outline"
            title="No Scholarships Found"
            message="No scholarships available at the moment. Check back later!"
          />
        ) : (
          data?.map((scholarship: Scholarship) => (
            <TouchableOpacity
              key={scholarship._id}
              className="bg-dark-200 rounded-lg p-4 mb-3"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold" numberOfLines={1}>
                    {scholarship.name}
                  </Text>
                  <Text className="text-gray-400 text-sm mt-1">{scholarship.provider}</Text>
                </View>
                <View className="bg-purple-600 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-semibold">
                    {scholarship.scholarship_type}
                  </Text>
                </View>
              </View>

              <View className="flex-row flex-wrap mt-2">
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="globe-outline" size={14} color="#9ca3af" />
                  <Text className="text-gray-400 text-xs ml-1">{scholarship.country}</Text>
                </View>
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="school-outline" size={14} color="#9ca3af" />
                  <Text className="text-gray-400 text-xs ml-1">
                    {scholarship.education_level}
                  </Text>
                </View>
                {scholarship.amount_min && scholarship.amount_max && (
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="cash-outline" size={14} color="#9ca3af" />
                    <Text className="text-gray-400 text-xs ml-1">
                      ${scholarship.amount_min.toLocaleString()} - $
                      {scholarship.amount_max.toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-gray-300 text-sm mt-2" numberOfLines={2}>
                {scholarship.description}
              </Text>

              <View className="flex-row items-center justify-between mt-3">
                <View className="bg-red-600 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs">Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}