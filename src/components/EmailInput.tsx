/**
 * Ready-to-use Email Input component for React Native
 */

import React from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useEmailAutocorrect } from '../hooks/useEmailAutocorrect';
import { EmailInputProps } from '../types';

export const EmailInput: React.FC<EmailInputProps & Omit<TextInputProps, 'value' | 'onChangeText'>> = ({
  onEmailChange,
  onEmailSubmit,
  config = {},
  showSuggestion = true,
  showValidation = true,
  placeholder = 'Enter your email',
  testID = 'email-input',
  style,
  ...textInputProps
}) => {
  const {
    email,
    setEmail,
    validation,
    suggestion,
    isChecking,
    acceptSuggestion,
    rejectSuggestion,
  } = useEmailAutocorrect(config);

  const handleChangeText = (text: string) => {
    setEmail(text);
    onEmailChange?.(text, validation.isValid);
  };

  const handleSubmit = () => {
    if (validation.isValid && email) {
      onEmailSubmit?.(email);
    }
  };

  return (
    <View style={styles.container} testID={`${testID}-container`}>
      <TextInput
        value={email}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        placeholder={placeholder}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        testID={testID}
        style={[
          styles.input,
          style,
          validation.error && email ? styles.inputError : null,
        ]}
        {...textInputProps}
      />
      
      {showValidation && validation.error && email && !isChecking && (
        <Text style={styles.errorText} testID={`${testID}-error`}>
          {validation.error}
        </Text>
      )}
      
      {showSuggestion && suggestion && !validation.isValid && (
        <View style={styles.suggestionContainer} testID={`${testID}-suggestion`}>
          <Text style={styles.suggestionText}>
            Did you mean{' '}
            <Text style={styles.suggestionEmail}>{suggestion.suggested}</Text>?
          </Text>
          <View style={styles.suggestionButtons}>
            <TouchableOpacity
              onPress={acceptSuggestion}
              style={[styles.suggestionButton, styles.acceptButton]}
              testID={`${testID}-accept`}
            >
              <Text style={styles.acceptButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={rejectSuggestion}
              style={[styles.suggestionButton, styles.rejectButton]}
              testID={`${testID}-reject`}
            >
              <Text style={styles.rejectButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
    marginLeft: 4,
  },
  suggestionContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestionText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  suggestionEmail: {
    fontWeight: '600',
    color: '#007AFF',
  },
  suggestionButtons: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  suggestionButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  acceptButton: {
    backgroundColor: '#007AFF',
  },
  rejectButton: {
    backgroundColor: '#8E8E93',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});