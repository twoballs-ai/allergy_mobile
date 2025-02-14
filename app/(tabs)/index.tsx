import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(new Date());  // Сохраняем дату рождения
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [personalProfile, setPersonalProfile] = useState<{ name: string; age: number } | null>(null);

  // При загрузке экрана пытаемся получить сохраненный личный профиль
  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile = await AsyncStorage.getItem('personalProfile');
      if (savedProfile) {
        setPersonalProfile(JSON.parse(savedProfile));
      }
    };
    loadProfile();
  }, []);

  const handleAddPersonalProfile = async () => {
    if (name && age) {
      const ageInYears = new Date().getFullYear() - age.getFullYear();
      const profile = { name, age: ageInYears };
      await AsyncStorage.setItem('personalProfile', JSON.stringify(profile));
      setPersonalProfile(profile);
      setName('');
      setAge(new Date());
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || age;
    setShowDatePicker(Platform.OS === 'ios' ? true : false);
    setAge(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Личный профиль</Text>

      {/* Если личный профиль еще не создан, показываем форму для ввода данных */}
      {!personalProfile && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Введите ваше имя"
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity onPress={showDatepicker}>
            <TextInput
              style={styles.input}
              placeholder="Выберите ваш возраст"
              value={age ? age.toLocaleDateString() : ''}
              editable={false}
            />
          </TouchableOpacity>
          <Button title="Добавить ваши данные" onPress={handleAddPersonalProfile} />
        </View>
      )}

      {/* Если личный профиль уже создан, отображаем его */}
      {personalProfile && (
        <View style={styles.profileContainer}>
          <Text style={styles.profileText}>Личный профиль:</Text>
          <Text style={styles.profileText}>Имя: {personalProfile.name}</Text>
          <Text style={styles.profileText}>Возраст: {personalProfile.age} лет</Text>
        </View>
      )}

      {/* Календарь для выбора даты */}
      {showDatePicker && (
        <DateTimePicker
          value={age}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
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
  inputContainer: {
    width: '80%',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  profileContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  profileText: {
    fontSize: 18,
    color: '#555',
  },
});
