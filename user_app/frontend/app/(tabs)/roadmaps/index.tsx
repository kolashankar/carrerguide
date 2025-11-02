import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import SearchBar from '@/components/common/SearchBar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

interface Roadmap {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  difficulty_level: string;
  estimated_duration: string;
  nodes: any[];
  is_published: boolean;
}

const categories = [
  { name: 'All', icon: 'apps' },
  { name: 'Web Dev', icon: 'globe' },
  { name: 'Mobile Dev', icon: 'phone-portrait' },
  { name: 'AI/ML', icon: 'hardware-chip' },
  { name: 'Data Science', icon: 'analytics' },
  { name: 'DevOps', icon: 'git-branch' },
  { name: 'Backend', icon: 'server' },
  { name: 'Frontend', icon: 'desktop' }
];

const difficultyConfig = {
  'Beginner': { colors: ['#10b981', '#059669'], bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  'Intermediate': { colors: ['#f59e0b', '#d97706'], bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  'Advanced': { colors: ['#ef4444', '#dc2626'], bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
};

export default function RoadmapsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    duration: 'all',
    status: 'all'
  });

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['roadmaps', searchQuery, selectedCategory, filters],
    queryFn: async () => {
      const params: any = {
        is_published: true,
        limit: 100
      };
      
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (filters.difficulty !== 'all') params.difficulty_level = filters.difficulty;
      
      const response = await api.get('/admin/roadmaps', { params });
      return response.data.roadmaps || [];
    }
  });

  const getRoadmapProgress = (roadmap: Roadmap) => {
    return Math.floor(Math.random() * 100);
  };

  const getDurationCategory = (duration: string) => {
    const hours = parseInt(duration);
    if (hours < 90) return '<3 months';
    if (hours < 180) return '3-6 months';
    return '6+ months';
  };

  const filteredData = data?.filter((roadmap: Roadmap) => {
    if (filters.duration !== 'all') {
      const durationCat = getDurationCategory(roadmap.estimated_duration);
      if (filters.duration !== durationCat) return false;
    }
    
    if (filters.status !== 'all') {
      const progress = getRoadmapProgress(roadmap);
      if (filters.status === 'not_started' && progress > 0) return false;
      if (filters.status === 'in_progress' && (progress === 0 || progress === 100)) return false;
      if (filters.status === 'completed' && progress !== 100) return false;
    }
    
    return true;
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingSpinner message="Loading roadmaps..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6', '#a855f7']}
        className="px-5 py-5 shadow-lg"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-white text-2xl font-extrabold mb-1">Learning Roadmaps</Text>
            <Text className="text-purple-100 text-sm">Structured paths to master skills</Text>
          </View>
          <View className="bg-white/20 backdrop-blur rounded-full px-4 py-2">
            <Text className="text-white font-extrabold text-base">{filteredData?.length || 0}</Text>
          </View>
        </View>
      </LinearGradient>

      <View className="px-4 py-4">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search roadmaps..."
        />
      </View>

      {/* Enhanced Category Chips - Smaller for mobile */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-2 mb-3"
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            onPress={() => setSelectedCategory(category.name)}
            className={`mr-2 shadow-sm min-h-[36px] justify-center ${
              selectedCategory === category.name
                ? 'bg-indigo-600'
                : 'bg-white border border-gray-200'
            }`}
            style={{ borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Ionicons 
                name={category.icon as any} 
                size={14} 
                color={selectedCategory === category.name ? '#fff' : '#4b5563'} 
              />
              <Text
                className={`ml-1.5 font-semibold text-xs ${
                  selectedCategory === category.name ? 'text-white' : 'text-gray-700'
                }`}
              >
                {category.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filter Bar */}
      <View className="bg-white px-4 py-3 mb-2 flex-row items-center justify-between shadow-sm">
        <View className="flex-row items-center">
          <Ionicons name="grid-outline" size={18} color="#6b7280" />
          <Text className="text-gray-600 text-sm font-bold ml-2">
            {filteredData?.length || 0} roadmaps
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          className="flex-row items-center bg-indigo-50 px-4 py-2 rounded-xl"
          activeOpacity={0.7}
        >
          <Ionicons name="filter" size={18} color="#6366f1" />
          <Text className="text-indigo-600 font-extrabold ml-2 text-sm">Filters</Text>
          {showFilters && <Ionicons name="chevron-up" size={16} color="#6366f1" style={{ marginLeft: 4 }} />}
          {!showFilters && <Ionicons name="chevron-down" size={16} color="#6366f1" style={{ marginLeft: 4 }} />}
        </TouchableOpacity>
      </View>

      {/* Enhanced Filters Panel */}
      {showFilters && (
        <ScrollView horizontal className="bg-white px-4 py-4 border-t border-b border-gray-100 mb-2">
          <View className="flex-row space-x-4">
            {/* Difficulty Filter */}
            <View className="mr-4">
              <Text className="text-xs font-extrabold text-gray-700 mb-2 uppercase">Difficulty</Text>
              <View className="flex-row">
                {['all', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                  <TouchableOpacity
                    key={diff}
                    onPress={() => setFilters({...filters, difficulty: diff})}
                    className={`px-4 py-2 rounded-xl mr-2 ${
                      filters.difficulty === diff ? 'bg-indigo-600' : 'bg-gray-100'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text className={`text-xs font-extrabold ${
                      filters.difficulty === diff ? 'text-white' : 'text-gray-700'
                    }`}>
                      {diff === 'all' ? 'All' : diff}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Duration Filter */}
            <View className="mr-4">
              <Text className="text-xs font-extrabold text-gray-700 mb-2 uppercase">Duration</Text>
              <View className="flex-row">
                {['all', '<3 months', '3-6 months', '6+ months'].map((dur) => (
                  <TouchableOpacity
                    key={dur}
                    onPress={() => setFilters({...filters, duration: dur})}
                    className={`px-4 py-2 rounded-xl mr-2 ${
                      filters.duration === dur ? 'bg-indigo-600' : 'bg-gray-100'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text className={`text-xs font-extrabold ${
                      filters.duration === dur ? 'text-white' : 'text-gray-700'
                    }`}>
                      {dur === 'all' ? 'All' : dur}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor="#6366f1" />
        }
      >
        {filteredData && filteredData.length === 0 ? (
          <EmptyState
            icon="map-outline"
            title="No Roadmaps Found"
            message="No roadmaps match your criteria. Try adjusting filters!"
          />
        ) : (
          <View className="px-4 py-4">
            {filteredData?.map((roadmap: Roadmap, index: number) => {
              const progress = getRoadmapProgress(roadmap);
              const diffConfig = difficultyConfig[roadmap.difficulty_level as keyof typeof difficultyConfig] || difficultyConfig.Beginner;
              
              return (
                <TouchableOpacity
                  key={roadmap._id}
                  className="bg-white rounded-3xl p-6 mb-4 shadow-md"
                  onPress={() => router.push(`/roadmaps/${roadmap._id}`)}
                  activeOpacity={0.8}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  {/* Header */}
                  <View className="flex-row items-start mb-3">
                    <LinearGradient
                      colors={['#6366f1', '#8b5cf6']}
                      className="w-14 h-14 rounded-2xl items-center justify-center mr-3 shadow-sm"
                    >
                      <Ionicons name="map" size={26} color="#fff" />
                    </LinearGradient>
                    <View className="flex-1">
                      <Text className="text-gray-900 text-lg font-extrabold leading-6 mb-2" numberOfLines={2}>
                        {roadmap.title}
                      </Text>
                      <View className="flex-row items-center">
                        <View className={`${diffConfig.bg} px-3 py-1 rounded-full mr-2 border ${diffConfig.border}`}>
                          <Text className={`${diffConfig.text} text-xs font-extrabold`}>{roadmap.difficulty_level}</Text>
                        </View>
                        <View className="bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                          <Text className="text-purple-700 text-xs font-extrabold">{roadmap.subcategory || roadmap.category}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Description */}
                  <Text className="text-gray-600 text-sm mb-4 leading-5" numberOfLines={2}>
                    {roadmap.description}
                  </Text>

                  {/* Progress Bar */}
                  <View className="bg-gray-100 rounded-2xl p-4 mb-4">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-gray-700 text-xs font-bold">Your Progress</Text>
                      <Text className="text-indigo-600 text-xs font-extrabold">{progress}%</Text>
                    </View>
                    <View className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <LinearGradient
                        colors={['#6366f1', '#8b5cf6']}
                        className="h-full rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </View>
                  </View>

                  {/* Footer Stats */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1 mr-4">
                      <View className="bg-blue-100 p-2 rounded-lg">
                        <Ionicons name="time" size={16} color="#2563eb" />
                      </View>
                      <Text className="text-gray-700 text-xs font-bold ml-2">
                        {roadmap.estimated_duration}h
                      </Text>
                    </View>
                    <View className="flex-row items-center flex-1 mr-4">
                      <View className="bg-purple-100 p-2 rounded-lg">
                        <Ionicons name="git-network" size={16} color="#8b5cf6" />
                      </View>
                      <Text className="text-gray-700 text-xs font-bold ml-2">
                        {roadmap.nodes?.length || 0} topics
                      </Text>
                    </View>
                    <LinearGradient
                      colors={['#6366f1', '#8b5cf6']}
                      className="px-4 py-2 rounded-xl flex-row items-center shadow-sm"
                    >
                      <Text className="text-white text-xs font-extrabold mr-1">Start</Text>
                      <Ionicons name="arrow-forward" size={14} color="#fff" />
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}
