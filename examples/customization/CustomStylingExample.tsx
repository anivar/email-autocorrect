/**
 * Custom styling example
 * Shows various ways to style the EmailInput component
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { EmailInput } from 'email-autocorrect';

export function CustomStylingExample() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'brand'>('light');
  
  const getStyles = () => {
    switch (theme) {
      case 'dark':
        return darkStyles;
      case 'brand':
        return brandStyles;
      default:
        return lightStyles;
    }
  };
  
  const currentStyles = getStyles();
  
  return (
    <View style={[styles.container, currentStyles.container]}>
      <Text style={[styles.title, currentStyles.title]}>Themed Email Input</Text>
      
      {/* Theme switcher */}
      <View style={styles.themeSwitcher}>
        {(['light', 'dark', 'brand'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.themeButton,
              theme === t && styles.activeTheme,
            ]}
            onPress={() => setTheme(t)}
          >
            <Text style={styles.themeButtonText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Styled email input */}
      <EmailInput
        placeholder="Enter your email"
        style={[styles.input, currentStyles.input]}
        placeholderTextColor={currentStyles.placeholderColor}
        selectionColor={currentStyles.selectionColor}
        // Custom validation feedback
        onEmailChange={(email, isValid) => {
          console.log('Email:', email, 'Valid:', isValid);
        }}
      />
      
      {/* Inline style example */}
      <Text style={[styles.sectionTitle, currentStyles.text]}>
        Inline Suggestion Style
      </Text>
      <EmailInput
        placeholder="Type an email..."
        style={[
          styles.input,
          currentStyles.input,
          { marginTop: 10 },
        ]}
        config={{
          debounceMs: 0,
          minConfidence: 0.7,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  themeSwitcher: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 10,
  },
  themeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  activeTheme: {
    backgroundColor: '#007AFF',
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

// Light theme
const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  title: {
    color: '#000000',
  },
  text: {
    color: '#333333',
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderColor: '#e0e0e0',
    color: '#000000',
  },
  placeholderColor: '#999999',
  selectionColor: '#007AFF',
});

// Dark theme
const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
  },
  title: {
    color: '#ffffff',
  },
  text: {
    color: '#e0e0e0',
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444444',
    color: '#ffffff',
  },
  placeholderColor: '#888888',
  selectionColor: '#4a9eff',
});

// Brand theme
const brandStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f7ff',
  },
  title: {
    color: '#0052cc',
  },
  text: {
    color: '#172b4d',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#0052cc',
    borderWidth: 2,
    color: '#172b4d',
  },
  placeholderColor: '#6b778c',
  selectionColor: '#0052cc',
});