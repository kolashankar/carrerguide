import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import SearchBar from '../../../components/common/SearchBar';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import EmptyState from '../../../components/common/EmptyState';

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  cover_image?: string;
  read_time: number;
  views_count: number;
  created_at: string;
}

export default function LearningScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['articles', searchQuery],
    queryFn: async () => {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      
      const response = await api.get('/user/articles', { params });
      return response.data.articles || [];
    },
  });

  const handleArticlePress = (articleId: string) => {
    router.push(`/(tabs)/learning/${articleId}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400">
        <LoadingSpinner message="Loading articles..." />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400">
        <EmptyState
          icon="alert-circle-outline"
          title="Error Loading Articles"
          message="Failed to load articles. Please try again."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      {/* Header */}
      <View className="px-6 py-4">
        <Text className="text-white text-2xl font-bold">Learning</Text>
        <Text className="text-gray-400 text-sm mt-1">Explore articles and guides</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search articles..."
      />

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#3b82f6"
          />
        }
      >
        {data && data.length === 0 ? (
          <EmptyState
            icon="book-outline"
            title="No Articles Found"
            message="No articles available at the moment. Check back later!"
          />
        ) : (
          data?.map((article: Article) => (
            <TouchableOpacity
              key={article._id}
              className="bg-dark-200 rounded-lg p-4 mb-3"
              onPress={() => handleArticlePress(article._id)}
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold" numberOfLines={2}>
                    {article.title}
                  </Text>
                  <Text className="text-gray-400 text-sm mt-1">By {article.author}</Text>
                </View>
              </View>

              <Text className="text-gray-300 text-sm mt-2" numberOfLines={3}>
                {article.excerpt}
              </Text>

              <View className="flex-row flex-wrap mt-3">
                {article.tags.slice(0, 3).map((tag, index) => (
                  <View key={index} className="bg-dark-300 px-2 py-1 rounded mr-2 mb-2">
                    <Text className="text-gray-400 text-xs">#{tag}</Text>
                  </View>
                ))}
              </View>

              <View className="flex-row items-center justify-between mt-3">
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={14} color="#9ca3af" />
                  <Text className="text-gray-400 text-xs ml-1">{article.read_time} min read</Text>
                  <Ionicons name="eye-outline" size={14} color="#9ca3af" className="ml-3" />
                  <Text className="text-gray-400 text-xs ml-1">{article.views_count} views</Text>
                </View>
                <View className="bg-primary-600 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-semibold">{article.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}