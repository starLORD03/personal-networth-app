
import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ArrowUpRight, ArrowDownRight, Search, PlusCircle } from 'lucide-react-native';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function TransactionsScreen() {
	const { transactions } = useContext(AppContext);
	const navigation = useNavigation();
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredTransactions, setFilteredTransactions] = useState(transactions);

	useEffect(() => {
		setFilteredTransactions(
			transactions.filter(
				t =>
					t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					t.category.toLowerCase().includes(searchTerm.toLowerCase())
			)
		);
	}, [searchTerm, transactions]);

	const formatCurrency = (amount) => `₹${Math.abs(amount).toLocaleString()}`;

	return (
		<ScrollView className="min-h-screen bg-gray-50 px-4 pt-4">
			<View className="flex-row justify-between items-center mb-4">
				<Text className="text-xl font-bold">Transactions</Text>
				<TouchableOpacity onPress={() => navigation.navigate('Add Transaction')}>
					<PlusCircle size={24} color="#3B82F6" />
				</TouchableOpacity>
			</View>
			<View className="mb-4">
				<View className="relative">
					<TextInput
						placeholder="Search transactions..."
						value={searchTerm}
						onChangeText={setSearchTerm}
						className="w-full p-2 pl-10 border rounded"
					/>
					<View style={{ position: 'absolute', left: 8, top: 8 }}>
						<Search size={20} color="#6B7280" />
					</View>
				</View>
			</View>
			<View>
				{filteredTransactions.length === 0 ? (
					<Text className="py-6 text-center text-gray-500">No transactions found.</Text>
				) : (
					filteredTransactions.map(transaction => (
						<View key={transaction.id} className="py-3 flex-row justify-between items-center border-b border-gray-100">
							<View className="flex-row items-center space-x-3">
								<View className={`w-8 h-8 rounded-full items-center justify-center ${
									transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
								}`}>
									{transaction.type === 'income' ? (
										<ArrowUpRight size={20} color="#16A34A" />
									) : (
										<ArrowDownRight size={20} color="#DC2626" />
									)}
								</View>
								<View>
									<Text className="font-medium">{transaction.description}</Text>
									<Text className="text-xs text-gray-600">{transaction.category} • {transaction.account}</Text>
								</View>
							</View>
							<View className="items-end">
								<Text className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
									{transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
								</Text>
								<Text className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</Text>
							</View>
						</View>
					))
				)}
			</View>
		</ScrollView>
	);
}
