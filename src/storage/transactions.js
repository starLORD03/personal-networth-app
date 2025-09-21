import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'transactions';

export async function saveTransactions(transactions) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error("Error saving transactions", e);
  }
}

export async function loadTransactions() {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error("Error loading transactions", e);
    return [];
  }
}
