import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HamburgerMenu from '../../components/common/HamburgerMenu';

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const communityLinks = [
    {
      icon: 'logo-whatsapp' as const,
      title: 'WhatsApp',
      members: '46K+',
      color: '#25D366',
      url: 'https://chat.whatsapp.com/YOUR_COMMUNITY_INVITE_LINK',
    },
    {
      icon: 'chatbubbles' as const,
      title: 'Channel',
      members: '9K+',
      color: '#2563eb',
      url: '#',
    },
    {
      icon: 'logo-linkedin' as const,
      title: 'LinkedIn',
      members: '44K+',
      color: '#0077b5',
      url: '#',
    },
  ];

  const quickAccessFeatures = [
    {
      icon: 'briefcase' as const,
      title: 'Find Jobs That Match Your Skills',
      description: 'Search through 50,000+ job opportunities from top companies.',
      ctaText: 'Browse Jobs',
      route: '/(tabs)/jobs',
      highlight: 'Adobe is hiring Software Development Engineer Freshers',
      highlightCompany: 'Adobe',
    },
    {
      icon: 'code-slash' as const,
      title: 'Master Technical Interviews',
      description: 'Practice with 3000+ coding problems and company-specific questions.',
      ctaText: 'Start Practicing',
      route: '/(tabs)/dsa',
      highlight: 'Array',
      highlightCount: '1779',
    },
    {
      icon: 'document-text' as const,
      title: 'AI-Powered Career Tools',
      description: 'Leverage cutting-edge AI to supercharge your job search.',
      ctaText: 'Resume Review',
      route: '/(tabs)/profile/career-tools',
      highlight: 'ATS-optimized',
      tools: ['Resume', 'Cover Letter', 'Auto Apply'],
    },
    {
      icon: 'stats-chart' as const,
      title: 'Track Your Progress & Build Profile',
      description: 'Monitor your job search journey and track applications.',
      ctaText: 'View Dashboard',
      route: '/(tabs)/profile',
      highlight: 'Your Applications',
    },
  ];

  const handleCommunityLink = (url: string) => {
    if (url !== '#') {
      Linking.openURL(url).catch(err => console.error('Error opening link:', err));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Hero Section */}
        <LinearGradient
          colors={['#2563eb', '#3b82f6', '#4f46e5']}
          className="px-5 py-10"
        >
          <View className="flex-row items-center justify-between mb-6">
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

          <Text className="text-white text-3xl font-extrabold mb-3 leading-tight">
            India's #1 Freshers{' '}
            <Text className="text-yellow-300">Career Portal</Text>
          </Text>
          <Text className="text-blue-100 text-base mb-6 leading-6">
            Your one-stop platform for freshers jobs, internships, interview prep, and career growth.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/jobs')}
            className="bg-yellow-400 py-3.5 px-8 rounded-xl items-center min-h-[48px] justify-center"
          >
            <Text className="text-gray-900 font-bold text-base">Find Jobs</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Community Section */}
        <View className="px-5 py-10 bg-white">
          <Text className="text-gray-900 text-2xl font-bold mb-6 text-center">
            Join Our Community
          </Text>
          <View className="space-y-4">
            {communityLinks.map((link, index) => (
              <TouchableOpacity
                key={link.title}
                onPress={() => handleCommunityLink(link.url)}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 p-5 flex-row items-center min-h-[88px]"
                style={{ marginBottom: index < communityLinks.length - 1 ? 16 : 0 }}
              >
                <View
                  className="w-14 h-14 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: link.color }}
                >
                  <Ionicons name={link.icon} size={28} color="#fff" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 text-lg font-bold mb-1">
                    {link.title}
                  </Text>
                  <Text className="text-blue-600 text-xl font-extrabold">
                    {link.members}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Access Section */}
        <View className="px-5 py-10 bg-gray-50">
          <Text className="text-gray-900 text-2xl font-bold mb-6 text-center">
            Quick Access
          </Text>
          <View className="space-y-6">
            {quickAccessFeatures.map((feature, index) => (
              <View
                key={feature.title}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
                style={{ marginBottom: index < quickAccessFeatures.length - 1 ? 20 : 0 }}
              >
                <View className="flex-row items-start mb-4">
                  <View className="bg-blue-100 w-14 h-14 rounded-xl items-center justify-center mr-4">
                    <Ionicons name={feature.icon} size={26} color="#2563eb" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 text-base font-bold mb-2 leading-5">
                      {feature.title}
                    </Text>
                    <Text className="text-gray-600 text-sm leading-5">
                      {feature.description}
                    </Text>
                  </View>
                </View>

                {feature.highlight && (
                  <View className="bg-blue-50 rounded-xl p-4 mb-4">
                    <Text className="text-blue-900 text-sm font-semibold leading-5">
                      {feature.highlight}
                      {feature.highlightCompany && (
                        <Text className="text-blue-600"> {feature.highlightCompany}</Text>
                      )}
                      {feature.highlightCount && (
                        <Text className="text-blue-600"> {feature.highlightCount}</Text>
                      )}
                    </Text>
                  </View>
                )}

                {feature.tools && (
                  <View className="flex-row mb-4 gap-2">
                    {feature.tools.map((tool, idx) => (
                      <View
                        key={tool}
                        className={`flex-1 p-3 rounded-xl ${
                          idx === 0 ? 'bg-green-50' : 'bg-gray-100'
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold text-center ${
                            idx === 0 ? 'text-green-700' : 'text-gray-500'
                          }`}
                        >
                          {tool}
                        </Text>
                        <Text className="text-xs text-center mt-1 text-gray-600">
                          {idx === 0 ? 'ATS-optimized' : 'Coming Soon'}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => router.push(feature.route as any)}
                  className="bg-blue-600 py-3.5 rounded-xl items-center min-h-[48px] justify-center"
                >
                  <Text className="text-white font-bold text-base">
                    {feature.ctaText}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <LinearGradient
          colors={['#111827', '#1f2937']}
          className="px-5 py-12"
        >
          <Text className="text-white text-2xl font-bold mb-3 text-center leading-tight">
            Ready to Start Your Career Journey?
          </Text>
          <Text className="text-gray-300 text-base mb-8 text-center leading-6">
            Join thousands of students and professionals who found success with CareerGuide.
          </Text>
          <View className="space-y-4">
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/jobs')}
              className="bg-blue-600 py-3.5 px-8 rounded-xl items-center min-h-[48px] justify-center"
            >
              <Text className="text-white font-bold text-base">Find Jobs Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/dsa')}
              className="border-2 border-white py-3.5 px-8 rounded-xl items-center min-h-[48px] justify-center"
            >
              <Text className="text-white font-bold text-base">Practice Coding</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Footer */}
        <View className="bg-white px-5 py-6 border-t border-gray-200">
          <Text className="text-gray-500 text-xs text-center leading-5">
            © {new Date().getFullYear()} CareerGuide. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
