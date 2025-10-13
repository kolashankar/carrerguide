import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getDSAStats, DSAStats } from '../../../lib/dsaProgress';

export default function DSAScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<DSAStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const dsaStats = await getDSAStats();
      setStats(dsaStats);
    } catch (error) {
      console.error('Error loading DSA stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: 'Questions',
      description: 'Practice coding problems',
      icon: 'code-slash' as keyof typeof Ionicons.glyphMap,
      route: '/(tabs)/dsa/questions',
      color: 'bg-blue-600',
    },
    {
      title: 'Topics',
      description: 'Learn by topics',
      icon: 'list' as keyof typeof Ionicons.glyphMap,
      route: '/(tabs)/dsa/topics',
      color: 'bg-green-600',
    },
    {
      title: 'Sheets',
      description: 'Curated problem sets',
      icon: 'document-text' as keyof typeof Ionicons.glyphMap,
      route: '/(tabs)/dsa/sheets',
      color: 'bg-purple-600',
    },
    {
      title: 'Companies',
      description: 'Company-wise problems',
      icon: 'business' as keyof typeof Ionicons.glyphMap,
      route: '/(tabs)/dsa/companies',
      color: 'bg-orange-600',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      {/* Header */}
      <View className="px-6 py-4">
        <Text className="text-white text-2xl font-bold">DSA Corner</Text>
        <Text className="text-gray-400 text-sm mt-1">Master Data Structures & Algorithms</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Dashboard Stats - Placeholder */}
        <View className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 mb-6">
          <Text className="text-white text-xl font-bold mb-2">Your Progress</Text>
          <View className="flex-row justify-between mt-4">
            <View>
              <Text className="text-white text-3xl font-bold">0</Text>
              <Text className="text-gray-200 text-sm">Solved</Text>
            </View>
            <View>
              <Text className="text-white text-3xl font-bold">0%</Text>
              <Text className="text-gray-200 text-sm">Accuracy</Text>
            </View>
            <View>
              <Text className="text-white text-3xl font-bold">0</Text>
              <Text className="text-gray-200 text-sm">Streak</Text>
            </View>
          </View>
        </View>

        {/* Sections */}
        <Text className="text-white text-lg font-bold mb-4">Explore</Text>
        {sections.map((section, index) => (
          <TouchableOpacity
            key={index}
            className="bg-dark-200 rounded-lg p-4 mb-3 flex-row items-center"
            onPress={() => router.push(section.route as any)}
          >
            <View className={`${section.color} w-12 h-12 rounded-lg items-center justify-center mr-4`}>
              <Ionicons name={section.icon} size={24} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">{section.title}</Text>
              <Text className="text-gray-400 text-sm">{section.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}