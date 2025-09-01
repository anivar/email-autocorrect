/**
 * Email provider data and typo mappings
 */

// Common typo fixes
export const TYPO_FIXES: Record<string, string> = {
  // Missing dots
  'gmailcom': 'gmail.com',
  'yahoocom': 'yahoo.com',
  'hotmailcom': 'hotmail.com',
  'outlookcom': 'outlook.com',
  'aolcom': 'aol.com',
  'icloudcom': 'icloud.com',
  
  // Character typos
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'tahoo.com': 'yahoo.com',
  'uahoo.com': 'yahoo.com',
  'yhaoo.com': 'yahoo.com',
  
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmeil.com': 'hotmail.com',
  
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outlokk.com': 'outlook.com',
  'autlook.com': 'outlook.com',
  'outlool.com': 'outlook.com',
  
  'aol.co': 'aol.com',
  'aoll.com': 'aol.com',
  'apl.com': 'aol.com',
  'ail.com': 'aol.com',
  
  'iclod.com': 'icloud.com',
  'icloid.com': 'icloud.com',
  'icloyd.com': 'icloud.com',
  'icould.com': 'icloud.com',
  
  // Autocorrect issues
  'Gmail.com': 'gmail.com',
  'email.com': 'gmail.com',
  'Email.com': 'gmail.com',
  'Yahoo.com': 'yahoo.com',
  'Hotmail.com': 'hotmail.com',
  'Outlook.com': 'outlook.com',
  
  // Voice input errors
  'g mail.com': 'gmail.com',
  'gee mail.com': 'gmail.com',
  'jay mail.com': 'gmail.com',
  'why ahoo.com': 'yahoo.com',
  'hot male.com': 'hotmail.com',
  'out look.com': 'outlook.com',
  'i cloud.com': 'icloud.com',
  'a o l.com': 'aol.com',
};

// Provider rules - which TLDs are valid for each provider
export const PROVIDER_RULES: Record<string, string[]> = {
  // Global providers - restricted TLDs
  'gmail': ['com'],
  'googlemail': ['com'],
  'icloud': ['com'],
  'me': ['com'],
  'mac': ['com'],
  'aol': ['com'],
  'aim': ['com'],
  'zoho': ['com'],
  'protonmail': ['com', 'ch'],
  'proton': ['me'],
  'tutanota': ['com'],
  'fastmail': ['com', 'fm'],
  'ymail': ['com'],
  'rocketmail': ['com'],
  
  // Multi-TLD providers
  'yahoo': ['com', 'co.uk', 'ca', 'com.au', 'fr', 'es', 'ie', 'co.nz', 'de', 'it', 'com.br', 'co.jp', 'co.in'],
  'hotmail': ['com', 'co.uk', 'fr', 'es', 'de', 'it', 'com.br'],
  'live': ['com', 'co.uk', 'fr', 'de', 'it', 'ca', 'com.au'],
  'outlook': ['com', 'co.uk', 'com.au', 'fr', 'es', 'de', 'it'],
  'msn': ['com'],
  
  // Regional ISPs
  'btinternet': ['com'],
  'virginmedia': ['com'],
  'sky': ['com'],
  'talktalk': ['net'],
  'orange': ['fr', 'es'],
  'free': ['fr'],
  'sfr': ['fr'],
  'laposte': ['net'],
  'wanadoo': ['fr'],
  'gmx': ['com', 'de', 'at', 'ch', 'net'],
  'web': ['de'],
  't-online': ['de'],
  'telstra': ['com.au'],
  'bigpond': ['com', 'com.au', 'net.au'],
  'optusnet': ['com.au'],
  'rogers': ['com'],
  'bell': ['net', 'ca'],
  'shaw': ['ca'],
  'telus': ['net'],
  'qq': ['com'],
  '163': ['com'],
  '126': ['com'],
  'sina': ['com'],
  'naver': ['com'],
  'hanmail': ['net'],
  'rediffmail': ['com'],
};