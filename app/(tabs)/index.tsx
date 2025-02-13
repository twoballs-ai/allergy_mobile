// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Platform } from 'react-native';
import { useProfile } from '../../context/ProfileContext';  // Импортируем контекст
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const { profileType, setProfileType } = useProfile();  // Используем контекст для получения и изменения профиля
  const [name, setName] = useState('');
  const [age, setAge] = useState(new Date());  // Сохраняем дату рождения
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<{ name: string; age: Date; relation: string }[]>([]);
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

  const handleSelectProfileType = (type: 'personal' | 'family') => {
    setProfileType(type);  // Обновляем тип профиля
  };

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

  const handleAddFamilyMember = () => {
    if (name && age) {
      const newMember = { name, age, relation: 'Член семьи' }; // Здесь можно использовать поле для отношения
      setFamilyMembers([...familyMembers, newMember]);
      setName('');
      setAge(new Date(''));
    }
  };

  const handleSaveFamilyProfile = () => {
    if (familyMembers.length > 0) {
      alert(`Семейный профиль сохранен: ${familyMembers.map(member => `${member.name} (${member.relation})`).join(', ')}`);
      // Сохранить или передать данные на следующий экран
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
      <Text style={styles.title}>Дневник аллергика</Text>

      {/* Если профиль не выбран, показываем кнопки для выбора профиля */}
      {profileType === null ? (
        <>
          <Text style={styles.subtitle}>Выберите тип профиля:</Text>
          <TouchableOpacity
            style={[styles.button, profileType === 'personal' && styles.activeButton]}
            onPress={() => handleSelectProfileType('personal')}
          >
            <Text style={styles.buttonText}>Личный профиль</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, profileType === 'family' && styles.activeButton]}
            onPress={() => handleSelectProfileType('family')}
          >
            <Text style={styles.buttonText}>Семейный профиль</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Для Личного профиля показываем форму с полями имя и возраст, если профиль еще не создан */}
          {profileType === 'personal' && !personalProfile && (
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

          {/* Для Семейного профиля показываем форму для добавления членов семьи */}
          {profileType === 'family' && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Введите имя члена семьи"
                value={name}
                onChangeText={setName}
              />
              <TouchableOpacity onPress={showDatepicker}>
                <TextInput
                  style={styles.input}
                  placeholder="Выберите возраст"
                  value={age ? age.toLocaleDateString() : ''}
                  editable={false}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Отношение (например, сын, мама)"
                value={name}  // Переиспользуем state name для отношения
                onChangeText={(text) => setFamilyMembers(prev => prev.map((item, idx) => idx === familyMembers.length - 1 ? { ...item, relation: text } : item))}
              />
              <Button title="Добавить члена семьи" onPress={handleAddFamilyMember} />
              <Button title="Сохранить семейный профиль" onPress={handleSaveFamilyProfile} />

              {familyMembers.length > 0 && (
                <Text style={styles.familyList}>
                  Члены семьи: {familyMembers.map(member => `${member.name} (${member.relation})`).join(', ')}
                </Text>
              )}
            </View>
          )}
        </>
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
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
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
  familyList: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

