/**
 * React Native Example - Email Autocorrect
 * Full Unicode/EAI support following IDNA2008 standards
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useEmailAutocorrect, correctEmail, validateEmail } from 'email-autocorrect';

export function EmailFieldExample() {
  const { email, setEmail, suggestion, validation } = useEmailAutocorrect({
    minConfidence: 0.8,
    debounceMs: 0, // Instant suggestions
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email Address</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        style={[styles.input, validation.error && styles.inputError]}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      {validation.error && (
        <Text style={styles.error}>{validation.error}</Text>
      )}
      
      {suggestion && (
        <TouchableOpacity
          style={styles.suggestion}
          onPress={() => setEmail(suggestion.suggested)}
        >
          <Text style={styles.suggestionText}>
            Did you mean: <Text style={styles.bold}>{suggestion.suggested}</Text>?
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Example with EAI/IDN support (IDNA2008 compliant)
export function InternationalEmailExample() {
  const [emails] = useState([
    'user@münchen.de',        // German IDN
    '用户@例え.jp',            // Japanese EAI
    'अनिवार@भारत.भारत',       // Hindi EAI
    'info@café.fr',           // French IDN
    'josé@españa.es',         // Spanish IDN
    'владимир@почта.рф',      // Russian EAI
  ]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>IDNA2008/EAI Examples</Text>
      {emails.map((email, index) => {
        const validation = validateEmail(email);
        const suggestion = correctEmail(email);
        
        return (
          <View key={index} style={styles.emailItem}>
            <Text style={styles.emailText}>{email}</Text>
            <Text style={[
              styles.status,
              validation.isValid ? styles.valid : styles.invalid
            ]}>
              {validation.isValid ? '✓ Valid' : `✗ ${validation.error}`}
            </Text>
            {suggestion && (
              <Text style={styles.suggestionText}>
                Suggestion: {suggestion.suggested}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

// Voice input example
export function VoiceInputExample() {
  const [voiceText, setVoiceText] = useState('john smith at gmail dot com');
  const { email, setEmail, validation } = useEmailAutocorrect();
  
  const handleVoiceConvert = () => {
    // The main corrector handles voice input automatically
    const result = correctEmail(voiceText);
    if (result && result.reason === 'Fixed voice input (at → @)') {
      setEmail(result.suggested);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Voice Input</Text>
      <TextInput
        value={voiceText}
        onChangeText={setVoiceText}
        placeholder="Say: user at gmail dot com"
        style={styles.input}
        multiline
      />
      
      <TouchableOpacity style={styles.button} onPress={handleVoiceConvert}>
        <Text style={styles.buttonText}>Convert to Email</Text>
      </TouchableOpacity>
      
      {email && (
        <View style={styles.result}>
          <Text style={styles.resultLabel}>Converted Email:</Text>
          <Text style={styles.resultText}>{email}</Text>
          <Text style={[
            styles.status,
            validation.isValid ? styles.valid : styles.invalid
          ]}>
            {validation.isValid ? 'Valid email' : validation.error}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  error: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  suggestion: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#e3f2ff',
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
    color: '#007aff',
  },
  emailItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  emailText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
  },
  valid: {
    color: '#34c759',
  },
  invalid: {
    color: '#ff3b30',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#007aff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  result: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
});