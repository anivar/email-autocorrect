/**
 * Latin Script Optimized Example
 * IDNA2008-compliant Latin script version for reduced bundle size
 * Follows IDN LGR (Label Generation Rules) for Latin script
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { 
  correctEmailLatin, 
  validateEmailLatin,
  processVoiceInputLatin 
} from 'email-autocorrect';

export function LatinEmailExample() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  
  const handleEmailChange = (text: string) => {
    setEmail(text);
    
    // Validate using Latin version
    const validation = validateEmailLatin(text);
    setError(validation.error || '');
    
    // Check for suggestions
    if (text.includes('@')) {
      const correction = correctEmailLatin(text);
      setSuggestion(correction?.suggested || null);
    } else {
      setSuggestion(null);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>IDNA2008 Latin Script Version</Text>
      <Text style={styles.subtitle}>
        Optimized for Latin-1 Supplement (ISO-8859-1)
      </Text>
      
      <TextInput
        value={email}
        onChangeText={handleEmailChange}
        placeholder="Enter email (Latin characters only)"
        style={[styles.input, error && styles.inputError]}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      {suggestion && suggestion !== email && (
        <View style={styles.suggestionBox}>
          <Text style={styles.suggestionText}>
            Did you mean: {suggestion}?
          </Text>
        </View>
      )}
    </View>
  );
}

export function LatinVoiceInputExample() {
  const [voiceInput, setVoiceInput] = useState('maria garcia at hotmail dot com');
  const [convertedEmail, setConvertedEmail] = useState('');
  
  const handleConvert = () => {
    // Process voice input with Latin version
    const email = processVoiceInputLatin(voiceInput);
    setConvertedEmail(email);
    
    // Check if it needs correction
    const suggestion = correctEmailLatin(email);
    if (suggestion) {
      setConvertedEmail(suggestion.suggested);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice to Email (Latin)</Text>
      
      <TextInput
        value={voiceInput}
        onChangeText={setVoiceInput}
        placeholder="Say: user at gmail dot com"
        style={styles.input}
        multiline
      />
      
      <Text style={styles.button} onPress={handleConvert}>
        Convert Voice to Email
      </Text>
      
      {convertedEmail && (
        <View style={styles.result}>
          <Text style={styles.resultLabel}>Email:</Text>
          <Text style={styles.resultText}>{convertedEmail}</Text>
        </View>
      )}
    </View>
  );
}

export function SupportedCharactersDemo() {
  // Examples following IDNA2008 Latin script LGR
  const examples = [
    { email: 'josé@españa.es', label: 'Spanish (Latin-1)' },
    { email: 'françois@société.fr', label: 'French (Latin-1)' },
    { email: 'müller@münchen.de', label: 'German (Latin-1)' },
    { email: 'søren@københavn.dk', label: 'Danish (Latin-1)' },
    { email: 'andré@são-paulo.br', label: 'Portuguese (Latin-1)' },
    { email: 'info@café.com', label: 'Accented domain' },
  ];
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>IDNA2008 Latin Script Support</Text>
      <Text style={styles.subtitle}>
        Following IDN LGR for Latin script (Unicode blocks 0000-00FF)
      </Text>
      
      {examples.map((example, index) => {
        const validation = validateEmailLatin(example.email);
        
        return (
          <View key={index} style={styles.exampleItem}>
            <Text style={styles.exampleEmail}>{example.email}</Text>
            <Text style={styles.exampleLabel}>{example.label}</Text>
            <Text style={[
              styles.status,
              validation.isValid ? styles.valid : styles.invalid
            ]}>
              {validation.isValid ? '✓ Valid' : '✗ Invalid'}
            </Text>
          </View>
        );
      })}
      
      <View style={styles.note}>
        <Text style={styles.noteTitle}>IDNA2008 Compliance:</Text>
        <Text style={styles.noteText}>
          • Basic Latin (U+0020 to U+007E){'\n'}
          • Latin-1 Supplement (U+00A0 to U+00FF){'\n'}
          • No script mixing (prevents homograph attacks){'\n'}
          • Follows IDN Label Generation Rules{'\n'}
          • ~40% smaller bundle than full Unicode version
        </Text>
      </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  error: {
    color: '#ff3b30',
    fontSize: 12,
    marginBottom: 8,
  },
  suggestionBox: {
    padding: 12,
    backgroundColor: '#e3f2ff',
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#007aff',
  },
  button: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#007aff',
    color: 'white',
    textAlign: 'center',
    borderRadius: 8,
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
  },
  exampleItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  exampleEmail: {
    fontSize: 14,
    fontWeight: '500',
  },
  exampleLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    marginTop: 4,
  },
  valid: {
    color: '#34c759',
  },
  invalid: {
    color: '#ff3b30',
  },
  note: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#666',
  },
});