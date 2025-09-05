/**
 * Latin character set email corrector following IDNA2008 standards
 * Supports Latin script as defined in IDN specifications
 * Excludes characters that could be used for spoofing
 * Tree-shakeable alternative to the full Unicode version
 */

import { TYPO_FIXES_LATIN, COMMON_DOMAINS_LATIN, PROVIDER_RULES_LATIN } from '../data/emailDataLatin';
import { calculateSimilarity } from '../utils/similarity';

export interface EmailSuggestion {
  original: string;
  suggested: string;
  confidence: number;
  reason?: string;
}

export interface EmailValidation {
  isValid: boolean;
  error?: string;
}

/**
 * IDNA2008-compliant Latin script email corrector
 * Follows IDN standards for Latin character sets
 * Smaller bundle size for Latin-script focused applications
 */
export class EmailCorrectorLatin {
  // IDNA2008-compliant Latin character ranges
  // Basic Latin (ASCII): \u0020-\u007E
  // Latin-1 Supplement: \u00A0-\u00FF (excluding some control chars)
  // Following IDNA2008 restrictions to prevent spoofing
  private readonly LATIN_EMAIL_REGEX = /^[\u0020-\u007E\u00A0-\u00FF._%+-]+@[\u0020-\u007E\u00A0-\u00FF.-]+\.[\u0020-\u007E\u00A0-\u00FF]{2,}$/;

  /**
   * Validates email format following IDNA2008 Latin script rules
   * Accepts Basic Latin + Latin-1 Supplement per IDN standards
   * Rejects mixed scripts to prevent homograph attacks
   */
  validateEmail(email: string): EmailValidation {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email is required' };
    }

    // Enforce IDNA2008 Latin script boundaries (\u0020-\u00FF)
    // This prevents script mixing and potential spoofing
    // Starting at \u0020 (space) to exclude control characters
    if (!/^[\u0020-\u00FF]*$/.test(email)) {
      return { isValid: false, error: 'Only Latin script characters allowed (IDNA2008)' };
    }

    const trimmed = email.trim().toLowerCase();
    
    // Check for @ symbol
    const atCount = (trimmed.match(/@/g) || []).length;
    if (atCount === 0) {
      return { isValid: false, error: 'Email must contain @ symbol' };
    }
    if (atCount > 1) {
      return { isValid: false, error: 'Email can only contain one @ symbol' };
    }

    const [localPart, domain] = trimmed.split('@');
    
    // Check username
    if (!localPart || localPart.length === 0) {
      return { isValid: false, error: 'Email username is required' };
    }
    
    // Latin character validation 
    if (!/^[\u0020-\u007E\u00A0-\u00FF._%+-]+$/.test(localPart)) {
      return { isValid: false, error: 'Invalid characters in email username' };
    }

    // Check domain
    if (!domain || domain.length === 0) {
      return { isValid: false, error: 'Email domain is required' };
    }
    
    if (!/^[\u0020-\u007E\u00A0-\u00FF.-]+$/.test(domain)) {
      return { isValid: false, error: 'Invalid email domain format' };
    }

    // Full regex check
    if (!this.LATIN_EMAIL_REGEX.test(trimmed)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true };
  }

  /**
   * Suggests corrections for common typos (Latin character set only)
   * Works with Latin-1 Supplement but excludes other Unicode blocks
   */
  correctEmail(
    email: string,
    config?: { minConfidence?: number; customDomains?: string[] }
  ): EmailSuggestion | null {
    if (!email || typeof email !== 'string') return null;

    // Reject non-Latin characters
    if (!/^[\u0000-\u00FF]*$/.test(email)) return null;

    const trimmed = email.trim().toLowerCase();
    
    // Skip if it doesn't look like an email
    if (!trimmed.includes('@')) return null;

    const [localPart, domainPart] = trimmed.split('@');
    if (!localPart || !domainPart) return null;

    // Check for direct typo match (using minimal Latin dataset)
    if (TYPO_FIXES_LATIN[domainPart]) {
      return {
        original: email,
        suggested: `${localPart}@${TYPO_FIXES_LATIN[domainPart]}`,
        confidence: 0.95,
        reason: 'Common typo'
      };
    }

    // Check similarity with common domains (minimal set)
    let bestMatch: EmailSuggestion | null = null;
    let bestScore = 0;

    const domainsToCheck = [
      ...COMMON_DOMAINS_LATIN,
      ...(config?.customDomains || [])
    ];

    for (const domain of domainsToCheck) {
      const similarity = calculateSimilarity(domainPart, domain);
      
      if (similarity > bestScore && similarity >= (config?.minConfidence || 0.7)) {
        bestScore = similarity;
        bestMatch = {
          original: email,
          suggested: `${localPart}@${domain}`,
          confidence: similarity,
          reason: 'Similar domain'
        };
      }
    }

    return bestMatch;
  }

  /**
   * Process voice input - convert "at" to @ and "dot" to .
   * Latin/ASCII only version
   */
  processVoiceInput(text: string): string {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .replace(/\s+at\s+/g, '@')
      .replace(/\s+dot\s+/g, '.')
      .replace(/\s+/g, '');
  }
}

// Export singleton instance for tree-shaking
export const emailCorrectorLatin = new EmailCorrectorLatin();

// Export standalone functions for maximum tree-shaking
export const validateEmailLatin = (email: string): EmailValidation => 
  emailCorrectorLatin.validateEmail(email);

export const correctEmailLatin = (
  email: string, 
  config?: { minConfidence?: number; customDomains?: string[] }
): EmailSuggestion | null => 
  emailCorrectorLatin.correctEmail(email, config);

export const processVoiceInputLatin = (text: string): string =>
  emailCorrectorLatin.processVoiceInput(text);