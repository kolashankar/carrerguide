import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-white text-2xl font-bold">Profile</Text>
        </View>

        {/* User Info */}
        <View className="px-6 py-4 bg-dark-200 mx-4 rounded-lg mb-4">
          <View className="items-center mb-4">
            <View className="bg-primary-600 w-20 h-20 rounded-full items-center justify-center mb-3">
              <Text className="text-white text-3xl font-bold">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <Text className="text-white text-xl font-bold">{user?.full_name}</Text>
            <Text className="text-gray-400 text-sm">{user?.email}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-4">
          <TouchableOpacity 
            className="bg-dark-200 px-6 py-4 rounded-lg mb-2 flex-row items-center justify-between"
            onPress={() => router.push('/(tabs)/profile/bookmarks')}
          >
            <View className="flex-row items-center">
              <Ionicons name="bookmark-outline" size={24} color="#9ca3af" />
              <Text className="text-white ml-4 text-base">Bookmarks</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-dark-200 px-6 py-4 rounded-lg mb-2 flex-row items-center justify-between"
            onPress={() => router.push('/(tabs)/profile/reading-history')}
          >
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={24} color="#9ca3af" />
              <Text className="text-white ml-4 text-base">Reading History</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 rounded-lg mb-2 flex-row items-center justify-between"
            onPress={() => router.push('/(tabs)/profile/career-tools')}
          >
            <View className="flex-row items-center">
              <Ionicons name="sparkles" size={24} color="#fff" />
              <Text className="text-white ml-4 text-base font-semibold">Career Tools (AI)</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-dark-200 px-6 py-4 rounded-lg mb-2 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="settings-outline" size={24} color="#9ca3af" />
              <Text className="text-white ml-4 text-base">Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-600 px-6 py-4 rounded-lg mt-4 flex-row items-center justify-center"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text className="text-white ml-3 text-base font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
