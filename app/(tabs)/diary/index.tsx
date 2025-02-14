import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

const RecordItem = ({ record }: { record: any }) => {
  const renderReactionIcons = (score: number) => {
    // Для отображения иконок восклицательных знаков, чем выше score, тем больше иконок.
    if (score === 0) return null;
    return (
      <>
        {[...Array(score)].map((_, index) => (
          <Ionicons
            key={index}
            name="alert-circle"
            size={28}
            color="#F7D700"
          />
        ))}
      </>
    );
  };

  return (
    <View
      style={[
        styles.record,
        record.category === 'food'
          ? styles.foodRecord
          : record.category === 'medication'
          ? styles.medicationRecord
          : record.category === 'plants'
          ? styles.plantsRecord
          : null,
      ]}
    >
      {record.category === 'food' && (
        <>
          <Text style={styles.recordText}>Продукты: {record.name}</Text>
          <Text style={styles.recordText}>Объем порции: {record.amount}</Text>
          {record.preparationMethod && (
            <Text style={styles.recordText}>Способ приготовления: {record.preparationMethod}</Text>
          )}
        </>
      )}
      {record.category === 'medication' && (
        <>
          <Text style={styles.recordText}>Лекарства: {record.name}</Text>
        </>
      )}
      {record.category === 'plants' && (
        <>
          <Text style={styles.recordText}>Контакт с растениями: {record.name}</Text>
        </>
      )}
      {record.reaction && <Text style={styles.recordText}>Реакция: {record.reaction}</Text>}
      {record.reactionScore !== 0 && (
        <Text style={styles.recordText}>
          Общая степень реакции: {renderReactionIcons(record.reactionScore)}
        </Text>
      )}
      {record.skinReaction !== 0 && (
        <Text style={styles.recordText}>Кожа: {renderReactionIcons(record.skinReaction)}</Text>
      )}
      {record.digestiveReaction !== 0 && (
        <Text style={styles.recordText}>Пищеварительная система: {renderReactionIcons(record.digestiveReaction)}</Text>
      )}
      {record.respiratoryReaction !== 0 && (
        <Text style={styles.recordText}>Дыхательная система: {renderReactionIcons(record.respiratoryReaction)}</Text>
      )}
      {record.reactionDuration && (
        <Text style={styles.recordText}>Длительность реакции: {record.reactionDuration} ч</Text>
      )}
    </View>
  );
};

export default function DiaryHistoryScreen() {
  const [allergyRecords, setAllergyRecords] = useState<any[]>([]);
  const router = useRouter();
  const isFocused = useIsFocused();

  // Загружаем данные при монтировании экрана или когда он снова становится видимым
  useEffect(() => {
    const loadAllergyRecords = async () => {
      try {
        const storedData = await AsyncStorage.getItem('allergyRecords');
        if (storedData) {
          setAllergyRecords(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    loadAllergyRecords();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>История аллергических реакций</Text>
      {allergyRecords.length > 0 ? (
        <ScrollView contentContainerStyle={styles.recordsContainer}>
          {allergyRecords.map((record, index) => (
            <RecordItem key={index} record={record} />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noRecordsText}>Нет записей.</Text>
      )}
      <Button
        title="Добавить новую реакцию"
        onPress={() => router.push({ pathname: '/diary/add' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#4B0082',
    fontWeight: 'bold',
  },
  recordsContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  record: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  foodRecord: {
    backgroundColor: '#FFFAE6', // светлый желтый для еды
  },
  medicationRecord: {
    backgroundColor: '#E6F7FF', // светлый голубой для лекарств
  },
  plantsRecord: {
    backgroundColor: '#E6FFE6', // светлый зеленый для растений
  },
  recordText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  noRecordsText: {
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
});
