/**
 * Ready-to-use Email Input component for React Native
 * This version shows suggestions as a separate UI element below the input
 * For inline autocomplete, use EmailInputInline component
 */

import React, { useRef, useEffect } from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  AccessibilityInfo,
  Platform,
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

  const inputRef = useRef<TextInput>(null);
  const previousSuggestionRef = useRef<string | null>(null);

  // Announce suggestions to screen readers
  useEffect(() => {
    if (suggestion && suggestion.suggested !== previousSuggestionRef.current) {
      const announcement = `Email suggestion available: Did you mean ${suggestion.suggested}? Press tab to navigate to accept or reject buttons.`;
      AccessibilityInfo.announceForAccessibility(announcement);
      previousSuggestionRef.current = suggestion.suggested;
    } else if (!suggestion) {
      previousSuggestionRef.current = null;
    }
  }, [suggestion]);

  // Announce validation errors to screen readers
  useEffect(() => {
    if (validation.error && email && !isChecking) {
      AccessibilityInfo.announceForAccessibility(validation.error);
    }
  }, [validation.error, email, isChecking]);

  const handleChangeText = (text: string) => {
    setEmail(text);
    onEmailChange?.(text, validation.isValid);
  };

  const handleSubmit = () => {
    if (validation.isValid && email) {
      onEmailSubmit?.(email);
    }
  };

  const handleAcceptSuggestion = () => {
    acceptSuggestion();
    AccessibilityInfo.announceForAccessibility('Suggestion accepted');
    inputRef.current?.focus();
  };

  const handleRejectSuggestion = () => {
    rejectSuggestion();
    AccessibilityInfo.announceForAccessibility('Suggestion rejected');
    inputRef.current?.focus();
  };

  return (
    <View 
      style={styles.container} 
      testID={`${testID}-container`}
      accessible={false} // Container should not be focusable
    >
      <TextInput
        ref={inputRef}
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
        // Accessibility props
        accessible={true}
        accessibilityRole="none" // TextInput has built-in role
        accessibilityLabel="Email address input"
        accessibilityHint={validation.error ? validation.error : "Enter your email address"}
        accessibilityState={{
          disabled: false,
          selected: false,
        }}
        accessibilityValue={{
          text: email || '',
        }}
        importantForAccessibility="yes"
        {...textInputProps}
      />
      
      {showValidation && validation.error && email && !isChecking && (
        <Text 
          style={styles.errorText} 
          testID={`${testID}-error`}
          accessible={true}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          importantForAccessibility="yes"
        >
          {validation.error}
        </Text>
      )}
      
      {showSuggestion && suggestion && !validation.isValid && (
        <View 
          style={styles.suggestionContainer} 
          testID={`${testID}-suggestion`}
          accessible={true}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          accessibilityLabel={`Email suggestion: Did you mean ${suggestion.suggested}?`}
        >
          <Text 
            style={styles.suggestionText}
            accessible={false} // Parent View handles announcement
          >
            Did you mean{' '}
            <Text style={styles.suggestionEmail}>{suggestion.suggested}</Text>?
          </Text>
          <View 
            style={styles.suggestionButtons}
            accessible={false}
          >
            <TouchableOpacity
              onPress={handleAcceptSuggestion}
              style={[styles.suggestionButton, styles.acceptButton]}
              testID={`${testID}-accept`}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Accept suggestion ${suggestion.suggested}`}
              accessibilityHint="Double tap to use this email address"
              accessibilityState={{
                disabled: false,
              }}
            >
              <Text style={styles.acceptButtonText} importantForAccessibility="no">Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRejectSuggestion}
              style={[styles.suggestionButton, styles.rejectButton]}
              testID={`${testID}-reject`}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Reject suggestion"
              accessibilityHint="Double tap to keep your original email"
              accessibilityState={{
                disabled: false,
              }}
            >
              <Text style={styles.rejectButtonText} importantForAccessibility="no">No</Text>
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
  // Focus indicators for keyboard navigation
  inputFocused: {
    borderColor: '#007AFF',
    borderWidth: 2,
    ...(Platform.OS === 'web' && {
      outlineWidth: 2,
      outlineColor: '#007AFF',
      outlineStyle: 'solid',
    }),
  },
  buttonFocused: {
    ...(Platform.OS === 'web' && {
      outlineWidth: 2,
      outlineColor: '#000000',
      outlineStyle: 'solid',
      outlineOffset: 2,
    }),
  },
});