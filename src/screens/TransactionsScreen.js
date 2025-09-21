import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Search, PlusCircle } from 'lucide-react';

const initialTransactions = [
	{ id: 1, date: '2025-08-28', description: 'Swiggy Food Order', amount: -450, category: 'Food & Dining', type: 'expense', merchant: 'Swiggy', account: 'HDFC Savings' },
	{ id: 2, date: '2025-08-27', description: 'Salary Credit', amount: 85000, category: 'Income', type: 'income', merchant: 'Tech Corp Ltd', account: 'HDFC Savings' },
	{ id: 3, date: '2025-08-26', description: 'Netflix Subscription', amount: -199, category: 'Entertainment', type: 'expense', merchant: 'Netflix', account: 'ICICI Credit Card' },
	{ id: 4, date: '2025-08-25', description: 'Zepto Groceries', amount: -850, category: 'Groceries', type: 'expense', merchant: 'Zepto', account: 'HDFC Savings' },
	{ id: 5, date: '2025-08-24', description: 'Jio Recharge', amount: -599, category: 'Phone/Internet', type: 'expense', merchant: 'Jio', account: 'HDFC Savings' }
];

const TransactionsScreen = () => {
	const [transactions, setTransactions] = useState(initialTransactions);
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

	// Format currency
	const formatCurrency = (amount) => `₹${Math.abs(amount).toLocaleString()}`;

	// Add Transaction handler (stub)
	const handleAddTransaction = () => {
		// Implement navigation or modal for adding transaction
		alert('Add Transaction feature coming soon!');
	};

	return (
		<div className="p-4 min-h-screen bg-gray-50 max-w-md mx-auto">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold">Transactions</h2>
				<button onClick={handleAddTransaction}>
					<PlusCircle className="w-6 h-6 text-blue-600" />
				</button>
			</div>
			<div className="mb-4">
				<div className="relative">
					<input
						type="text"
						placeholder="Search transactions..."
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						className="w-full p-2 pl-10 border rounded"
					/>
					<Search className="absolute left-2 top-2 w-5 h-5 text-gray-400" />
				</div>
			</div>
			<div className="divide-y">
				{filteredTransactions.length === 0 ? (
					<div className="py-6 text-center text-gray-500">No transactions found.</div>
				) : (
					filteredTransactions.map(transaction => (
						<div key={transaction.id} className="py-3 flex justify-between items-center">
							<div className="flex items-center space-x-3">
								<div className={`w-8 h-8 rounded-full flex items-center justify-center ${
									transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
								}`}>
									{transaction.type === 'income' ? (
										<ArrowUpRight className="w-4 h-4 text-green-600" />
									) : (
										<ArrowDownRight className="w-4 h-4 text-red-600" />
									)}
								</div>
								<div>
									<p className="font-medium">{transaction.description}</p>
									<p className="text-xs text-gray-600">{transaction.category} • {transaction.account}</p>
								</div>
							</div>
							<div className="text-right">
								<p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
									{transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
								</p>
								<p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default TransactionsScreen;
