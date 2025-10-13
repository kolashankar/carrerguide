import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import SearchBar from '../common/SearchBar';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

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

export default function InternshipsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['internships', searchQuery],
    queryFn: async () => {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      
      const response = await api.get('/user/internships', { params });
      return response.data.internships || [];
    },
  });

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
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search internships..."
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
            title="No Internships Found"
            message="No internships available at the moment. Check back later!"
          />
        ) : (
          data?.map((internship: Internship) => (
            <TouchableOpacity
              key={internship._id}
              className="bg-dark-200 rounded-lg p-4 mb-3"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold" numberOfLines={1}>
                    {internship.title}
                  </Text>
                  <Text className="text-gray-400 text-sm mt-1">{internship.company}</Text>
                </View>
                <View className="bg-green-600 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-semibold">
                    {internship.internship_type}
                  </Text>
                </View>
              </View>

              <View className="flex-row flex-wrap mt-2">
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="location-outline" size={14} color="#9ca3af" />
                  <Text className="text-gray-400 text-xs ml-1">{internship.location}</Text>
                </View>
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="time-outline" size={14} color="#9ca3af" />
                  <Text className="text-gray-400 text-xs ml-1">{internship.duration}</Text>
                </View>
                {internship.stipend_min && internship.stipend_max && (
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="cash-outline" size={14} color="#9ca3af" />
                    <Text className="text-gray-400 text-xs ml-1">
                      ${internship.stipend_min} - ${internship.stipend_max}/month
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-gray-300 text-sm mt-2" numberOfLines={2}>
                {internship.description}
              </Text>

              <View className="flex-row items-center justify-between mt-3">
                <View className="bg-dark-300 px-3 py-1 rounded-full">
                  <Text className="text-gray-400 text-xs">{internship.category}</Text>
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