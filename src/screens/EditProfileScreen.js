import React, { useContext, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../services/AuthService';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, setUser } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    currency: user?.currency || 'INR',
  });

  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    try {
      setLoading(true);

      if (!formData.name.trim()) {
        Alert.alert('Error', 'Name is required');
        setLoading(false);
        return;
      }

      // Update profile in AuthService (persists data)
      const updatedUser = await AuthService.updateUserProfile(formData);

      // Update context
      setUser(updatedUser);

      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        }
      ]);
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  // const handleSave = async () => {
  //   try {
  //     setLoading(true);
      
  //     // Validate required fields
  //     if (!formData.name.trim()) {
  //       Alert.alert('Error', 'Name is required');
  //       setLoading(false);
  //       return;
  //     }

  //     // Update user in context (you can add API call here)
  //     const updatedUser = {
  //       ...user,
  //       ...formData,
  //     };
      
  //     setUser(updatedUser);
      
  //     Alert.alert('Success', 'Profile updated successfully', [
  //       {
  //         text: 'OK',
  //         onPress: () => navigation.goBack(),
  //       }
  //     ]);
  //   } catch (error) {
  //     console.error('Update profile error:', error);
  //     Alert.alert('Error', 'Failed to update profile');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <FormField
          label="Full Name"
          icon="person-outline"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter your full name"
          required
        />

        <FormField
          label="Email"
          icon="mail-outline"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Enter your email"
          keyboardType="email-address"
          editable={false}
          disabled
        />

        <FormField
          label="Phone Number"
          icon="call-outline"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />

        <FormField
          label="Address"
          icon="home-outline"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholder="Enter your address"
          multiline
        />

        <FormField
          label="City"
          icon="location-outline"
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
          placeholder="Enter your city"
        />

        <FormField
          label="Country"
          icon="globe-outline"
          value={formData.country}
          onChangeText={(text) => setFormData({ ...formData, country: text })}
          placeholder="Enter your country"
        />

        <FormField
          label="Preferred Currency"
          icon="cash-outline"
          value={formData.currency}
          onChangeText={(text) => setFormData({ ...formData, currency: text })}
          placeholder="INR"
        />

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function FormField({ 
  label, icon, value, onChangeText, placeholder, 
  keyboardType, multiline, required, editable = true, disabled = false 
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={[styles.inputContainer, disabled && styles.inputDisabled]}>
        <Ionicons name={icon} size={20} color="#9CA3AF" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          editable={editable}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  form: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#DC2626',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});