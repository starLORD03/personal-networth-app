

import React, { useContext } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

export default function InvestmentsScreen() {
  const { investments = [] } = useContext(AppContext);
  const safeInvestments = Array.isArray(investments) ? investments : [];
  
  const totalInvestmentValue = safeInvestments.reduce((sum,i)=>sum+i.currentValue,0);
  const totalReturns = safeInvestments.reduce((sum,i)=>sum+i.returns,0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Investments</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Investment Value</Text>
        <Text style={styles.summaryAmount}>₹{totalInvestmentValue.toLocaleString()}</Text>
        <View style={styles.summaryReturnsRow}>
          <Ionicons name="trending-up-outline" size={20} color="#fff" />
          <Text style={styles.summaryReturnsText}>+₹{totalReturns.toLocaleString()} Returns</Text>
        </View>
      </View>

            <Text style={styles.sectionTitle}>Holdings</Text>
      {safeInvestments.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="trending-up-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyStateText}>No investments yet</Text>
          <Text style={styles.emptyStateSubtext}>Start investing to grow your wealth</Text>
        </View>
      ) : safeInvestments.map(inv => (
        <View key={inv.id} style={styles.holdingCard}>
          <View style={styles.holdingHeader}>
            <View>
              <Text style={styles.holdingName}>{inv.name}</Text>
              <Text style={styles.holdingType}>{inv.type}</Text>
            </View>
            <View style={[styles.holdingRisk, {backgroundColor: inv.riskLevel === 'High' ? '#FECACA' : inv.riskLevel === 'Medium' ? '#FEF9C3' : '#DCFCE7'}]}>
              <Text style={{color: inv.riskLevel === 'High' ? '#DC2626' : inv.riskLevel === 'Medium' ? '#CA8A04' : '#16A34A', fontSize: 12, fontWeight: 'bold'}}>{inv.riskLevel} Risk</Text>
            </View>
          </View>
          <View style={styles.holdingFooter}>
            <View>
              <Text style={styles.holdingValue}>₹{inv.currentValue.toLocaleString()}</Text>
              {inv.units && (
                <Text style={styles.holdingUnits}>{inv.units} units @ ₹{inv.nav || inv.price}</Text>
              )}
            </View>
            <View style={styles.holdingReturnsCol}>
              <Text style={[styles.holdingReturns, {color: inv.returns >= 0 ? '#16A34A' : '#DC2626'}]}>{inv.returns >= 0 ? '+' : '-'}₹{inv.returns.toLocaleString()}</Text>
              <Text style={styles.holdingReturnsPercent}>{((inv.returns/inv.investedAmount)*100).toFixed(2)}%</Text>
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
  summaryCard: { backgroundColor: '#8B5CF6', borderRadius: 16, marginHorizontal: 18, marginBottom: 18, padding: 18, alignItems: 'center' },
  summaryLabel: { color: '#fff', fontSize: 15, opacity: 0.9, marginBottom: 4 },
  summaryAmount: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  summaryReturnsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  summaryReturnsText: { color: '#fff', fontSize: 13, marginLeft: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginHorizontal: 18, marginBottom: 8 },
  holdingCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 18, marginBottom: 12, padding: 18, borderWidth: 1, borderColor: '#E5E7EB' },
  holdingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  holdingName: { color: '#111827', fontWeight: 'bold', fontSize: 15 },
  holdingType: { color: '#6B7280', fontSize: 12 },
  holdingRisk: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  holdingFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  holdingValue: { color: '#111827', fontWeight: 'bold', fontSize: 18 },
  holdingUnits: { color: '#6B7280', fontSize: 12 },
  holdingReturnsCol: { alignItems: 'flex-end' },
    holdingReturns: { fontWeight: 'bold', fontSize: 15 },
  holdingReturnsPercent: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    marginHorizontal: 18,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
