import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import SearchBar from '../common/SearchBar';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

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

export default function JobsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const router = useRouter();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['jobs', searchQuery, filterCategory],
    queryFn: async () => {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (filterCategory) params.category = filterCategory;
      
      const response = await api.get('/user/jobs', { params });
      return response.data.jobs || [];
    },
  });

  const handleJobPress = (jobId: string) => {
    router.push(`/(tabs)/jobs/${jobId}`);
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
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search jobs by title..."
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
            icon="briefcase-outline"
            title="No Jobs Found"
            message="No jobs available at the moment. Check back later!"
          />
        ) : (
          data?.map((job: Job) => (
            <TouchableOpacity
              key={job._id}
              className="bg-dark-200 rounded-lg p-4 mb-3"
              onPress={() => handleJobPress(job._id)}
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold" numberOfLines={1}>
                    {job.title}
                  </Text>
                  <Text className="text-gray-400 text-sm mt-1">{job.company}</Text>
                </View>
                <View className="bg-primary-600 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-semibold">{job.job_type}</Text>
                </View>
              </View>

              <View className="flex-row flex-wrap mt-2">
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="location-outline" size={14} color="#9ca3af" />
                  <Text className="text-gray-400 text-xs ml-1">{job.location}</Text>
                </View>
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="briefcase-outline" size={14} color="#9ca3af" />
                  <Text className="text-gray-400 text-xs ml-1">{job.experience_level}</Text>
                </View>
                {job.salary_min && job.salary_max && (
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="cash-outline" size={14} color="#9ca3af" />
                    <Text className="text-gray-400 text-xs ml-1">
                      ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-gray-300 text-sm mt-2" numberOfLines={2}>
                {job.description}
              </Text>

              <View className="flex-row items-center justify-between mt-3">
                <View className="bg-dark-300 px-3 py-1 rounded-full">
                  <Text className="text-gray-400 text-xs">{job.category}</Text>
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