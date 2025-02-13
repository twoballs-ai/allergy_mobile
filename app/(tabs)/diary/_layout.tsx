// app/(tabs)/diary/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router/stack';  // Импортируем стэк навигации

export default function DiaryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add" />
    </Stack>
  );
}