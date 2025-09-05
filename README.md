# Email Autocorrect

[![npm version](https://img.shields.io/npm/v/email-autocorrect.svg)](https://www.npmjs.com/package/email-autocorrect)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/email-autocorrect)](https://bundlephobia.com/package/email-autocorrect)

### Standards Compliance
[![EAI Compliant](https://img.shields.io/badge/EAI-Compliant-brightgreen)](https://tools.ietf.org/html/rfc6531)
[![IDN Support](https://img.shields.io/badge/IDN-Support-brightgreen)](https://www.icann.org/resources/pages/idn-2012-02-25-en)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG_2.1-AA-brightgreen)](https://www.w3.org/WAI/WCAG21/quickref/)
[![WAI-ARIA](https://img.shields.io/badge/WAI--ARIA-Compliant-brightgreen)](https://www.w3.org/TR/wai-aria-1.2/)
[![Unicode Ready](https://img.shields.io/badge/Unicode-Ready-brightgreen)](https://unicode.org/standard/standard.html)

Intelligent email typo correction for React Native, React, and Next.js. Unicode-first with full EAI/IDN support. Zero dependencies, tree-shakeable, with accessibility built-in.

## Features

- **🌍 Unicode First** - Full EAI compliance for global email addresses
- **🌐 IDN Support** - Internationalized domain names (中文.公司, भारत.भारत)
- **🎯 Smart Corrections** - Fixes 40+ common typos like "gmial.com" → "gmail.com"
- **⚡ Instant** - Zero-latency suggestions, no debounce by default
- **🎤 Voice Ready** - Converts "at" to "@" from speech-to-text
- **♿ Accessible** - Screen reader support, keyboard navigation
- **🌳 Tree-Shakeable** - Import only what you need
- **📦 Tiny** - ~10KB minified + gzipped, zero dependencies

## Installation

```bash
npm install email-autocorrect
```

Works with React Native, React web, Next.js, and any JavaScript framework. No native dependencies.

## Quick Start

### Option 1: Ready-to-use Component

```tsx
import { EmailInput } from 'email-autocorrect';

<EmailInput
  onEmailChange={(email, isValid) => {
    console.log(email, isValid);
  }}
  onEmailSubmit={(email) => {
    // Handle submission
  }}
/>
```

### Option 2: Hook Only (Smaller Bundle)

```tsx
import { useEmailAutocorrect } from 'email-autocorrect';

function MyEmailInput() {
  const { email, setEmail, suggestion, acceptSuggestion } = useEmailAutocorrect();
  
  return (
    <TextInput
      value={email}
      onChangeText={setEmail}
      placeholder={suggestion?.suggested}
    />
  );
}
```

### Option 3: Functions Only (Smallest Bundle)

```tsx
import { correctEmail, validateEmail } from 'email-autocorrect';

const suggestion = correctEmail('user@gmial.com');
// { suggested: 'user@gmail.com', confidence: 0.92 }

const validation = validateEmail('user@gmail.com');
// { isValid: true }

// Full Unicode/EAI support
validateEmail('用户@例え.jp');  // { isValid: true }
validateEmail('अनिवार@भारत.भारत');  // { isValid: true }
validateEmail('info@münchen.de');  // { isValid: true }
```

## Examples

### React Native

```tsx
import { useEmailAutocorrect } from 'email-autocorrect';
import { TextInput, View, Text } from 'react-native';

function EmailField() {
  const { email, setEmail, suggestion, validation } = useEmailAutocorrect();
  
  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {suggestion && (
        <Text onPress={() => setEmail(suggestion.suggested)}>
          Did you mean: {suggestion.suggested}?
        </Text>
      )}
      {validation.error && <Text>{validation.error}</Text>}
    </View>
  );
}
```

### React Web

```tsx
import { EmailInput } from 'email-autocorrect';

function SignupForm() {
  return (
    <EmailInput
      onEmailChange={(email, isValid) => {
        console.log('Email:', email, 'Valid:', isValid);
      }}
      placeholder="Enter your email"
      className="email-input"
    />
  );
}
```

### Next.js

```tsx
'use client';
import { correctEmail, validateEmail } from 'email-autocorrect';

export function EmailForm() {
  const handleSubmit = (email: string) => {
    // Validate first
    const validation = validateEmail(email);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }
    
    // Check for typos
    const suggestion = correctEmail(email);
    if (suggestion) {
      if (confirm(`Did you mean ${suggestion.suggested}?`)) {
        email = suggestion.suggested;
      }
    }
    
    // Submit email
    console.log('Submitting:', email);
  };
  
  return (/* your form JSX */);
}
```

### Using Latin Version for Optimization

```tsx
// Import Latin version for smaller bundle
import { 
  correctEmailLatin, 
  validateEmailLatin,
  processVoiceInputLatin 
} from 'email-autocorrect';

// React Native voice input example
function VoiceEmailInput() {
  const [voiceText, setVoiceText] = useState('');
  
  const handleVoiceInput = (text: string) => {
    // Convert voice to email format
    const email = processVoiceInputLatin(text);
    setVoiceText(email);
    
    // Validate and correct
    if (validateEmailLatin(email).isValid) {
      const suggestion = correctEmailLatin(email);
      if (suggestion) {
        setVoiceText(suggestion.suggested);
      }
    }
  };
  
  return (/* your component */);
}
```

## API Reference

### React Hook

#### `useEmailAutocorrect(config?)`

```tsx
const {
  email,              // Current email value
  setEmail,           // Update email
  validation,         // { isValid, error? }
  suggestion,         // { suggested, confidence, reason }
  acceptSuggestion,   // Accept current suggestion
  rejectSuggestion,   // Dismiss suggestion
  isChecking          // Loading state
} = useEmailAutocorrect({
  debounceMs: 0,      // Delay before showing suggestions (default: 0)
  minConfidence: 0.7, // Minimum confidence threshold
  domains: ['custom.com'], // Additional custom domains
});
```

### Validation Functions

#### `validateEmail(email: string)`
Returns validation result with detailed error messages:
```tsx
{ isValid: true } 
// or
{ isValid: false, error: 'Email domain is required' }
```

#### `validateEmailLatin(email: string)`
Latin-script only validation following IDNA2008:
```tsx
{ isValid: true }
// or  
{ isValid: false, error: 'Only Latin script characters allowed (IDNA2008)' }
```

### Correction Functions

#### `correctEmail(email: string, config?)`
Returns suggestion or null if email is valid:
```tsx
{
  original: 'user@gmial.com',
  suggested: 'user@gmail.com',
  confidence: 0.95,
  reason: 'Common typo'
}
```

#### `correctEmailLatin(email: string, config?)`
Latin-script optimized correction:
```tsx
{
  original: 'user@hotmial.com',
  suggested: 'user@hotmail.com',
  confidence: 0.95,
  reason: 'Common typo'
}
```

### Voice Input Processing

#### `processVoiceInputLatin(text: string)`
Converts voice text to email format:
```tsx
processVoiceInputLatin('john smith at gmail dot com')
// Returns: 'johnsmith@gmail.com'
```

### TLD Management

#### `loadTLDs(source?: string)`
Load TLD list from IANA or custom source:
```tsx
// Load from IANA (default)
await loadTLDs();

// Load from custom URL
await loadTLDs('https://your-api.com/tlds.txt');
```


### Core Functions

#### Full Unicode Version (Default)
- `correctEmail(email, config?)` - Get typo suggestions with confidence score
- `validateEmail(email)` - Validate email format with detailed errors
- `loadTLDs(source?)` - Load TLDs from IANA or custom source

#### Latin Optimized Version
- `correctEmailLatin(email, config?)` - Latin-script typo correction
- `validateEmailLatin(email)` - IDNA2008 Latin script validation  
- `processVoiceInputLatin(text)` - Convert voice text to email format

#### Advanced Classes
- `EmailCorrector` - Full Unicode email corrector class
- `EmailCorrectorLatin` - Latin-script optimized corrector class

## Tree-Shaking

This package supports tree-shaking. Import only what you need:

```tsx
// ✅ Small - Only imports the hook
import { useEmailAutocorrect } from 'email-autocorrect';

// ✅ Smaller - Only imports one function
import { validateEmail } from 'email-autocorrect';

// ❌ Larger - Imports everything
import * as EmailAutocorrect from 'email-autocorrect';
```

### IDNA2008-Compliant Latin Script Version

For applications targeting Latin script markets, we offer an IDNA2008-compliant version that reduces bundle size by 50% (32 typo fixes, 21 domains):

```tsx
// ~6KB instead of ~10KB - IDNA2008 Latin script optimized
import { correctEmailLatin, validateEmailLatin, processVoiceInputLatin } from 'email-autocorrect';

// Same API as main version
const suggestion = correctEmailLatin('user@gmial.com');
// { suggested: 'user@gmail.com', confidence: 0.95 }

const validation = validateEmailLatin('user@gmail.com');
// { isValid: true }

// Voice input processing
const email = processVoiceInputLatin('user at gmail dot com');
// 'user@gmail.com'

// IDNA2008-compliant Latin-1 Supplement support
validateEmailLatin('josé@españa.es');  // { isValid: true }
validateEmailLatin('françois@société.fr');  // { isValid: true }
```

This version follows IDNA2008 standards:
- **IDN-compliant**: Follows IDNA2008 Latin script boundaries  
- **Anti-spoofing**: Prevents homograph attacks by enforcing single script
- **Latin-1 Support**: Full Latin-1 Supplement (àáâãäå, ñ, ç, etc.)
- **Coverage**: 32 typo fixes, 21 common domains, 10 TLDs
- **Optimized size**: 50% smaller bundle (5.96KB vs 11.93KB unminified)

## Configuration

```tsx
const config = {
  // Debounce delay (ms)
  debounceMs: 0,
  
  // Minimum confidence (0-1)
  minConfidence: 0.7,
  
  // Country hint for better suggestions
  country: 'UK',
  
  // Custom domains to recognize
  customDomains: ['company.com'],
  
  // Enable/disable features
  enableSuggestions: true,
  enableValidation: true,
};
```

## How It Works

1. **Unicode-First Design**: Full EAI/IDN support for global email addresses
2. **Typo Detection**: Levenshtein distance + keyboard proximity analysis
3. **Smart Ranking**: Popular domains prioritized (Gmail 43%, Outlook 9%)
4. **Voice Handling**: "user at gmail dot com" → "user@gmail.com"
5. **Any Domain Support**: Works with all domains, not limited to a preset list

## IANA TLD Support (Optional)

For complete TLD validation, optionally load the official IANA TLD list:

```tsx
import { loadTLDs, validateEmail } from 'email-autocorrect';

// Load official IANA TLDs
await loadTLDs(); // Uses default IANA source

// Or specify custom source (must follow IANA format)
await loadTLDs('https://your-domain.com/custom-tlds.txt');

// Now validates against all IANA TLDs including IDN
validateEmail('user@example.みんな');  // Japanese TLD
validateEmail('info@company.संगठन');   // Hindi TLD
validateEmail('contact@site.中国');    // Chinese TLD
```

The IANA list includes:
- **gTLDs**: .com, .org, .net, .info, etc.
- **ccTLDs**: .uk, .de, .jp, .br, etc.
- **IDN TLDs**: .中国, .भारत, .みんな, etc.
- **New gTLDs**: .photography, .technology, .amsterdam, etc.

## Browser Support

Works in React Native Web and modern browsers with full accessibility.

## Contributing

PRs welcome! Please read our [contributing guide](CONTRIBUTING.md).

## License

MIT © [Anivar Aravind](https://github.com/anivar)

---

<p align="center">
  <a href="https://github.com/anivar/email-autocorrect/stargazers">⭐ Star on GitHub</a> • 
  <a href="https://github.com/anivar/email-autocorrect/issues">🐛 Report Bug</a> • 
  <a href="https://www.npmjs.com/package/email-autocorrect">📦 npm</a>
</p>