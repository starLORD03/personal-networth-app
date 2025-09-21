import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function ChartCard({ data }) {
  return (
    <View style={{ margin: 10, backgroundColor: '#fff', borderRadius: 10, padding: 10, elevation: 3 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 5 }}>Net Worth Over Time</Text>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#1e3a8a',
          backgroundGradientFrom: '#3b82f6',
          backgroundGradientTo: '#60a5fa',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
        }}
        style={{ borderRadius: 10 }}
      />
    </View>
  );
}
