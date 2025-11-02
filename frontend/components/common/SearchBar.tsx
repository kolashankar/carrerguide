import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilter?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  onFilter,
}: SearchBarProps) {
  return (
    <View className="flex-row items-center px-4 mb-3">
      <View className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 flex-row items-center shadow-sm">
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          className="flex-1 text-gray-900 ml-3 text-base"
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      {onFilter && (
        <TouchableOpacity
          className="bg-blue-600 rounded-xl p-3 ml-2 shadow-sm min-h-[44px] min-w-[44px] items-center justify-center"
          onPress={onFilter}
        >
          <Ionicons name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}
