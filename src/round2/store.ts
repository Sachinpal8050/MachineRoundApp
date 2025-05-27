import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key: string, value: string) => {
  return await AsyncStorage.setItem(key, value);
};

export const getItem = async (key: string) => {
  return await AsyncStorage.getItem(key);
};

export const removeItem = async (key: string) => {
  return await AsyncStorage.removeItem(key);
};
