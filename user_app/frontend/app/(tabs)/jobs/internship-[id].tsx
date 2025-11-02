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

interface Internship {
  _id: string;
  title: string;
  company_name: string;
  location: string;
  internship_type: string;
  category: string;
  duration: string;
  is_paid: boolean;
  stipend_amount?: number;
  stipend_currency?: string;
  description: string;
  skills_required: string[];
  responsibilities: string[];
  qualifications: string[];
  learning_outcomes: string[];
  start_date?: string;
  application_deadline?: string;
  application_url?: string;
  is_active: boolean;
}

export default function InternshipDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);

  const { data: internship, isLoading, isError } = useQuery({
    queryKey: ['internship', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/admin/internships/${id}`);
      return response.data.internship || response.data || null;
    },
    enabled: !!id,
    retry: 1,
  });

  useEffect(() => {
    if (internship) {
      checkBookmark();
    }
  }, [internship]);

  const checkBookmark = async () => {
    if (internship) {
      const bookmarked = await isBookmarked(internship._id);
      setIsBookmarkedState(bookmarked);
    }
  };

  const handleBookmark = async () => {
    if (internship) {
      const success = await toggleBookmark(internship._id, 'internship', internship);
      if (success) {
        setIsBookmarkedState(!isBookmarkedState);
      }
    }
  };

  const handleApply = () => {
    if (internship?.application_url) {
      Linking.openURL(internship.application_url).catch(() => {
        Alert.alert('Error', 'Unable to open the application link');
      });
    } else {
      Alert.alert('Coming Soon', 'Application feature will be available soon');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingSpinner message="Loading internship details..." />
      </SafeAreaView>
    );
  }

  if (isError || !internship) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <EmptyState
          icon="alert-circle-outline"
          title="Error Loading Internship"
          message="Failed to load internship details. Please try again."
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
            Internship Details
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
        {/* Internship Header */}
        <LinearGradient
          colors={['#16a34a', '#22c55e']}
          className="px-5 py-6"
        >
          <Text className="text-white text-2xl font-extrabold mb-2 leading-tight">{internship.title}</Text>
          <View className="flex-row items-center mb-2">
            <Ionicons name="business" size={16} color="#dcfce7" />
            <Text className="text-green-100 text-base ml-2">{internship.company_name}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color="#dcfce7" />
            <Text className="text-green-100 text-base ml-2">{internship.location}</Text>
          </View>
        </LinearGradient>

        {/* Internship Info Tags */}
        <View className="px-5 py-4 bg-white">
          <View className="flex-row flex-wrap">
            <View className="bg-blue-100 px-4 py-2 rounded-xl mr-2 mb-2">
              <Text className="text-blue-700 text-sm font-semibold">{internship.internship_type}</Text>
            </View>
            <View className="bg-purple-100 px-4 py-2 rounded-xl mr-2 mb-2">
              <Text className="text-purple-700 text-sm font-semibold">{internship.category}</Text>
            </View>
            <View className="bg-orange-100 px-4 py-2 rounded-xl mb-2">
              <Text className="text-orange-700 text-sm font-semibold">{internship.duration}</Text>
            </View>
          </View>
        </View>

        {/* Stipend */}
        <View className="bg-white mx-4 rounded-2xl p-5 shadow-sm border border-gray-100">
          <Text className="text-gray-600 text-sm mb-1">Stipend</Text>
          {internship.is_paid && internship.stipend_amount ? (
            <Text className="text-gray-900 text-xl font-bold">
              {internship.stipend_currency || '$'} {internship.stipend_amount.toLocaleString()}/month
            </Text>
          ) : (
            <Text className="text-gray-900 text-xl font-bold">Unpaid</Text>
          )}
        </View>

        {/* Description */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-gray-100">
          <Text className="text-gray-900 text-lg font-bold mb-3">Description</Text>
          <Text className="text-gray-700 text-base leading-6">{internship.description}</Text>
        </View>

        {/* Skills Required */}
        {internship.skills_required && internship.skills_required.length > 0 && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-gray-900 text-lg font-bold mb-3">Skills Required</Text>
            <View className="flex-row flex-wrap">
              {internship.skills_required.map((skill: string, index: number) => (
                <View key={index} className="bg-blue-100 px-4 py-2 rounded-xl mr-2 mb-2">
                  <Text className="text-blue-700 text-sm font-semibold">{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Responsibilities */}
        {internship.responsibilities && internship.responsibilities.length > 0 && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-gray-900 text-lg font-bold mb-3">Responsibilities</Text>
            {internship.responsibilities.map((item: string, index: number) => (
              <View key={index} className="flex-row mb-3">
                <View className="bg-green-600 w-2 h-2 rounded-full mt-2 mr-3" />
                <Text className="text-gray-700 text-base flex-1 leading-6">{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Qualifications */}
        {internship.qualifications && internship.qualifications.length > 0 && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-gray-900 text-lg font-bold mb-3">Qualifications</Text>
            {internship.qualifications.map((item: string, index: number) => (
              <View key={index} className="flex-row mb-3">
                <View className="bg-blue-600 w-2 h-2 rounded-full mt-2 mr-3" />
                <Text className="text-gray-700 text-base flex-1 leading-6">{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Learning Outcomes */}
        {internship.learning_outcomes && internship.learning_outcomes.length > 0 && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-gray-900 text-lg font-bold mb-3">Learning Outcomes</Text>
            {internship.learning_outcomes.map((item: string, index: number) => (
              <View key={index} className="flex-row mb-3">
                <Ionicons name="school" size={20} color="#10b981" />
                <Text className="text-gray-700 text-base ml-3 flex-1 leading-6">{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Dates */}
        <View className="bg-white mx-4 mt-4 mb-24 rounded-2xl p-5 shadow-sm border border-gray-100">
          {internship.start_date && (
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 w-12 h-12 rounded-xl items-center justify-center">
                <Ionicons name="calendar-outline" size={22} color="#2563eb" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-600 text-xs">Start Date</Text>
                <Text className="text-gray-900 text-base font-semibold mt-0.5">
                  {new Date(internship.start_date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
          {internship.application_deadline && (
            <View className="flex-row items-center">
              <View className="bg-orange-100 w-12 h-12 rounded-xl items-center justify-center">
                <Ionicons name="time-outline" size={22} color="#ea580c" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-600 text-xs">Application Deadline</Text>
                <Text className="text-gray-900 text-base font-semibold mt-0.5">
                  {new Date(internship.application_deadline).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-5 py-4 border-t border-gray-200 shadow-lg">
        <TouchableOpacity
          onPress={handleApply}
        >
          <LinearGradient
            colors={['#16a34a', '#22c55e']}
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
