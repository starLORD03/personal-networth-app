

import React, { useContext } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user, transactions } = useContext(AppContext);

  // Calculate monthly income/expenses
  const monthlyIncome = transactions.filter(t => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Calculate net worth (simple sum for demo)
  const netWorth = monthlyIncome - monthlyExpenses + 5752518.72; // Replace with your actual logic

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{user.name.charAt(0)}</Text></View>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{user.name.split(' ')[0]}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Ionicons name="eye-off-outline" size={22} color="#6B7280" style={{marginRight:12}} />
          <Ionicons name="notifications-outline" size={22} color="#6B7280" />
        </View>
      </View>

      {/* Net Worth Card */}
      <View style={styles.netWorthCard}>
        <Text style={styles.netWorthLabel}>Net Worth</Text>
        <Text style={styles.netWorthValue}>₹{netWorth.toLocaleString()}</Text>
        <View style={styles.netWorthChangeRow}>
          <Ionicons name="arrow-up" size={16} color="#fff" />
          <Text style={styles.netWorthChangeText}>₹12.5K this month</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsRow}>
        <QuickAction label="Add Transaction" color="#3B82F6" icon="add-circle-outline" />
        <QuickAction label="Scan Receipt" color="#10B981" icon="scan-outline" />
        <QuickAction label="Set Goal" color="#8B5CF6" icon="flag-outline" />
        <QuickAction label="Analytics" color="#F97316" icon="bar-chart-outline" />
      </View>

      {/* Monthly Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>This Month</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryIconCircleGreen}><Ionicons name="arrow-up" size={18} color="#16A34A" /></View>
          <View style={styles.summaryTextCol}><Text style={styles.summaryLabel}>Income</Text><Text style={styles.summarySubLabel}>Salary & others</Text></View>
          <Text style={styles.summaryAmountGreen}>+₹{monthlyIncome.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <View style={styles.summaryIconCircleRed}><Ionicons name="arrow-down" size={18} color="#DC2626" /></View>
          <View style={styles.summaryTextCol}><Text style={styles.summaryLabel}>Expenses</Text><Text style={styles.summarySubLabel}>All categories</Text></View>
          <Text style={styles.summaryAmountRed}>-₹{monthlyExpenses.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Net Savings</Text>
          <Text style={styles.summaryAmount}>{(monthlyIncome - monthlyExpenses).toLocaleString()}</Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsCard}>
        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Recent Transactions</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#6B7280" />
        </View>
        {transactions.slice(0, 2).map(transaction => (
          <View key={transaction.id} style={styles.transactionRow}>
            <View style={[styles.transactionIconCircle, {backgroundColor: transaction.type === 'income' ? '#F0FDF4' : '#FEF2F2'}]}>
              <Ionicons name={transaction.type === 'income' ? 'arrow-up' : 'arrow-down'} size={18} color={transaction.type === 'income' ? '#16A34A' : '#DC2626'} />
            </View>
            <View style={styles.transactionTextCol}>
              <Text style={styles.transactionDesc}>{transaction.description}</Text>
              <Text style={styles.transactionSub}>{transaction.category} • {transaction.account}</Text>
            </View>
            <View style={styles.transactionAmountCol}>
              <Text style={[styles.transactionAmount, {color: transaction.amount > 0 ? '#16A34A' : '#DC2626'}]}>{transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}</Text>
              <Text style={styles.transactionDate}>{new Date(transaction.date).toLocaleDateString()}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function QuickAction({ label, color, icon }) {
  return (
    <TouchableOpacity style={[styles.quickAction, {backgroundColor: color}]}> 
      <Ionicons name={icon} size={24} color="#fff" />
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#F3F4F6' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'linear-gradient(90deg,#3B82F6,#8B5CF6)', alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: '#3B82F6' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  greeting: { color: '#6B7280', fontSize: 13 },
  userName: { color: '#111827', fontWeight: 'bold', fontSize: 16 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  netWorthCard: { backgroundColor: 'linear-gradient(90deg,#22C55E,#3B82F6)', borderRadius: 16, margin: 18, padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3B82F6' },
  netWorthLabel: { color: '#fff', fontSize: 16, opacity: 0.9, marginBottom: 4 },
  netWorthValue: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  netWorthChangeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  netWorthChangeText: { color: '#fff', fontSize: 13, marginLeft: 4 },
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 18, marginBottom: 18 },
  quickAction: { flex: 1, marginHorizontal: 4, borderRadius: 12, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  quickActionLabel: { color: '#fff', fontWeight: 'bold', fontSize: 13, marginTop: 6 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 18, marginBottom: 18, padding: 18 },
  summaryTitle: { color: '#111827', fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  summaryIconCircleGreen: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  summaryIconCircleRed: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  summaryTextCol: { flex: 1 },
  summaryLabel: { color: '#111827', fontWeight: '500', fontSize: 15 },
  summarySubLabel: { color: '#6B7280', fontSize: 13 },
  summaryAmountGreen: { color: '#16A34A', fontWeight: 'bold', fontSize: 15 },
  summaryAmountRed: { color: '#DC2626', fontWeight: 'bold', fontSize: 15 },
  summaryAmount: { color: '#111827', fontWeight: 'bold', fontSize: 15 },
  summaryDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 },
  transactionsCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 18, marginBottom: 18 },
  transactionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  transactionsTitle: { color: '#111827', fontWeight: 'bold', fontSize: 16 },
  transactionRow: { flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  transactionIconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  transactionTextCol: { flex: 1 },
  transactionDesc: { color: '#111827', fontWeight: '500', fontSize: 15 },
  transactionSub: { color: '#6B7280', fontSize: 13 },
  transactionAmountCol: { alignItems: 'flex-end' },
  transactionAmount: { fontWeight: 'bold', fontSize: 15 },
  transactionDate: { color: '#6B7280', fontSize: 12, marginTop: 2 },
});
