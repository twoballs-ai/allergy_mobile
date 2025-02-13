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
  const [reactionDuration, setReactionDuration] = useState<Date>(new Date(0)); 
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

  const handleAddRecord = () => {
    // Проверяем обязательные поля
    if (name && reaction && reactionScore !== 0 && reactionDuration) {
      const newRecord = {
        category,
        name,
        amount: category === 'food' ? amount : undefined,  // Объем порции для пищи
        preparationMethod: category === 'food' ? preparationMethod : undefined,  // Способ приготовления для пищи
        reaction,  // Обязательное поле "реакция"
        reactionScore,
        skinReaction: skinReaction || 0,  // Если нет значения, ставим 0
        digestiveReaction: digestiveReaction || 0,
        respiratoryReaction: respiratoryReaction || 0,
        reactionDuration: reactionDuration.toLocaleTimeString(),
      };
  
      // Создаем новый массив записей, добавляя новую запись
      const newAllergyRecords = [...allergyRecords, newRecord];
  
      console.log('New Record:', newRecord);  // Для отладки
  
      // Обновляем состояние allergyRecords
      setAllergyRecords(newAllergyRecords);
  
      // Сохраняем новые данные в AsyncStorage
      saveData(newAllergyRecords);
  
      // Очищаем поля формы
      clearFields();
  
      // Проверка перед возвратом на экран
      console.log('Returning to previous screen...');
      router.back();
    } else {
      // Проверка, какие поля не заполнены
      console.log('Form data is incomplete:', { name, reaction, reactionScore, reactionDuration });
      if (!reaction) {
        console.error('Поле "реакция" обязательно для заполнения');
      }
      if (reactionScore === 0) {
        console.error('Оценка реакции обязательно должна быть выбрана');
      }
    }
  };
  
  
  
  const saveData = async (data: any[]) => {
    try {
      console.log('Saving data to AsyncStorage:', data);  // Для отладки
      await AsyncStorage.setItem('allergyRecords', JSON.stringify(data));
    } catch (error) {
      console.error("Error saving data", error);
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

    setReactionDuration(undefined);
  };

  // Поля для ввода в зависимости от выбранной категории
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

    {/* Поле "Реакция" */}
    <Text style={styles.subtitle}>Реакция:</Text>
    <TextInput style={styles.input} value={reaction} onChangeText={setReaction} placeholder="Введите описание реакции" />

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
            <Text style={styles.recordText}>Длительность реакции: {record.reactionDuration}</Text>
          </View>
        ))}
      </View>
    )}
  </ScrollView>
);
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 20,
    backgroundColor: '#F0F0F0', // Светлый фон
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6A0DAD', // Яркий пурпурный
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 10,
    color: '#6A0DAD',
    fontWeight: '600', // Полужирный текст
  },
  categoryContainer: {
    flexDirection: 'column', // Вертикальное расположение
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center', // Центрирование кнопок
  },
  categoryButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    margin: 10,
    backgroundColor: '#9C27B0', // Фиолетовый фон
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Тень для кнопок
  },
  activeCategory: {
    backgroundColor: '#D32F2F', // Красный цвет при активной категории
  },
  categoryText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700', // Жирный шрифт
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    width: '80%',
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF', // Белый фон для полей
    fontSize: 16,
  },
  reactionIcons: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
  },
  slider: {
    width: '80%',
    marginVertical: 15,
    height: 40,
    borderRadius: 10, // Округление ползунка
  },
  durationContainer: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 15, // Расстояние между ползунками
  },
  sliderLabel: {
    fontSize: 16,
    color: '#6A0DAD',
    marginTop: 10,
  },
  detailsButton: {
    fontSize: 18,
    color: '#007AFF',
    marginVertical: 15,
    fontWeight: '600',
  },
  recordsContainer: {
    marginTop: 30,
    width: '85%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  record: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#F9F9F9', // Светлый фон для записей
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recordText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  durationTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  durationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  // Стили для ползунков
  sliderTime: {
    width: '45%',
    marginVertical: 15,
    height: 40,
    borderRadius: 10,
  },
});
