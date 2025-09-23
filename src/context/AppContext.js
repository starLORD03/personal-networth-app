import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Centralized state for accounts, assets, transactions, investments, goals
  const [user, setUser] = useState({
    name: 'John Doe',
    profilePic: null,
    currency: 'INR'
  });
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'HDFC Savings', type: 'bank', balance: 125000, accountNumber: '****1234' },
    { id: 2, name: 'SBI Current', type: 'bank', balance: 45000, accountNumber: '****5678' },
    { id: 3, name: 'ICICI Credit Card', type: 'credit', balance: -15000, limit: 100000 },
    { id: 4, name: 'Personal Loan', type: 'loan', balance: -350000, originalAmount: 500000 }
  ]);
  const [assets, setAssets] = useState([
    { id: 1, name: 'Apartment', type: 'real-estate', value: 4500000, purchasePrice: 4000000 },
    { id: 2, name: 'Car', type: 'vehicle', value: 800000, purchasePrice: 1200000 },
    { id: 3, name: 'Gold', type: 'commodity', value: 150000, quantity: '30g' },
    { id: 4, name: 'Emergency FD', type: 'fixed-deposit', value: 200000, maturityDate: '2026-08-28' }
  ]);
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2025-08-28', description: 'Swiggy Food Order', amount: -450, category: 'Food & Dining', type: 'expense', merchant: 'Swiggy', account: 'HDFC Savings' },
    { id: 2, date: '2025-08-27', description: 'Salary Credit', amount: 85000, category: 'Income', type: 'income', merchant: 'Tech Corp Ltd', account: 'HDFC Savings' },
    { id: 3, date: '2025-08-26', description: 'Netflix Subscription', amount: -199, category: 'Entertainment', type: 'expense', merchant: 'Netflix', account: 'ICICI Credit Card' },
    { id: 4, date: '2025-08-25', description: 'Zepto Groceries', amount: -850, category: 'Groceries', type: 'expense', merchant: 'Zepto', account: 'HDFC Savings' },
    { id: 5, date: '2025-08-24', description: 'Jio Recharge', amount: -599, category: 'Phone/Internet', type: 'expense', merchant: 'Jio', account: 'HDFC Savings' }
  ]);
  const [investments, setInvestments] = useState([
    { id: 1, name: 'SBI Bluechip Fund', type: 'Mutual Fund', units: 150.5, nav: 45.20, currentValue: 6802.60, investedAmount: 6000, returns: 802.60, riskLevel: 'Medium' },
    { id: 2, name: 'Reliance Industries', type: 'Stock', units: 25, price: 2450.80, currentValue: 61270, investedAmount: 58000, returns: 3270, riskLevel: 'High' },
    { id: 3, name: 'HDFC Top 100 Fund', type: 'Mutual Fund', units: 200.8, nav: 520.15, currentValue: 104446.12, investedAmount: 100000, returns: 4446.12, riskLevel: 'Medium' },
    { id: 4, name: 'PPF Account', type: 'Tax Saving', currentValue: 125000, investedAmount: 100000, returns: 25000, riskLevel: 'Low' }
  ]);
  const [goals, setGoals] = useState([
    { id: 1, name: 'Emergency Fund', targetAmount: 500000, currentAmount: 200000, targetDate: '2026-12-31', priority: 'High' },
    { id: 2, name: 'Car Purchase', targetAmount: 1200000, currentAmount: 300000, targetDate: '2026-06-30', priority: 'Medium' },
    { id: 3, name: 'Vacation Fund', targetAmount: 200000, currentAmount: 50000, targetDate: '2025-12-31', priority: 'Low' },
    { id: 4, name: 'House Down Payment', targetAmount: 1000000, currentAmount: 150000, targetDate: '2027-03-31', priority: 'High' }
  ]);

  return (
    <AppContext.Provider value={{
      user, setUser,
      accounts, setAccounts,
      assets, setAssets,
      transactions, setTransactions,
      investments, setInvestments,
      goals, setGoals
    }}>
      {children}
    </AppContext.Provider>
  );
};
