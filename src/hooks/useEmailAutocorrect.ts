/**
 * React hook for email autocorrection
 * 
 * Provides email validation and autocorrection functionality with debouncing
 * 
 * @param config - Optional configuration for validation and suggestions
 * @returns Object with email state, validation, suggestions, and handlers
 * 
 * @example
 * const { email, setEmail, suggestion, acceptSuggestion } = useEmailAutocorrect();
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { EmailSuggestion, ValidationResult, EmailAutocorrectConfig } from '../types';
import { correctEmail, validateEmail } from '../core/emailCorrector';

export function useEmailAutocorrect(config: EmailAutocorrectConfig = {}) {
  const {
    enableSuggestions = true,
    enableValidation = true,
    debounceMs = 300,
    minConfidence = 0.7,
  } = config;
  
  const [email, setEmail] = useState('');
  const [validation, setValidation] = useState<ValidationResult>({ isValid: false });
  const [suggestion, setSuggestion] = useState<EmailSuggestion | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!email) {
      setValidation({ isValid: false });
      setSuggestion(null);
      return;
    }
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      setIsChecking(true);
      
      // Validate
      if (enableValidation) {
        const validationResult = validateEmail(email);
        setValidation(validationResult);
      }
      
      // Get suggestions
      if (enableSuggestions) {
        const correctionResult = correctEmail(email, config);
        if (correctionResult && correctionResult.confidence >= minConfidence) {
          setSuggestion(correctionResult);
        } else {
          setSuggestion(null);
        }
      }
      
      setIsChecking(false);
    }, debounceMs);
    
    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [email, enableValidation, enableSuggestions, config, minConfidence, debounceMs]);
  
  const acceptSuggestion = useCallback(() => {
    if (suggestion) {
      setEmail(suggestion.suggested);
      setSuggestion(null);
      setValidation({ isValid: true });
    }
  }, [suggestion]);
  
  const rejectSuggestion = useCallback(() => {
    setSuggestion(null);
  }, []);
  
  return {
    email,
    setEmail,
    validation,
    suggestion,
    isChecking,
    acceptSuggestion,
    rejectSuggestion,
  };
}