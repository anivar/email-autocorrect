/**
 * Email Correction Core
 * Instant, zero-latency email suggestions optimized for client-side performance
 * Full support for EAI, IDN, and global TLDs
 */

import { EmailSuggestion, ValidationResult, EmailAutocorrectConfig } from '../types';
import { calculateSimilarity } from '../utils/similarity';
import { TLD_DATA, TYPO_MAP, PROVIDERS, KEYBOARD_MAP } from '../data/registry';

export class EmailCorrector {
  private additionalTLDs = new Set<string>();
  private knownDomainsSet: Set<string>;
  
  private readonly ASCII_EMAIL_REGEX = /^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~]+(\.[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
  private readonly UNICODE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly AT_PATTERN = /\s+at\s+/i;
  
  constructor() {
    // Pre-compute known domains for O(1) lookup
    this.knownDomainsSet = new Set();
    PROVIDERS.forEach(p => {
      this.knownDomainsSet.add(p.domain.toLowerCase());
      p.aliases?.forEach(alias => this.knownDomainsSet.add(alias.toLowerCase()));
    });
  }

  correct(email: string, config: EmailAutocorrectConfig = {}): EmailSuggestion | null {
    if (!email || email.length < 3) return null;

    // Fast path: Handle voice input
    let processedEmail = email.trim();
    let voiceInputCorrected = false;
    
    if (this.AT_PATTERN.test(processedEmail) && !processedEmail.includes('@')) {
      processedEmail = processedEmail.replace(this.AT_PATTERN, '@');
      voiceInputCorrected = true;
    }

    if (!processedEmail.includes('@')) return null;

    const [username, domain] = processedEmail.split('@');
    if (!username || !domain) return null;

    // If we only fixed voice input, return that
    if (voiceInputCorrected && this.validate(processedEmail).isValid) {
      return {
        original: email,
        suggested: processedEmail,
        confidence: 0.95,
        reason: 'Fixed voice input (at → @)'
      };
    }

    // Fast path: Direct typo lookup (O(1))
    const domainLower = domain.toLowerCase();
    const typoFix = TYPO_MAP[domainLower];
    if (typoFix) {
      return {
        original: email,
        suggested: `${username}@${typoFix}`,
        confidence: 0.95,
        reason: 'Common typo'
      };
    }
    
    // Fast path: Already valid domain
    if (this.knownDomainsSet.has(domainLower)) {
      return null;
    }
    
    // Domain suggestion
    const suggestion = this.suggestDomain(domainLower, config);
    
    if (suggestion) {
      return {
        original: email,
        suggested: `${username}@${suggestion.domain}`,
        confidence: suggestion.confidence,
        reason: suggestion.reason
      };
    }
    
    return null;
  }

  validate(email: string): ValidationResult {
    if (!email || !email.trim()) {
      return { isValid: false, error: 'Email is required' };
    }
    
    const trimmed = email.trim();
    
    // Fast @ validation
    const atIndex = trimmed.indexOf('@');
    if (atIndex === -1) return { isValid: false, error: 'Email must contain @ symbol' };
    if (atIndex === 0) return { isValid: false, error: 'Email username is required' };
    if (trimmed.indexOf('@', atIndex + 1) !== -1) return { isValid: false, error: 'Email can only contain one @ symbol' };
    
    const localPart = trimmed.substring(0, atIndex);
    const domainPart = trimmed.substring(atIndex + 1);
    
    // Length checks
    if (localPart.length > 64) return { isValid: false, error: 'Email username too long (max 64 characters)' };
    if (!domainPart) return { isValid: false, error: 'Email domain is missing' };
    if (domainPart.length > 255) return { isValid: false, error: 'Email domain too long (max 255 characters)' };
    
    // Domain must have extension
    if (!domainPart.includes('.')) {
      return { isValid: false, error: 'Email domain must have extension (e.g., .com)' };
    }
    
    // Fast validation paths
    if (!this.isValidLocalPart(localPart)) {
      return { isValid: false, error: 'Invalid characters in email username' };
    }
    
    if (!this.isValidDomain(domainPart)) {
      return { isValid: false, error: 'Invalid email domain format' };
    }
    
    // Final regex validation - dual approach for EAI compliance
    const hasUnicode = this.hasUnicodeCharacters(trimmed);
    const isValid = hasUnicode 
      ? this.UNICODE_EMAIL_REGEX.test(trimmed)
      : this.ASCII_EMAIL_REGEX.test(trimmed);
    
    return isValid 
      ? { isValid: true }
      : { isValid: false, error: 'Invalid email format' };
  }

  private isValidLocalPart(localPart: string): boolean {
    // Fast invalid pattern checks
    if (localPart[0] === '.' || localPart[localPart.length - 1] === '.') return false;
    if (localPart.includes('..')) return false;
    
    // Allow Unicode (EAI) or valid ASCII pattern
    if (this.hasUnicodeCharacters(localPart)) return true;
    
    return /^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~]+(\.[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~]+)*$/.test(localPart) ||
           /^"([^"\\]|\\.)*"$/.test(localPart);
  }

  private isValidDomain(domain: string): boolean {
    const labels = domain.split('.');
    
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      if (!label || label.length > 63) return false;
      
      // Allow Unicode (IDN) or valid ASCII
      if (!this.hasUnicodeCharacters(label) && 
          !/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(label)) {
        return false;
      }
    }
    
    return true;
  }

  private hasUnicodeCharacters(str: string): boolean {
    // Fast ASCII check
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127) return true;
    }
    return false;
  }

  private suggestDomain(domain: string, config: EmailAutocorrectConfig): {domain: string, confidence: number, reason: string} | null {
    let bestMatch = { domain: '', score: 0, reason: '' };
    
    // Fast path: Missing TLD
    if (!domain.includes('.')) {
      const withCom = `${domain}.com`;
      if (this.knownDomainsSet.has(withCom)) {
        return { domain: withCom, confidence: 0.9, reason: 'Added .com' };
      }
    }

    // Include custom domains if provided
    const allProviders = [...PROVIDERS];
    if (config.customDomains) {
      config.customDomains.forEach(d => {
        allProviders.push({ domain: d.toLowerCase(), weight: 0.01 });
      });
    }

    // Check popular providers
    for (let i = 0; i < allProviders.length; i++) {
      const provider = allProviders[i];
      
      // Skip if lengths differ too much
      if (Math.abs(domain.length - provider.domain.length) > 2) continue;
      
      const levScore = calculateSimilarity(domain, provider.domain);
      if (levScore > 0.85) {
        const keyScore = this.calculateKeyboardScore(domain, provider.domain);
        const combinedScore = (levScore * 0.7) + (keyScore * 0.3);
        
        if (combinedScore > bestMatch.score) {
          bestMatch = {
            domain: provider.domain,
            score: combinedScore,
            reason: keyScore > levScore ? 'Keyboard typing error' : 'Similar domain'
          };
        }
      }
      
      // Check aliases if main domain didn't match well
      if (bestMatch.score < 0.85 && provider.aliases) {
        for (let j = 0; j < provider.aliases.length; j++) {
          const alias = provider.aliases[j];
          const aliasScore = calculateSimilarity(domain, alias);
          if (aliasScore > bestMatch.score && aliasScore > 0.85) {
            bestMatch = { domain: alias, score: aliasScore, reason: 'Known email provider' };
          }
        }
      }
    }

    // TLD corrections (only if we haven't found a good match)
    if (bestMatch.score < 0.85 && domain.includes('.')) {
      const dotIndex = domain.lastIndexOf('.');
      const name = domain.substring(0, dotIndex);
      const tld = domain.substring(dotIndex + 1);
      
      // Check all TLDs including dynamically loaded ones
      const allTLDs = [...TLD_DATA, ...Array.from(this.additionalTLDs)];
      
      for (let i = 0; i < allTLDs.length && i < 50; i++) {
        const validTld = allTLDs[i];
        if (Math.abs(tld.length - validTld.length) <= 1) {
          const score = calculateSimilarity(tld, validTld);
          if (score > 0.8) {
            const candidate = `${name}.${validTld}`;
            if (this.knownDomainsSet.has(candidate) && score > bestMatch.score) {
              bestMatch = { domain: candidate, score, reason: 'TLD correction' };
            }
          }
        }
      }
    }

    return bestMatch.score > 0.8 
      ? { domain: bestMatch.domain, confidence: bestMatch.score, reason: bestMatch.reason }
      : null;
  }

  private isKnownDomain(domain: string): boolean {
    return this.knownDomainsSet.has(domain.toLowerCase());
  }


  /**
   * Load TLDs from IANA or custom source
   * Supports dynamic loading of gTLDs, ccTLDs, and IDNs
   * @param source - Optional URL to fetch TLD list (defaults to IANA)
   */
  async loadTLDs(source?: string): Promise<void> {
    try {
      const url = source || 'https://data.iana.org/TLD/tlds-alpha-by-domain.txt';
      const response = await fetch(url);
      const text = await response.text();
      
      // Parse IANA format (skip comments)
      const tlds = text
        .split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(tld => tld.toLowerCase().trim());
      
      // Add to our TLD set
      tlds.forEach(tld => this.additionalTLDs.add(tld));
    } catch (error) {
      console.warn('Failed to load TLDs from IANA:', error);
    }
  }

  /**
   * Check if a TLD is valid (including dynamically loaded ones)
   */
  private isValidTLD(tld: string): boolean {
    return TLD_DATA.includes(tld) || this.additionalTLDs.has(tld.toLowerCase());
  }

  private calculateKeyboardScore(input: string, candidate: string): number {
    if (input === candidate) return 1;
    
    const lenDiff = Math.abs(input.length - candidate.length);
    if (lenDiff > 1) return 0;
    
    let distance = lenDiff;
    const minLen = Math.min(input.length, candidate.length);
    
    for (let i = 0; i < minLen; i++) {
      if (input[i] === candidate[i]) continue;
      
      const inputLower = input[i].toLowerCase();
      const candidateLower = candidate[i].toLowerCase();
      
      if (inputLower === candidateLower) continue;
      
      // Check keyboard adjacency
      const adjacent = KEYBOARD_MAP[inputLower];
      distance += (adjacent && adjacent.includes(candidateLower)) ? 0.5 : 1;
    }
    
    const maxLen = Math.max(input.length, candidate.length);
    return Math.max(0, (maxLen - distance) / maxLen);
  }
}

// Singleton instance
const corrector = new EmailCorrector();

// Exported functions
export const correctEmail = (email: string, config?: EmailAutocorrectConfig) => corrector.correct(email, config);
export const validateEmail = (email: string) => corrector.validate(email);
export const loadTLDs = (source?: string) => corrector.loadTLDs(source);