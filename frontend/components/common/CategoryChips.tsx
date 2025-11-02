import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryChips({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4 py-2 bg-gray-50"
      contentContainerStyle={{ paddingRight: 16 }}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          className={`px-3 py-1.5 rounded-full mr-2 min-h-[36px] justify-center ${
            selectedCategory === category
              ? 'bg-blue-600 shadow-sm'
              : 'bg-white border border-gray-200'
          }`}
          onPress={() => onSelectCategory(category)}
        >
          <Text
            className={`font-semibold text-xs ${
              selectedCategory === category ? 'text-white' : 'text-gray-700'
            }`}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
