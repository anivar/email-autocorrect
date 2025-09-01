/**
 * Voice input support with email autocorrect
 * Handles speech-to-text with proper announcements
 */

import React, { useEffect, useRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  AccessibilityInfo,
  Platform,
} from 'react-native';
import { useEmailAutocorrect } from 'react-native-email-autocorrect';

export function VoiceInputExample() {
  const { 
    email, 
    setEmail, 
    suggestion, 
    acceptSuggestion,
    validation 
  } = useEmailAutocorrect({
    debounceMs: 300, // Small delay for voice input
  });
  
  const inputRef = useRef<TextInput>(null);
  const lastAnnouncedRef = useRef<string>('');
  const isVoiceInputRef = useRef(false);
  
  // Detect voice input by checking for rapid multi-word changes
  const handleChangeText = (text: string) => {
    const wordDiff = text.split(' ').length - email.split(' ').length;
    isVoiceInputRef.current = wordDiff > 2 || text.length - email.length > 20;
    
    setEmail(text);
    
    // Announce full text after voice input
    if (isVoiceInputRef.current && text.includes('@')) {
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(
          `Voice input received: ${text}`
        );
      }, 500);
    }
  };
  
  // Enhanced announcements for voice input
  useEffect(() => {
    if (suggestion && email) {
      const announcement = isVoiceInputRef.current
        ? `Voice input corrected to: ${suggestion.suggested}. Say "accept" or tap to confirm.`
        : `Did you mean ${suggestion.suggested}?`;
      
      if (announcement !== lastAnnouncedRef.current) {
        AccessibilityInfo.announceForAccessibility(announcement);
        lastAnnouncedRef.current = announcement;
      }
    }
  }, [suggestion, email]);
  
  // Voice commands support
  useEffect(() => {
    if (email.toLowerCase().includes(' accept') && suggestion) {
      setEmail(email.replace(/ accept$/i, ''));
      acceptSuggestion();
      AccessibilityInfo.announceForAccessibility('Suggestion accepted');
    }
  }, [email, suggestion, acceptSuggestion]);
  
  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        value={email}
        onChangeText={handleChangeText}
        placeholder="Speak or type email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          styles.input,
          validation.error && styles.inputError,
        ]}
        // Accessibility for voice input
        accessible={true}
        accessibilityLabel="Email input with voice support"
        accessibilityHint="Speak your email address or type it"
        accessibilityRole={Platform.OS === 'web' ? 'textbox' : 'none'}
        {...(Platform.OS === 'web' && {
          'aria-label': 'Email with voice input',
          'aria-live': 'polite',
          'aria-invalid': validation.error ? 'true' : 'false',
          'x-webkit-speech': true, // Chrome speech input
          'speech': true,
        })}
      />
      
      {suggestion && (
        <View 
          style={styles.suggestionBox}
          accessible={true}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          <Text style={styles.suggestionLabel}>
            Suggested: 
          </Text>
          <Text style={styles.suggestionText}>
            {suggestion.suggested}
          </Text>
          <Text style={styles.voiceHint}>
            Say "accept" to use this
          </Text>
        </View>
      )}
      
      <Text 
        style={styles.instructions}
        accessible={true}
        importantForAccessibility="yes"
      >
        💡 Tip: After speaking, say "accept" to confirm suggestions
      </Text>
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
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  suggestionBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  suggestionLabel: {
    fontSize: 14,
    color: '#666',
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 4,
  },
  voiceHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  instructions: {
    marginTop: 20,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});