import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';

import { Ionicons } from '@expo/vector-icons'; // Для иконок

export default function DiaryScreen() {
  // Состояния для данных дневника
  const [category, setCategory] = useState<string>('food'); // По умолчанию пищевой дневник
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [preparationMethod, setPreparationMethod] = useState('');
  const [reaction, setReaction] = useState('');
  const [reactionScore, setReactionScore] = useState<number>(0); // Оценка реакции
  const [skinReaction, setSkinReaction] = useState<number>(0);
  const [digestiveReaction, setDigestiveReaction] = useState<number>(0);
  const [respiratoryReaction, setRespiratoryReaction] = useState<number>(0);
  const [reactionDuration, setReactionDuration] = useState<number>(0); // Длительность реакции
  const [showDetails, setShowDetails] = useState<boolean>(false); // Показать подробности
  const [allergyRecords, setAllergyRecords] = useState<any[]>([]);

  // Добавление новой записи
  const handleAddRecord = () => {
    if (name && amount && reaction && reactionScore !== 0) {
      const newRecord = {
        category,
        name,
        amount,
        preparationMethod,
        reaction,
        reactionScore,
        skinReaction,
        digestiveReaction,
        respiratoryReaction,
        reactionDuration,
      };
      setAllergyRecords([...allergyRecords, newRecord]);
      clearFields();
    }
  };

  // Очистка полей после добавления записи
  const clearFields = () => {
    setName('');
    setAmount('');
    setPreparationMethod('');
    setReaction('');
    setReactionScore(0);
    setSkinReaction(0);
    setDigestiveReaction(0);
    setRespiratoryReaction(0);
    setReactionDuration(0);
  };

  // Рендеринг иконок для реакции по пятибалльной шкале
  const renderReactionIcons = () => {
    const icons = [];
    for (let i = 1; i <= 5; i++) {
      icons.push(
        <TouchableOpacity key={i} onPress={() => setReactionScore(i)}>
          <Ionicons
            name={i <= reactionScore ? 'alert-circle' : 'alert-circle-outline'}
            size={28}
            color={i <= reactionScore ? '#F7D700' : '#D3D3D3'} // Мягкий желтый и серый
          />
        </TouchableOpacity>
      );
    }
    return icons;
  };

  // Выбор категории (пищевой дневник, лекарства, контакт с растениями и т.д.)
  const renderCategoryFields = () => {
    switch (category) {
      case 'food':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Введите продукты"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Объем порции"
              value={amount}
              onChangeText={setAmount}
            />
            <TextInput
              style={styles.input}
              placeholder="Способ приготовления"
              value={preparationMethod}
              onChangeText={setPreparationMethod}
            />
          </>
        );
      case 'medication':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Введите лекарства"
              value={name}
              onChangeText={setName}
            />
          </>
        );
      case 'plants':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Контакт с растениями"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Реакция на растения"
              value={reaction}
              onChangeText={setReaction}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <Text style={styles.title}>Дневник аллергии</Text>

      {/* Выбор категории (вертикальный список) */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity style={styles.categoryButton} onPress={() => setCategory('food')}>
          <Text style={styles.categoryText}>Пищевой дневник</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton} onPress={() => setCategory('medication')}>
          <Text style={styles.categoryText}>Лекарства</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton} onPress={() => setCategory('plants')}>
          <Text style={styles.categoryText}>Контакт с растениями</Text>
        </TouchableOpacity>
      </View>

      {/* Поля для ввода в зависимости от выбранной категории */}
      {renderCategoryFields()}

      {/* Оценка реакции на аллерген */}
      <Text style={styles.subtitle}>Оценка общей реакции:</Text>
      <View style={styles.reactionIcons}>{renderReactionIcons()}</View>

      {/* Кнопка для раскрытия подробностей */}
      <TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
        <Text style={styles.detailsButton}>{showDetails ? 'Скрыть подробности' : 'Подробнее'}</Text>
      </TouchableOpacity>

      {/* Оценка реакции по системам (показывается по нажатию на "Подробнее") */}
      {showDetails && (
        <>
          <Text style={styles.subtitle}>Кожа:</Text>
          <View style={styles.reactionIcons}>
            {renderReactionIconsForSystem(setSkinReaction, skinReaction)}
          </View>
          <Text style={styles.subtitle}>Пищеварительная система:</Text>
          <View style={styles.reactionIcons}>
            {renderReactionIconsForSystem(setDigestiveReaction, digestiveReaction)}
          </View>
          <Text style={styles.subtitle}>Дыхательная система:</Text>
          <View style={styles.reactionIcons}>
            {renderReactionIconsForSystem(setRespiratoryReaction, respiratoryReaction)}
          </View>
        </>
      )}

      {/* Ползунок для длительности реакции */}
      <Text style={styles.subtitle}>Длительность реакции (в часах): {reactionDuration} ч</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={24}
        step={1}
        value={reactionDuration}
        onValueChange={setReactionDuration}
        minimumTrackTintColor="#F7D700"
        maximumTrackTintColor="#D3D3D3"
        thumbTintColor="#F7D700"
      />

      {/* Кнопка для добавления записи */}
      <Button title="Добавить запись" onPress={handleAddRecord} />

      {/* Список записей */}
      {allergyRecords.length > 0 && (
        <View style={styles.recordsContainer}>
          <Text style={styles.subtitle}>Записи аллергии:</Text>
          {allergyRecords.map((record, index) => (
            <View key={index} style={styles.record}>
              <Text style={styles.recordText}>Категория: {record.category}</Text>
              <Text style={styles.recordText}>Продукты: {record.name}</Text>
              {record.category === 'food' && <Text style={styles.recordText}>Объем порции: {record.amount}</Text>}
              {record.category === 'food' && <Text style={styles.recordText}>Способ приготовления: {record.preparationMethod}</Text>}
              <Text style={styles.recordText}>Реакция: {record.reaction}</Text>
              <Text style={styles.recordText}>Степень общей реакции: {record.reactionScore}</Text>
              <Text style={styles.recordText}>Кожа: {record.skinReaction}</Text>
              <Text style={styles.recordText}>Пищеварительная система: {record.digestiveReaction}</Text>
              <Text style={styles.recordText}>Дыхательная система: {record.respiratoryReaction}</Text>
              <Text style={styles.recordText}>Длительность реакции: {record.reactionDuration} ч</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// Функция рендера иконок для системыф
const renderReactionIconsForSystem = (setReactionSystem: React.Dispatch<React.SetStateAction<number>>, reactionScoreSystem: number) => {
  const icons = [];
  for (let i = 1; i <= 5; i++) {
    icons.push(
      <TouchableOpacity key={i} onPress={() => setReactionSystem(i)}>
        <Ionicons
          name={i <= reactionScoreSystem ? 'alert-circle' : 'alert-circle-outline'}
          size={28}
          color={i <= reactionScoreSystem ? '#F7D700' : '#D3D3D3'} // Мягкий желтый и светло-серый
        />
      </TouchableOpacity>
    );
  }
  return icons;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: '#f0f8ff', // Светлый фон
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 20, // Уменьшение отступов на экране
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#4B0082', // Мягкий фиолетовый цвет
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 5, // Уменьшены отступы
    color: '#4B0082', // Мягкий фиолетовый цвет
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#ffffff', // Белый фон для поля ввода
  },
  categoryContainer: {
    width: '100%',
    marginBottom: 20,
  },
  categoryButton: {
    padding: 12,
    backgroundColor: '#007AFF',
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
  },
  reactionIcons: {
    flexDirection: 'row',
    marginVertical: 5, // Уменьшены отступы
  },
  slider: {
    width: '80%',
    marginVertical: 10,
  },
  detailsButton: {
    fontSize: 16,
    color: '#007AFF',
    marginVertical: 10,
  },
  recordsContainer: {
    width: '80%',
    marginTop: 20,
  },
  record: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  recordText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
