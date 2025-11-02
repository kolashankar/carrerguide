import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getDSAStats, DSAStats } from '../../../lib/dsaProgress';
import HamburgerMenu from '../../../components/common/HamburgerMenu';

export default function DSAScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<DSAStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

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
      title: 'DSA Questions',
      description: 'Practice 3000+ coding problems',
      icon: 'code-slash' as keyof typeof Ionicons.glyphMap,
      route: '/(tabs)/dsa/questions',
      gradient: ['#2563eb', '#3b82f6'],
    },
    {
      title: 'Topics',
      description: 'Learn by category',
      icon: 'list' as keyof typeof Ionicons.glyphMap,
      route: '/(tabs)/dsa/topics',
      gradient: ['#16a34a', '#22c55e'],
    },
    {
      title: 'DSA Sheets',
      description: 'Curated problem collections',
      icon: 'document-text' as keyof typeof Ionicons.glyphMap,
      route: '/(tabs)/dsa/sheets',
      gradient: ['#9333ea', '#a855f7'],
    },
    {
      title: 'Company Questions',
      description: 'Interview prep by company',
      icon: 'business' as keyof typeof Ionicons.glyphMap,
      route: '/(tabs)/dsa/companies',
      gradient: ['#ea580c', '#f97316'],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Hero Header */}
      <LinearGradient
        colors={['#2563eb', '#4f46e5', '#6366f1']}
        className="px-5 py-6"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity 
            onPress={() => setMenuVisible(true)}
            className="p-2 -ml-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu" size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="p-2 -mr-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Text className="text-white text-3xl font-extrabold mb-2">DSA Corner</Text>
        <Text className="text-blue-100 text-base">Master Technical Interviews</Text>
        
        {/* Stats */}
        <View className="flex-row justify-between mt-5 gap-2">
          <View className="bg-white/20 backdrop-blur rounded-xl p-4 flex-1">
            <Text className="text-white text-2xl font-extrabold">{stats?.totalSolved || 0}</Text>
            <Text className="text-blue-100 text-xs mt-1 font-semibold">Solved</Text>
          </View>
          <View className="bg-white/20 backdrop-blur rounded-xl p-4 flex-1">
            <Text className="text-white text-2xl font-extrabold">
              {stats?.totalSolved ? Math.round((stats.totalSolved / (stats.totalSolved + 100)) * 100) : 0}%
            </Text>
            <Text className="text-blue-100 text-xs mt-1 font-semibold">Progress</Text>
          </View>
          <View className="bg-white/20 backdrop-blur rounded-xl p-4 flex-1">
            <Text className="text-white text-2xl font-extrabold">{stats?.streak || 0}</Text>
            <Text className="text-blue-100 text-xs mt-1 font-semibold">Streak</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 py-5">
        {/* Quick Access */}
        <Text className="text-gray-900 text-xl font-extrabold mb-4">Quick Access</Text>
        {sections.map((section, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white rounded-2xl p-5 mb-4 flex-row items-center shadow-sm border border-gray-100"
            onPress={() => router.push(section.route as any)}
          >
            <LinearGradient
              colors={section.gradient}
              className="w-14 h-14 rounded-xl items-center justify-center mr-4"
            >
              <Ionicons name={section.icon} size={26} color="#fff" />
            </LinearGradient>
            <View className="flex-1">
              <Text className="text-gray-900 text-base font-bold leading-5">{section.title}</Text>
              <Text className="text-gray-600 text-sm mt-1.5 leading-5">{section.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>
        ))}

        {/* CTA Card */}
        <LinearGradient
          colors={['#1e293b', '#334155']}
          className="rounded-2xl p-6 mt-2"
        >
          <Text className="text-white text-xl font-extrabold mb-2">Ready to Start?</Text>
          <Text className="text-gray-300 text-sm mb-4 leading-5">
            Begin your journey to master DSA and ace technical interviews
          </Text>
          <TouchableOpacity 
            className="bg-blue-600 rounded-xl py-3.5 items-center shadow-sm min-h-[48px] justify-center"
            onPress={() => router.push('/(tabs)/dsa/questions')}
          >
            <Text className="text-white font-extrabold text-base">Start Practicing</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>

      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
