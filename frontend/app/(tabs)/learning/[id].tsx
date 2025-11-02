import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import HamburgerMenu from '../../../components/common/HamburgerMenu';
import { toggleBookmark, isBookmarked } from '../../../lib/bookmarks';
import { saveArticleProgress, getArticleProgress, completeArticle } from '../../../lib/readProgress';

interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  author_avatar?: string;
  category: string;
  tags: string[];
  cover_image?: string;
  read_time: number;
  views_count: number;
  created_at: string;
}

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const contentHeight = useRef(0);

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      if (!id) {
        return null;
      }
      try {
        const response = await api.get(`/user/articles/${id}`);
        return response.data.article || response.data || null;
      } catch (error) {
        console.error('Error fetching article:', error);
        return null;
      }
    },
    enabled: !!id,
    retry: 1,
  });

  useEffect(() => {
    if (article) {
      checkBookmark();
      loadProgress();
    }
  }, [article]);

  const checkBookmark = async () => {
    if (article) {
      const bookmarked = await isBookmarked(article._id);
      setIsBookmarkedState(bookmarked);
    }
  };

  const loadProgress = async () => {
    if (article) {
      const progress = await getArticleProgress(article._id);
      if (progress) {
        setReadProgress(progress.progress);
      }
    }
  };

  const handleBookmark = async () => {
    if (article) {
      const success = await toggleBookmark(article._id, 'article', article);
      if (success) {
        setIsBookmarkedState(!isBookmarkedState);
      }
    }
  };

  const handleShare = async () => {
    if (article) {
      try {
        await Share.share({
          message: `Check out this article: ${article.title}`,
          title: article.title,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleScroll = async (event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const progress = Math.min(
      Math.round((contentOffset.y / (contentSize.height - layoutMeasurement.height)) * 100),
      100
    );
    
    if (progress > readProgress && article) {
      setReadProgress(progress);
      await saveArticleProgress(article._id, progress);
      
      if (progress >= 95) {
        await completeArticle(article._id);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-gray-600 mt-4">Loading article...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !article) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#9ca3af" />
          <Text className="text-gray-900 text-xl font-bold mt-4">Article Not Found</Text>
          <Text className="text-gray-600 text-center mt-2">The article you&apos;re looking for doesn&apos;t exist or has been removed.</Text>
          <TouchableOpacity
            className="bg-blue-600 px-6 py-3 rounded-xl mt-6 shadow-sm"
            onPress={() => router.back()}
          >
            <Text className="text-white font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        <TouchableOpacity onPress={() => setMenuVisible(true)} className="mr-3">
          <Ionicons name="menu" size={28} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View className="flex-1" />
        <TouchableOpacity onPress={handleBookmark} className="mr-3">
          <Ionicons
            name={isBookmarkedState ? 'bookmark' : 'bookmark-outline'}
            size={26}
            color={isBookmarkedState ? '#2563eb' : '#6b7280'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Reading Progress Bar */}
      {readProgress > 0 && (
        <View className="h-1 bg-gray-200">
          <View 
            className="h-full bg-blue-600"
            style={{ width: `${readProgress}%` }}
          />
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={100}
      >
        {/* Article Header */}
        <View className="bg-white px-6 py-8 border-b border-gray-100">
          {/* Category Badge */}
          <View className="self-start bg-purple-100 px-4 py-2 rounded-full mb-4">
            <Text className="text-purple-700 text-sm font-bold">{article.category}</Text>
          </View>

          {/* Title */}
          <Text className="text-gray-900 text-3xl font-extrabold mb-6 leading-tight">
            {article.title}
          </Text>

          {/* Meta Info */}
          <View className="flex-row items-center mb-6">
            {/* Author */}
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center mr-3">
                {article.author_avatar ? (
                  <Text className="text-2xl">{article.author_avatar}</Text>
                ) : (
                  <Ionicons name="person" size={24} color="#9333ea" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 text-sm font-bold">{article.author}</Text>
                <Text className="text-gray-500 text-xs">{formatDate(article.created_at)}</Text>
              </View>
            </View>

            {/* Stats */}
            <View className="flex-row items-center">
              <View className="flex-row items-center mr-4">
                <Ionicons name="time-outline" size={16} color="#6b7280" />
                <Text className="text-gray-600 text-sm ml-1">{article.read_time} min</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="eye-outline" size={16} color="#6b7280" />
                <Text className="text-gray-600 text-sm ml-1">{article.views_count}</Text>
              </View>
            </View>
          </View>

          {/* Tags */}
          <View className="flex-row flex-wrap">
            {article.tags.slice(0, 5).map((tag: string, index: number) => (
              <View key={index} className="bg-gray-100 px-3 py-2 rounded-lg mr-2 mb-2">
                <Text className="text-gray-700 text-sm font-semibold">#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Cover Image */}
        {article.cover_image && (
          <View className="bg-white px-6 py-4 mb-4">
            <View className="w-full h-64 bg-gray-200 rounded-2xl overflow-hidden">
              <View className="w-full h-full items-center justify-center bg-blue-50">
                <Ionicons name="image-outline" size={64} color="#93c5fd" />
              </View>
            </View>
          </View>
        )}

        {/* Article Content */}
        <View className="bg-white px-6 py-8">
          <Text className="text-gray-800 text-base leading-8 font-normal">
            {article.content}
          </Text>
        </View>

        {/* Tags Section */}
        {article.tags && article.tags.length > 0 && (
          <View className="bg-white px-6 py-6 mt-4 border-t border-gray-100">
            <Text className="text-gray-900 text-lg font-bold mb-4">Related Tags</Text>
            <View className="flex-row flex-wrap">
              {article.tags.map((tag: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  className="bg-gray-100 px-4 py-2 rounded-lg mr-2 mb-2"
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-700 text-sm font-semibold">#{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Share Section */}
        <View className="bg-white px-6 py-6 mt-4 mb-6 border-t border-gray-100">
          <Text className="text-gray-900 text-lg font-bold mb-4">Share this article</Text>
          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center shadow-sm"
            onPress={handleShare}
          >
            <Ionicons name="share-social" size={20} color="#fff" />
            <Text className="text-white font-bold ml-2">Share Article</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
