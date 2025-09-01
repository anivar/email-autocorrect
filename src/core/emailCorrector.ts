/**
 * Core email correction and validation logic
 * 
 * This module provides the main functions for:
 * - Detecting and correcting email typos
 * - Validating email format
 * - Suggesting domain corrections based on context
 */

import { EmailSuggestion, ValidationResult, EmailAutocorrectConfig } from '../types';
import { TYPO_FIXES, PROVIDER_RULES } from '../data/emailData';
import { getRegionalTLD } from '../utils/regional';

// Standard email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Analyzes an email address and suggests corrections for common typos
 * 
 * @param email - The email address to check
 * @param config - Optional configuration for regional preferences
 * @returns A suggestion object if a correction is found, null otherwise
 * 
 * @example
 * correctEmail('user@gmial.com') 
 * // Returns: { suggested: 'user@gmail.com', confidence: 0.95, reason: 'Common typo fixed' }
 */
export function correctEmail(
  email: string,
  config: EmailAutocorrectConfig = {}
): EmailSuggestion | null {
  // Early return for invalid input
  if (!email) return null;
  
  // Handle voice input "at" → "@" replacement
  let processedEmail = email.trim();
  let atReplaced = false;
  if (processedEmail.toLowerCase().includes(' at ') && !processedEmail.includes('@')) {
    processedEmail = processedEmail.replace(/ at /i, '@');
    atReplaced = true;
  }
  
  if (!processedEmail.includes('@')) return null;
  
  // Parse email into username and domain parts
  const parts = processedEmail.split('@');
  if (parts.length !== 2) return null;
  
  let [username, domain] = parts;
  if (!username || !domain) return null;
  
  // Check typo fixes with original case
  if (TYPO_FIXES[domain]) {
    return {
      original: email,
      suggested: `${username.toLowerCase()}@${TYPO_FIXES[domain]}`,
      confidence: 0.95,
      reason: 'Common typo fixed'
    };
  }
  
  // Convert to lowercase for further processing
  username = username.toLowerCase();
  domain = domain.toLowerCase();
  
  // If we only replaced "at" and the rest is valid, return that suggestion
  if (atReplaced && EMAIL_REGEX.test(`${username}@${domain}`)) {
    return {
      original: email,
      suggested: `${username}@${domain}`,
      confidence: 0.9,
      reason: 'Replaced "at" with @ symbol'
    };
  }
  
  // Check direct typo fixes for lowercase domain
  if (TYPO_FIXES[domain]) {
    return {
      original: email,
      suggested: `${username}@${TYPO_FIXES[domain]}`,
      confidence: 0.95,
      reason: 'Common typo fixed'
    };
  }
  
  // Handle missing TLD
  if (!domain.includes('.')) {
    const provider = domain;
    
    // Known provider
    if (PROVIDER_RULES[provider]) {
      const tld = getRegionalTLD(provider, config.country);
      return {
        original: email,
        suggested: `${username}@${provider}.${tld}`,
        confidence: 0.9,
        reason: 'Added missing domain extension'
      };
    }
    
    // Unknown provider - suggest .com
    return {
      original: email,
      suggested: `${username}@${domain}.com`,
      confidence: 0.7,
      reason: 'Added .com extension'
    };
  }
  
  // Check for wrong TLD on known provider
  const [provider, ...tldParts] = domain.split('.');
  const tld = tldParts.join('.');
  
  if (PROVIDER_RULES[provider]) {
    const validTLDs = PROVIDER_RULES[provider];
    if (!validTLDs.includes(tld)) {
      const preferredTLD = getRegionalTLD(provider, config.country);
      return {
        original: email,
        suggested: `${username}@${provider}.${preferredTLD}`,
        confidence: 0.85,
        reason: 'Corrected domain extension'
      };
    }
  }
  
  // Check custom domains if provided
  if (config.customDomains && config.customDomains.length > 0) {
    for (const customDomain of config.customDomains) {
      // Skip if it's an exact match (already valid)
      if (domain === customDomain) continue;
      
      if (isCloseMatch(domain, customDomain)) {
        return {
          original: email,
          suggested: `${username}@${customDomain}`,
          confidence: 0.8,
          reason: 'Matched company domain'
        };
      }
    }
  }
  
  return null;
}

/**
 * Validates an email address format and provides specific error messages
 * 
 * @param email - The email address to validate
 * @returns Validation result with isValid flag and error message if invalid
 * 
 * @example
 * validateEmail('user@gmail.com') // Returns: { isValid: true }
 * validateEmail('user@gmail') // Returns: { isValid: false, error: 'Email domain must have extension (e.g., .com)' }
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!email.includes('@')) {
    return { isValid: false, error: 'Email must contain @ symbol' };
  }
  
  const parts = email.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  const [username, domain] = parts;
  
  if (!username) {
    return { isValid: false, error: 'Email username is missing' };
  }
  
  if (!domain) {
    return { isValid: false, error: 'Email domain is missing' };
  }
  
  if (!domain.includes('.')) {
    return { isValid: false, error: 'Email domain must have extension (e.g., .com)' };
  }
  
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true };
}

function isCloseMatch(str1: string, str2: string): boolean {
  if (str1 === str2) return true;
  if (Math.abs(str1.length - str2.length) > 2) return false;
  
  // Simple edit distance check
  let differences = 0;
  for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
    if (str1[i] !== str2[i]) differences++;
    if (differences > 2) return false;
  }
  
  return true;
}