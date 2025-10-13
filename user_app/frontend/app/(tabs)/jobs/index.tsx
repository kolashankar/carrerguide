import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import JobsList from '../../../components/jobs/JobsList';
import InternshipsList from '../../../components/jobs/InternshipsList';
import ScholarshipsList from '../../../components/jobs/ScholarshipsList';

type TabType = 'jobs' | 'internships' | 'scholarships';

export default function JobsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('jobs');
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      {/* Header */}
      <View className="px-6 py-4">
        <Text className="text-white text-2xl font-bold">Opportunities</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 mb-4">
        <TouchableOpacity
          className={`flex-1 py-3 rounded-lg mr-2 ${
            activeTab === 'jobs' ? 'bg-primary-600' : 'bg-dark-200'
          }`}
          onPress={() => setActiveTab('jobs')}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'jobs' ? 'text-white' : 'text-gray-400'
            }`}
          >
            Jobs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 rounded-lg mr-2 ${
            activeTab === 'internships' ? 'bg-primary-600' : 'bg-dark-200'
          }`}
          onPress={() => setActiveTab('internships')}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'internships' ? 'text-white' : 'text-gray-400'
            }`}
          >
            Internships
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 rounded-lg ${
            activeTab === 'scholarships' ? 'bg-primary-600' : 'bg-dark-200'
          }`}
          onPress={() => setActiveTab('scholarships')}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'scholarships' ? 'text-white' : 'text-gray-400'
            }`}
          >
            Scholarships
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1">
        {activeTab === 'jobs' && <JobsList />}
        {activeTab === 'internships' && <InternshipsList />}
        {activeTab === 'scholarships' && <ScholarshipsList />}
      </View>
    </SafeAreaView>
  );
}