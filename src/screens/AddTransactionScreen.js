import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert } from 'react-native';
import { saveTransactions, loadTransactions } from '../storage/transactions';

export default function AddTransactionScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const save = async () => {
    if(!description || !amount || !category || !date){
      Alert.alert("Fill all fields");
      return;
    }
    const newTransaction = { id: Date.now(), description, amount: parseFloat(amount), category, date, account: 'HDFC Savings', type: amount>=0 ? 'income':'expense' };
    const existing = await loadTransactions();
    const updated = [newTransaction, ...existing];
    await saveTransactions(updated);
    navigation.goBack();
  }

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <Text>Description</Text>
      <TextInput style={{ borderWidth:1,borderColor:'#ccc', marginBottom:10, padding:5 }} value={description} onChangeText={setDescription} />
      <Text>Amount</Text>
      <TextInput style={{ borderWidth:1,borderColor:'#ccc', marginBottom:10, padding:5 }} value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <Text>Category</Text>
      <TextInput style={{ borderWidth:1,borderColor:'#ccc', marginBottom:10, padding:5 }} value={category} onChangeText={setCategory} />
      <Text>Date (YYYY-MM-DD)</Text>
      <TextInput style={{ borderWidth:1,borderColor:'#ccc', marginBottom:10, padding:5 }} value={date} onChangeText={setDate} />
      <Button title="Save Transaction" onPress={save} />
    </ScrollView>
  );
}
