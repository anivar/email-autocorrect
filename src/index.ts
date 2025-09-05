/**
 * Email Autocorrect
 * 
 * Unicode-first email validation and typo correction
 * Full EAI/IDN support for global email addresses
 */

// ===== Primary Exports (Unicode/EAI Support) =====
export { 
  correctEmail, 
  validateEmail, 
  loadTLDs 
} from './core/email-corrector';

// ===== React Integration =====
export { useEmailAutocorrect } from './hooks/useEmailAutocorrect';
export { EmailInput } from './components/EmailInput';
export { EmailInputInline } from './components/EmailInputInline';

// ===== Types =====
export type { 
  EmailSuggestion, 
  ValidationResult, 
  EmailAutocorrectConfig,
  EmailInputProps 
} from './types';

// ===== Optimized Variants =====
// Latin character set version for tree-shaking optimization
export {
  validateEmailLatin,
  correctEmailLatin,
  processVoiceInputLatin
} from './core/email-corrector-latin';

// ===== Advanced Usage =====
export { EmailCorrector } from './core/email-corrector';
export { EmailCorrectorLatin } from './core/email-corrector-latin';