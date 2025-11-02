import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import EmptyState from '../../../components/common/EmptyState';
import HamburgerMenu from '../../../components/common/HamburgerMenu';
import { toggleBookmark, isBookmarked } from '../../../lib/bookmarks';
import { recordQuestionSubmission, getQuestionStatus } from '../../../lib/dsaProgress';

interface CodeSolution {
  language: string;
  code: string;
}

interface DSAQuestion {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  companies: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  solution_approach?: string;
  code_solutions: CodeSolution[];
  hints: string[];
  time_complexity?: string;
  space_complexity?: string;
  similar_questions?: string[];
}

export default function QuestionDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [questionStatus, setQuestionStatus] = useState<'unsolved' | 'attempted' | 'solved'>('unsolved');

  const { data: question, isLoading, isError } = useQuery({
    queryKey: ['dsa-question', id],
    queryFn: async () => {
      const response = await api.get(`/admin/dsa/questions/${id}`);
      return response.data.question;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (question) {
      checkBookmark();
      loadQuestionStatus();
    }
  }, [question]);

  const checkBookmark = async () => {
    if (question) {
      const bookmarked = await isBookmarked(question._id);
      setIsBookmarkedState(bookmarked);
    }
  };

  const loadQuestionStatus = async () => {
    if (question) {
      const status = await getQuestionStatus(question._id);
      setQuestionStatus(status);
    }
  };

  const handleBookmark = async () => {
    if (question) {
      const success = await toggleBookmark(question._id, 'question', question);
      if (success) {
        setIsBookmarkedState(!isBookmarkedState);
      }
    }
  };

  const handleSubmit = async (status: 'attempted' | 'solved') => {
    if (question) {
      const success = await recordQuestionSubmission(question._id, question.title, status);
      if (success) {
        setQuestionStatus(status);
        Alert.alert('Success', `Question marked as ${status}!`);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Hard': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (questionStatus) {
      case 'solved': return 'checkmark-circle';
      case 'attempted': return 'time';
      default: return 'code-slash';
    }
  };

  const getStatusColor = () => {
    switch (questionStatus) {
      case 'solved': return '#10b981';
      case 'attempted': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingSpinner message="Loading question..." />
      </SafeAreaView>
    );
  }

  if (isError || !question) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <EmptyState
          icon="alert-circle-outline"
          title="Error Loading Question"
          message="Failed to load question details. Please try again."
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
          <Ionicons name={getStatusIcon()} size={24} color={getStatusColor()} />
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

      <ScrollView className="flex-1 px-4 py-4">
        {/* Question Title */}
        <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
          <Text className="text-gray-900 text-2xl font-extrabold mb-3">{question.title}</Text>
          <View className="flex-row items-center flex-wrap">
            <View className={`${getDifficultyColor(question.difficulty)} px-4 py-2 rounded-full mr-2 mb-2`}>
              <Text className="text-white text-sm font-bold">{question.difficulty}</Text>
            </View>
            {question.topics.slice(0, 3).map((topic, index) => (
              <View key={index} className="bg-blue-100 px-4 py-2 rounded-full mr-2 mb-2">
                <Text className="text-blue-700 text-sm font-semibold">{topic}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Companies */}
        {question.companies && question.companies.length > 0 && (
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
            <Text className="text-gray-600 text-xs font-semibold mb-2">Asked by companies:</Text>
            <Text className="text-gray-900 text-base font-semibold">{question.companies.join(', ')}</Text>
          </View>
        )}

        {/* Problem Statement */}
        <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
          <Text className="text-gray-900 text-xl font-bold mb-3">Problem Statement</Text>
          <Text className="text-gray-700 text-base leading-6">{question.description}</Text>
        </View>

        {/* Examples */}
        {question.examples && question.examples.length > 0 && (
          <View className="mb-4">
            <Text className="text-gray-900 text-xl font-bold mb-3 px-2">Examples</Text>
            {question.examples.map((example, index) => (
              <View key={index} className="bg-white rounded-2xl p-5 mb-3 shadow-sm border border-gray-100">
                <Text className="text-blue-600 font-extrabold mb-3">Example {index + 1}</Text>
                <View className="mb-3">
                  <Text className="text-gray-600 text-sm font-semibold">Input:</Text>
                  <View className="bg-gray-50 rounded-lg p-3 mt-1">
                    <Text className="text-gray-900 font-mono text-sm">{example.input}</Text>
                  </View>
                </View>
                <View className="mb-3">
                  <Text className="text-gray-600 text-sm font-semibold">Output:</Text>
                  <View className="bg-gray-50 rounded-lg p-3 mt-1">
                    <Text className="text-gray-900 font-mono text-sm">{example.output}</Text>
                  </View>
                </View>
                {example.explanation && (
                  <View>
                    <Text className="text-gray-600 text-sm font-semibold">Explanation:</Text>
                    <Text className="text-gray-700 text-sm mt-1 leading-5">{example.explanation}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Constraints */}
        {question.constraints && question.constraints.length > 0 && (
          <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
            <Text className="text-gray-900 text-xl font-bold mb-4">Constraints</Text>
            {question.constraints.map((constraint, index) => (
              <View key={index} className="flex-row mb-3">
                <View className="bg-blue-600 w-2 h-2 rounded-full mt-2 mr-3" />
                <Text className="text-gray-700 text-sm flex-1 leading-5">{constraint}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Hints */}
        {question.hints && question.hints.length > 0 && (
          <View className="mb-4">
            <TouchableOpacity
              className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-5 mb-3 flex-row items-center justify-between shadow-sm"
              onPress={() => setShowHints(!showHints)}
            >
              <Text className="text-yellow-700 font-extrabold">💡 Hints ({question.hints.length})</Text>
              <Ionicons
                name={showHints ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#ca8a04"
              />
            </TouchableOpacity>
            {showHints && (
              <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                {question.hints.map((hint, index) => (
                  <View key={index} className="mb-4">
                    <Text className="text-yellow-600 font-bold mb-2">Hint {index + 1}:</Text>
                    <Text className="text-gray-700 text-sm leading-5">{hint}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Solution */}
        <View className="mb-20">
          <TouchableOpacity
            className="bg-green-50 border-2 border-green-500 rounded-2xl p-5 mb-3 flex-row items-center justify-between shadow-sm"
            onPress={() => setShowSolution(!showSolution)}
          >
            <Text className="text-green-700 font-extrabold">🎯 Solution Approach</Text>
            <Ionicons
              name={showSolution ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#10b981"
            />
          </TouchableOpacity>
          {showSolution && (
            <View>
              {question.solution_approach && (
                <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
                  <Text className="text-gray-700 text-base leading-6">{question.solution_approach}</Text>
                </View>
              )}

              {/* Code Solutions */}
              {question.code_solutions && question.code_solutions.length > 0 && (
                <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
                  <Text className="text-gray-900 text-lg font-bold mb-4">Code Solutions</Text>
                  
                  {/* Language Selector */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                    {question.code_solutions.map((solution, index) => (
                      <TouchableOpacity
                        key={index}
                        className={`px-5 py-3 rounded-xl mr-2 ${
                          selectedLanguage === solution.language ? 'bg-blue-600' : 'bg-gray-100'
                        }`}
                        onPress={() => setSelectedLanguage(solution.language)}
                      >
                        <Text className={`font-bold ${
                          selectedLanguage === solution.language ? 'text-white' : 'text-gray-700'
                        }`}>{solution.language}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Selected Language Code */}
                  {question.code_solutions
                    .filter((s) => s.language === selectedLanguage)
                    .map((solution, index) => (
                      <View key={index} className="bg-gray-900 rounded-xl p-4">
                        <ScrollView horizontal>
                          <Text className="text-green-400 font-mono text-sm">{solution.code}</Text>
                        </ScrollView>
                      </View>
                    ))}
                </View>
              )}

              {/* Complexity Analysis */}
              {(question.time_complexity || question.space_complexity) && (
                <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <Text className="text-gray-900 font-bold text-lg mb-4">Complexity Analysis</Text>
                  {question.time_complexity && (
                    <View className="mb-3">
                      <Text className="text-gray-600 text-sm font-semibold">Time Complexity:</Text>
                      <View className="bg-blue-50 rounded-lg p-3 mt-1">
                        <Text className="text-blue-700 font-mono font-bold">{question.time_complexity}</Text>
                      </View>
                    </View>
                  )}
                  {question.space_complexity && (
                    <View>
                      <Text className="text-gray-600 text-sm font-semibold">Space Complexity:</Text>
                      <View className="bg-purple-50 rounded-lg p-3 mt-1">
                        <Text className="text-purple-700 font-mono font-bold">{question.space_complexity}</Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-4 border-t border-gray-200 shadow-lg">
        <View className="flex-row">
          <TouchableOpacity
            className="flex-1 py-4 rounded-xl mr-2 flex-row items-center justify-center shadow-sm"
            onPress={() => handleSubmit('attempted')}
          >
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              className="w-full py-4 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="time" size={20} color="#fff" />
              <Text className="text-white font-extrabold ml-2">Attempted</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-4 rounded-xl flex-row items-center justify-center shadow-sm"
            onPress={() => handleSubmit('solved')}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              className="w-full py-4 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text className="text-white font-extrabold ml-2">Solved</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
