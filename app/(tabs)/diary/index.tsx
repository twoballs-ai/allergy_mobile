// app/(tabs)/diary/history.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function DiaryHistoryScreen({ allergyRecords = [] }: any) {
    const router = useRouter();
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>История аллергических реакций</Text>
        {allergyRecords.length > 0 ? (
          <ScrollView contentContainerStyle={styles.recordsContainer}>
            {allergyRecords.map((record: any, index: number) => (
              <View key={index} style={styles.record}>
                <Text style={styles.recordText}>Категория: {record.category}</Text>
                <Text style={styles.recordText}>Продукты: {record.name}</Text>
                {record.category === 'food' && <Text style={styles.recordText}>Объем порции: {record.amount}</Text>}
                <Text style={styles.recordText}>Реакция: {record.reaction}</Text>
                <Text style={styles.recordText}>Степень реакции: {record.reactionScore}</Text>
                <Text style={styles.recordText}>Длительность реакции: {record.reactionDuration} ч</Text>
                <Text style={styles.recordText}>Кожа: {record.skinReaction}</Text>
                <Text style={styles.recordText}>Пищеварительная система: {record.digestiveReaction}</Text>
                <Text style={styles.recordText}>Дыхательная система: {record.respiratoryReaction}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noRecordsText}>Нет записей.</Text>
        )}
  
        <Button
          title="Добавить новую реакцию"
          onPress={() => router.push('/diary/add')}
        />
      </View>
    );
  }
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#4B0082',
  },
  recordsContainer: {
    width: '80%',
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
  noRecordsText: {
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
});
