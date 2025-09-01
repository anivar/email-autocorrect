/**
 * Regional TLD utilities
 */

import { PROVIDER_RULES } from '../data/emailData';

const REGIONAL_PREFERENCES: Record<string, Record<string, string>> = {
  'UK': {
    'yahoo': 'co.uk',
    'hotmail': 'co.uk',
    'outlook': 'co.uk',
    'live': 'co.uk',
  },
  'Canada': {
    'yahoo': 'ca',
    'live': 'ca',
  },
  'Australia': {
    'yahoo': 'com.au',
    'outlook': 'com.au',
    'live': 'com.au',
  },
  'France': {
    'yahoo': 'fr',
    'hotmail': 'fr',
    'outlook': 'fr',
    'live': 'fr',
  },
  'Spain': {
    'yahoo': 'es',
    'hotmail': 'es',
    'outlook': 'es',
  },
  'Germany': {
    'yahoo': 'de',
    'hotmail': 'de',
    'outlook': 'de',
    'live': 'de',
  },
  'Italy': {
    'yahoo': 'it',
    'hotmail': 'it',
    'outlook': 'it',
    'live': 'it',
  },
  'Ireland': {
    'yahoo': 'ie',
  },
  'New Zealand': {
    'yahoo': 'co.nz',
  },
  'Brazil': {
    'yahoo': 'com.br',
    'hotmail': 'com.br',
  },
  'Japan': {
    'yahoo': 'co.jp',
  },
  'India': {
    'yahoo': 'co.in',
  },
};

export function getRegionalTLD(provider: string, country?: string): string {
  // If no country specified or provider not in rules, use default
  if (!country || !PROVIDER_RULES[provider]) {
    return PROVIDER_RULES[provider]?.[0] || 'com';
  }
  
  // Check if there's a regional preference
  const regionalTLD = REGIONAL_PREFERENCES[country]?.[provider];
  
  // Verify the regional TLD is valid for this provider
  if (regionalTLD && PROVIDER_RULES[provider].includes(regionalTLD)) {
    return regionalTLD;
  }
  
  // Fall back to the first valid TLD for this provider
  return PROVIDER_RULES[provider][0];
}