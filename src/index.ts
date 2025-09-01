/**
 * React Native Email Autocorrect
 * Smart email validation and suggestion library
 */

export { useEmailAutocorrect } from './hooks/useEmailAutocorrect';
export { EmailInput } from './components/EmailInput';
export { correctEmail, validateEmail } from './core/emailCorrector';
export type {
  EmailSuggestion,
  ValidationResult,
  EmailAutocorrectConfig,
  EmailInputProps,
} from './types';