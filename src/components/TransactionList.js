import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { ArrowUpRight, ArrowDownRight } from '@expo/vector-icons';

export default function TransactionList({ transactions }) {
  return (
    <FlatList
      data={transactions}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#fff', marginVertical: 5, borderRadius: 10 }}>
          <View>
            <Text style={{ fontWeight: '600' }}>{item.description}</Text>
            <Text style={{ fontSize: 12, color: '#555' }}>{item.category} • {item.account}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontWeight: '600', color: item.amount >= 0 ? 'green' : 'red' }}>
              {item.amount >= 0 ? '+' : ''}₹{Math.abs(item.amount)}
            </Text>
            <Text style={{ fontSize: 10, color: '#888' }}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
        </View>
      )}
    />
  );
}
