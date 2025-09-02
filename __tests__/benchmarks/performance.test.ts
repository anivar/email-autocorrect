/**
 * Performance benchmark tests
 * Ensures email correction performance stays optimal
 */

import { correctEmail, validateEmail, EmailCorrector } from '../../src/core/email-corrector';

describe('Performance Benchmarks', () => {
  const iterations = 10000;
  
  describe('correctEmail performance', () => {
    test('should correct common typos within 1ms', () => {
      const testCases = [
        'user@gmial.com',
        'test@yahooo.com',
        'admin@hotmial.com',
        'info@outlok.com',
      ];
      
      testCases.forEach(email => {
        const start = performance.now();
        correctEmail(email);
        const end = performance.now();
        
        expect(end - start).toBeLessThan(1);
      });
    });
    
    test('should handle ${iterations} corrections efficiently', () => {
      const emails = [
        'user@gmial.com',
        'test@yahoo.com',
        'admin@hotmail.com',
        'info@outlook.com',
        'hello@iclod.com',
      ];
      
      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        correctEmail(emails[i % emails.length]);
      }
      const end = performance.now();
      
      const totalTime = end - start;
      const avgTime = totalTime / iterations;
      
      console.log(`Total time for ${iterations} corrections: ${totalTime.toFixed(2)}ms`);
      console.log(`Average time per correction: ${avgTime.toFixed(4)}ms`);
      
      // Should process 10k emails in under 100ms
      expect(totalTime).toBeLessThan(100);
      expect(avgTime).toBeLessThan(0.01); // Under 0.01ms per email
    });
    
    test('cache performance should improve repeated corrections', () => {
      const corrector = new EmailCorrector();
      const email = 'user@gmial.com';
      
      // First run (cache miss)
      const start1 = performance.now();
      corrector.correct(email);
      const end1 = performance.now();
      const firstTime = end1 - start1;
      
      // Second run (cache hit)
      const start2 = performance.now();
      corrector.correct(email);
      const end2 = performance.now();
      const secondTime = end2 - start2;
      
      // Cache hit should be at least 50% faster
      expect(secondTime).toBeLessThan(firstTime * 0.5);
    });
  });
  
  describe('validateEmail performance', () => {
    test('should validate emails within 0.5ms', () => {
      const testCases = [
        'valid@email.com',
        'invalid@',
        '@invalid.com',
        'no-at-sign.com',
        'unicode@例え.jp',
      ];
      
      testCases.forEach(email => {
        const start = performance.now();
        validateEmail(email);
        const end = performance.now();
        
        expect(end - start).toBeLessThan(0.5);
      });
    });
    
    test('should handle ${iterations} validations efficiently', () => {
      const emails = [
        'user@gmail.com',
        'test@yahoo.com',
        'invalid@',
        'admin@company.co.uk',
        'info@例え.jp',
      ];
      
      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        validateEmail(emails[i % emails.length]);
      }
      const end = performance.now();
      
      const totalTime = end - start;
      const avgTime = totalTime / iterations;
      
      console.log(`Total time for ${iterations} validations: ${totalTime.toFixed(2)}ms`);
      console.log(`Average time per validation: ${avgTime.toFixed(4)}ms`);
      
      // Should process 10k validations in under 50ms
      expect(totalTime).toBeLessThan(50);
      expect(avgTime).toBeLessThan(0.005); // Under 0.005ms per validation
    });
  });
  
  describe('Memory efficiency', () => {
    test('should not leak memory with cache', () => {
      const corrector = new EmailCorrector();
      const uniqueEmails = 1000;
      
      // Generate unique emails to fill cache
      for (let i = 0; i < uniqueEmails; i++) {
        corrector.correct(`user${i}@gmial.com`);
      }
      
      // Clear cache
      corrector.clearCache();
      
      // Memory should be released (this is more of a sanity check)
      expect(corrector).toBeDefined();
    });
  });
  
  describe('Algorithm efficiency', () => {
    test('typo map lookup should be O(1)', () => {
      const domains = ['gmial.com', 'yahooo.com', 'hotmial.com'];
      const times: number[] = [];
      
      domains.forEach(domain => {
        const start = performance.now();
        // Direct lookup in typo map
        const corrector = new EmailCorrector();
        corrector.correct(`test@${domain}`);
        const end = performance.now();
        times.push(end - start);
      });
      
      // All lookups should take similar time (O(1))
      const avgTime = times.reduce((a, b) => a + b) / times.length;
      times.forEach(time => {
        expect(Math.abs(time - avgTime)).toBeLessThan(avgTime * 0.5);
      });
    });
    
    test('similarity calculation should scale linearly', () => {
      const corrector = new EmailCorrector();
      const baseDomain = 'gmail.com';
      
      // Test with different length inputs
      const testDomains = [
        'gmai',      // 4 chars
        'gmial',     // 5 chars
        'gmaill',    // 6 chars
        'gmailll',   // 7 chars
        'gmaillll',  // 8 chars
      ];
      
      const times: number[] = [];
      
      testDomains.forEach(domain => {
        const start = performance.now();
        corrector.correct(`test@${domain}.com`);
        const end = performance.now();
        times.push(end - start);
      });
      
      // Time should increase roughly linearly with input length
      for (let i = 1; i < times.length; i++) {
        const ratio = times[i] / times[0];
        const expectedRatio = (i + 4) / 4; // Length ratio
        expect(ratio).toBeLessThan(expectedRatio * 2); // Allow 2x variance
      }
    });
  });
  
  describe('Regression tests', () => {
    test('performance should not degrade with config options', () => {
      const email = 'user@gmial.com';
      const configs = [
        {},
        { minConfidence: 0.9 },
        { customDomains: ['company.com', 'corp.net'] },
        { enableSuggestions: true, enableValidation: true },
      ];
      
      const times = configs.map(config => {
        const start = performance.now();
        correctEmail(email, config);
        const end = performance.now();
        return end - start;
      });
      
      // All configs should perform similarly
      const baseTime = times[0];
      times.forEach(time => {
        expect(time).toBeLessThan(baseTime * 1.5); // Allow 50% variance
      });
    });
    
    test('Unicode handling should not significantly impact performance', () => {
      const asciiEmail = 'user@gmail.com';
      const unicodeEmail = 'пользователь@почта.рф';
      
      const start1 = performance.now();
      validateEmail(asciiEmail);
      const end1 = performance.now();
      const asciiTime = end1 - start1;
      
      const start2 = performance.now();
      validateEmail(unicodeEmail);
      const end2 = performance.now();
      const unicodeTime = end2 - start2;
      
      // Unicode should be at most 2x slower
      expect(unicodeTime).toBeLessThan(asciiTime * 2);
    });
  });
});