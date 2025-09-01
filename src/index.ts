/**
 * React Native Email Autocorrect
 * 
 * High-performance email typo correction and validation library
 * with full support for international domains (EAI/IDN)
 */

// Core functions
export { 
  correctEmail, 
  validateEmail, 
  clearCache,
  loadTLDs 
} from './core/email-corrector';

// React hooks
export { useEmailAutocorrect } from './hooks/useEmailAutocorrect';

// React components
export { EmailInput } from './components/EmailInput';
export { EmailInputInline } from './components/EmailInputInline';

// Types
export type { 
  EmailSuggestion, 
  ValidationResult, 
  EmailAutocorrectConfig,
  EmailInputProps 
} from './types';

// Direct access to core class (advanced usage)
export { EmailCorrector } from './core/email-corrector';