/**
 * Email Input component with inline autocomplete suggestions
 * Shows suggestions as faded text within the input field
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  AccessibilityInfo,
  Platform,
} from 'react-native';
import { useEmailAutocorrect } from '../hooks/useEmailAutocorrect';
import { EmailInputProps } from '../types';

export const EmailInputInline: React.FC<EmailInputProps & Omit<TextInputProps, 'value' | 'onChangeText'>> = ({
  onEmailChange,
  onEmailSubmit,
  config = {},
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
  } = useEmailAutocorrect(config);

  const inputRef = useRef<TextInput>(null);
  const [displayValue, setDisplayValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const previousSuggestionRef = useRef<string | null>(null);

  // Update display value to show inline suggestion
  useEffect(() => {
    if (suggestion && email && suggestion.suggested.toLowerCase().startsWith(email.toLowerCase())) {
      // Show the suggestion inline
      setDisplayValue(suggestion.suggested);
    } else {
      setDisplayValue(email);
    }
  }, [email, suggestion]);

  // Announce suggestions to screen readers
  useEffect(() => {
    if (suggestion && suggestion.suggested !== previousSuggestionRef.current) {
      const remainingSuggestion = suggestion.suggested.slice(email.length);
      if (remainingSuggestion) {
        AccessibilityInfo.announceForAccessibility(
          `Autocomplete suggestion: ${remainingSuggestion}. Press right arrow or tab to accept.`
        );
      }
      previousSuggestionRef.current = suggestion.suggested;
    } else if (!suggestion) {
      previousSuggestionRef.current = null;
    }
  }, [suggestion, email]);

  // Announce validation errors
  useEffect(() => {
    if (validation.error && email && !isChecking) {
      AccessibilityInfo.announceForAccessibility(validation.error);
    }
  }, [validation.error, email, isChecking]);

  const handleChangeText = (text: string) => {
    // If user is typing and text is shorter, they're deleting
    if (text.length < email.length) {
      setEmail(text);
      onEmailChange?.(text, false);
      return;
    }

    // If the new text matches the suggestion, accept it
    if (suggestion && text === suggestion.suggested) {
      acceptSuggestion();
      onEmailChange?.(text, true);
      return;
    }

    // Normal typing
    setEmail(text);
    onEmailChange?.(text, validation.isValid);
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = e.nativeEvent.key;
    
    // Accept suggestion with Tab or Right Arrow
    if ((key === 'Tab' || key === 'ArrowRight') && suggestion && displayValue === suggestion.suggested) {
      e.preventDefault?.();
      acceptSuggestion();
      onEmailChange?.(suggestion.suggested, true);
      AccessibilityInfo.announceForAccessibility('Suggestion accepted');
    }
  };

  const handleSubmit = () => {
    // Accept suggestion if it's showing
    if (suggestion && displayValue === suggestion.suggested) {
      acceptSuggestion();
      onEmailChange?.(suggestion.suggested, true);
    }
    
    if (validation.isValid && email) {
      onEmailSubmit?.(email);
    }
  };

  const handleSelectionChange = (event: any) => {
    setCursorPosition(event.nativeEvent.selection.start);
  };

  return (
    <View style={styles.container} testID={`${testID}-container`}>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          value={displayValue}
          onChangeText={handleChangeText}
          onKeyPress={handleKeyPress}
          onSubmitEditing={handleSubmit}
          onSelectionChange={handleSelectionChange}
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
          accessibilityRole="none"
          accessibilityLabel="Email address input with autocomplete"
          accessibilityHint={
            suggestion 
              ? `Autocomplete available. Current suggestion: ${suggestion.suggested}. Press tab or right arrow to accept.`
              : "Enter your email address"
          }
          accessibilityState={{
            disabled: false,
          }}
          accessibilityValue={{
            text: email || '',
          }}
          importantForAccessibility="yes"
          {...textInputProps}
        />
        
        {/* Overlay to show the suggestion in gray */}
        {suggestion && displayValue === suggestion.suggested && email.length < suggestion.suggested.length && (
          <View style={styles.suggestionOverlay} pointerEvents="none">
            <Text style={styles.hiddenText}>{email}</Text>
            <Text style={styles.suggestionText}>
              {suggestion.suggested.slice(email.length)}
            </Text>
          </View>
        )}
      </View>
      
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#000000',
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
  suggestionOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 0,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  hiddenText: {
    fontSize: 16,
    color: 'transparent',
  },
  suggestionText: {
    fontSize: 16,
    color: '#999999',
  },
});