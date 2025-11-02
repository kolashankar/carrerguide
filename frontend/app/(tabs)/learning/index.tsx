import React, { useState, useEffect } from 'react';
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
import CategoryChips from '../../../components/common/CategoryChips';
import ArticlesFilterModal, { ArticleFilters } from '../../../components/learning/ArticlesFilterModal';
import SortModal, { SortOption } from '../../../components/common/SortModal';
import { toggleBookmark, isBookmarked } from '../../../lib/bookmarks';
import { getInProgressArticles, getArticleProgress } from '../../../lib/readProgress';

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

const CATEGORIES = [
  'All',
  'Career Growth',
  'Technical Skills',
  'Interview Preparation',
  'Resume Writing',
  'Soft Skills',
  'Industry Insights',
];

const SORT_OPTIONS: SortOption[] = [
  { label: 'Latest', value: 'latest' },
  { label: 'Most Viewed', value: 'views' },
  { label: 'Trending', value: 'trending' },
];

export default function LearningScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(new Set());
  const [inProgressIds, setInProgressIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<ArticleFilters>({
    categories: [],
    tags: [],
    author: '',
    readTime: '',
  });
  const router = useRouter();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['articles', searchQuery, selectedCategory, filters, sortBy],
    queryFn: async () => {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (filters.categories.length > 0) params.categories = filters.categories.join(',');
      if (filters.tags.length > 0) params.tags = filters.tags.join(',');
      if (filters.author) params.author = filters.author;
      if (filters.readTime) params.read_time_max = filters.readTime;
      if (sortBy) params.sort = sortBy;

      const response = await api.get('/user/articles', { params });
      return response.data.articles || [];
    },
  });

  useEffect(() => {
    loadBookmarks();
    loadInProgress();
  }, [data]);

  const loadBookmarks = async () => {
    const bookmarkedIds = new Set<string>();
    if (data) {
      for (const article of data) {
        if (await isBookmarked(article._id)) {
          bookmarkedIds.add(article._id);
        }
      }
      setBookmarkedArticles(bookmarkedIds);
    }
  };

  const loadInProgress = async () => {
    const inProgress = await getInProgressArticles();
    setInProgressIds(new Set(inProgress.map((p) => p.articleId)));
  };

  const handleArticlePress = (articleId: string) => {
    router.push(`/(tabs)/learning/${articleId}`);
  };

  const handleBookmark = async (article: Article, e: any) => {
    e.stopPropagation();
    const success = await toggleBookmark(article._id, 'article', article);
    if (success) {
      setBookmarkedArticles((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(article._id)) {
          newSet.delete(article._id);
        } else {
          newSet.add(article._id);
        }
        return newSet;
      });
    }
  };

  const handleTagClick = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: [tag],
    }));
  };

  const handleApplyFilters = (newFilters: ArticleFilters) => {
    setFilters(newFilters);
  };

  // Get all unique tags from articles
  const allTags: string[] = data
    ? Array.from(new Set(data.flatMap((article: Article) => article.tags)))
    : [];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <LoadingSpinner message="Loading articles..." />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <EmptyState
          icon="alert-circle-outline"
          title="Error Loading Articles"
          message="Failed to load articles. Please try again."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#8b5cf6', '#a855f7', '#c084fc']}
        className="px-5 py-5 shadow-lg"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-white text-2xl font-extrabold mb-1">Learning Hub</Text>
            <Text className="text-purple-100 text-sm">Discover articles and guides</Text>
          </View>
          <View className="bg-white/20 backdrop-blur rounded-full px-4 py-2">
            <Text className="text-white font-extrabold text-base">{data?.length || 0}</Text>
          </View>
        </View>
      </LinearGradient>

      <View className="px-4 py-4">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search articles..."
        />
      </View>

      {/* Enhanced Filter and Sort Buttons */}
      <View className="flex-row px-4 mb-3">
        <TouchableOpacity
          className="flex-row items-center bg-white border-2 border-purple-200 px-5 py-3 rounded-xl mr-3 shadow-sm flex-1"
          onPress={() => setShowFilters(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="options" size={20} color="#8b5cf6" />
          <Text className="text-purple-600 ml-2 font-extrabold">Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center bg-white border-2 border-purple-200 px-5 py-3 rounded-xl shadow-sm flex-1"
          onPress={() => setShowSort(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="swap-vertical" size={20} color="#8b5cf6" />
          <Text className="text-purple-600 ml-2 font-extrabold">Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Category Chips */}
      <CategoryChips
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#8b5cf6"
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
          data?.map((article: Article, index: number) => (
            <TouchableOpacity
              key={article._id}
              className="bg-white rounded-3xl p-5 mb-4 shadow-md"
              onPress={() => handleArticlePress(article._id)}
              activeOpacity={0.8}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              {/* Header with Bookmark */}
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center mb-2">
                    <LinearGradient
                      colors={['#8b5cf6', '#a855f7']}
                      className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                    >
                      <Ionicons name="document-text" size={16} color="#fff" />
                    </LinearGradient>
                    <View className={`${
                      article.category === 'Career Growth' ? 'bg-blue-100 border-blue-200' :
                      article.category === 'Technical Skills' ? 'bg-purple-100 border-purple-200' :
                      article.category === 'Interview Preparation' ? 'bg-green-100 border-green-200' :
                      'bg-orange-100 border-orange-200'
                    } px-3 py-1 rounded-full border`}>
                      <Text className={`${
                        article.category === 'Career Growth' ? 'text-blue-700' :
                        article.category === 'Technical Skills' ? 'text-purple-700' :
                        article.category === 'Interview Preparation' ? 'text-green-700' :
                        'text-orange-700'
                      } text-xs font-extrabold`}>{article.category}</Text>
                    </View>
                  </View>
                  <Text className="text-gray-900 text-lg font-extrabold leading-6" numberOfLines={2}>
                    {article.title}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1 font-semibold">By {article.author}</Text>
                </View>
                <TouchableOpacity 
                  onPress={(e) => handleBookmark(article, e)}
                  className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={bookmarkedArticles.has(article._id) ? 'bookmark' : 'bookmark-outline'}
                    size={22}
                    color={bookmarkedArticles.has(article._id) ? '#8b5cf6' : '#6b7280'}
                  />
                </TouchableOpacity>
              </View>

              {/* Continue Reading Badge */}
              {inProgressIds.has(article._id) && (
                <View className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 px-3 py-2 rounded-xl mb-3 flex-row items-center">
                  <Ionicons name="play-circle" size={16} color="#f59e0b" />
                  <Text className="text-yellow-700 text-xs font-extrabold ml-2">Continue Reading</Text>
                </View>
              )}

              {/* Excerpt */}
              <Text className="text-gray-600 text-sm mt-2 leading-5" numberOfLines={3}>
                {article.excerpt}
              </Text>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <View className="flex-row flex-wrap mt-4">
                  {article.tags.slice(0, 3).map((tag, tagIndex) => (
                    <TouchableOpacity
                      key={tagIndex}
                      className="bg-purple-50 px-3 py-1.5 rounded-lg mr-2 mb-2 border border-purple-200"
                      onPress={() => handleTagClick(tag)}
                      activeOpacity={0.7}
                    >
                      <Text className="text-purple-700 text-xs font-bold">#{tag}</Text>
                    </TouchableOpacity>
                  ))}
                  {article.tags.length > 3 && (
                    <View className="bg-gray-100 px-3 py-1.5 rounded-lg mb-2">
                      <Text className="text-gray-600 text-xs font-bold">+{article.tags.length - 3}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Footer Stats */}
              <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <View className="flex-row items-center">
                  <View className="bg-blue-100 p-1.5 rounded-lg">
                    <Ionicons name="time" size={14} color="#2563eb" />
                  </View>
                  <Text className="text-gray-700 text-xs font-bold ml-2">
                    {article.read_time} min read
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="bg-green-100 p-1.5 rounded-lg">
                    <Ionicons name="eye" size={14} color="#16a34a" />
                  </View>
                  <Text className="text-gray-700 text-xs font-bold ml-2">
                    {article.views_count} views
                  </Text>
                </View>
                <View className="bg-purple-100 px-3 py-1.5 rounded-lg">
                  <Ionicons name="arrow-forward" size={14} color="#8b5cf6" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View className="h-4" />
      </ScrollView>

      <ArticlesFilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
        availableTags={allTags}
      />

      <SortModal
        visible={showSort}
        onClose={() => setShowSort(false)}
        onSelect={setSortBy}
        currentSort={sortBy}
        options={SORT_OPTIONS}
      />
    </SafeAreaView>
  );
}