# React Native Email Autocorrect - Package Summary

## Package Details
- **Name**: `react-native-email-autocorrect`
- **Version**: 1.0.0
- **Size**: ~3KB gzipped
- **Dependencies**: Zero (pure JavaScript)
- **Compatibility**: React Native 0.70+ (Old & New Architecture)
- **Node**: 18+ (tested on 18, 20, 22 LTS)

## API Overview

### Components
```tsx
import { EmailInput } from 'react-native-email-autocorrect';

<EmailInput
  placeholder="Enter your email"
  onEmailChange={(email, isValid) => console.log(email, isValid)}
  onEmailSubmit={(email) => handleSubmit(email)}
  config={{ country: 'UK' }}
/>
```

### Hooks
```tsx
import { useEmailAutocorrect } from 'react-native-email-autocorrect';

const {
  email,              // Current email value
  setEmail,           // Update email
  validation,         // { isValid, error }
  suggestion,         // { suggested, confidence, reason }
  acceptSuggestion,   // Accept the suggestion
  rejectSuggestion,   // Reject the suggestion
  isChecking          // Loading state
} = useEmailAutocorrect({ country: 'USA' });
```

### Functions
```tsx
import { correctEmail, validateEmail } from 'react-native-email-autocorrect';

// Get correction suggestion
const suggestion = correctEmail('user@gmial.com');
// Returns: { original: 'user@gmial.com', suggested: 'user@gmail.com', confidence: 0.95, reason: 'Common typo fixed' }

// Validate email format
const result = validateEmail('user@gmail.com');
// Returns: { isValid: true }
```

## What It Corrects

1. **Common Typos**
   - `gmial.com` → `gmail.com`
   - `yaho.com` → `yahoo.com`
   - `hotmial.com` → `hotmail.com`

2. **Missing Extensions**
   - `user@gmail` → `user@gmail.com`
   - `user@company` → `user@company.com`

3. **Mobile Autocorrect**
   - `Gmail.com` → `gmail.com`
   - `email.com` → `gmail.com`

4. **Regional Domains**
   - `user@yahoo` (UK) → `user@yahoo.co.uk`
   - `user@yahoo` (Canada) → `user@yahoo.ca`

## Configuration Options

```tsx
interface EmailAutocorrectConfig {
  enableSuggestions?: boolean;  // Enable suggestions (default: true)
  enableValidation?: boolean;   // Enable validation (default: true)
  customDomains?: string[];     // Company domains
  country?: string;             // User country (e.g., 'UK', 'USA')
  minConfidence?: number;       // Min confidence (0-1, default: 0.7)
  debounceMs?: number;          // Debounce delay (default: 300ms)
}
```

## File Structure
```
src/
├── components/
│   └── EmailInput.tsx        # Ready-to-use React Native component
├── core/
│   └── emailCorrector.ts     # Core correction & validation logic
├── data/
│   └── emailData.ts          # Email provider data & typo mappings
├── hooks/
│   └── useEmailAutocorrect.ts # React hook
├── utils/
│   └── regional.ts           # Regional TLD utilities
├── index.ts                  # Main exports
└── types.ts                  # TypeScript definitions
```

## Key Features

1. **Zero Dependencies** - Pure JavaScript, no native modules
2. **TypeScript** - Full type definitions included
3. **Tree-Shakeable** - Import only what you need
4. **Performance** - <1ms processing time
5. **Privacy** - All processing on-device
6. **New Architecture** - Compatible with Fabric & TurboModules

## Testing & Quality

- Unit tests with Jest
- CI/CD with GitHub Actions
- ESLint & Prettier configured
- TypeScript strict mode
- 80%+ code coverage target

## Publishing Checklist

- [x] Clean, consistent naming
- [x] Comprehensive TypeScript types
- [x] JSDoc comments on all exports
- [x] Example app included
- [x] README with clear examples
- [x] License (MIT)
- [x] GitHub repository configured
- [x] CI/CD workflows ready
- [x] Node 18+ compatibility
- [x] React Native 0.70+ support

## Quick Start

```bash
# Install
yarn add react-native-email-autocorrect

# Use in your app
import { EmailInput } from 'react-native-email-autocorrect';

<EmailInput onEmailSubmit={handleSubmit} />
```

That's it! No native setup required.