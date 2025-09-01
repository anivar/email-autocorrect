/**
 * Gmail-style overlay suggestion implementation
 * Shows grayed-out suggestion text overlaid on the input
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  AccessibilityInfo,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { useEmailAutocorrect } from 'react-native-email-autocorrect';

export function GmailStyleExample() {
  const { 
    email, 
    setEmail, 
    suggestion, 
    acceptSuggestion,
    validation 
  } = useEmailAutocorrect({
    debounceMs: 0,
  });
  
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectionPosition, setSelectionPosition] = useState(0);
  const previousSuggestionRef = useRef<string | null>(null);
  
  // Only show suggestion if cursor is at the end
  const showSuggestion = suggestion && 
    selectionPosition === email.length && 
    suggestion.suggested.toLowerCase().startsWith(email.toLowerCase());
  
  // Announce suggestions
  useEffect(() => {
    if (showSuggestion && suggestion.suggested !== previousSuggestionRef.current) {
      const remainingText = suggestion.suggested.slice(email.length);
      AccessibilityInfo.announceForAccessibility(
        `Suggestion: ${remainingText}. Press Tab or Right Arrow to accept.`
      );
      previousSuggestionRef.current = suggestion.suggested;
    } else if (!showSuggestion) {
      previousSuggestionRef.current = null;
    }
  }, [showSuggestion, suggestion, email]);
  
  const handleChangeText = (text: string) => {
    setEmail(text);
  };
  
  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = e.nativeEvent.key;
    
    if (showSuggestion) {
      // Accept with Tab or Right Arrow
      if (key === 'Tab' || key === 'ArrowRight') {
        e.preventDefault?.();
        setEmail(suggestion.suggested);
        acceptSuggestion();
        AccessibilityInfo.announceForAccessibility('Suggestion accepted');
        // Move cursor to end
        setTimeout(() => {
          inputRef.current?.setSelection(
            suggestion.suggested.length, 
            suggestion.suggested.length
          );
        }, 0);
      }
      // Reject with Escape
      else if (key === 'Escape') {
        e.preventDefault?.();
        // This will cause suggestion to recalculate
        setEmail(email + ' ');
        setEmail(email);
        AccessibilityInfo.announceForAccessibility('Suggestion dismissed');
      }
    }
  };
  
  const handleSelectionChange = (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    setSelectionPosition(e.nativeEvent.selection.start);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          value={email}
          onChangeText={handleChangeText}
          onKeyPress={handleKeyPress}
          onSelectionChange={handleSelectionChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            validation.error && styles.inputError,
          ]}
          // Accessibility
          accessible={true}
          accessibilityLabel="Email input"
          accessibilityHint={
            showSuggestion 
              ? `Autocomplete: ${suggestion.suggested}. Tab or Right Arrow to accept, Escape to dismiss.`
              : "Type your email address"
          }
          accessibilityRole={Platform.OS === 'web' ? 'textbox' : 'none'}
          {...(Platform.OS === 'web' && {
            'aria-autocomplete': 'inline',
            'aria-expanded': showSuggestion ? 'true' : 'false',
            'aria-invalid': validation.error ? 'true' : 'false',
          })}
        />
        
        {/* Suggestion overlay */}
        {showSuggestion && (
          <View 
            style={styles.suggestionOverlay} 
            pointerEvents="none"
            accessible={false}
          >
            <Text style={styles.typedText}>{email}</Text>
            <Text style={styles.suggestionText}>
              {suggestion.suggested.slice(email.length)}
            </Text>
          </View>
        )}
      </View>
      
      {/* Keyboard hints */}
      {showSuggestion && (
        <Text 
          style={styles.hint}
          accessible={true}
          accessibilityRole="text"
        >
          Tab or → to accept • Esc to dismiss
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputFocused: {
    borderColor: '#007AFF',
    borderWidth: 2,
    ...Platform.select({
      web: {
        outlineWidth: 0,
      },
    }),
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  suggestionOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 0,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typedText: {
    fontSize: 16,
    color: 'transparent',
  },
  suggestionText: {
    fontSize: 16,
    color: '#999',
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
});