import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

const accountsData = [
  { id: 1, name: 'HDFC Savings', type: 'bank', balance: 125000, accountNumber: '****1234' },
  { id: 2, name: 'SBI Current', type: 'bank', balance: 45000, accountNumber: '****5678' },
  { id: 3, name: 'ICICI Credit Card', type: 'credit', balance: -15000, limit: 100000 },
  { id: 4, name: 'Personal Loan', type: 'loan', balance: -350000, originalAmount: 500000 },
];

const assetsData = [
  { id: 1, name: 'Apartment', type: 'real-estate', value: 4500000, purchasePrice: 4000000 },
  { id: 2, name: 'Car', type: 'vehicle', value: 800000, purchasePrice: 1200000 },
  { id: 3, name: 'Gold', type: 'commodity', value: 150000, quantity: '30g' },
];

export default function AccountsScreen() {
  const totalAssets = accountsData.filter(a => a.balance > 0).reduce((sum,a)=>sum+a.balance,0) + assetsData.reduce((sum,a)=>sum+a.value,0);
  const totalLiabilities = Math.abs(accountsData.filter(a=>a.balance<0).reduce((sum,a)=>sum+a.balance,0));

  return (
    <ScrollView style={{ flex: 1, padding: 10, backgroundColor: '#f0f0f0' }}>
      <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 10 }}>Summary</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
        <View style={{ flex: 1, backgroundColor: '#fff', marginRight:5, padding:10, borderRadius:10 }}>
          <Text style={{ fontSize:12, color:'#555' }}>Total Assets</Text>
          <Text style={{ fontWeight:'600', fontSize:16, color:'green' }}>₹{totalAssets.toLocaleString()}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#fff', marginLeft:5, padding:10, borderRadius:10 }}>
          <Text style={{ fontSize:12, color:'#555' }}>Total Liabilities</Text>
          <Text style={{ fontWeight:'600', fontSize:16, color:'red' }}>₹{totalLiabilities.toLocaleString()}</Text>
        </View>
      </View>

      <Text style={{ fontWeight: '600', fontSize: 16, marginVertical:5 }}>Bank Accounts</Text>
      {accountsData.filter(a=>a.type==='bank').map(acc=>(
        <View key={acc.id} style={{ backgroundColor:'#fff', padding:10, borderRadius:10, marginBottom:5 }}>
          <Text style={{ fontWeight:'600' }}>{acc.name}</Text>
          <Text style={{ fontSize:12, color:'#555' }}>{acc.accountNumber}</Text>
          <Text style={{ fontWeight:'600', fontSize:14, color:'green' }}>₹{acc.balance.toLocaleString()}</Text>
        </View>
      ))}

      <Text style={{ fontWeight: '600', fontSize: 16, marginVertical:5 }}>Credit & Loans</Text>
      {accountsData.filter(a=>a.type==='credit' || a.type==='loan').map(acc=>(
        <View key={acc.id} style={{ backgroundColor:'#fff', padding:10, borderRadius:10, marginBottom:5 }}>
          <Text style={{ fontWeight:'600' }}>{acc.name}</Text>
          <Text style={{ fontSize:12, color:'#555' }}>{acc.accountNumber || ''}</Text>
          <Text style={{ fontWeight:'600', fontSize:14, color:'red' }}>₹{acc.balance.toLocaleString()}</Text>
          {acc.limit && <Text style={{ fontSize:12, color:'#555' }}>Limit: ₹{acc.limit.toLocaleString()}</Text>}
        </View>
      ))}

      <Text style={{ fontWeight: '600', fontSize: 16, marginVertical:5 }}>Assets</Text>
      {assetsData.map(asset=>(
        <View key={asset.id} style={{ backgroundColor:'#fff', padding:10, borderRadius:10, marginBottom:5 }}>
          <Text style={{ fontWeight:'600' }}>{asset.name}</Text>
          <Text style={{ fontSize:12, color:'#555' }}>{asset.type}</Text>
          <Text style={{ fontWeight:'600', fontSize:14, color:'blue' }}>₹{asset.value.toLocaleString()}</Text>
          <Text style={{ fontSize:12, color: asset.value > asset.purchasePrice ? 'green':'red' }}>
            {asset.value > asset.purchasePrice ? '+' : '-'}₹{Math.abs(asset.value - asset.purchasePrice).toLocaleString()}
          </Text>
        </View>
      ))}

    </ScrollView>
  );
}
