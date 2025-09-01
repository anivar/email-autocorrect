/**
 * Consolidated data registry
 * Comprehensive domain and TLD data with frequency weighting
 */

// Common email provider domains with aliases and frequency weights
export const PROVIDERS = [
  // Major global providers
  { domain: 'gmail.com', aliases: ['googlemail.com'], weight: 0.43 },
  { domain: 'yahoo.com', aliases: ['ymail.com', 'rocketmail.com'], weight: 0.08 },
  { domain: 'outlook.com', aliases: ['hotmail.com', 'live.com', 'msn.com'], weight: 0.09 },
  { domain: 'icloud.com', aliases: ['me.com', 'mac.com'], weight: 0.02 },
  { domain: 'aol.com', aliases: ['aim.com'], weight: 0.01 },
  
  // Regional variants
  { domain: 'yahoo.co.uk', weight: 0.02 },
  { domain: 'yahoo.co.in', weight: 0.01 },
  { domain: 'yahoo.in', weight: 0.01 },
  { domain: 'yahoo.fr', weight: 0.01 },
  { domain: 'hotmail.co.uk', weight: 0.01 },
  { domain: 'hotmail.fr', weight: 0.01 },
  { domain: 'gmail.de', weight: 0.01 },
  { domain: 'gmx.de', weight: 0.01 },
  { domain: 'web.de', weight: 0.01 },
  
  // Professional domains
  { domain: 'protonmail.com', aliases: ['pm.me', 'protonmail.ch'], weight: 0.005 },
  { domain: 'mail.com', weight: 0.005 },
  { domain: 'zoho.com', weight: 0.005 },
  { domain: 'fastmail.com', weight: 0.002 },
  
  // Educational/Business
  { domain: 'gmail.edu', weight: 0.001 },
  { domain: 'outlook.edu', weight: 0.001 },
];

// Direct typo mappings for instant correction
export const TYPO_MAP: Record<string, string> = {
  // Gmail typos
  'gmial.com': 'gmail.com',
  'gmali.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cmo': 'gmail.com',
  'gmail.ocm': 'gmail.com',
  'gmail.vom': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmailcom': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmeil.com': 'gmail.com',
  
  // Yahoo typos
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'yhaoo.com': 'yahoo.com',
  'yahou.com': 'yahoo.com',
  'yahho.com': 'yahoo.com',
  'yaoho.com': 'yahoo.com',
  
  // Hotmail/Outlook typos
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmali.com': 'hotmail.com',
  'hotmeil.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outlokk.com': 'outlook.com',
  'outloook.com': 'outlook.com',
  
  // iCloud typos
  'iclod.com': 'icloud.com',
  'icoud.com': 'icloud.com',
  'iclould.com': 'icloud.com',
  'icloude.com': 'icloud.com',
  
  // AOL typos
  'aol.co': 'aol.com',
  'aol.con': 'aol.com',
  'aool.com': 'aol.com',
  
  // Domain TLD typos
  'gmail.comm': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'yahoo.comm': 'yahoo.com',
  'hotmail.comm': 'hotmail.com',
};

// Comprehensive TLD list (gTLDs, ccTLDs, and modern TLDs)
export const TLD_DATA = [
  // Generic TLDs (most common)
  'com', 'net', 'org', 'edu', 'gov', 'mil', 'int',
  
  // Modern gTLDs
  'io', 'ai', 'app', 'dev', 'tech', 'xyz', 'online', 'site', 'website',
  'blog', 'shop', 'store', 'cloud', 'digital', 'email', 'social',
  
  // Business/Professional
  'biz', 'info', 'pro', 'name', 'mobi', 'tel', 'jobs', 'company',
  
  // Major ccTLDs
  'uk', 'de', 'fr', 'it', 'es', 'nl', 'be', 'ch', 'at', 'dk', 'se', 'no', 'fi',
  'ru', 'ua', 'pl', 'cz', 'sk', 'hu', 'ro', 'bg', 'gr', 'tr',
  'jp', 'cn', 'kr', 'tw', 'hk', 'sg', 'my', 'th', 'vn', 'ph', 'id',
  'in', 'pk', 'bd', 'lk', 'np',
  'au', 'nz',
  'us', 'ca', 'mx', 'br', 'ar', 'cl', 'co', 'pe', 've',
  'za', 'eg', 'ma', 'ng', 'ke', 'tn',
  'ae', 'sa', 'il', 'jo', 'qa', 'kw',
  
  // Tech-friendly ccTLDs
  'co', 'me', 'tv', 'cc', 'to', 'ly', 'am', 'fm', 'ws', 'gg', 'im',
  
  // Common second-level domains
  'co.uk', 'org.uk', 'ac.uk', 'gov.uk',
  'co.in', 'org.in', 'gov.in', 'ac.in', 'edu.in', 'net.in',
  'com.au', 'org.au', 'gov.au', 'edu.au', 'net.au',
  'co.nz', 'org.nz', 'govt.nz', 'ac.nz', 'net.nz',
  'com.br', 'org.br', 'gov.br', 'edu.br', 'net.br',
  'co.za', 'org.za', 'gov.za', 'ac.za', 'net.za',
  'co.jp', 'or.jp', 'go.jp', 'ac.jp', 'ne.jp',
  
  // IDNs (Internationalized Domain Names) - stored as punycode
  'xn--fiqs8s', // .中国 (China)
  'xn--fiqz9s', // .中國 (China traditional)
  'xn--p1ai', // .рф (Russia)
  'xn--wgbh1c', // .مصر (Egypt)
  'xn--j6w193g', // .香港 (Hong Kong)
  'xn--h2brj9c', // .भारत (India - Bharat)
  'xn--mgbbh1a71e', // .بھارت (India - Urdu)
  'xn--s9brj9c', // .ਭਾਰਤ (India - Punjabi)
  'xn--xkc2dl3a5ee0h', // .இந்தியா (India - Tamil)
  'xn--45brj9c', // .ভারত (India - Bengali)
];

// QWERTY keyboard adjacent keys for typo detection
export const KEYBOARD_MAP: Record<string, string[]> = {
  'a': ['s', 'q', 'w', 'z'],
  'b': ['v', 'n', 'g', 'h', ' '],
  'c': ['x', 'v', 'd', 'f', ' '],
  'd': ['s', 'f', 'e', 'r', 'c', 'x'],
  'e': ['w', 'r', 'd', 's', '3', '4'],
  'f': ['d', 'g', 'r', 't', 'c', 'v'],
  'g': ['f', 'h', 't', 'y', 'v', 'b'],
  'h': ['g', 'j', 'y', 'u', 'b', 'n'],
  'i': ['u', 'o', 'k', 'j', '8', '9'],
  'j': ['h', 'k', 'u', 'i', 'n', 'm'],
  'k': ['j', 'l', 'i', 'o', 'm', ','],
  'l': ['k', 'o', 'p', ';', '.'],
  'm': ['n', 'j', 'k', ',', ' '],
  'n': ['b', 'm', 'h', 'j', ' '],
  'o': ['i', 'p', 'l', 'k', '9', '0'],
  'p': ['o', 'l', '[', ';', '0', '-'],
  'q': ['w', 'a', '1', '2'],
  'r': ['e', 't', 'f', 'd', '4', '5'],
  's': ['a', 'd', 'w', 'e', 'z', 'x'],
  't': ['r', 'y', 'g', 'f', '5', '6'],
  'u': ['y', 'i', 'j', 'h', '7', '8'],
  'v': ['c', 'b', 'f', 'g', ' '],
  'w': ['q', 'e', 'a', 's', '2', '3'],
  'x': ['z', 'c', 's', 'd', ' '],
  'y': ['t', 'u', 'h', 'g', '6', '7'],
  'z': ['a', 'x', 's'],
  '.': ['l', ',', ';', '/'],
  '@': ['2', 'q', 'a'],
  '1': ['2', 'q'],
  '2': ['1', '3', 'q', 'w', '@'],
  '3': ['2', '4', 'w', 'e'],
  '4': ['3', '5', 'e', 'r'],
  '5': ['4', '6', 'r', 't'],
  '6': ['5', '7', 't', 'y'],
  '7': ['6', '8', 'y', 'u'],
  '8': ['7', '9', 'u', 'i'],
  '9': ['8', '0', 'i', 'o'],
  '0': ['9', '-', 'o', 'p'],
};