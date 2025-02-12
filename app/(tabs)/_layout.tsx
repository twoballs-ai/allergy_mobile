import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Tab = 'Home' | 'Services' | 'Products' | 'Profile';

export default function TabLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('Home');

  // Рендеринг текущего экрана
  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <Text style={styles.screenText}>Главная</Text>;
      case 'Services':
        return <Text style={styles.screenText}>Услуги</Text>;
      case 'Products':
        return <Text style={styles.screenText}>Товары</Text>;
      case 'Profile':
        return <Text style={styles.screenText}>Профиль</Text>;
      default:
        return <Text style={styles.screenText}>Главная</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {/* Основной экран */}
      <View style={styles.screen}>{renderScreen()}</View>
      {/* Навигационная панель */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
}

// Navbar компонент
const Navbar: React.FC<{ activeTab: Tab; setActiveTab: React.Dispatch<React.SetStateAction<Tab>> }> = ({ activeTab, setActiveTab }) => {
  const tabs: { name: Tab; label: string; icon: string }[] = [
    { name: 'Home', label: 'Главная', icon: 'home' },
    { name: 'Services', label: 'Услуги', icon: 'build' },
    { name: 'Products', label: 'Товары', icon: 'shopping-cart' },
    { name: 'Profile', label: 'Профиль', icon: 'person' },
  ];

  return (
    <View style={styles.navbar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.navItem}
          onPress={() => setActiveTab(tab.name)}
        >
          <Icon
            name={tab.icon}
            size={24}
            color={activeTab === tab.name ? '#2089dc' : '#888'}
          />
          <Text style={activeTab === tab.name ? styles.activeText : styles.text}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    fontSize: 20,
    color: '#000',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#888',
    fontSize: 12,
  },
  activeText: {
    color: '#2089dc',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
