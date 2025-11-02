import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting registration...');
      await register(email, password, fullName);
      console.log('Registration successful, navigating to tabs...');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="flex-1"
        >
          {/* Header with Gradient */}
          <LinearGradient
            colors={['#8b5cf6', '#a78bfa']}
            className="px-6 pt-12 pb-16 rounded-b-3xl"
          >
            <View className="flex-row justify-end mb-4">
              <TouchableOpacity
                onPress={() => router.replace('/(tabs)')}
                className="bg-white/20 px-4 py-2 rounded-full"
              >
                <Text className="text-white text-sm font-semibold">Skip for now</Text>
              </TouchableOpacity>
            </View>
            <View className="items-center mb-6">
              <View className="bg-white/20 w-20 h-20 rounded-full items-center justify-center mb-4">
                <Ionicons name="person-add" size={40} color="#fff" />
              </View>
              <Text className="text-white text-4xl font-extrabold mb-2">Join CareerGuide</Text>
              <Text className="text-purple-100 text-base text-center">Start your journey to success today</Text>
            </View>
          </LinearGradient>

          {/* Form Container */}
          <View className="flex-1 px-6 -mt-8 pb-6">
            <View className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              {/* Full Name Input */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 text-sm font-semibold">Full Name</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-4 flex-row items-center border border-gray-200">
                  <Ionicons name="person-outline" size={22} color="#6b7280" />
                  <TextInput
                    className="flex-1 text-gray-900 ml-3 text-base"
                    placeholder="Enter your full name"
                    placeholderTextColor="#9ca3af"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 text-sm font-semibold">Email Address</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-4 flex-row items-center border border-gray-200">
                  <Ionicons name="mail-outline" size={22} color="#6b7280" />
                  <TextInput
                    className="flex-1 text-gray-900 ml-3 text-base"
                    placeholder="Enter your email"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 text-sm font-semibold">Password</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-4 flex-row items-center border border-gray-200">
                  <Ionicons name="lock-closed-outline" size={22} color="#6b7280" />
                  <TextInput
                    className="flex-1 text-gray-900 ml-3 text-base"
                    placeholder="Create a password (min 8 characters)"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Text className="text-gray-700 mb-2 text-sm font-semibold">Confirm Password</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-4 flex-row items-center border border-gray-200">
                  <Ionicons name="lock-closed-outline" size={22} color="#6b7280" />
                  <TextInput
                    className="flex-1 text-gray-900 ml-3 text-base"
                    placeholder="Confirm your password"
                    placeholderTextColor="#9ca3af"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#8b5cf6', '#7c3aed']}
                  className="rounded-xl py-4 items-center shadow-md"
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-bold text-lg">Create Account</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="text-gray-500 text-sm mx-4">or</Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Login Link */}
              <View className="flex-row justify-center items-center">
                <Text className="text-gray-600 text-base">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text className="text-purple-600 font-bold text-base">Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Info */}
            <View className="items-center mt-6">
              <Text className="text-gray-500 text-sm text-center px-4">
                By creating an account, you agree to our{' '}
                <Text className="text-purple-600">Terms of Service</Text>
                {' '}and{' '}
                <Text className="text-purple-600">Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}