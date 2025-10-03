

import React, { useState, useContext, useEffect } from 'react';
import { 
  ScrollView, View, Text, TextInput, TouchableOpacity, 
  Alert, StyleSheet, Platform, Modal, FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { 
  formatCurrency, 
  validateAmount, 
  parseAmountInput,
  amountToMinorUnits,
  getCurrencySymbol,
  getCurrencyDecimals 
} from '../utils/currencyUtils';
import { 
  getTodayDate, 
  validateDate, 
  formatDateForDisplay,
  formatDateToISO 
} from '../utils/dateUtils';

export default function AddTransactionScreen() {
  const { transactions, addTransaction, user } = useContext(AppContext);
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // 'expense' or 'income'
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [notes, setNotes] = useState('');
  
  // UI state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Get user currency (default to INR)
  const currency = user?.currency || 'INR';
  const currencySymbol = getCurrencySymbol(currency);
  const currencyDecimals = getCurrencyDecimals(currency);

    // Track if form is dirty
  useEffect(() => {
    if (title || amount || category || notes) {
      setIsDirty(true);
    }
  }, [title, amount, category, notes]);
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate title
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    // Validate category
    if (!category) {
      newErrors.category = 'Category is required';
    }
    
    // Validate amount
    const amountValidation = validateAmount(amount, currency);
    if (!amountValidation.valid) {
      newErrors.amount = amountValidation.error;
    }
    
    // Validate date
    const dateValidation = validateDate(date);
    if (!dateValidation.valid) {
      newErrors.date = dateValidation.error;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Save transaction
  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Convert amount to minor units
      const amountMinor = amountToMinorUnits(amount, currency);
      
      const newTransaction = {
        id: Date.now().toString(),
        userId: user?.id || 'default',
        title: title.trim(),
        type,
        category,
        categoryName: getCategoryName(category),
        amount: parseFloat(amount),
        amountMinor,
        currency,
        date,
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      addTransaction(newTransaction);
      
      Alert.alert(
        'Success', 
        'Transaction saved successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Save transaction error:', error);
      Alert.alert('Error', 'Failed to save transaction');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    if (isDirty) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };
  
  // Get category name
  const getCategoryName = (id) => {
    const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
    const cat = allCategories.find(c => c.id === id);
    return cat?.name || id;
  };

    const styles = createStyles(theme);
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.headerButton}
          disabled={isLoading || !isDirty}
        >
          <Text style={[
            styles.headerButtonText,
            (!isDirty || isLoading) && styles.headerButtonTextDisabled
          ]}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Transaction Type Toggle */}
        <View style={styles.typeToggleContainer}>
          <TouchableOpacity
            style={[
              styles.typeToggle,
              type === 'expense' && styles.typeToggleActive
            ]}
            onPress={() => {
              setType('expense');
              setCategory('');
              setIsDirty(true);
            }}
          >
            <Ionicons 
              name="arrow-down" 
              size={20} 
              color={type === 'expense' ? '#fff' : theme.colors.error} 
            />
            <Text style={[
              styles.typeToggleText,
              type === 'expense' && styles.typeToggleTextActive
            ]}>
              Expense
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeToggle,
              type === 'income' && styles.typeToggleActiveIncome
            ]}
            onPress={() => {
              setType('income');
              setCategory('');
              setIsDirty(true);
            }}
          >
            <Ionicons 
              name="arrow-up" 
              size={20} 
              color={type === 'income' ? '#fff' : theme.colors.success} 
            />
            <Text style={[
              styles.typeToggleText,
              type === 'income' && styles.typeToggleTextActive
            ]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Title Field */}
          <FormField
            label="Title"
            required
            error={errors.title}
            theme={theme}
          >
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) {
                  setErrors({ ...errors, title: null });
                }
              }}
              placeholder="e.g., Groceries, Dinner, Uber"
              placeholderTextColor={theme.colors.textTertiary}
              maxLength={100}
            />
          </FormField>
          
          {/* Category Field */}
          <FormField
            label="Category"
            required
            error={errors.category}
            theme={theme}
          >
            <TouchableOpacity
              style={[styles.input, styles.selectInput, errors.category && styles.inputError]}
              onPress={() => setShowCategoryModal(true)}
            >
              <View style={styles.selectContent}>
                {category ? (
                  <Text style={styles.selectText}>
                    {getCategoryName(category)}
                  </Text>
                ) : (
                  <Text style={styles.selectPlaceholder}>
                    Select category
                  </Text>
                )}
                <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </FormField>
          
          {/* Amount Field */}
          <FormField
            label="Amount"
            required
            error={errors.amount}
            theme={theme}
          >
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>{currencySymbol}</Text>
              <TextInput
                style={[styles.input, styles.amountInput, errors.amount && styles.inputError]}
                value={amount}
                onChangeText={(text) => {
                  const cleaned = parseAmountInput(text, currency);
                  setAmount(cleaned);
                  if (errors.amount) {
                    setErrors({ ...errors, amount: null });
                  }
                }}
                placeholder={`0.${'0'.repeat(currencyDecimals)}`}
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="decimal-pad"
              />
              <Text style={styles.currencyCode}>{currency}</Text>
            </View>
          </FormField>
          
          {/* Date Field */}
          <FormField
            label="Date"
            required
            error={errors.date}
            theme={theme}
          >
            <TouchableOpacity
              style={[styles.input, styles.selectInput, errors.date && styles.inputError]}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.selectContent}>
                <Text style={styles.selectText}>
                  {formatDateForDisplay(date)}
                </Text>
                <Ionicons name="calendar" size={20} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </FormField>
          
          {/* Notes Field (Optional) */}
          <FormField
            label="Notes"
            theme={theme}
          >
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes (optional)"
              placeholderTextColor={theme.colors.textTertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </FormField>
        </View>
      </ScrollView>
      
      {/* Category Modal */}
      <CategoryModal
        visible={showCategoryModal}
        type={type}
        selectedCategory={category}
        onSelect={(id) => {
          setCategory(id);
          setShowCategoryModal(false);
          if (errors.category) {
            setErrors({ ...errors, category: null });
          }
        }}
        onClose={() => setShowCategoryModal(false)}
        theme={theme}
      />
      
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date(date)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) {
              const formattedDate = formatDateToISO(selectedDate);
              setDate(formattedDate);
              if (errors.date) {
                setErrors({ ...errors, date: null });
              }
            }
          }}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

// Form Field Component
function FormField({ label, required, error, children, theme }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ 
        fontSize: 14, 
        fontWeight: '600', 
        color: theme.colors.text,
        marginBottom: 8 
      }}>
        {label} {required && <Text style={{ color: theme.colors.error }}>*</Text>}
      </Text>
      {children}
      {error && (
        <Text style={{ 
          fontSize: 12, 
          color: theme.colors.error,
          marginTop: 4 
        }}>
          {error}
        </Text>
      )}
    </View>
  );
}

// Category Modal Component
function CategoryModal({ visible, type, selectedCategory, onSelect, onClose, theme }) {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end'
      }}>
        <View style={{
          backgroundColor: theme.colors.card,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '80%',
          paddingBottom: 34
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: theme.colors.text
            }}>
              Select Category
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.borderLight,
                  backgroundColor: selectedCategory === item.id 
                    ? theme.colors.primaryContainer 
                    : 'transparent'
                }}
                onPress={() => onSelect(item.id)}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: item.color + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <Text style={{
                  fontSize: 16,
                  color: theme.colors.text,
                  flex: 1
                }}>
                  {item.name}
                </Text>
                {selectedCategory === item.id && (
                  <Ionicons name="checkmark" size={24} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerButton: {
    padding: 4,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  headerButtonTextDisabled: {
    color: theme.colors.textTertiary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scrollView: {
    flex: 1,
  },
  typeToggleContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  typeToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    gap: 8,
  },
  typeToggleActive: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  typeToggleActiveIncome: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  typeToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  typeToggleTextActive: {
    color: '#fff',
  },
  formSection: {
    padding: 20,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    fontSize: 16,
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  selectPlaceholder: {
    fontSize: 16,
    color: theme.colors.textTertiary,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
    paddingLeft: 14,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    borderWidth: 0,
    padding: 14,
  },
  currencyCode: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    paddingRight: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
