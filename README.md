# React Native Email Autocorrect

[![npm version](https://img.shields.io/npm/v/react-native-email-autocorrect.svg)](https://www.npmjs.com/package/react-native-email-autocorrect)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-native-email-autocorrect)](https://bundlephobia.com/package/react-native-email-autocorrect)

Intelligent email typo correction for React Native. Zero dependencies, tree-shakeable, with accessibility built-in.

## Features

- **🎯 Smart Corrections** - Fixes common typos like "gmial.com" → "gmail.com"
- **⚡ Instant** - Zero-latency suggestions, no debounce by default
- **🌍 Global** - 1500+ TLDs, international domains (IDN/EAI)
- **🎤 Voice Ready** - Converts "at" to "@" from speech-to-text
- **♿ Accessible** - Screen reader support, keyboard navigation
- **🌳 Tree-Shakeable** - Import only what you need
- **📦 Tiny** - ~15KB minified, zero dependencies

## Installation

```bash
npm install react-native-email-autocorrect
```

No native modules. No pod install. Works everywhere React Native runs.

## Quick Start

### Option 1: Ready-to-use Component

```tsx
import { EmailInput } from 'react-native-email-autocorrect';

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
import { useEmailAutocorrect } from 'react-native-email-autocorrect';

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
import { correctEmail, validateEmail } from 'react-native-email-autocorrect';

const suggestion = correctEmail('user@gmial.com');
// { suggested: 'user@gmail.com', confidence: 0.92 }

const validation = validateEmail('user@gmail.com');
// { isValid: true }
```

## Accessibility Examples

See our [GitHub examples](https://github.com/anivar/react-native-email-autocorrect/tree/main/examples/accessibility) for accessible implementations:

- [Inline Autocomplete](https://github.com/anivar/react-native-email-autocorrect/blob/main/examples/accessibility/InlineSuggestionExample.tsx) - Gmail-style inline suggestions
- [Overlay Suggestions](https://github.com/anivar/react-native-email-autocorrect/blob/main/examples/accessibility/GmailStyleExample.tsx) - With keyboard navigation
- [Voice Input](https://github.com/anivar/react-native-email-autocorrect/blob/main/examples/accessibility/VoiceInputExample.tsx) - Optimized for speech-to-text

## API Reference

### `useEmailAutocorrect(config?)`

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

### Functions

- `correctEmail(email, config?)` - Get suggestion or null
- `validateEmail(email)` - Get validation result
- `clearCache()` - Clear suggestion cache
- `loadTLDs(tlds)` - Add custom TLDs

## Tree-Shaking

This package supports tree-shaking. Import only what you need:

```tsx
// ✅ Small - Only imports the hook
import { useEmailAutocorrect } from 'react-native-email-autocorrect';

// ✅ Smaller - Only imports one function
import { validateEmail } from 'react-native-email-autocorrect';

// ❌ Larger - Imports everything
import * as EmailAutocorrect from 'react-native-email-autocorrect';
```

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

1. **Typo Detection**: Levenshtein distance + keyboard proximity
2. **Smart Ranking**: Popular domains prioritized (Gmail 43%, Outlook 9%)
3. **Voice Handling**: "user at gmail dot com" → "user@gmail.com"
4. **IDN Support**: Full Unicode/Punycode email support

## Browser Support

Works in React Native Web and modern browsers with full accessibility.

## Contributing

PRs welcome! Please read our [contributing guide](CONTRIBUTING.md).

## License

MIT © [Anivar Aravind](https://github.com/anivar)

---

<p align="center">
  <a href="https://github.com/anivar/react-native-email-autocorrect/stargazers">⭐ Star on GitHub</a> • 
  <a href="https://github.com/anivar/react-native-email-autocorrect/issues">🐛 Report Bug</a> • 
  <a href="https://www.npmjs.com/package/react-native-email-autocorrect">📦 npm</a>
</p>