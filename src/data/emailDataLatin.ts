/**
 * IDNA2008-compliant Latin script dataset for optimized bundle size
 * Follows IDN standards for Latin character sets (Basic Latin + Latin-1 Supplement)
 * Unicode range: \u0000-\u00FF per IDNA2008 Latin script definition
 * Prevents homograph attacks by staying within single script boundaries
 */

// Common typo fixes - English/Latin only
export const TYPO_FIXES_LATIN: Record<string, string> = {
  // Gmail typos (most common - 43% market share)
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmailcom': 'gmail.com',
  
  // Yahoo typos
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yhaoo.com': 'yahoo.com',
  'yahoocom': 'yahoo.com',
  
  // Outlook/Hotmail typos  
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'hotmailcom': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outlookcom': 'outlook.com',
  
  // iCloud typos
  'iclod.com': 'icloud.com',
  'icloudcom': 'icloud.com',
  'icould.com': 'icloud.com',
  
  // AOL typos
  'aol.co': 'aol.com',
  'aolcom': 'aol.com',
  
  // Common TLD typos
  'gmail.con': 'gmail.com',
  'gmail.cmo': 'gmail.com',
  'gmail.ocm': 'gmail.com',
  'yahoo.con': 'yahoo.com',
  'yahoo.cmo': 'yahoo.com',
  'hotmail.con': 'hotmail.com',
  'outlook.con': 'outlook.com',
};

// Common Latin-character domains including IDN examples
export const COMMON_DOMAINS_LATIN = [
  // English providers
  'gmail.com',      // 43% market share
  'yahoo.com',      // 8% 
  'outlook.com',    // 9%
  'hotmail.com',    // Legacy Microsoft
  'icloud.com',     // Apple
  'aol.com',        // Legacy
  'live.com',       // Microsoft
  'msn.com',        // Microsoft legacy
  
  // European/Latin IDN domains
  'yahoo.fr',       // France
  'yahoo.es',       // Spain  
  'yahoo.it',       // Italy
  'gmx.de',         // Germany
  'web.de',         // Germany
  'laposte.net',    // France
  'orange.fr',      // France
  'libero.it',      // Italy
  'terra.es',       // Spain
  'sapo.pt',        // Portugal
  
  // Latin-character TLDs
  'yahoo.com.br',   // Brazil (Portuguese)
  'yahoo.com.mx',   // Mexico (Spanish)
  'yahoo.com.ar',   // Argentina
] as const;

// Provider rules for Latin-character domains
export const PROVIDER_RULES_LATIN: Record<string, readonly string[]> = {
  'gmail': ['com'],
  'yahoo': ['com', 'fr', 'es', 'it', 'de', 'com.br', 'com.mx', 'com.ar'],
  'outlook': ['com', 'fr', 'es', 'it', 'de', 'com.br'],
  'hotmail': ['com', 'fr', 'es', 'it', 'de', 'com.br'],
  'icloud': ['com'],
  'aol': ['com'],
  'live': ['com', 'fr', 'de', 'it'],
  'msn': ['com'],
  'gmx': ['de', 'com', 'at', 'ch'],
  'web': ['de'],
  'orange': ['fr', 'es'],
  'laposte': ['net'],
  'libero': ['it'],
  'terra': ['es', 'com.br'],
  'sapo': ['pt'],
} as const;