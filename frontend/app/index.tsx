import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    // Wait for both auth to load and navigation to be ready
    if (!isLoading && rootNavigationState?.key && !hasNavigated) {
      console.log('Index - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
      
      // Use setTimeout to ensure navigation happens after render
      const timer = setTimeout(() => {
        try {
          // Always redirect to tabs - authentication is optional
          // Users can browse jobs, articles, etc. without login
          // Only Career Tools will require authentication
          console.log('Redirecting to tabs...');
          router.replace('/(tabs)');
          setHasNavigated(true);
        } catch (error) {
          console.error('Error in navigation:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, rootNavigationState?.key, hasNavigated]);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-blue-600 text-3xl font-bold mb-4">CareerGuide</Text>
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}
