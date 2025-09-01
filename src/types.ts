/**
 * TypeScript type definitions for React Native Email Autocorrect
 */

/**
 * Represents a suggested email correction
 */
export interface EmailSuggestion {
  /** The original email address entered by the user */
  original: string;
  
  /** The suggested corrected email address */
  suggested: string;
  
  /** Confidence level of the suggestion (0-1) */
  confidence: number;
  
  /** Human-readable reason for the suggestion */
  reason: string;
}

/**
 * Result of email validation
 */
export interface ValidationResult {
  /** Whether the email format is valid */
  isValid: boolean;
  
  /** Error message if validation fails */
  error?: string;
  
  /** Optional suggestion for correction */
  suggestion?: EmailSuggestion;
}

/**
 * Configuration options for email autocorrection
 */
export interface EmailAutocorrectConfig {
  /** Enable autocorrection suggestions (default: true) */
  enableSuggestions?: boolean;
  
  /** Enable email validation (default: true) */
  enableValidation?: boolean;
  
  /** Custom company domains to recognize */
  customDomains?: string[];
  
  /** User's country for regional TLD suggestions (e.g., 'UK', 'USA') */
  country?: string;
  
  /** Minimum confidence threshold for showing suggestions (0-1, default: 0.7) */
  minConfidence?: number;
  
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
}

/**
 * Props for the EmailInput component
 */
export interface EmailInputProps {
  /** Callback when email changes */
  onEmailChange?: (email: string, isValid: boolean) => void;
  
  /** Callback when email is submitted */
  onEmailSubmit?: (email: string) => void;
  
  /** Configuration options */
  config?: EmailAutocorrectConfig;
  
  /** Show autocorrect suggestions (default: true) */
  showSuggestion?: boolean;
  
  /** Show validation errors (default: true) */
  showValidation?: boolean;
  
  /** Input placeholder text */
  placeholder?: string;
  
  /** Test ID for testing */
  testID?: string;
}