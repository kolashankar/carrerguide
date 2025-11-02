import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../../lib/api';
import HamburgerMenu from '../../../components/common/HamburgerMenu';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      if (!id) {
        return null;
      }
      try {
        const response = await api.get(`/user/jobs/${id}`);
        return response.data.job || response.data || null;
      } catch (error) {
        console.error('Error fetching job:', error);
        return null;
      }
    },
    enabled: !!id,
    retry: 1,
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-gray-600 mt-4 text-base">Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !job) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#9ca3af" />
          <Text className="text-gray-900 text-xl font-bold mt-4">Job Not Found</Text>
          <Text className="text-gray-600 text-center mt-2 leading-6">The job you're looking for doesn't exist or has been removed.</Text>
          <TouchableOpacity
            className="bg-blue-600 px-6 py-3.5 rounded-xl mt-6 min-h-[48px] justify-center"
            onPress={() => router.back()}
          >
            <Text className="text-white font-bold text-base">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => setMenuVisible(true)} 
          className="mr-3 p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu" size={26} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mr-3 p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-gray-900 text-lg font-bold flex-1" numberOfLines={1}>Job Details</Text>
        <TouchableOpacity
          className="p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="bookmark-outline" size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Job Header */}
        <LinearGradient
          colors={['#2563eb', '#4f46e5']}
          className="px-5 py-6"
        >
          <Text className="text-white text-2xl font-extrabold mb-2 leading-tight">{job.title}</Text>
          <Text className="text-blue-100 text-lg mb-4">{job.company}</Text>
          
          <View className="flex-row flex-wrap">
            <View className="bg-white/20 px-4 py-2 rounded-full mr-2 mb-2">
              <Text className="text-white font-semibold text-sm">{job.job_type}</Text>
            </View>
            <View className="bg-white/20 px-4 py-2 rounded-full mr-2 mb-2">
              <Text className="text-white font-semibold text-sm">{job.category}</Text>
            </View>
            <View className="bg-white/20 px-4 py-2 rounded-full mb-2">
              <Text className="text-white font-semibold text-sm">{job.experience_level}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Job Details */}
        <View className="px-5 py-6">
          {/* Location & Salary */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <Ionicons name="location" size={22} color="#2563eb" />
              <Text className="text-gray-900 text-base ml-3 flex-1">{job.location}</Text>
            </View>
            {job.salary_min && job.salary_max && (
              <View className="flex-row items-center">
                <Ionicons name="cash" size={22} color="#10b981" />
                <Text className="text-gray-900 text-base ml-3">
                  ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
            <Text className="text-gray-900 text-lg font-bold mb-3">Job Description</Text>
            <Text className="text-gray-600 text-base leading-6">{job.description}</Text>
          </View>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
              <Text className="text-gray-900 text-lg font-bold mb-3">Required Skills</Text>
              <View className="flex-row flex-wrap">
                {job.skills.map((skill: string, index: number) => (
                  <View
                    key={index}
                    className="bg-blue-50 px-4 py-2 rounded-full mr-2 mb-2 border border-blue-200"
                  >
                    <Text className="text-blue-600 font-semibold text-sm">{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
              <Text className="text-gray-900 text-lg font-bold mb-3">Responsibilities</Text>
              {job.responsibilities.map((resp: string, index: number) => (
                <View key={index} className="flex-row mb-3">
                  <Text className="text-blue-600 text-base mr-3">•</Text>
                  <Text className="text-gray-600 text-base flex-1 leading-6">{resp}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Qualifications */}
          {job.qualifications && job.qualifications.length > 0 && (
            <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
              <Text className="text-gray-900 text-lg font-bold mb-3">Qualifications</Text>
              {job.qualifications.map((qual: string, index: number) => (
                <View key={index} className="flex-row mb-3">
                  <Text className="text-green-600 text-base mr-3">✓</Text>
                  <Text className="text-gray-600 text-base flex-1 leading-6">{qual}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
              <Text className="text-gray-900 text-lg font-bold mb-3">Benefits</Text>
              {job.benefits.map((benefit: string, index: number) => (
                <View key={index} className="flex-row mb-3">
                  <Ionicons name="star" size={18} color="#f59e0b" />
                  <Text className="text-gray-600 text-base ml-2 flex-1 leading-6">{benefit}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View className="px-5 py-4 bg-white border-t border-gray-200">
        <TouchableOpacity className="bg-blue-600 py-4 rounded-xl items-center shadow-md">
          <Text className="text-white font-bold text-lg">Apply Now</Text>
        </TouchableOpacity>
      </View>

      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
