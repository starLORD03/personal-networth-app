import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const investmentsData = [
  { id: 1, name: 'SBI Bluechip Fund', type: 'Mutual Fund', currentValue: 6802.6, investedAmount: 6000, returns: 802.6, riskLevel: 'Medium' },
  { id: 2, name: 'Reliance Industries', type: 'Stock', currentValue: 61270, investedAmount: 58000, returns: 3270, riskLevel: 'High' },
  { id: 3, name: 'HDFC Top 100 Fund', type: 'Mutual Fund', currentValue: 104446, investedAmount: 100000, returns: 4446, riskLevel: 'Medium' },
  { id: 4, name: 'PPF Account', type: 'Tax Saving', currentValue: 125000, investedAmount: 100000, returns: 25000, riskLevel: 'Low' },
];

export default function InvestmentsScreen() {
  const totalInvestmentValue = investmentsData.reduce((sum,i)=>sum+i.currentValue,0);
  const totalReturns = investmentsData.reduce((sum,i)=>sum+i.returns,0);

  return (
    <ScrollView style={{ flex: 1, padding: 10, backgroundColor:'#f0f0f0' }}>
      <Text style={{ fontWeight:'600', fontSize:16, marginBottom:10 }}>Total Investment Value</Text>
      <View style={{ backgroundColor:'#6b5bff', padding:10, borderRadius:10, marginBottom:10 }}>
        <Text style={{ fontSize:16, color:'#fff', fontWeight:'600' }}>₹{totalInvestmentValue.toLocaleString()}</Text>
        <Text style={{ fontSize:12, color:'#d1d5db' }}>+₹{totalReturns.toLocaleString()} Returns</Text>
      </View>

      {investmentsData.map(inv=>(
        <View key={inv.id} style={{ backgroundColor:'#fff', padding:10, borderRadius:10, marginBottom:5 }}>
          <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
            <Text style={{ fontWeight:'600' }}>{inv.name}</Text>
            <Text style={{ fontSize:12, color: inv.riskLevel==='High' ? 'red': inv.riskLevel==='Medium'?'orange':'green' }}>{inv.riskLevel} Risk</Text>
          </View>
          <Text style={{ fontSize:14, fontWeight:'600', color:'#000' }}>₹{inv.currentValue.toLocaleString()}</Text>
          <Text style={{ fontSize:12, color: inv.returns>=0?'green':'red' }}>
            {inv.returns>=0 ? '+' : ''}₹{inv.returns.toLocaleString()} ({((inv.returns/inv.investedAmount)*100).toFixed(2)}%)
          </Text>
          <Text style={{ fontSize:12, color:'#555' }}>{inv.type}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
