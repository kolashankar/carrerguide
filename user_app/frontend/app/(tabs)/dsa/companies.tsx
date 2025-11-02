import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import SearchBar from '../../../components/common/SearchBar';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import EmptyState from '../../../components/common/EmptyState';
import HamburgerMenu from '../../../components/common/HamburgerMenu';

interface Company {
  _id: string;
  name: string;
  logo: string;
  industry: string;
  problem_count: number;
  job_count: number;
}

const industryColors: { [key: string]: string[] } = {
  'Technology': ['#2563eb', '#3b82f6'],
  'Finance': ['#10b981', '#059669'],
  'E-commerce': ['#f59e0b', '#d97706'],
  'Healthcare': ['#ef4444', '#dc2626'],
  'Consulting': ['#8b5cf6', '#7c3aed'],
  'default': ['#6b7280', '#4b5563'],
};

export default function CompaniesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['dsa-companies', searchQuery],
    queryFn: async () => {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      
      const response = await api.get('/admin/dsa/companies', { params });
      return response.data.companies || [];
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingSpinner message="Loading companies..." />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <EmptyState
          icon="alert-circle-outline"
          title="Error Loading Companies"
          message="Failed to load companies. Please try again."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#ea580c', '#f97316', '#fb923c']}
        className="px-5 py-5 shadow-lg"
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => setMenuVisible(true)} 
            className="mr-3 p-2 active:opacity-70"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu" size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="mr-3 p-2 active:opacity-70"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-2xl font-extrabold">Top Companies</Text>
          </View>
        </View>
        <View className="bg-white/20 backdrop-blur rounded-xl p-3">
          <Text className="text-white text-base font-bold">Interview Prep by Company</Text>
          <Text className="text-orange-100 text-sm mt-0.5">{data?.length || 0} companies available</Text>
        </View>
      </LinearGradient>

      <View className="px-4 py-4">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search companies..."
        />
      </View>

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#ea580c"
          />
        }
      >
        {data && data.length === 0 ? (
          <EmptyState
            icon="business-outline"
            title="No Companies Found"
            message="No companies available. Check back later!"
          />
        ) : (
          data?.map((company: Company, index: number) => {
            const colors = industryColors[company.industry] || industryColors.default;
            return (
              <TouchableOpacity
                key={company._id}
                className="bg-white rounded-3xl p-5 mb-4 shadow-md"
                onPress={() => router.push(`/dsa/company-${company._id}`)}
                activeOpacity={0.8}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-center">
                  {/* Company Logo */}
                  <LinearGradient
                    colors={['#f8fafc', '#ffffff']}
                    className="w-20 h-20 rounded-2xl items-center justify-center mr-4 shadow-sm border-2 border-gray-100"
                  >
                    <Text className="text-4xl">{company.logo}</Text>
                  </LinearGradient>
                  
                  <View className="flex-1">
                    {/* Company Name */}
                    <Text className="text-gray-900 text-lg font-extrabold leading-6 mb-1" numberOfLines={1}>
                      {company.name}
                    </Text>
                    
                    {/* Industry Badge */}
                    <View className="flex-row items-center mb-3">
                      <View className="bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                        <Text className="text-orange-700 text-xs font-bold">{company.industry}</Text>
                      </View>
                    </View>
                    
                    {/* Stats */}
                    <View className="flex-row items-center">
                      <View className="flex-row items-center mr-4">
                        <LinearGradient
                          colors={['#dbeafe', '#bfdbfe']}
                          className="p-1.5 rounded-lg mr-2"
                        >
                          <Ionicons name="code-slash" size={14} color="#2563eb" />
                        </LinearGradient>
                        <Text className="text-gray-700 text-xs font-bold">
                          {company.problem_count} problems
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <LinearGradient
                          colors={['#dcfce7', '#bbf7d0']}
                          className="p-1.5 rounded-lg mr-2"
                        >
                          <Ionicons name="briefcase" size={14} color="#16a34a" />
                        </LinearGradient>
                        <Text className="text-gray-700 text-xs font-bold">
                          {company.job_count} jobs
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  {/* Arrow */}
                  <View className="bg-orange-100 w-10 h-10 rounded-full items-center justify-center">
                    <Ionicons name="chevron-forward" size={24} color="#ea580c" />
                  </View>
                </View>

                {/* Action Footer */}
                <View className="mt-4 pt-4 border-t border-gray-100 flex-row items-center justify-between">
                  <Text className="text-gray-600 text-xs font-bold">Rank #{index + 1}</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="trending-up" size={16} color="#16a34a" />
                    <Text className="text-green-600 text-xs font-bold ml-1">Popular</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View className="h-4" />
      </ScrollView>

      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
