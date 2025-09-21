import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import ChartCard from '../components/ChartCard';
import TransactionList from '../components/TransactionList';
import GoalProgress from '../components/GoalProgress';
import { loadTransactions } from '../storage/transactions';

export default function DashboardScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([
    { id: 1, name: 'Emergency Fund', targetAmount: 500000, currentAmount: 200000, targetDate: '2026-12-31', priority: 'High' },
    { id: 2, name: 'Car Purchase', targetAmount: 1200000, currentAmount: 300000, targetDate: '2026-06-30', priority: 'Medium' }
  ]);

  useEffect(() => {
    loadTransactions().then(data => setTransactions(data));
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f0f0', padding: 10 }}>
      <ChartCard data={{ labels: ['Jan','Feb','Mar','Apr'], datasets:[{data:[1000,1500,2000,2500]}]}} />
      <Text style={{ fontWeight: '600', marginVertical: 10 }}>Recent Transactions</Text>
      <TransactionList transactions={transactions.slice(0,5)} />
      <Text style={{ fontWeight: '600', marginVertical: 10 }}>Goals</Text>
      {goals.map(goal => <GoalProgress key={goal.id} goal={goal} />)}
      <Button title="Add Transaction" onPress={() => navigation.navigate('Add Transaction')} />
    </ScrollView>
  );
}
