// app/context/ProfileContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileType = 'personal' | 'family' | null;

interface ProfileContextProps {
  profileType: ProfileType;
  setProfileType: (type: ProfileType) => void;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileType, setProfileType] = useState<ProfileType>(null);

  useEffect(() => {
    // Получение типа профиля из AsyncStorage при монтировании компонента
    const loadProfileType = async () => {
      const storedProfileType = await AsyncStorage.getItem('profileType');
      if (storedProfileType) {
        setProfileType(storedProfileType as ProfileType);
      }
    };
    loadProfileType();
  }, []);

  useEffect(() => {
    if (profileType) {
      AsyncStorage.setItem('profileType', profileType);
    }
  }, [profileType]);

  return (
    <ProfileContext.Provider value={{ profileType, setProfileType }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextProps => {
  const context = React.useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
