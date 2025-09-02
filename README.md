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

Intelligent email typo correction for React Native, React, and Next.js. Zero dependencies, tree-shakeable, with accessibility built-in.

## Features

- **🎯 Smart Corrections** - Fixes common typos like "gmial.com" → "gmail.com"
- **⚡ Instant** - Zero-latency suggestions, no debounce by default
- **🌍 Global** - 1500+ TLDs, international domains (IDN/EAI)
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
```

## Framework Examples

### React Native
- [Inline Autocomplete](https://github.com/anivar/email-autocorrect/blob/main/examples/accessibility/InlineSuggestionExample.tsx) - Gmail-style inline suggestions
- [Overlay Suggestions](https://github.com/anivar/email-autocorrect/blob/main/examples/accessibility/GmailStyleExample.tsx) - With keyboard navigation
- [Voice Input](https://github.com/anivar/email-autocorrect/blob/main/examples/accessibility/VoiceInputExample.tsx) - Optimized for speech-to-text
- [Enterprise Styling](https://github.com/anivar/email-autocorrect/blob/main/examples/customization/EnterpriseExample.tsx) - Corporate email validation

### React Web
- [Web Component](https://github.com/anivar/email-autocorrect/blob/main/examples/web/EmailInput.tsx) - Pure React implementation
- [Custom Hook](https://github.com/anivar/email-autocorrect/blob/main/examples/web/useEmailAutocorrect.ts) - Web-compatible hook

### Next.js
- [Form Example](https://github.com/anivar/email-autocorrect/blob/main/examples/nextjs/EmailFormExample.tsx) - Server & client components
- Works with App Router and Pages Router
- SSR/SSG compatible

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
import { useEmailAutocorrect } from 'email-autocorrect';

// ✅ Smaller - Only imports one function
import { validateEmail } from 'email-autocorrect';

// ❌ Larger - Imports everything
import * as EmailAutocorrect from 'email-autocorrect';
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
  <a href="https://github.com/anivar/email-autocorrect/stargazers">⭐ Star on GitHub</a> • 
  <a href="https://github.com/anivar/email-autocorrect/issues">🐛 Report Bug</a> • 
  <a href="https://www.npmjs.com/package/email-autocorrect">📦 npm</a>
</p>