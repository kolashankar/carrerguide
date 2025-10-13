import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoadmapsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-white text-2xl font-bold mb-2">Roadmaps</Text>
        <Text className="text-gray-400 text-center">Coming in Phase 5</Text>
      </View>
    </SafeAreaView>
  );
}
