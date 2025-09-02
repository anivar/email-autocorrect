/**
 * Enterprise customization example
 * Shows how to customize the EmailInput component for corporate use
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EmailInput } from 'email-autocorrect';

export function EnterpriseExample() {
  // Corporate allowed domains
  const allowedDomains = ['company.com', 'company.co.uk', 'company.io'];
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Corporate Email</Text>
      <Text style={styles.subtitle}>Only company emails allowed</Text>
      
      <EmailInput
        placeholder="employee@company.com"
        style={styles.input}
        onEmailChange={(email, isValid) => {
          // Additional validation for corporate domains
          if (isValid && email) {
            const domain = email.split('@')[1];
            const isCorporate = allowedDomains.includes(domain);
            if (!isCorporate) {
              console.log('Please use a company email address');
            }
          }
        }}
        // Custom styling
        testID="corporate-email"
        // Pass custom domains for better suggestions
        config={{
          customDomains: allowedDomains,
          minConfidence: 0.8, // Higher threshold for corporate
        }}
      />
      
      <Text style={styles.hint}>
        Accepted domains: {allowedDomains.join(', ')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#0066cc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'System', // Or corporate font
  },
  hint: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});