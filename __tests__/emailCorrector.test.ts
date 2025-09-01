/**
 * Tests for email correction logic
 */

import { correctEmail, validateEmail } from '../src/core/emailCorrector';

describe('correctEmail', () => {
  describe('typo corrections', () => {
    it('should correct common Gmail typos', () => {
      const result = correctEmail('user@gmial.com');
      expect(result).toEqual({
        original: 'user@gmial.com',
        suggested: 'user@gmail.com',
        confidence: 0.95,
        reason: 'Common typo fixed',
      });
    });

    it('should correct missing dots', () => {
      const result = correctEmail('user@gmailcom');
      expect(result).toEqual({
        original: 'user@gmailcom',
        suggested: 'user@gmail.com',
        confidence: 0.95,
        reason: 'Common typo fixed',
      });
    });

    it('should correct autocorrect capitalization', () => {
      const result = correctEmail('user@Gmail.com');
      expect(result).toEqual({
        original: 'user@Gmail.com',
        suggested: 'user@gmail.com',
        confidence: 0.95,
        reason: 'Common typo fixed',
      });
    });
  });

  describe('missing TLD handling', () => {
    it('should add .com to Gmail', () => {
      const result = correctEmail('user@gmail');
      expect(result).toEqual({
        original: 'user@gmail',
        suggested: 'user@gmail.com',
        confidence: 0.9,
        reason: 'Added missing domain extension',
      });
    });

    it('should add regional TLD for Yahoo in UK', () => {
      const result = correctEmail('user@yahoo', { country: 'UK' });
      expect(result).toEqual({
        original: 'user@yahoo',
        suggested: 'user@yahoo.co.uk',
        confidence: 0.9,
        reason: 'Added missing domain extension',
      });
    });

    it('should add .com to unknown domains', () => {
      const result = correctEmail('user@company');
      expect(result).toEqual({
        original: 'user@company',
        suggested: 'user@company.com',
        confidence: 0.7,
        reason: 'Added .com extension',
      });
    });
  });

  describe('invalid inputs', () => {
    it('should return null for empty email', () => {
      expect(correctEmail('')).toBeNull();
    });

    it('should return null for email without @', () => {
      expect(correctEmail('userexample.com')).toBeNull();
    });

    it('should return null for valid email', () => {
      expect(correctEmail('user@gmail.com')).toBeNull();
    });
  });
});

describe('validateEmail', () => {
  it('should validate correct email', () => {
    const result = validateEmail('user@example.com');
    expect(result).toEqual({ isValid: true });
  });

  it('should reject email without @', () => {
    const result = validateEmail('userexample.com');
    expect(result).toEqual({
      isValid: false,
      error: 'Email must contain @ symbol',
    });
  });

  it('should reject email without domain', () => {
    const result = validateEmail('user@');
    expect(result).toEqual({
      isValid: false,
      error: 'Email domain is missing',
    });
  });

  it('should reject email without TLD', () => {
    const result = validateEmail('user@example');
    expect(result).toEqual({
      isValid: false,
      error: 'Email domain must have extension (e.g., .com)',
    });
  });

  it('should reject empty email', () => {
    const result = validateEmail('');
    expect(result).toEqual({
      isValid: false,
      error: 'Email is required',
    });
  });
});