import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Animated } from 'react-native';
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

interface DSAQuestion {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  companies: string[];
  description: string;
}

export default function QuestionsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['dsa-questions', searchQuery, difficultyFilter],
    queryFn: async () => {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (difficultyFilter) params.difficulty = difficultyFilter;
      
      const response = await api.get('/admin/dsa/questions', { params });
      return response.data.questions || [];
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return ['#10b981', '#059669'];
      case 'Medium': return ['#f59e0b', '#d97706'];
      case 'Hard': return ['#ef4444', '#dc2626'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getDifficultyBgColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Hard': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingSpinner message="Loading questions..." />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <EmptyState
          icon="alert-circle-outline"
          title="Error Loading Questions"
          message="Failed to load questions. Please try again."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#2563eb', '#4f46e5', '#6366f1']}
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
            <Text className="text-white text-2xl font-extrabold">DSA Questions</Text>
          </View>
        </View>
        <View className="bg-white/20 backdrop-blur rounded-xl p-3">
          <Text className="text-white text-base font-bold">{data?.length || 0}+ Coding Problems</Text>
          <Text className="text-blue-100 text-sm mt-0.5">Practice and master DSA</Text>
        </View>
      </LinearGradient>

      <View className="px-4 py-4">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search questions by title or topic..."
        />
      </View>

      {/* Enhanced Difficulty Filter */}
      <View className="px-4 mb-4">
        <Text className="text-gray-700 text-sm font-bold mb-3">Difficulty Level</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            className={`px-6 py-3 rounded-xl mr-3 shadow-sm min-h-[44px] justify-center ${
              difficultyFilter === '' ? 'bg-blue-600' : 'bg-white border-2 border-gray-200'
            }`}
            onPress={() => setDifficultyFilter('')}
            activeOpacity={0.7}
          >
            <Text className={`font-extrabold text-sm ${
              difficultyFilter === '' ? 'text-white' : 'text-gray-700'
            }`}>All Levels</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-3 rounded-xl mr-3 shadow-sm min-h-[44px] justify-center ${
              difficultyFilter === 'Easy' ? 'bg-green-600' : 'bg-white border-2 border-gray-200'
            }`}
            onPress={() => setDifficultyFilter('Easy')}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              {difficultyFilter === 'Easy' && <Ionicons name="checkmark-circle" size={16} color="#fff" style={{ marginRight: 4 }} />}
              <Text className={`font-extrabold text-sm ${
                difficultyFilter === 'Easy' ? 'text-white' : 'text-gray-700'
              }`}>Easy</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-3 rounded-xl mr-3 shadow-sm min-h-[44px] justify-center ${
              difficultyFilter === 'Medium' ? 'bg-yellow-600' : 'bg-white border-2 border-gray-200'
            }`}
            onPress={() => setDifficultyFilter('Medium')}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              {difficultyFilter === 'Medium' && <Ionicons name="checkmark-circle" size={16} color="#fff" style={{ marginRight: 4 }} />}
              <Text className={`font-extrabold text-sm ${
                difficultyFilter === 'Medium' ? 'text-white' : 'text-gray-700'
              }`}>Medium</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-3 rounded-xl shadow-sm min-h-[44px] justify-center ${
              difficultyFilter === 'Hard' ? 'bg-red-600' : 'bg-white border-2 border-gray-200'
            }`}
            onPress={() => setDifficultyFilter('Hard')}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              {difficultyFilter === 'Hard' && <Ionicons name="checkmark-circle" size={16} color="#fff" style={{ marginRight: 4 }} />}
              <Text className={`font-extrabold text-sm ${
                difficultyFilter === 'Hard' ? 'text-white' : 'text-gray-700'
              }`}>Hard</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-4"
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
            icon="code-slash-outline"
            title="No Questions Found"
            message="No questions available. Try adjusting your filters!"
          />
        ) : (
          data?.map((question: DSAQuestion, index: number) => (
            <TouchableOpacity
              key={question._id}
              className="bg-white rounded-2xl p-5 mb-4 shadow-md border border-gray-100"
              onPress={() => router.push(`/(tabs)/dsa/question-${question._id}`)}
              activeOpacity={0.8}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              {/* Question Header */}
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center mb-2">
                    <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
                      <Text className="text-blue-600 font-extrabold text-sm">#{index + 1}</Text>
                    </View>
                    <Text className="text-gray-900 text-base font-extrabold leading-5 flex-1" numberOfLines={2}>
                      {question.title}
                    </Text>
                  </View>
                </View>
                <LinearGradient
                  colors={getDifficultyColor(question.difficulty)}
                  className="px-4 py-2 rounded-full shadow-sm"
                >
                  <Text className="text-white text-xs font-extrabold">
                    {question.difficulty}
                  </Text>
                </LinearGradient>
              </View>

              {/* Description */}
              <Text className="text-gray-600 text-sm mt-2 leading-5" numberOfLines={2}>
                {question.description}
              </Text>

              {/* Topics */}
              {question.topics && question.topics.length > 0 && (
                <View className="flex-row flex-wrap mt-4">
                  {question.topics.slice(0, 3).map((topic, index) => (
                    <View key={index} className="bg-blue-50 px-3 py-2 rounded-lg mr-2 mb-2 border border-blue-200">
                      <Text className="text-blue-700 text-xs font-bold">{topic}</Text>
                    </View>
                  ))}
                  {question.topics.length > 3 && (
                    <View className="bg-gray-100 px-3 py-2 rounded-lg mb-2">
                      <Text className="text-gray-600 text-xs font-bold">+{question.topics.length - 3} more</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Companies Footer */}
              {question.companies && question.companies.length > 0 && (
                <View className="flex-row items-center mt-4 pt-4 border-t border-gray-100">
                  <View className="bg-orange-100 p-1.5 rounded">
                    <Ionicons name="business" size={14} color="#ea580c" />
                  </View>
                  <Text className="text-gray-700 text-xs ml-2 font-bold flex-1" numberOfLines={1}>
                    Asked by: {question.companies.slice(0, 3).join(', ')}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#3b82f6" />
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
        <View className="h-4" />
      </ScrollView>

      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
