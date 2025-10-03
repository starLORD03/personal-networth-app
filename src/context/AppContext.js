import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/AuthService';

export const AppContext = createContext();

const initialState = {
  user: null,
  accounts: [],
  transactions: [],
  investments: [],
  goals: [],
  assets: [],
  loading: false,
  error: null,
  isFirstLogin: false,
  showBalances: true,
  appInitialized: false,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_FIRST_LOGIN':
      return { ...state, isFirstLogin: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_INVESTMENTS':
      return { ...state, investments: action.payload };
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    case 'TOGGLE_BALANCE_VISIBILITY':
      return { ...state, showBalances: !state.showBalances };
    case 'ADD_TRANSACTION':
      return { 
        ...state, 
        transactions: [action.payload, ...state.transactions] 
      };
    case 'ADD_ACCOUNT':
      return {
        ...state,
        accounts: [...state.accounts, action.payload]
      };
    case 'ADD_INVESTMENT':
      return {
        ...state,
        investments: [...state.investments, action.payload]
      };
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, action.payload]
      };
    case 'LOGOUT':
      return {
        ...initialState,
        appInitialized: true,
      };
    case 'SET_APP_INITIALIZED':
      return { ...state, appInitialized: true };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    initializeApp();
  }, []);

    const initializeApp = async () => {
    try {
      // Just mark app as initialized
      // Don't check hasOpenedBefore here - let login flow handle it
      dispatch({ type: 'SET_APP_INITIALIZED' });
    } catch (error) {
      console.error('App initialization failed:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

    const setUser = (userData) => {
    dispatch({ type: 'SET_USER', payload: userData });
  };

  const setIsFirstLogin = (value) => {
    dispatch({ type: 'SET_FIRST_LOGIN', payload: value });
  };

  const logout = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Clear secure storage
      await AuthService.clearUserSession();
      
      // Clear app state
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Logout failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addTransaction = (transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const addAccount = (account) => {
    dispatch({ type: 'ADD_ACCOUNT', payload: account });
  };

  const addInvestment = (investment) => {
    dispatch({ type: 'ADD_INVESTMENT', payload: investment });
  };

  const addGoal = (goal) => {
    dispatch({ type: 'ADD_GOAL', payload: goal });
  };

  const toggleBalanceVisibility = () => {
    dispatch({ type: 'TOGGLE_BALANCE_VISIBILITY' });
  };

    const value = {
    ...state,
    setUser,
    setIsFirstLogin,
    logout,
    addTransaction,
    addAccount,
    addInvestment,
    addGoal,
    toggleBalanceVisibility,
    dispatch,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};