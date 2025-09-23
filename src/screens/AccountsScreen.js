

import React, { useContext } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

export default function AccountsScreen() {
  const { accounts, assets } = useContext(AppContext);
  const totalAssets = accounts.filter(a => a.balance > 0).reduce((sum,a)=>sum+a.balance,0) + assets.reduce((sum,a)=>sum+a.value,0);
  const totalLiabilities = Math.abs(accounts.filter(a=>a.balance<0).reduce((sum,a)=>sum+a.balance,0));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Accounts Summary</Text>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCardGreen}>
          <Text style={styles.summaryLabel}>Total Assets</Text>
          <Text style={styles.summaryAmountGreen}>₹{totalAssets.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryCardRed}>
          <Text style={styles.summaryLabel}>Total Liabilities</Text>
          <Text style={styles.summaryAmountRed}>₹{totalLiabilities.toLocaleString()}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Bank Accounts</Text>
      {accounts.filter(acc => acc.type === 'bank').map(acc => (
        <View key={acc.id} style={styles.bankCard}>
          <View style={styles.bankCardHeader}>
            <View>
              <Text style={styles.bankName}>{acc.name}</Text>
              <Text style={styles.bankNumber}>{acc.accountNumber}</Text>
            </View>
            <Ionicons name="wallet-outline" size={20} color="#fff" />
          </View>
          <View style={styles.bankCardFooter}>
            <Text style={styles.bankBalance}>₹{acc.balance.toLocaleString()}</Text>
            <Text style={styles.bankType}>{acc.type} Account</Text>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Credit & Loans</Text>
      {accounts.filter(acc => acc.type === 'credit' || acc.type === 'loan').map(acc => (
        <View key={acc.id} style={styles.creditCard}>
          <View style={styles.creditCardHeader}>
            <View>
              <Text style={styles.creditName}>{acc.name}</Text>
              <Text style={styles.creditNumber}>{acc.accountNumber}</Text>
              <Text style={styles.creditBalance}>₹{acc.balance.toLocaleString()}</Text>
            </View>
            <Ionicons name="card-outline" size={20} color="#DC2626" />
          </View>
          {acc.limit && (
            <View style={styles.creditLimitSection}>
              <View style={styles.creditLimitRow}>
                <Text style={styles.creditLimitText}>Used: ₹{Math.abs(acc.balance).toLocaleString()}</Text>
                <Text style={styles.creditLimitText}>Limit: ₹{acc.limit.toLocaleString()}</Text>
              </View>
              <View style={styles.creditLimitBarBg}>
                <View style={[styles.creditLimitBarFill, {width: `${(Math.abs(acc.balance) / acc.limit) * 100}%`}]} />
              </View>
            </View>
          )}
        </View>
      ))}

      <Text style={styles.sectionTitle}>Assets</Text>
      {assets.map(asset => (
        <View key={asset.id} style={styles.assetCard}>
          <View style={styles.assetCardHeader}>
            <View>
              <Text style={styles.assetName}>{asset.name}</Text>
              <Text style={styles.assetType}>{asset.type.replace('-', ' ')}</Text>
              <Text style={styles.assetValue}>₹{asset.value.toLocaleString()}</Text>
            </View>
            <View style={styles.assetCardIconCol}>
              <Ionicons name="logo-bitcoin" size={20} color="#3B82F6" />
              {asset.purchasePrice !== undefined && (
                <Text style={[styles.assetChange, {color: asset.value > asset.purchasePrice ? '#16A34A' : '#DC2626'}]}>
                  {asset.value > asset.purchasePrice ? '+' : '-'}₹{Math.abs(asset.value - asset.purchasePrice).toLocaleString()}
                </Text>
              )}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 0 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827', margin: 18, marginBottom: 0 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 18, marginBottom: 18 },
  summaryCardGreen: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 18, marginRight: 8, borderWidth: 1, borderColor: '#D1FAE5' },
  summaryCardRed: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 18, marginLeft: 8, borderWidth: 1, borderColor: '#FECACA' },
  summaryLabel: { color: '#6B7280', fontSize: 14, marginBottom: 4 },
  summaryAmountGreen: { color: '#16A34A', fontWeight: 'bold', fontSize: 18 },
  summaryAmountRed: { color: '#DC2626', fontWeight: 'bold', fontSize: 18 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginHorizontal: 18, marginBottom: 8 },
  bankCard: { backgroundColor: '#3B82F6', borderRadius: 16, marginHorizontal: 18, marginBottom: 12, padding: 18 },
  bankCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  bankName: { color: '#fff', fontSize: 15, opacity: 0.9 },
  bankNumber: { color: '#fff', fontSize: 12, opacity: 0.75 },
  bankCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  bankBalance: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  bankType: { color: '#fff', fontSize: 12, opacity: 0.75, textTransform: 'capitalize' },
  creditCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 18, marginBottom: 12, padding: 18, borderWidth: 1, borderColor: '#FECACA' },
  creditCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  creditName: { color: '#111827', fontWeight: 'bold', fontSize: 15 },
  creditNumber: { color: '#6B7280', fontSize: 12 },
  creditBalance: { color: '#DC2626', fontWeight: 'bold', fontSize: 18, marginTop: 4 },
  creditLimitSection: { marginTop: 8 },
  creditLimitRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  creditLimitText: { color: '#6B7280', fontSize: 12 },
  creditLimitBarBg: { backgroundColor: '#F3F4F6', borderRadius: 8, height: 8, width: '100%', marginTop: 2 },
  creditLimitBarFill: { backgroundColor: '#DC2626', borderRadius: 8, height: 8 },
  assetCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 18, marginBottom: 12, padding: 18, borderWidth: 1, borderColor: '#E5E7EB' },
  assetCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  assetName: { color: '#111827', fontWeight: 'bold', fontSize: 15 },
  assetType: { color: '#6B7280', fontSize: 12, textTransform: 'capitalize' },
  assetValue: { color: '#3B82F6', fontWeight: 'bold', fontSize: 18, marginTop: 4 },
  assetCardIconCol: { alignItems: 'flex-end' },
  assetChange: { fontSize: 12, marginTop: 2 },
});
