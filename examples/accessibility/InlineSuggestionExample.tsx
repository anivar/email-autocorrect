/**
 * Minimal inline suggestion implementation
 * Shows suggestion directly in the input field
 */

import React, { useEffect, useRef } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  AccessibilityInfo,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { useEmailAutocorrect } from 'react-native-email-autocorrect';

export function InlineSuggestionExample() {
  const { 
    email, 
    setEmail, 
    suggestion, 
    acceptSuggestion,
    validation 
  } = useEmailAutocorrect({
    debounceMs: 0, // Instant suggestions
  });
  
  const inputRef = useRef<TextInput>(null);
  const previousSuggestionRef = useRef<string | null>(null);
  
  // Display value shows the suggestion inline
  const displayValue = suggestion?.suggested || email;
  
  // Announce suggestions to screen readers
  useEffect(() => {
    if (suggestion && suggestion.suggested !== previousSuggestionRef.current) {
      const remainingText = suggestion.suggested.slice(email.length);
      if (remainingText) {
        AccessibilityInfo.announceForAccessibility(
          `Autocomplete: ${remainingText}. Press right arrow to accept.`
        );
      }
      previousSuggestionRef.current = suggestion.suggested;
    }
  }, [suggestion, email]);
  
  const handleChangeText = (text: string) => {
    // User accepted the suggestion by typing it completely
    if (text === suggestion?.suggested) {
      acceptSuggestion();
      AccessibilityInfo.announceForAccessibility('Suggestion accepted');
    } else {
      setEmail(text);
    }
  };
  
  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    // Accept suggestion with Right Arrow or Tab
    if ((e.nativeEvent.key === 'ArrowRight' || e.nativeEvent.key === 'Tab') && 
        suggestion && 
        email !== suggestion.suggested) {
      e.preventDefault?.();
      acceptSuggestion();
      AccessibilityInfo.announceForAccessibility('Suggestion accepted');
    }
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        value={displayValue}
        onChangeText={handleChangeText}
        onKeyPress={handleKeyPress}
        placeholder="Enter email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          styles.input,
          validation.error ? styles.inputError : null,
        ]}
        // Accessibility
        accessible={true}
        accessibilityLabel="Email input with autocomplete"
        accessibilityHint={
          suggestion 
            ? `Suggestion: ${suggestion.suggested}. Press right arrow to accept.`
            : "Type your email address"
        }
        accessibilityRole={Platform.OS === 'web' ? 'textbox' : 'none'}
        {...(Platform.OS === 'web' && {
          'aria-autocomplete': 'inline',
          'aria-invalid': validation.error ? 'true' : 'false',
          'aria-describedby': validation.error ? 'email-error' : undefined,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
});