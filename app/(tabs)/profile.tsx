// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useProfile } from '../../context/ProfileContext';  // Используем контекст

export default function ProfileScreen() {
  const { profileType, setProfileType } = useProfile();  // Используем контекст для получения и изменения профиля

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите тип профиля</Text>

      <TouchableOpacity
        style={[styles.button, profileType === 'personal' && styles.activeButton]}
        onPress={() => setProfileType('personal')}
      >
        <Text style={styles.buttonText}>Личный профиль</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, profileType === 'family' && styles.activeButton]}
        onPress={() => setProfileType('family')}
      >
        <Text style={styles.buttonText}>Семейный профиль</Text>
      </TouchableOpacity>

      {profileType && (
        <Text style={styles.selectedText}>
          Выбранный профиль: {profileType === 'personal' ? 'Личный профиль' : 'Семейный профиль'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 5,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
    color: '#555',
  },
});
