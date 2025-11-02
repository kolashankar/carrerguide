import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import EmptyState from '../../../components/common/EmptyState';
import { toggleBookmark, isBookmarked } from '../../../lib/bookmarks';
import { LinearGradient } from 'expo-linear-gradient';

interface Scholarship {
  _id: string;
  title: string;
  organization_name: string;
  country: string;
  scholarship_type: string;
  field_of_study: string;
  education_level: string;
  amount: number;
  currency: string;
  description: string;
  eligibility_criteria: string[];
  benefits: string[];
  application_process: string[];
  required_documents: string[];
  deadline: string;
  application_url?: string;
  is_active: boolean;
}

export default function ScholarshipDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);

  const { data: scholarship, isLoading, isError } = useQuery({
    queryKey: ['scholarship', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/admin/scholarships/${id}`);
      return response.data.scholarship || response.data || null;
    },
    enabled: !!id,
    retry: 1,
  });

  useEffect(() => {
    if (scholarship) {
      checkBookmark();
    }
  }, [scholarship]);

  const checkBookmark = async () => {
    if (scholarship) {
      const bookmarked = await isBookmarked(scholarship._id);
      setIsBookmarkedState(bookmarked);
    }
  };

  const handleBookmark = async () => {
    if (scholarship) {
      const success = await toggleBookmark(scholarship._id, 'scholarship', scholarship);
      if (success) {
        setIsBookmarkedState(!isBookmarkedState);
      }
    }
  };

  const handleApply = () => {
    if (scholarship?.application_url) {
      Linking.openURL(scholarship.application_url).catch(() => {
        Alert.alert('Error', 'Unable to open the application link');
      });
    } else {
      Alert.alert('Coming Soon', 'Application feature will be available soon');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingSpinner message="Loading scholarship details..." />
      </SafeAreaView>
    );
  }

  if (isError || !scholarship) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <EmptyState
          icon="alert-circle-outline"
          title="Error Loading Scholarship"
          message="Failed to load scholarship details. Please try again."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="mr-3 p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-gray-900 text-lg font-bold flex-1" numberOfLines={1}>
            Scholarship Details
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleBookmark}
          className="p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isBookmarkedState ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isBookmarkedState ? '#2563eb' : '#6b7280'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Scholarship Header */}
        <LinearGradient
          colors={['#9333ea', '#a855f7']}
          className="px-5 py-6"
        >
          <Text className="text-white text-2xl font-extrabold mb-2 leading-tight">{scholarship.title}</Text>
          <View className="flex-row items-center mb-2">
            <Ionicons name="business" size={16} color="#f3e8ff" />
            <Text className="text-purple-100 text-base ml-2">{scholarship.organization_name}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color="#f3e8ff" />
            <Text className="text-purple-100 text-base ml-2">{scholarship.country}</Text>
          </View>
        </LinearGradient>

        {/* Scholarship Info Tags */}
        <View className="px-5 py-4 bg-white">
          <View className="flex-row flex-wrap">
            <View className="bg-blue-100 px-4 py-2 rounded-xl mr-2 mb-2">
              <Text className="text-blue-700 text-sm font-semibold">{scholarship.scholarship_type}</Text>
            </View>
            <View className="bg-green-100 px-4 py-2 rounded-xl mr-2 mb-2">
              <Text className="text-green-700 text-sm font-semibold">{scholarship.education_level}</Text>
            </View>
            <View className="bg-purple-100 px-4 py-2 rounded-xl mb-2">
              <Text className="text-purple-700 text-sm font-semibold">{scholarship.field_of_study}</Text>
            </View>
          </View>
        </View>

        {/* Amount */}
        <View className="bg-white mx-4 rounded-2xl p-5 shadow-sm border border-gray-100">
          <Text className="text-gray-600 text-sm mb-1">Scholarship Amount</Text>
          <Text className="text-gray-900 text-2xl font-extrabold">
            {scholarship.currency} {scholarship.amount.toLocaleString()}
          </Text>
        </View>

        {/* Description */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-gray-100">
          <Text className="text-gray-900 text-lg font-bold mb-3">Description</Text>
          <Text className="text-gray-700 text-base leading-6">{scholarship.description}</Text>
        </View>

        {/* Eligibility Criteria */}
        {scholarship.eligibility_criteria && scholarship.eligibility_criteria.length > 0 && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-gray-900 text-lg font-bold mb-4">Eligibility Criteria</Text>
            {scholarship.eligibility_criteria.map((item: string, index: number) => (
              <View key={index} className="flex-row mb-3">
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text className="text-gray-700 text-base ml-3 flex-1 leading-6">{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Benefits */}
        {scholarship.benefits && scholarship.benefits.length > 0 && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-gray-900 text-lg font-bold mb-4">Benefits</Text>
            {scholarship.benefits.map((item: string, index: number) => (
              <View key={index} className="flex-row mb-3">
                <Ionicons name="star" size={20} color="#f59e0b" />
                <Text className="text-gray-700 text-base ml-3 flex-1 leading-6">{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Application Process */}
        {scholarship.application_process && scholarship.application_process.length > 0 && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-gray-900 text-lg font-bold mb-4">Application Process</Text>
            {scholarship.application_process.map((item: string, index: number) => (
              <View key={index} className="flex-row mb-3">
                <View className="bg-purple-600 w-7 h-7 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-xs font-bold">{index + 1}</Text>
                </View>
                <Text className="text-gray-700 text-base flex-1 leading-6">{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Required Documents */}
        {scholarship.required_documents && scholarship.required_documents.length > 0 && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-gray-900 text-lg font-bold mb-4">Required Documents</Text>
            {scholarship.required_documents.map((item: string, index: number) => (
              <View key={index} className="flex-row mb-3">
                <Ionicons name="document-text" size={20} color="#2563eb" />
                <Text className="text-gray-700 text-base ml-3 flex-1 leading-6">{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Deadline */}
        {scholarship.deadline && (
          <View className="bg-red-50 border-2 border-red-200 mx-4 mt-4 mb-24 rounded-2xl p-5">
            <View className="flex-row items-center">
              <View className="bg-red-600 w-12 h-12 rounded-full items-center justify-center">
                <Ionicons name="alert-circle" size={24} color="#fff" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-red-900 font-bold text-base">Application Deadline</Text>
                <Text className="text-red-700 text-lg font-extrabold mt-1">
                  {new Date(scholarship.deadline).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Apply Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-5 py-4 border-t border-gray-200 shadow-lg">
        <TouchableOpacity
          onPress={handleApply}
        >
          <LinearGradient
            colors={['#9333ea', '#a855f7']}
            className="py-3.5 rounded-xl flex-row items-center justify-center min-h-[52px]"
          >
            <Ionicons name="send" size={20} color="#fff" />
            <Text className="text-white text-base font-bold ml-2">Apply Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
