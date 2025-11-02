import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../lib/api';

export default function EditProfileScreen() {
  const { user, updateUserProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    bio: '',
    education: '',
    experience: '',
    skills: [] as string[],
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        education: user.education || '',
        experience: user.experience || '',
        skills: user.skills || [],
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!formData.full_name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/auth/profile', formData);
      
      if (response.data.success) {
        // Update user context
        await updateUserProfile({
          ...user,
          full_name: formData.full_name,
          phone: formData.phone,
          bio: formData.bio,
          education: formData.education,
          experience: formData.experience,
          skills: formData.skills,
        });
        
        Alert.alert('Success', 'Profile updated successfully!');
        router.back();
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove),
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-extrabold">Edit Profile</Text>
        </View>

        <ScrollView className="flex-1 px-4 py-6">
          {/* Full Name */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold mb-2">Full Name *</Text>
            <View className="bg-white rounded-lg px-4 py-3 flex-row items-center border border-gray-200">
              <Ionicons name="person-outline" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-black"
                placeholder="Enter your full name"
                placeholderTextColor="#9ca3af"
                value={formData.full_name}
                onChangeText={(text) => setFormData({ ...formData, full_name: text })}
              />
            </View>
          </View>

          {/* Email (Read-only) */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold mb-2">Email (Cannot be changed)</Text>
            <View className="bg-gray-100 rounded-lg px-4 py-3 flex-row items-center border border-gray-200">
              <Ionicons name="mail-outline" size={20} color="#6b7280" />
              <Text className="flex-1 ml-3 text-black">{user?.email}</Text>
            </View>
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold mb-2">Phone Number</Text>
            <View className="bg-white rounded-lg px-4 py-3 flex-row items-center border border-gray-200">
              <Ionicons name="call-outline" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-black"
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="#9ca3af"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Bio */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold mb-2">Bio</Text>
            <View className="bg-white rounded-lg px-4 py-3 border border-gray-200">
              <TextInput
                className="text-black"
                placeholder="Tell us about yourself..."
                placeholderTextColor="#9ca3af"
                value={formData.bio}
                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Education */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold mb-2">Education</Text>
            <View className="bg-white rounded-lg px-4 py-3 flex-row items-center border border-gray-200">
              <Ionicons name="school-outline" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-black"
                placeholder="e.g., B.Tech in Computer Science"
                placeholderTextColor="#9ca3af"
                value={formData.education}
                onChangeText={(text) => setFormData({ ...formData, education: text })}
              />
            </View>
          </View>

          {/* Experience */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold mb-2">Experience</Text>
            <View className="bg-white rounded-lg px-4 py-3 flex-row items-center border border-gray-200">
              <Ionicons name="briefcase-outline" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-black"
                placeholder="e.g., 2 years in Software Development"
                placeholderTextColor="#9ca3af"
                value={formData.experience}
                onChangeText={(text) => setFormData({ ...formData, experience: text })}
              />
            </View>
          </View>

          {/* Skills */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold mb-2">Skills</Text>
            <View className="flex-row mb-3">
              <View className="flex-1 bg-white rounded-lg px-4 py-3 flex-row items-center border border-gray-200 mr-2">
                <Ionicons name="code-slash-outline" size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-black"
                  placeholder="Add a skill"
                  placeholderTextColor="#9ca3af"
                  value={skillInput}
                  onChangeText={setSkillInput}
                  onSubmitEditing={addSkill}
                />
              </View>
              <TouchableOpacity
                onPress={addSkill}
                className="bg-blue-600 rounded-lg px-6 py-3 items-center justify-center"
              >
                <Text className="text-white font-bold">Add</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap">
              {formData.skills.map((skill, index) => (
                <View
                  key={index}
                  className="bg-blue-100 rounded-full px-4 py-2 mr-2 mb-2 flex-row items-center"
                >
                  <Text className="text-blue-700 font-semibold mr-2">{skill}</Text>
                  <TouchableOpacity onPress={() => removeSkill(skill)}>
                    <Ionicons name="close-circle" size={18} color="#1d4ed8" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {formData.skills.length === 0 && (
              <Text className="text-gray-500 text-sm mt-2">No skills added yet</Text>
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="bg-blue-600 rounded-lg py-4 items-center mt-6 mb-4"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-extrabold text-base">Save Changes</Text>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="border border-gray-300 rounded-lg py-4 items-center mb-8"
          >
            <Text className="text-gray-900 font-bold text-base">Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
