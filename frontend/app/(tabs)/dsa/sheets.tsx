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

interface DSASheet {
  _id: string;
  name: string;
  description: string;
  level: string;
  tags: string[];
  questions: any[];
  difficulty_breakdown: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  is_published: boolean;
}

const getLevelColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'beginner': return ['#10b981', '#059669'];
    case 'intermediate': return ['#f59e0b', '#d97706'];
    case 'advanced': return ['#ef4444', '#dc2626'];
    default: return ['#6b7280', '#4b5563'];
  }
};

export default function SheetsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['dsa-sheets', searchQuery],
    queryFn: async () => {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      
      const response = await api.get('/admin/dsa/sheets', { params });
      return response.data.sheets || [];
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingSpinner message="Loading sheets..." />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <EmptyState
          icon="alert-circle-outline"
          title="Error Loading Sheets"
          message="Failed to load sheets. Please try again."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#9333ea', '#a855f7', '#c084fc']}
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
            <Text className="text-white text-2xl font-extrabold">DSA Sheets</Text>
          </View>
        </View>
        <View className="bg-white/20 backdrop-blur rounded-xl p-3">
          <Text className="text-white text-base font-bold">Curated Problem Collections</Text>
          <Text className="text-purple-100 text-sm mt-0.5">{data?.length || 0} sheets available</Text>
        </View>
      </LinearGradient>

      <View className="px-4 py-4">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search sheets..."
        />
      </View>

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#9333ea"
          />
        }
      >
        {data && data.length === 0 ? (
          <EmptyState
            icon="document-text-outline"
            title="No Sheets Found"
            message="No problem sheets available. Check back later!"
          />
        ) : (
          data?.map((sheet: DSASheet, index: number) => {
            const levelColors = getLevelColor(sheet.level);
            return (
              <TouchableOpacity
                key={sheet._id}
                className="bg-white rounded-3xl p-6 mb-4 shadow-md"
                onPress={() => router.push(`/(tabs)/dsa/sheet-${sheet._id}`)}
                activeOpacity={0.8}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                {/* Header with Icon */}
                <View className="flex-row items-start mb-4">
                  <LinearGradient
                    colors={['#9333ea', '#a855f7']}
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3 shadow-sm"
                  >
                    <Ionicons name="document-text" size={24} color="#fff" />
                  </LinearGradient>
                  <View className="flex-1">
                    <Text className="text-gray-900 text-lg font-extrabold leading-6 mb-1" numberOfLines={2}>
                      {sheet.name}
                    </Text>
                    <LinearGradient
                      colors={levelColors}
                      className="px-3 py-1.5 rounded-full self-start shadow-sm"
                    >
                      <Text className="text-white text-xs font-extrabold">{sheet.level}</Text>
                    </LinearGradient>
                  </View>
                </View>

                {/* Description */}
                <Text className="text-gray-600 text-sm leading-5 mb-4" numberOfLines={2}>
                  {sheet.description}
                </Text>

                {/* Stats Card */}
                <View className="bg-purple-50 rounded-2xl p-4 mb-4 border border-purple-100">
                  <View className="flex-row items-center justify-between">
                    <View className="items-center flex-1">
                      <View className="bg-white w-12 h-12 rounded-xl items-center justify-center mb-2 shadow-sm">
                        <Ionicons name="list" size={24} color="#9333ea" />
                      </View>
                      <Text className="text-purple-900 text-lg font-extrabold">{sheet.questions?.length || 0}</Text>
                      <Text className="text-purple-600 text-xs font-bold">Problems</Text>
                    </View>
                    {sheet.difficulty_breakdown && (
                      <>
                        <View className="items-center flex-1">
                          <View className="bg-green-500 w-12 h-12 rounded-xl items-center justify-center mb-2 shadow-sm">
                            <Text className="text-white text-base font-extrabold">{sheet.difficulty_breakdown.Easy}</Text>
                          </View>
                          <Text className="text-gray-700 text-xs font-bold">Easy</Text>
                        </View>
                        <View className="items-center flex-1">
                          <View className="bg-yellow-500 w-12 h-12 rounded-xl items-center justify-center mb-2 shadow-sm">
                            <Text className="text-white text-base font-extrabold">{sheet.difficulty_breakdown.Medium}</Text>
                          </View>
                          <Text className="text-gray-700 text-xs font-bold">Medium</Text>
                        </View>
                        <View className="items-center flex-1">
                          <View className="bg-red-500 w-12 h-12 rounded-xl items-center justify-center mb-2 shadow-sm">
                            <Text className="text-white text-base font-extrabold">{sheet.difficulty_breakdown.Hard}</Text>
                          </View>
                          <Text className="text-gray-700 text-xs font-bold">Hard</Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>

                {/* Tags */}
                {sheet.tags && sheet.tags.length > 0 && (
                  <View className="flex-row flex-wrap">
                    {sheet.tags.slice(0, 4).map((tag, index) => (
                      <View key={index} className="bg-purple-100 px-3 py-2 rounded-lg mr-2 mb-2 border border-purple-200">
                        <Text className="text-purple-700 text-xs font-bold">#{tag}</Text>
                      </View>
                    ))}
                    {sheet.tags.length > 4 && (
                      <View className="bg-gray-100 px-3 py-2 rounded-lg mb-2">
                        <Text className="text-gray-600 text-xs font-bold">+{sheet.tags.length - 4}</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Action Button */}
                <LinearGradient
                  colors={['#9333ea', '#a855f7']}
                  className="rounded-xl p-3 mt-4 flex-row items-center justify-center shadow-sm"
                >
                  <Text className="text-white font-extrabold mr-2">Start Practicing</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </LinearGradient>
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
