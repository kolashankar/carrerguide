import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import JobsList from '../../../components/jobs/JobsList';
import InternshipsList from '../../../components/jobs/InternshipsList';
import ScholarshipsList from '../../../components/jobs/ScholarshipsList';
import HamburgerMenu from '../../../components/common/HamburgerMenu';

type TabType = 'jobs' | 'internships' | 'scholarships';

export default function JobsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('jobs');
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity 
            onPress={() => setMenuVisible(true)}
            className="p-2 -ml-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu" size={26} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Jobs</Text>
          <TouchableOpacity 
            className="p-2 -mr-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="notifications-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-gray-100 rounded-xl p-1">
          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-lg ${
              activeTab === 'jobs' ? 'bg-white shadow-sm' : ''
            }`}
            onPress={() => setActiveTab('jobs')}
          >
            <Text
              className={`text-center font-semibold text-sm ${
                activeTab === 'jobs' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Jobs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-lg ${
              activeTab === 'internships' ? 'bg-white shadow-sm' : ''
            }`}
            onPress={() => setActiveTab('internships')}
          >
            <Text
              className={`text-center font-semibold text-sm ${
                activeTab === 'internships' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Internships
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-lg ${
              activeTab === 'scholarships' ? 'bg-white shadow-sm' : ''
            }`}
            onPress={() => setActiveTab('scholarships')}
          >
            <Text
              className={`text-center font-semibold text-sm ${
                activeTab === 'scholarships' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Scholarships
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        {activeTab === 'jobs' && <JobsList />}
        {activeTab === 'internships' && <InternshipsList />}
        {activeTab === 'scholarships' && <ScholarshipsList />}
      </View>

      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
