import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
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
  description?: string;
}

interface Question {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  description?: string;
}

export default function CompanyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  const { data: company, isLoading, refetch } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const response = await api.get(`/admin/dsa/companies/${id}`);
      return response.data.data;
    },
  });

  const { data: questionsData, isLoading: questionsLoading } = useQuery({
    queryKey: ['company-questions', id, company?.name],
    queryFn: async () => {
      const response = await api.get('/admin/dsa/questions', {
        params: { limit: 100 },
      });
      // Filter questions that have this company name in their companies array
      return response.data.questions?.filter(
        (q: any) =>
          q.companies &&
          q.companies.some((c: string) =>
            c.toLowerCase().includes(company?.name.toLowerCase() || '')
          )
      ) || [];
    },
    enabled: !!company,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-600';
      case 'Medium':
        return 'bg-yellow-600';
      case 'Hard':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getDifficultyTextColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Hard':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Calculate difficulty breakdown
  const difficultyCount = questionsData?.reduce(
    (acc: any, q: Question) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
      return acc;
    },
    { Easy: 0, Medium: 0, Hard: 0 }
  ) || { Easy: 0, Medium: 0, Hard: 0 };

  // Filter questions by selected difficulty
  const filteredQuestions = selectedDifficulty
    ? questionsData?.filter((q: Question) => q.difficulty === selectedDifficulty)
    : questionsData;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingSpinner message="Loading company details..." />
      </SafeAreaView>
    );
  }

  if (!company) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <EmptyState
          icon="business-outline"
          title="Company Not Found"
          message="The company you're looking for doesn't exist."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => setMenuVisible(true)} className="mr-3">
          <Ionicons name="menu" size={28} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-gray-900 text-lg font-bold flex-1" numberOfLines={1}>
          {company.name}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ea580c" />
        }
      >
        {/* Company Header */}
        <LinearGradient colors={['#ea580c', '#f97316']} className="px-6 py-8">
          <View className="flex-row items-center mb-6">
            <View className="w-20 h-20 rounded-2xl bg-white/20 items-center justify-center mr-5">
              <Text className="text-5xl">{company.logo || '🏢'}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-2xl font-extrabold mb-2">{company.name}</Text>
              <Text className="text-orange-100 text-base">{company.industry}</Text>
            </View>
          </View>

          {company.description && (
            <Text className="text-orange-50 text-base leading-6 mb-6">{company.description}</Text>
          )}

          {/* Stats Cards */}
          <View className="flex-row">
            <View className="flex-1 bg-white/20 backdrop-blur rounded-xl p-4 mr-2">
              <View className="flex-row items-center mb-2">
                <View className="bg-white/30 w-10 h-10 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="code-outline" size={20} color="#fff" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-2xl font-extrabold">{company.problem_count}</Text>
                  <Text className="text-orange-100 text-xs font-semibold">Problems</Text>
                </View>
              </View>
            </View>
            <View className="flex-1 bg-white/20 backdrop-blur rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <View className="bg-white/30 w-10 h-10 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="briefcase-outline" size={20} color="#fff" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-2xl font-extrabold">{company.job_count}</Text>
                  <Text className="text-orange-100 text-xs font-semibold">Job Openings</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Difficulty Breakdown */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
          <Text className="text-gray-900 text-xl font-extrabold mb-5">Difficulty Breakdown</Text>
          <View className="flex-row justify-between">
            <View className="flex-1 bg-green-50 rounded-xl p-4 mr-2">
              <View className="items-center">
                <Ionicons name="checkmark-circle" size={28} color="#16a34a" />
                <Text className="text-green-600 text-3xl font-extrabold mt-2">{difficultyCount.Easy}</Text>
                <Text className="text-green-700 text-sm font-bold mt-1">Easy</Text>
              </View>
            </View>
            <View className="flex-1 bg-yellow-50 rounded-xl p-4 mr-2">
              <View className="items-center">
                <Ionicons name="alert-circle" size={28} color="#ca8a04" />
                <Text className="text-yellow-600 text-3xl font-extrabold mt-2">{difficultyCount.Medium}</Text>
                <Text className="text-yellow-700 text-sm font-bold mt-1">Medium</Text>
              </View>
            </View>
            <View className="flex-1 bg-red-50 rounded-xl p-4">
              <View className="items-center">
                <Ionicons name="flame" size={28} color="#dc2626" />
                <Text className="text-red-600 text-3xl font-extrabold mt-2">{difficultyCount.Hard}</Text>
                <Text className="text-red-700 text-sm font-bold mt-1">Hard</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Difficulty Filter */}
        <View className="px-4 mt-6 mb-4">
          <Text className="text-gray-900 text-xl font-extrabold mb-4">Practice Questions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <TouchableOpacity
              className={`px-6 py-3 rounded-xl mr-3 ${
                selectedDifficulty === '' ? 'bg-blue-600' : 'bg-white border border-gray-200'
              }`}
              onPress={() => setSelectedDifficulty('')}
            >
              <Text
                className={`font-bold ${
                  selectedDifficulty === '' ? 'text-white' : 'text-gray-700'
                }`}
              >
                All ({questionsData?.length || 0})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-6 py-3 rounded-xl mr-3 ${
                selectedDifficulty === 'Easy' ? 'bg-green-600' : 'bg-white border border-gray-200'
              }`}
              onPress={() => setSelectedDifficulty('Easy')}
            >
              <Text
                className={`font-bold ${
                  selectedDifficulty === 'Easy' ? 'text-white' : 'text-gray-700'
                }`}
              >
                Easy ({difficultyCount.Easy})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-6 py-3 rounded-xl mr-3 ${
                selectedDifficulty === 'Medium' ? 'bg-yellow-600' : 'bg-white border border-gray-200'
              }`}
              onPress={() => setSelectedDifficulty('Medium')}
            >
              <Text
                className={`font-bold ${
                  selectedDifficulty === 'Medium' ? 'text-white' : 'text-gray-700'
                }`}
              >
                Medium ({difficultyCount.Medium})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-6 py-3 rounded-xl ${
                selectedDifficulty === 'Hard' ? 'bg-red-600' : 'bg-white border border-gray-200'
              }`}
              onPress={() => setSelectedDifficulty('Hard')}
            >
              <Text
                className={`font-bold ${
                  selectedDifficulty === 'Hard' ? 'text-white' : 'text-gray-700'
                }`}
              >
                Hard ({difficultyCount.Hard})
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Problems List */}
        <View className="px-4 mb-6">
          {questionsLoading ? (
            <View className="py-8">
              <LoadingSpinner message="Loading questions..." />
            </View>
          ) : filteredQuestions && filteredQuestions.length > 0 ? (
            filteredQuestions.map((question: Question, index: number) => (
              <TouchableOpacity
                key={question._id}
                className="bg-white rounded-2xl p-5 mb-3 shadow-sm border border-gray-100"
                onPress={() => router.push(`/(tabs)/dsa/question-${question._id}`)}
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1 mr-3">
                    <Text className="text-gray-900 text-base font-bold leading-6" numberOfLines={2}>
                      {index + 1}. {question.title}
                    </Text>
                  </View>
                  <View className={`${getDifficultyColor(question.difficulty)} px-4 py-1 rounded-full`}>
                    <Text className="text-white text-xs font-bold">{question.difficulty}</Text>
                  </View>
                </View>

                {question.description && (
                  <Text className="text-gray-600 text-sm mb-3 leading-5" numberOfLines={2}>
                    {question.description}
                  </Text>
                )}

                {/* Topics */}
                <View className="flex-row flex-wrap">
                  {question.topics?.slice(0, 3).map((topic, idx) => (
                    <View key={idx} className="bg-blue-100 px-3 py-1 rounded-lg mr-2 mb-1">
                      <Text className="text-blue-700 text-xs font-semibold">{topic}</Text>
                    </View>
                  ))}
                  {question.topics && question.topics.length > 3 && (
                    <View className="bg-gray-100 px-3 py-1 rounded-lg">
                      <Text className="text-gray-600 text-xs font-semibold">
                        +{question.topics.length - 3}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <EmptyState
              icon="code-slash-outline"
              title="No Questions Found"
              message={`No ${selectedDifficulty.toLowerCase()} questions found for this company.`}
            />
          )}
        </View>

        {/* Interview Tips Section */}
        <View className="bg-white mx-4 mb-6 rounded-2xl p-6 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 w-12 h-12 rounded-xl items-center justify-center mr-3">
              <Ionicons name="bulb" size={24} color="#2563eb" />
            </View>
            <Text className="text-gray-900 text-xl font-extrabold flex-1">
              Interview Preparation Tips
            </Text>
          </View>
          <View className="space-y-3">
            <View className="flex-row items-start mb-4">
              <View className="bg-green-600 w-2 h-2 rounded-full mt-2 mr-3" />
              <Text className="flex-1 text-gray-700 leading-6">
                Focus on data structures and algorithms fundamentals
              </Text>
            </View>
            <View className="flex-row items-start mb-4">
              <View className="bg-green-600 w-2 h-2 rounded-full mt-2 mr-3" />
              <Text className="flex-1 text-gray-700 leading-6">
                Practice coding questions from {company.name}&apos;s frequently asked problems
              </Text>
            </View>
            <View className="flex-row items-start mb-4">
              <View className="bg-green-600 w-2 h-2 rounded-full mt-2 mr-3" />
              <Text className="flex-1 text-gray-700 leading-6">
                Review system design concepts for senior roles
              </Text>
            </View>
            <View className="flex-row items-start">
              <View className="bg-green-600 w-2 h-2 rounded-full mt-2 mr-3" />
              <Text className="flex-1 text-gray-700 leading-6">
                Understand the company&apos;s products and technical stack
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
