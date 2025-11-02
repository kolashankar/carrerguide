import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable, Alert } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '../../contexts/AuthContext'

interface MenuItem {
  name: string
  icon: keyof typeof Ionicons.glyphMap
  route?: string
  requiresAuth?: boolean
  children?: {
    name: string
    route: string
    requiresAuth?: boolean
  }[]
}

interface HamburgerMenuProps {
  visible: boolean
  onClose: () => void
}

export default function HamburgerMenu({ visible, onClose }: HamburgerMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const handleNavigation = (route: string, requiresAuth: boolean = false) => {
    if (requiresAuth && !isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please sign in to access this feature',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => {
              onClose()
              router.push('/(auth)/login')
            },
          },
        ]
      )
      return
    }
    router.push(route as any)
    onClose()
  }

  const handleLogout = async () => {
    await logout()
    onClose()
    router.push('/(tabs)')
  }

  const menuItems: MenuItem[] = [
    {
      name: 'Home',
      icon: 'home',
      route: '/(tabs)',
      requiresAuth: false,
    },
    {
      name: 'Jobs',
      icon: 'briefcase',
      route: '/(tabs)/jobs',
      requiresAuth: false,
    },
    {
      name: 'Internships',
      icon: 'briefcase-outline',
      route: '/(tabs)/jobs',
      requiresAuth: false,
    },
    {
      name: 'Scholarships',
      icon: 'school',
      route: '/(tabs)/jobs',
      requiresAuth: false,
    },
    {
      name: 'Learning',
      icon: 'book',
      requiresAuth: false,
      children: [
        { name: 'Articles', route: '/(tabs)/learning', requiresAuth: false },
        { name: 'DSA Corner', route: '/(tabs)/dsa', requiresAuth: false },
        { name: 'Roadmaps', route: '/(tabs)/roadmaps', requiresAuth: false },
      ]
    },
    {
      name: 'Career Tools',
      icon: 'construct',
      requiresAuth: true,
      children: [
        { name: 'Resume Review', route: '/(tabs)/profile/career-tools/resume-review', requiresAuth: true },
        { name: 'Cover Letter', route: '/(tabs)/profile/career-tools/cover-letter', requiresAuth: true },
        { name: 'ATS Hack', route: '/(tabs)/profile/career-tools/ats-hack', requiresAuth: true },
        { name: 'Cold Email', route: '/(tabs)/profile/career-tools/cold-email', requiresAuth: true },
      ]
    },
  ]

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 flex-row">
        {/* Overlay */}
        <Pressable 
          className="flex-1 bg-black/50"
          onPress={onClose}
        />

        {/* Sidebar */}
        <View className="w-80 bg-white h-full shadow-2xl">
          <View className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-blue-600">CareerGuide</Text>
              <TouchableOpacity 
                onPress={onClose}
                className="p-2 rounded-md hover:bg-white"
              >
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 px-4 py-4">
            {menuItems.map((item) => {
              const isExpanded = expandedItems.includes(item.name)
              const isActive = pathname === item.route
              
              return (
                <View key={item.name} className="mb-1">
                  {item.route ? (
                    <TouchableOpacity
                      onPress={() => handleNavigation(item.route!, item.requiresAuth)}
                      className={`flex-row items-center px-4 py-3 rounded-lg ${
                        isActive ? 'bg-blue-50 shadow-sm' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Ionicons 
                        name={item.icon} 
                        size={20} 
                        color={isActive ? '#2563eb' : '#374151'} 
                      />
                      <Text 
                        className={`ml-3 text-base font-medium ${
                          isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {item.name}
                      </Text>
                      {item.requiresAuth && !isAuthenticated && (
                        <Ionicons name="lock-closed" size={16} color="#9ca3af" style={{ marginLeft: 4 }} />
                      )}
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => toggleExpand(item.name)}
                      className="flex-row items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50"
                    >
                      <View className="flex-row items-center">
                        <Ionicons name={item.icon} size={20} color="#374151" />
                        <Text className="ml-3 text-base font-medium text-gray-700">
                          {item.name}
                        </Text>
                        {item.requiresAuth && !isAuthenticated && (
                          <Ionicons name="lock-closed" size={16} color="#9ca3af" style={{ marginLeft: 4 }} />
                        )}
                      </View>
                      <Ionicons 
                        name={isExpanded ? 'chevron-down' : 'chevron-forward'} 
                        size={20} 
                        color="#9ca3af" 
                      />
                    </TouchableOpacity>
                  )}
                  
                  {isExpanded && item.children && (
                    <View className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.route || pathname.startsWith(child.route + '/')
                        return (
                          <TouchableOpacity
                            key={child.route}
                            onPress={() => handleNavigation(child.route, child.requiresAuth)}
                            className={`px-4 py-2 rounded-lg ${
                              isChildActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <View className="flex-row items-center">
                              <Text 
                                className={`text-sm ${
                                  isChildActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'
                                }`}
                              >
                                {child.name}
                              </Text>
                              {child.requiresAuth && !isAuthenticated && (
                                <Ionicons name="lock-closed" size={14} color="#9ca3af" style={{ marginLeft: 4 }} />
                              )}
                            </View>
                          </TouchableOpacity>
                        )
                      })}
                    </View>
                  )}
                </View>
              )
            })}

            <View className="my-4 border-t border-gray-200" />

            {/* User Actions */}
            {user ? (
              <>
                <TouchableOpacity
                  onPress={() => handleNavigation('/(tabs)/profile')}
                  className={`flex-row items-center px-4 py-3 rounded-lg ${
                    pathname === '/(tabs)/profile' ? 'bg-blue-50 shadow-sm' : 'hover:bg-gray-50'
                  }`}
                >
                  <Ionicons 
                    name="person" 
                    size={20} 
                    color={pathname === '/(tabs)/profile' ? '#2563eb' : '#374151'} 
                  />
                  <Text 
                    className={`ml-3 text-base font-medium ${
                      pathname === '/(tabs)/profile' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    Profile
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLogout}
                  className="flex-row items-center px-4 py-3 rounded-lg hover:bg-gray-50"
                >
                  <Ionicons name="log-out" size={20} color="#374151" />
                  <Text className="ml-3 text-base font-medium text-gray-700">
                    Logout
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => handleNavigation('/(auth)/login')}
                  className="flex-row items-center px-4 py-3 rounded-lg hover:bg-gray-50"
                >
                  <Ionicons name="log-in" size={20} color="#374151" />
                  <Text className="ml-3 text-base font-medium text-gray-700">
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleNavigation('/(auth)/register')}
                  className="flex-row items-center px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm"
                >
                  <Ionicons name="person-add" size={20} color="#fff" />
                  <Text className="ml-3 text-base font-medium text-white">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>

          <View className="px-4 py-4 border-t border-gray-200 bg-gray-50">
            <Text className="text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} CareerGuide. All rights reserved.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  )
}
