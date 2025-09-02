/**
 * React Web Example
 * Shows how to use the core functions in a React web app
 */

import React, { useState, useEffect } from 'react';
import { correctEmail, validateEmail } from 'email-autocorrect';

export function ReactWebExample() {
  const [email, setEmail] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [validation, setValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: false });
  
  useEffect(() => {
    // Validate email
    const result = validateEmail(email);
    setValidation(result);
    
    // Get suggestion
    if (email && !result.isValid) {
      const correction = correctEmail(email);
      setSuggestion(correction?.suggested || null);
    } else {
      setSuggestion(null);
    }
  }, [email]);
  
  const acceptSuggestion = () => {
    if (suggestion) {
      setEmail(suggestion);
      setSuggestion(null);
    }
  };
  
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>React Web Email Input</h2>
      
      <div style={styles.inputWrapper}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{
            ...styles.input,
            ...(validation.isValid ? styles.validInput : {}),
            ...(!validation.isValid && email ? styles.invalidInput : {}),
          }}
        />
        
        {/* Validation indicator */}
        {email && (
          <span style={styles.indicator}>
            {validation.isValid ? '✓' : '✗'}
          </span>
        )}
      </div>
      
      {/* Suggestion */}
      {suggestion && (
        <div style={styles.suggestion}>
          <span>Did you mean </span>
          <button 
            onClick={acceptSuggestion}
            style={styles.suggestionButton}
          >
            {suggestion}
          </button>
          <span>?</span>
        </div>
      )}
      
      {/* Error message */}
      {validation.error && email && (
        <div style={styles.error}>{validation.error}</div>
      )}
      
      {/* Examples showcase */}
      <div style={styles.examples}>
        <h3>Try these typos:</h3>
        <ul>
          <li>user@gmial.com</li>
          <li>john@yahooo.com</li>
          <li>alice at gmail.com</li>
          <li>bob@hotmial.com</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, system-ui, sans-serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  inputWrapper: {
    position: 'relative' as const,
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '12px 40px 12px 16px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
  },
  validInput: {
    borderColor: '#4caf50',
  },
  invalidInput: {
    borderColor: '#f44336',
  },
  indicator: {
    position: 'absolute' as const,
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '20px',
    color: '#4caf50',
  },
  suggestion: {
    padding: '10px',
    backgroundColor: '#e3f2fd',
    borderRadius: '6px',
    marginBottom: '10px',
    fontSize: '14px',
    color: '#1976d2',
  },
  suggestionButton: {
    background: 'none',
    border: 'none',
    color: '#1976d2',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '0 4px',
  },
  error: {
    color: '#f44336',
    fontSize: '14px',
    marginTop: '5px',
  },
  examples: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
};