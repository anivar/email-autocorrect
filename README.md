# React Native Email Autocorrect

[![npm version](https://img.shields.io/npm/v/react-native-email-autocorrect.svg)](https://www.npmjs.com/package/react-native-email-autocorrect)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/anivar/react-native-email-autocorrect/actions/workflows/ci.yml/badge.svg)](https://github.com/anivar/react-native-email-autocorrect/actions/workflows/ci.yml)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-native-email-autocorrect)](https://bundlephobia.com/package/react-native-email-autocorrect)
[![New Architecture](https://img.shields.io/badge/New%20Architecture-Compatible-brightgreen)](https://reactnative.dev/docs/the-new-architecture/landing-page)

A lightweight, zero-dependency email validation and autocorrection library for React Native. Catches common email typos and suggests corrections in real-time. **Fully compatible with React Native's New Architecture (Fabric & TurboModules).**

## Features

- 🔧 **Smart Autocorrection** - Fixes common typos like "gmial.com" → "gmail.com"
- ✅ **Real-time Validation** - Instant feedback on email format
- 🌍 **Regional Support** - Suggests appropriate TLDs based on location
- 📱 **Mobile Optimized** - Handles autocorrect and voice input errors
- 🎯 **High Accuracy** - Only suggests corrections with high confidence
- 🪶 **Lightweight** - ~3KB gzipped, zero dependencies
- 🔒 **Privacy First** - All processing happens on-device

## Requirements

- React Native 0.70+
- React 18+
- Works with both Old and New Architecture
- No native code = No pod install needed!

## Installation

```bash
npm install react-native-email-autocorrect
# or
yarn add react-native-email-autocorrect
# or
pnpm add react-native-email-autocorrect
```

**That's it!** No native code means no `pod install` or rebuilding needed.

## Quick Start

### Using the Component

```tsx
import { EmailInput } from 'react-native-email-autocorrect';

function SignupForm() {
  return (
    <EmailInput
      placeholder="Enter your email"
      onEmailChange={(email, isValid) => {
        console.log('Email:', email, 'Valid:', isValid);
      }}
      onEmailSubmit={(email) => {
        // Handle form submission
      }}
    />
  );
}
```

### Using the Hook

```tsx
import { useEmailAutocorrect } from 'react-native-email-autocorrect';

function CustomEmailInput() {
  const {
    email,
    setEmail,
    validation,
    suggestion,
    acceptSuggestion,
  } = useEmailAutocorrect();

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      
      {validation.error && (
        <Text style={{ color: 'red' }}>{validation.error}</Text>
      )}
      
      {suggestion && (
        <TouchableOpacity onPress={acceptSuggestion}>
          <Text>Did you mean {suggestion.suggested}?</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
```

### Direct Usage

```tsx
import { correctEmail, validateEmail } from 'react-native-email-autocorrect';

// Check for typos
const suggestion = correctEmail('user@gmial.com');
// { suggested: 'user@gmail.com', confidence: 0.95, reason: 'Common typo fixed' }

// Validate format
const validation = validateEmail('user@gmail.com');
// { isValid: true }
```

## What It Corrects

### Common Typos
- `gmial.com` → `gmail.com`
- `yaho.com` → `yahoo.com`
- `hotmial.com` → `hotmail.com`

### Missing Extensions
- `john@gmail` → `john@gmail.com`
- `john@yahoo` → `john@yahoo.com`
- `john@company` → `john@company.com`

### Mobile Autocorrect
- `Gmail.com` → `gmail.com`
- `email.com` → `gmail.com`

### Regional Domains
- `john@yahoo` in UK → `john@yahoo.co.uk`
- `john@yahoo` in Canada → `john@yahoo.ca`

## Configuration

```tsx
const config = {
  enableSuggestions: true,    // Enable autocorrection suggestions
  enableValidation: true,     // Enable format validation
  customDomains: ['company.com'], // Your company domains
  country: 'UK',             // User's country for regional TLDs
  minConfidence: 0.7,        // Minimum confidence for suggestions
  debounceMs: 300,           // Debounce delay in milliseconds
};

const { email, suggestion } = useEmailAutocorrect(config);
```

## API Reference

### Components

#### `<EmailInput />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onEmailChange` | `(email: string, isValid: boolean) => void` | - | Called on email change |
| `onEmailSubmit` | `(email: string) => void` | - | Called on form submission |
| `config` | `EmailAutocorrectConfig` | `{}` | Configuration options |
| `showSuggestion` | `boolean` | `true` | Show autocorrect suggestions |
| `showValidation` | `boolean` | `true` | Show validation errors |
| `placeholder` | `string` | `"Enter your email"` | Input placeholder |
| `...TextInputProps` | - | - | All React Native TextInput props |

### Hooks

#### `useEmailAutocorrect(config?)`

Returns:
- `email: string` - Current email value
- `setEmail: (email: string) => void` - Update email
- `validation: { isValid: boolean, error?: string }` - Validation result
- `suggestion: { suggested: string, confidence: number } | null` - Suggestion
- `acceptSuggestion: () => void` - Accept the suggestion
- `rejectSuggestion: () => void` - Reject the suggestion
- `isChecking: boolean` - Loading state

### Functions

#### `correctEmail(email: string, config?)`

Returns `EmailSuggestion | null`

#### `validateEmail(email: string)`

Returns `ValidationResult`

## Examples

### With Form Validation

```tsx
function CheckoutForm() {
  const { email, validation, setEmail } = useEmailAutocorrect();
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    setCanSubmit(validation.isValid);
  }, [validation.isValid]);

  return (
    <View>
      <EmailInput onEmailChange={setEmail} />
      <Button
        title="Continue"
        disabled={!canSubmit}
        onPress={handleCheckout}
      />
    </View>
  );
}
```

### Custom Styling

```tsx
<EmailInput
  style={{
    borderColor: '#007AFF',
    borderRadius: 12,
  }}
  placeholder="Your email address"
  placeholderTextColor="#999"
/>
```

## Performance

- **Bundle Size**: ~3KB gzipped
- **Processing Time**: <1ms per check
- **Memory**: Minimal overhead
- **Battery**: No impact (no network calls)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [Anivar Aravind](https://github.com/anivar)

## Support

- 🐛 [Report bugs](https://github.com/anivar/react-native-email-autocorrect/issues)
- 💡 [Request features](https://github.com/anivar/react-native-email-autocorrect/issues)
- 📖 [Read docs](https://github.com/anivar/react-native-email-autocorrect#readme)