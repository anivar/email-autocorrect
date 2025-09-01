/**
 * Tests for email correction and validation logic
 */

import { correctEmail, validateEmail } from '../src/core/emailCorrector';

describe('correctEmail', () => {
  describe('Common Provider Typos', () => {
    test.each([
      // Gmail typos
      ['user@gmial.com', 'user@gmail.com'],
      ['user@gmai.com', 'user@gmail.com'],
      ['user@gmil.com', 'user@gmail.com'],
      ['user@gnail.com', 'user@gmail.com'],
      ['user@gmaill.com', 'user@gmail.com'],
      
      // Yahoo typos
      ['user@yaho.com', 'user@yahoo.com'],
      ['user@yahooo.com', 'user@yahoo.com'],
      ['user@tahoo.com', 'user@yahoo.com'],
      ['user@yhaoo.com', 'user@yahoo.com'],
      
      // Hotmail typos
      ['user@hotmial.com', 'user@hotmail.com'],
      ['user@hotmai.com', 'user@hotmail.com'],
      ['user@hotmil.com', 'user@hotmail.com'],
      ['user@hotmal.com', 'user@hotmail.com'],
      
      // Outlook typos
      ['user@outlok.com', 'user@outlook.com'],
      ['user@outloo.com', 'user@outlook.com'],
      ['user@outlokk.com', 'user@outlook.com'],
      ['user@autlook.com', 'user@outlook.com'],
      
      // iCloud typos
      ['user@iclod.com', 'user@icloud.com'],
      ['user@icloid.com', 'user@icloud.com'],
      ['user@icould.com', 'user@icloud.com'],
      
      // Typing race conditions (fast typing errors)
      ['user@gamil.com', 'user@gmail.com'],
      ['user@gmail.ocm', 'user@gmail.com'],
      ['user@gmail.cmo', 'user@gmail.com'],
      ['user@gmali.com', 'user@gmail.com'],
      ['user@yahoo.ocm', 'user@yahoo.com'],
      ['user@yaaho.com', 'user@yahoo.com'],
      ['user@hotmail.ocm', 'user@hotmail.com'],
      ['user@hotamil.com', 'user@hotmail.com'],
    ])('corrects %s to %s', (input, expected) => {
      const result = correctEmail(input);
      expect(result).toMatchObject({
        original: input,
        suggested: expected,
        confidence: 0.95,
        reason: 'Common typo fixed',
      });
    });
  });

  describe('Missing Domain Extensions', () => {
    test.each([
      ['user@gmail', 'user@gmail.com', 0.9],
      ['user@yahoo', 'user@yahoo.com', 0.9],
      ['user@hotmail', 'user@hotmail.com', 0.9],
      ['user@outlook', 'user@outlook.com', 0.9],
      ['user@icloud', 'user@icloud.com', 0.9],
      ['user@company', 'user@company.com', 0.7],
    ])('adds extension to %s → %s', (input, expected, confidence) => {
      const result = correctEmail(input);
      expect(result).toMatchObject({
        original: input,
        suggested: expected,
        confidence,
      });
    });
  });

  describe('Voice Input Errors', () => {
    test.each([
      ['user at gmail.com', 'user@gmail.com', 'Replaced "at" with @ symbol'],
      ['john at yahoo.com', 'john@yahoo.com', 'Replaced "at" with @ symbol'],
      ['user@g mail.com', 'user@gmail.com', 'Common typo fixed'],
      ['user@gee mail.com', 'user@gmail.com', 'Common typo fixed'],
      ['user@jay mail.com', 'user@gmail.com', 'Common typo fixed'],
      ['user@why ahoo.com', 'user@yahoo.com', 'Common typo fixed'],
      ['user@hot male.com', 'user@hotmail.com', 'Common typo fixed'],
      ['user@out look.com', 'user@outlook.com', 'Common typo fixed'],
      ['user@i cloud.com', 'user@icloud.com', 'Common typo fixed'],
    ])('corrects voice input "%s" to %s', (input, expected, reason) => {
      const result = correctEmail(input);
      expect(result).toMatchObject({
        original: input,
        suggested: expected,
        reason,
      });
    });
  });

  describe('Mobile Autocorrect Issues', () => {
    test.each([
      ['user@Gmail.com', 'user@gmail.com'],
      ['user@email.com', 'user@gmail.com'],
      ['user@Email.com', 'user@gmail.com'],
    ])('fixes autocorrect case %s to %s', (input, expected) => {
      const result = correctEmail(input);
      expect(result).toBeTruthy();
      expect(result?.suggested).toBe(expected);
    });

    test.each([
      ['user@Yahoo.com', 'user@yahoo.com'],
      ['user@Hotmail.com', 'user@hotmail.com'], 
      ['user@Outlook.com', 'user@outlook.com'],
    ])('fixes provider name with caps: %s to %s', (input, expected) => {
      const result = correctEmail(input);
      expect(result).toBeTruthy();
      expect(result?.suggested).toBe(expected);
    });
  });

  describe('Missing Dots in Domain', () => {
    test.each([
      ['user@gmailcom', 'user@gmail.com'],
      ['user@yahoocom', 'user@yahoo.com'],
      ['user@hotmailcom', 'user@hotmail.com'],
      ['user@outlookcom', 'user@outlook.com'],
      ['user@aolcom', 'user@aol.com'],
    ])('adds missing dot in %s', (input, expected) => {
      const result = correctEmail(input);
      expect(result).toMatchObject({
        suggested: expected,
        confidence: 0.95,
        reason: 'Common typo fixed',
      });
    });
  });

  describe('Regional Domain Suggestions', () => {
    it('suggests .co.uk for UK users', () => {
      const result = correctEmail('user@yahoo', { country: 'UK' });
      expect(result?.suggested).toBe('user@yahoo.co.uk');
    });

    it('suggests .ca for Canadian users', () => {
      const result = correctEmail('user@yahoo', { country: 'Canada' });
      expect(result?.suggested).toBe('user@yahoo.ca');
    });

    it('suggests .com.au for Australian users', () => {
      const result = correctEmail('user@yahoo', { country: 'Australia' });
      expect(result?.suggested).toBe('user@yahoo.com.au');
    });

    it('suggests .fr for French users', () => {
      const result = correctEmail('user@yahoo', { country: 'France' });
      expect(result?.suggested).toBe('user@yahoo.fr');
    });

    it('defaults to .com when no country specified', () => {
      const result = correctEmail('user@yahoo');
      expect(result?.suggested).toBe('user@yahoo.com');
    });

    it('respects valid domains even with regional preference', () => {
      const result = correctEmail('user@yahoo.com', { country: 'UK' });
      expect(result).toBeNull(); // yahoo.com is valid, no correction needed
    });
  });

  describe('Custom Domain Support', () => {
    it('recognizes custom domains with typos', () => {
      const result = correctEmail('user@comapny.com', {
        customDomains: ['company.com'],
      });
      expect(result).toMatchObject({
        suggested: 'user@company.com',
        confidence: 0.8,
        reason: 'Matched company domain',
      });
    });

    it('handles valid custom domains', () => {
      const result = correctEmail('user@company.com', {
        customDomains: ['company.com', 'acmecorp.com'],
      });
      expect(result).toBeNull(); // Valid custom domain
    });
  });

  describe('Edge Cases', () => {
    test.each([
      '',
      ' ',
      'notanemail',
      '@gmail.com',
      'user@',
      'user@@gmail.com',
      '@',
      'user',
    ])('returns null for invalid input: "%s"', (input) => {
      expect(correctEmail(input)).toBeNull();
    });

    test.each([
      'user@gmail.com',
      'user@yahoo.com',
      'user@hotmail.com',
      'user@outlook.com',
      'user@company.com',
      'user.name@gmail.com',
      'user+tag@gmail.com',
      'user_123@yahoo.co.uk',
    ])('returns null for valid email: %s', (email) => {
      expect(correctEmail(email)).toBeNull();
    });
  });
});

describe('validateEmail', () => {
  describe('Valid Email Formats', () => {
    test.each([
      'user@gmail.com',
      'user.name@gmail.com',
      'user+tag@gmail.com',
      'user_123@yahoo.co.uk',
      'user-name@company.com',
      'user123@outlook.com',
      'a@example.com',
      'test.email.with+symbol@example4u.net',
    ])('validates %s as correct', (email) => {
      expect(validateEmail(email)).toEqual({ isValid: true });
    });
  });

  describe('Invalid Email Formats', () => {
    test.each([
      ['', 'Email is required'],
      ['notanemail', 'Email must contain @ symbol'],
      ['user@', 'Email domain is missing'],
      ['@gmail.com', 'Email username is missing'],
      ['user@@gmail.com', 'Invalid email format'],
      ['user@gmail', 'Email domain must have extension (e.g., .com)'],
      ['user @gmail.com', 'Invalid email format'],
      ['user@gmail .com', 'Invalid email format'],
    ])('rejects "%s" with error: %s', (email, expectedError) => {
      const result = validateEmail(email);
      expect(result).toEqual({
        isValid: false,
        error: expectedError,
      });
    });
  });
});

describe('Performance', () => {
  it('processes emails quickly', () => {
    const start = Date.now();
    for (let i = 0; i < 1000; i++) {
      correctEmail('user@gmial.com');
      validateEmail('user@gmail.com');
    }
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100); // Should process 2000 operations in < 100ms
  });
});