// app/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { ProfileProvider } from '../../context/ProfileContext';  // Импортируем контекст
import { Ionicons } from '@expo/vector-icons';  // Импорт иконок

export default function TabLayout() {
  return (
    <ProfileProvider>
      <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />  // Иконка для главной вкладки
          ),
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: 'Дневник',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />  // Иконка для вкладки дневника
          ),
        }}
      />
      </Tabs>
    </ProfileProvider>
  );
}
