/**
 * Example app demonstrating react-native-email-autocorrect
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { EmailInput, useEmailAutocorrect } from 'react-native-email-autocorrect';

const App = () => {
  const [submittedEmail, setSubmittedEmail] = useState('');
  
  // Example with custom hook
  const {
    email,
    setEmail,
    validation,
    suggestion,
    acceptSuggestion,
  } = useEmailAutocorrect({ country: 'USA' });

  const handleSubmit = (email: string) => {
    Alert.alert('Success', `Email submitted: ${email}`);
    setSubmittedEmail(email);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Email Autocorrect Example</Text>
        
        {/* Using the component */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Using EmailInput Component</Text>
          <EmailInput
            placeholder="Enter your email"
            onEmailSubmit={handleSubmit}
            config={{ country: 'USA' }}
          />
        </View>

        {/* Using the hook */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Using useEmailAutocorrect Hook</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Type an email"
            style={[styles.input, validation.error ? styles.inputError : null]}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          {validation.error && (
            <Text style={styles.errorText}>{validation.error}</Text>
          )}
          
          {suggestion && (
            <TouchableOpacity
              style={styles.suggestionBox}
              onPress={acceptSuggestion}
            >
              <Text>
                Did you mean <Text style={styles.bold}>{suggestion.suggested}</Text>?
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {submittedEmail ? (
          <View style={styles.result}>
            <Text style={styles.resultText}>
              Last submitted: {submittedEmail}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  suggestionBox: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#E3F2FF',
    borderRadius: 8,
  },
  bold: {
    fontWeight: '600',
    color: '#007AFF',
  },
  result: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#2E7D32',
    textAlign: 'center',
  },
});

// Fix missing import
const TextInput = require('react-native').TextInput;

export default App;