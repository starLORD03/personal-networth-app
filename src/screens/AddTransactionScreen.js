

import React, { useState, useContext } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function AddTransactionScreen() {
  const { transactions, setTransactions } = useContext(AppContext);
  const navigation = useNavigation();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const save = () => {
    if(!description || !amount || !category || !date){
      Alert.alert("Fill all fields");
      return;
    }
    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date,
      account: 'HDFC Savings',
      type: parseFloat(amount) >= 0 ? 'income':'expense'
    };
    setTransactions([newTransaction, ...transactions]);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Transaction</Text>
      <View style={styles.formSection}>
        <Text style={styles.label}>Description</Text>
        <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Description" />
        <Text style={styles.label}>Amount</Text>
        <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="Amount" />
        <Text style={styles.label}>Category</Text>
        <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Category" />
        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="Date" />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={save}>
        <Text style={styles.saveButtonText}>Save Transaction</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 0 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827', margin: 18, marginBottom: 0 },
  formSection: { marginHorizontal: 18, marginTop: 18, marginBottom: 18 },
  label: { color: '#6B7280', fontSize: 14, marginBottom: 4 },
  input: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', padding: 12, fontSize: 15, marginBottom: 12 },
  saveButton: { backgroundColor: '#3B82F6', borderRadius: 12, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', marginHorizontal: 18, marginBottom: 18 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
