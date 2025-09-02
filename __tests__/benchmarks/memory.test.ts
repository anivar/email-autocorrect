/**
 * Memory usage tests
 * Ensures the library maintains low memory footprint
 */

import { EmailCorrector } from '../../src/core/email-corrector';

describe('Memory Usage Tests', () => {
  test('should handle large batches without memory issues', () => {
    const corrector = new EmailCorrector();
    const batchSize = 50000;
    
    // Process large batch
    const startMemory = process.memoryUsage().heapUsed;
    
    for (let i = 0; i < batchSize; i++) {
      // Use different emails to avoid cache
      corrector.correct(`user${i % 1000}@gmial.com`);
    }
    
    const endMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = (endMemory - startMemory) / 1024 / 1024; // MB
    
    console.log(`Memory increase for ${batchSize} operations: ${memoryIncrease.toFixed(2)}MB`);
    
    // Should use less than 50MB for 50k operations
    expect(memoryIncrease).toBeLessThan(50);
    
    // Clear cache
    corrector.clearCache();
  });
  
  test('cache should have reasonable memory limits', () => {
    const corrector = new EmailCorrector();
    const uniqueEmails = 10000;
    
    const startMemory = process.memoryUsage().heapUsed;
    
    // Fill cache with unique entries
    for (let i = 0; i < uniqueEmails; i++) {
      corrector.correct(`unique${i}@domain${i}.com`);
    }
    
    const endMemory = process.memoryUsage().heapUsed;
    const cacheMemory = (endMemory - startMemory) / 1024 / 1024; // MB
    
    console.log(`Cache memory for ${uniqueEmails} unique entries: ${cacheMemory.toFixed(2)}MB`);
    
    // Cache should use less than 10MB for 10k entries
    expect(cacheMemory).toBeLessThan(10);
  });
});