import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HamburgerMenu from '../../components/common/HamburgerMenu';

export default function ProfileScreen() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.push('/(tabs)');
        },
      },
    ]);
  };

  const handleCareerToolsPress = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please sign in to access Career Tools',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => router.push('/(auth)/login'),
          },
        ]
      );
    } else {
      router.push('/(tabs)/profile/career-tools');
    }
  };

  const quickAccessItems = [
    {
      icon: 'bookmark',
      title: 'Bookmarks',
      subtitle: 'Saved opportunities',
      route: '/(tabs)/profile/bookmarks',
      color: '#3b82f6',
      bgColor: '#dbeafe',
      requiresAuth: false,
    },
    {
      icon: 'time',
      title: 'Reading History',
      subtitle: 'Articles you\'ve read',
      route: '/(tabs)/profile/reading-history',
      color: '#10b981',
      bgColor: '#d1fae5',
      requiresAuth: false,
    },
  ];

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1">
          {/* Header */}
          <View className="bg-white px-6 py-4 border-b border-gray-200 flex-row items-center justify-between">
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu" size={28} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">Profile</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Login Prompt */}
          <View className="flex-1 items-center justify-center px-6">
            <View className="bg-white w-24 h-24 rounded-full items-center justify-center mb-6 shadow-md">
              <Ionicons name="person-outline" size={48} color="#9ca3af" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Welcome to CareerGuide
            </Text>
            <Text className="text-gray-600 text-center mb-8 text-base leading-6">
              Sign in to access personalized features like Career Tools, bookmarks, and reading history
            </Text>
            
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              className="w-full mb-3"
            >
              <LinearGradient
                colors={['#2563eb', '#4f46e5']}
                className="rounded-xl py-4 items-center"
              >
                <Text className="text-white font-bold text-lg">Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(auth)/register')}
              className="w-full border-2 border-blue-600 rounded-xl py-4 items-center"
            >
              <Text className="text-blue-600 font-bold text-lg">Create Account</Text>
            </TouchableOpacity>

            <View className="mt-8 bg-blue-50 p-4 rounded-xl">
              <Text className="text-sm text-gray-700 text-center leading-5">
                💡 You can still browse jobs, internships, scholarships, articles, and roadmaps without signing in!
              </Text>
            </View>
          </View>
        </View>

        <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Hero Header */}
        <LinearGradient
          colors={['#4f46e5', '#7c3aed']}
          className="px-6 py-8"
        >
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile/edit-profile')}>
              <Ionicons name="create-outline" size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          <View className="items-center">
            <View className="bg-white w-24 h-24 rounded-full items-center justify-center mb-4">
              <Text className="text-indigo-600 text-4xl font-extrabold">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <Text className="text-white text-3xl font-bold mb-2">
              {user?.full_name || 'User'}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="mail" size={16} color="#e0e7ff" />
              <Text className="text-indigo-100 text-sm ml-2">{user?.email}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Statistics Cards */}
        <View className="px-6 py-6 bg-white border-b border-gray-200">
          <View className="flex-row justify-between">
            <View className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 mr-2">
              <Ionicons name="bookmark" size={24} color="#3b82f6" />
              <Text className="text-2xl font-bold text-gray-900 mt-2">0</Text>
              <Text className="text-xs text-gray-600 mt-1">Bookmarks</Text>
            </View>
            <View className="flex-1 bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 mx-1">
              <Ionicons name="code-slash" size={24} color="#10b981" />
              <Text className="text-2xl font-bold text-gray-900 mt-2">0</Text>
              <Text className="text-xs text-gray-600 mt-1">DSA Solved</Text>
            </View>
            <View className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 ml-2">
              <Ionicons name="book" size={24} color="#8b5cf6" />
              <Text className="text-2xl font-bold text-gray-900 mt-2">0</Text>
              <Text className="text-xs text-gray-600 mt-1">Articles</Text>
            </View>
          </View>
        </View>

        {/* Quick Access */}
        <View className="px-6 py-6">
          <Text className="text-gray-900 text-xl font-bold mb-4">Quick Access</Text>
          
          <View className="space-y-3">
            {quickAccessItems.map((item, index) => (
              <TouchableOpacity
                key={item.title}
                onPress={() => router.push(item.route as any)}
                className="bg-white rounded-xl border border-gray-200 p-4 flex-row items-center"
                style={{ marginBottom: index < quickAccessItems.length - 1 ? 12 : 0 }}
              >
                <View
                  className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <Ionicons name={item.icon as any} size={26} color={item.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 text-base font-bold mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-gray-600 text-sm">{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
              </TouchableOpacity>
            ))}

            {/* Career Tools - Special Gradient Card */}
            <TouchableOpacity
              onPress={handleCareerToolsPress}
            >
              <LinearGradient
                colors={['#3b82f6', '#8b5cf6']}
                className="rounded-xl p-4 flex-row items-center mt-3"
              >
                <View className="bg-white/20 w-14 h-14 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="sparkles" size={26} color="#fff" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-base font-extrabold mb-1">
                    Career Tools (AI)
                  </Text>
                  <Text className="text-white/80 text-sm">Resume, Cover Letter & More</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings & Logout */}
        <View className="px-6 pb-6">
          <Text className="text-gray-900 text-xl font-bold mb-4">Settings</Text>
          
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/settings')}
            className="bg-white rounded-xl border border-gray-200 p-4 flex-row items-center mb-4"
          >
            <View className="bg-gray-100 w-14 h-14 rounded-xl items-center justify-center mr-4">
              <Ionicons name="settings-outline" size={26} color="#6b7280" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 text-base font-bold">Settings</Text>
              <Text className="text-gray-600 text-sm">App preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 rounded-xl border border-red-200 p-4 flex-row items-center"
          >
            <View className="bg-red-100 w-14 h-14 rounded-xl items-center justify-center mr-4">
              <Ionicons name="log-out-outline" size={26} color="#dc2626" />
            </View>
            <View className="flex-1">
              <Text className="text-red-600 text-base font-bold">Logout</Text>
              <Text className="text-red-500 text-sm">Sign out of your account</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fca5a5" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}