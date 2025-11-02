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

interface DSATopic {
  _id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  question_count: number;
}

const gradientColors = [
  ['#2563eb', '#3b82f6'],
  ['#10b981', '#059669'],
  ['#8b5cf6', '#7c3aed'],
  ['#f59e0b', '#d97706'],
  ['#ef4444', '#dc2626'],
  ['#06b6d4', '#0891b2'],
];

export default function TopicsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['dsa-topics', searchQuery],
    queryFn: async () => {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      
      const response = await api.get('/admin/dsa/topics', { params });
      return response.data.topics || [];
    },
  });

  const handleTopicPress = (topicId: string) => {
    router.push(`/(tabs)/dsa/questions?topic=${topicId}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingSpinner message="Loading topics..." />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <EmptyState
          icon="alert-circle-outline"
          title="Error Loading Topics"
          message="Failed to load topics. Please try again."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#16a34a', '#22c55e', '#4ade80']}
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
            <Text className="text-white text-2xl font-extrabold">DSA Topics</Text>
          </View>
        </View>
        <View className="bg-white/20 backdrop-blur rounded-xl p-3">
          <Text className="text-white text-base font-bold">Learn by Category</Text>
          <Text className="text-green-100 text-sm mt-0.5">{data?.length || 0} topics available</Text>
        </View>
      </LinearGradient>

      <View className="px-4 py-4">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search topics..."
        />
      </View>

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#16a34a"
          />
        }
      >
        {data && data.length === 0 ? (
          <EmptyState
            icon="list-outline"
            title="No Topics Found"
            message="No topics available. Check back later!"
          />
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {data?.map((topic: DSATopic, index: number) => {
              const colors = gradientColors[index % gradientColors.length];
              return (
                <TouchableOpacity
                  key={topic._id}
                  className="bg-white rounded-3xl p-6 mb-4 shadow-md"
                  style={{
                    width: '48%',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                  onPress={() => handleTopicPress(topic._id)}
                  activeOpacity={0.8}
                >
                  <View className="items-center">
                    {/* Enhanced Icon */}
                    <LinearGradient
                      colors={colors}
                      className="w-20 h-20 rounded-2xl items-center justify-center mb-4 shadow-lg"
                      style={{
                        shadowColor: colors[0],
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 5,
                      }}
                    >
                      <Text className="text-4xl">{topic.icon || '📚'}</Text>
                    </LinearGradient>
                    
                    {/* Topic Name */}
                    <Text className="text-gray-900 text-base font-extrabold text-center mb-2" numberOfLines={1}>
                      {topic.name}
                    </Text>
                    
                    {/* Description */}
                    <Text className="text-gray-600 text-xs text-center leading-4 mb-3" numberOfLines={2}>
                      {topic.description}
                    </Text>
                    
                    {/* Problem Count Badge */}
                    <LinearGradient
                      colors={[colors[0] + '20', colors[1] + '20']}
                      className="px-4 py-2 rounded-full border-2"
                      style={{ borderColor: colors[0] }}
                    >
                      <Text className="text-xs font-extrabold" style={{ color: colors[0] }}>
                        {topic.question_count} problems
                      </Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View className="h-4" />
      </ScrollView>

      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
