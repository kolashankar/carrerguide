import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import EmptyState from '../../../components/common/EmptyState';
import HamburgerMenu from '../../../components/common/HamburgerMenu';
import {
  getSheetProgress,
  toggleSheetQuestion,
  isQuestionCompletedInSheet,
} from '../../../lib/dsaProgress';

interface DSASheet {
  _id: string;
  name: string;
  description: string;
  level: string;
  tags: string[];
  questions: {
    _id: string;
    title: string;
    difficulty: string;
    topics: string[];
  }[];
  difficulty_breakdown: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
}

export default function SheetDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());

  const { data: sheet, isLoading, isError, refetch } = useQuery({
    queryKey: ['dsa-sheet', id],
    queryFn: async () => {
      const response = await api.get(`/admin/dsa/sheets/${id}`);
      return response.data.sheet;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (sheet) {
      loadProgress();
    }
  }, [sheet]);

  const loadProgress = async () => {
    if (sheet) {
      const progress = await getSheetProgress(sheet._id);
      if (progress) {
        setCompletedQuestions(new Set(progress.completedQuestions));
      }
    }
  };

  const handleToggleQuestion = async (questionId: string) => {
    if (sheet) {
      const success = await toggleSheetQuestion(sheet._id, questionId, sheet.questions.length);
      if (success) {
        setCompletedQuestions((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(questionId)) {
            newSet.delete(questionId);
          } else {
            newSet.add(questionId);
          }
          return newSet;
        });
      }
    }
  };

  const handleQuestionPress = (questionId: string) => {
    router.push(`/(tabs)/dsa/question-${questionId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
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

  const progressPercentage = sheet
    ? Math.round((completedQuestions.size / sheet.questions.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingSpinner message="Loading sheet..." />
      </SafeAreaView>
    );
  }

  if (isError || !sheet) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <EmptyState
          icon="alert-circle-outline"
          title="Error Loading Sheet"
          message="Failed to load sheet details. Please try again."
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
          {sheet.name}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} tintColor="#9333ea" />}
      >
        {/* Sheet Info */}
        <LinearGradient
          colors={['#9333ea', '#a855f7']}
          className="px-6 py-6 mb-4"
        >
          <Text className="text-purple-100 text-base mb-3">{sheet.description}</Text>
          <View className="flex-row items-center flex-wrap">
            <View className="bg-white/20 px-4 py-2 rounded-full mr-2 mb-2">
              <Text className="text-white font-bold">{sheet.level}</Text>
            </View>
            {sheet.tags.slice(0, 3).map((tag, index) => (
              <View key={index} className="bg-white/10 px-4 py-2 rounded-full mr-2 mb-2">
                <Text className="text-white font-semibold">#{tag}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Progress Bar */}
        <View className="px-6 mb-4">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-900 font-extrabold text-lg">
                Progress: {completedQuestions.size}/{sheet.questions.length}
              </Text>
              <Text className="text-purple-600 font-extrabold text-xl">{progressPercentage}%</Text>
            </View>
            <View className="bg-gray-200 rounded-full h-4">
              <LinearGradient
                colors={['#9333ea', '#a855f7']}
                className="rounded-full h-4"
                style={{ width: `${progressPercentage}%` }}
              />
            </View>

            {/* Difficulty Breakdown */}
            {sheet.difficulty_breakdown && (
              <View className="flex-row items-center mt-5 pt-4 border-t border-gray-100">
                <View className="flex-row items-center mr-5">
                  <View className="bg-green-600 w-3 h-3 rounded-full mr-2" />
                  <Text className="text-gray-700 text-sm font-bold">{sheet.difficulty_breakdown.Easy} Easy</Text>
                </View>
                <View className="flex-row items-center mr-5">
                  <View className="bg-yellow-600 w-3 h-3 rounded-full mr-2" />
                  <Text className="text-gray-700 text-sm font-bold">{sheet.difficulty_breakdown.Medium} Medium</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="bg-red-600 w-3 h-3 rounded-full mr-2" />
                  <Text className="text-gray-700 text-sm font-bold">{sheet.difficulty_breakdown.Hard} Hard</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Questions List */}
        <View className="px-4">
          <Text className="text-gray-900 text-xl font-extrabold mb-4 px-2">Questions</Text>
          {sheet.questions.map((question, index) => (
            <View key={question._id} className="bg-white rounded-2xl p-5 mb-3 shadow-sm border border-gray-100">
              <View className="flex-row items-start">
                {/* Checkbox */}
                <TouchableOpacity
                  className="mr-4 mt-1"
                  onPress={() => handleToggleQuestion(question._id)}
                >
                  <View
                    className={`w-7 h-7 rounded-lg border-2 items-center justify-center ${
                      completedQuestions.has(question._id)
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-400'
                    }`}
                  >
                    {completedQuestions.has(question._id) && (
                      <Ionicons name="checkmark" size={18} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Question Info */}
                <TouchableOpacity
                  className="flex-1"
                  onPress={() => handleQuestionPress(question._id)}
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <Text
                      className={`text-base font-bold flex-1 mr-3 ${
                        completedQuestions.has(question._id)
                          ? 'text-gray-400 line-through'
                          : 'text-gray-900'
                      }`}
                      numberOfLines={2}
                    >
                      {index + 1}. {question.title}
                    </Text>
                    <Text className={`text-sm font-bold ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </Text>
                  </View>

                  {/* Topics */}
                  <View className="flex-row flex-wrap">
                    {question.topics.slice(0, 3).map((topic, topicIndex) => (
                      <View key={topicIndex} className="bg-blue-100 px-3 py-1 rounded-lg mr-2 mb-1">
                        <Text className="text-blue-700 text-xs font-semibold">{topic}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
