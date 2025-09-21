import React from 'react';
import { View, Text } from 'react-native';

export default function GoalProgress({ goal }) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 10, marginVertical: 5 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
        <Text style={{ fontWeight: '600' }}>{goal.name}</Text>
        <Text style={{ fontSize: 12, color: goal.priority === 'High' ? 'red' : goal.priority === 'Medium' ? 'orange' : 'green' }}>
          {goal.priority}
        </Text>
      </View>
      <View style={{ backgroundColor: '#eee', height: 8, borderRadius: 5 }}>
        <View style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: '#3b82f6', height: 8, borderRadius: 5 }} />
      </View>
      <Text style={{ fontSize: 12, color: '#555', marginTop: 3, textAlign: 'right' }}>{progress.toFixed(1)}% • {daysLeft} days left</Text>
    </View>
  );
}
