import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

// Компонент для рендера иконок реакции по шкале
const ReactionIcons = ({
  setReactionScore,
  reactionScore,
}: {
  setReactionScore: React.Dispatch<React.SetStateAction<number>>;
  reactionScore: number;
}) => {
  const icons = [];
  for (let i = 1; i <= 5; i++) {
    icons.push(
      <TouchableOpacity key={i} onPress={() => setReactionScore(i)}>
        <Ionicons
          name={i <= reactionScore ? 'alert-circle' : 'alert-circle-outline'}
          size={28}
          color={i <= reactionScore ? '#F7D700' : '#D3D3D3'}
        />
      </TouchableOpacity>
    );
  }
  return <View style={styles.reactionIcons}>{icons}</View>;
};

// Основной компонент экрана для добавления записи
export default function AddDiaryRecordScreen() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [preparationMethod, setPreparationMethod] = useState('');
  const [reaction, setReaction] = useState('');
  const [reactionScore, setReactionScore] = useState<number>(0);
  const [skinReaction, setSkinReaction] = useState<number>(0);
  const [digestiveReaction, setDigestiveReaction] = useState<number>(0);
  const [respiratoryReaction, setRespiratoryReaction] = useState<number>(0);
  const [reactionDuration, setReactionDuration] = useState<Date | undefined>(undefined); 
  const [category, setCategory] = useState<string>('food');
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [allergyRecords, setAllergyRecords] = useState<any[]>([]);
  const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);

  const router = useRouter();

  // Загружаем данные из локального хранилища при монтировании
  useEffect(() => {
    const loadData = async () => {
      const storedData = await AsyncStorage.getItem('allergyRecords');
      if (storedData) {
        setAllergyRecords(JSON.parse(storedData));
      }
    };
    loadData();
  }, []);

  // Сохраняем данные в локальное хранилище
  const saveData = async (newData: any[]) => {
    try {
      await AsyncStorage.setItem('allergyRecords', JSON.stringify(newData));
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  // Добавление новой записи
  const handleAddRecord = async () => {
    const newRecord = {
      category,
      name,
      amount: category === 'food' ? amount : undefined, // amount only for food
      preparationMethod: category === 'food' ? preparationMethod : undefined, // preparationMethod only for food
      reaction,
      reactionScore,
      skinReaction,
      digestiveReaction,
      respiratoryReaction,
      reactionDuration: reactionDuration ? reactionDuration.toLocaleTimeString() : undefined,
    };

    const newAllergyRecords = [...allergyRecords, newRecord];
    setAllergyRecords(newAllergyRecords);

    // Сохраняем данные в AsyncStorage
    await saveData(newAllergyRecords);

    // Возвращаемся на экран истории
    router.back();
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
    setReactionDuration(undefined);
  };

  // Поля для ввода в зависимости от выбранной категории
  const renderCategoryFields = () => {
    switch (category) {
      case 'food':
        return (
          <>
            <TextInput style={styles.input} placeholder="Введите продукты" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Объем порции" value={amount} onChangeText={setAmount} />
            <TextInput style={styles.input} placeholder="Способ приготовления" value={preparationMethod} onChangeText={setPreparationMethod} />
          </>
        );
      case 'medication':
        return (
          <>
            <TextInput style={styles.input} placeholder="Введите лекарства" value={name} onChangeText={setName} />
          </>
        );
      case 'plants':
        return (
          <>
            <TextInput style={styles.input} placeholder="Контакт с растениями" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Реакция на растения" value={reaction} onChangeText={setReaction} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <Text style={styles.title}>Добавить запись в дневник аллергии</Text>

      {/* Выбор категории (пищевой дневник, лекарства, контакт с растениями и т.д.) */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity style={[styles.categoryButton, category === 'food' && styles.activeCategory]} onPress={() => setCategory('food')}>
          <Text style={styles.categoryText}>Пищевой дневник</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.categoryButton, category === 'medication' && styles.activeCategory]} onPress={() => setCategory('medication')}>
          <Text style={styles.categoryText}>Лекарства</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.categoryButton, category === 'plants' && styles.activeCategory]} onPress={() => setCategory('plants')}>
          <Text style={styles.categoryText}>Контакт с растениями</Text>
        </TouchableOpacity>
      </View>

      {/* Поля для ввода в зависимости от выбранной категории */}
      {renderCategoryFields()}

      {/* Оценка общей реакции */}
      <Text style={styles.subtitle}>Оценка общей реакции:</Text>
      <ReactionIcons setReactionScore={setReactionScore} reactionScore={reactionScore} />

      {/* Кнопка для раскрытия подробностей */}
      <TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
        <Text style={styles.detailsButton}>{showDetails ? 'Скрыть подробности' : 'Подробнее'}</Text>
      </TouchableOpacity>

      {/* Оценка реакции по системам (кожная, пищеварительная, дыхательная) */}
      {showDetails && (
        <>
          <Text style={styles.subtitle}>Кожа:</Text>
          <ReactionIcons setReactionScore={setSkinReaction} reactionScore={skinReaction} />

          <Text style={styles.subtitle}>Пищеварительная система:</Text>
          <ReactionIcons setReactionScore={setDigestiveReaction} reactionScore={digestiveReaction} />

          <Text style={styles.subtitle}>Дыхательная система:</Text>
          <ReactionIcons setReactionScore={setRespiratoryReaction} reactionScore={respiratoryReaction} />
        </>
      )}

      {/* Кнопка для отображения и скрытия DateTimePicker */}
      <TouchableOpacity onPress={() => setShowDateTimePicker(true)}>
        <Text style={styles.detailsButton}>Добавить время реакции</Text>
      </TouchableOpacity>

      {/* Дата и время реакции */}
      {showDateTimePicker && (
        <DateTimePicker
          is24Hour={true}
          value={reactionDuration || new Date(0)} 
          mode="time"
          display="clock"
          onChange={(event, selectedDate) => {
            setShowDateTimePicker(false);  // Скрыть DateTimePicker после выбора времени
            setReactionDuration(selectedDate || reactionDuration);
          }}
        />
      )}

      {/* Кнопка для добавления записи */}
      <Button title="Добавить запись" onPress={handleAddRecord} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 20,
    backgroundColor: '#F0F0F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6A0DAD',
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 10,
    color: '#6A0DAD',
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'column',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    margin: 10,
    backgroundColor: '#9C27B0',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  activeCategory: {
    backgroundColor: '#D32F2F',
  },
  categoryText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    width: '80%',
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  reactionIcons: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
  },
  detailsButton: {
    fontSize: 18,
    color: '#007AFF',
    marginVertical: 15,
    fontWeight: '600',
  },
});
