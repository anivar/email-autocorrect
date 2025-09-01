# React Native Email Autocorrect

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](src/)

> Professional email typo correction library with intelligent algorithmic approach, global domain support, and EAI (Email Address Internationalization) standards compliance.

## ✨ Features

- **🧠 Intelligent Algorithms**: Uses Levenshtein distance, keyboard layout awareness, and pattern matching
- **🌍 Global Support**: 200+ TLD and ccTLD domains with IETF compliance
- **🔤 Unicode Support**: EAI standards (RFC 6530-6533) for international email addresses
- **📊 Frequency-based**: Gmail gets priority (43% market share), Yahoo (8%), Outlook (5%)
- **⚡ High Performance**: <0.001ms per correction, 1.1M+ corrections/second
- **🎯 Smart Validation**: Prevents correcting valid emails to invalid ones
- **🔧 React Integration**: Ready-to-use React Native hook
- **🚀 Zero Dependencies**: Pure TypeScript, no native modules needed

## 📦 Installation

```bash
npm install react-native-email-autocorrect
# or
yarn add react-native-email-autocorrect
# or
pnpm add react-native-email-autocorrect
```

**That's it!** No native code means no `pod install` or rebuilding needed.

## 🚀 Quick Start

### Using the Component

The easiest way to get started:

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
        console.log('Submitted:', email);
      }}
    />
  );
}
```

### Using the Hook

For custom UI implementations:

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
        style={[
          styles.input,
          validation.error && styles.inputError
        ]}
      />
      
      {validation.error && (
        <Text style={styles.errorText}>{validation.error}</Text>
      )}
      
      {suggestion && (
        <TouchableOpacity onPress={acceptSuggestion}>
          <Text style={styles.suggestion}>
            Did you mean {suggestion.suggested}?
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
```

### Direct Functions

For maximum control:

```tsx
import { correctEmail, validateEmail } from 'react-native-email-autocorrect';

// Check for typos
const suggestion = correctEmail('user@gmial.com');
if (suggestion) {
  console.log(suggestion.suggested); // 'user@gmail.com'
  console.log(suggestion.confidence); // 0.95
  console.log(suggestion.reason); // 'Keyboard typing error corrected'
}

// Validate format (including Unicode emails)
const validation = validateEmail('用户@测试.中国');
console.log(validation.isValid); // true

// Test specific cases
const testCases = [
  'user@company.com',    // ✅ Valid business domain
  'ping@gmx.de',         // ✅ Valid German provider  
  'user@example.co.in',  // ✅ Valid Indian ccTLD
  'ping@gmial.com',      // ➡️ Corrected to gmail.com
  'ping@yahoo.cmo'       // ➡️ Corrected to yahoo.com
];

testCases.forEach(email => {
  const result = correctEmail(email);
  console.log(email, '→', result ? result.suggested : 'No correction needed');
});
```

## 🎯 What It Corrects

### Common Typos
```
gmial.com     → gmail.com
yahooo.com    → yahoo.com
hotmial.com   → hotmail.com
outlok.com    → outlook.com
```

### Missing Extensions
```
john@gmail    → john@gmail.com
john@yahoo    → john@yahoo.com
john@company  → john@company.com
```

### Mobile Autocorrect
```
Gmail.com     → gmail.com
email.com     → gmail.com
YAHOO.COM     → yahoo.com
```

### Regional Domains
```
john@yahoo (UK)     → john@yahoo.co.uk
john@yahoo (Canada) → john@yahoo.ca
john@yahoo (France) → john@yahoo.fr
```

### Voice Input Errors
```
g mail.com    → gmail.com
at gmail.com  → @gmail.com
gee mail      → gmail.com
```

## ⚙️ Configuration

```tsx
const config = {
  // Enable/disable features
  enableSuggestions: true,    // Show autocorrect suggestions
  enableValidation: true,     // Validate email format
  
  // Customize behavior
  country: 'UK',              // For regional domains
  minConfidence: 0.7,         // Minimum confidence threshold
  debounceMs: 300,            // Debounce delay
  
  // Custom domains
  customDomains: ['company.com', 'corporate.org']
};

const { email, suggestion } = useEmailAutocorrect(config);
```

## 📚 API Reference

### Components

#### `<EmailInput />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onEmailChange` | `(email: string, isValid: boolean) => void` | - | Called on every change |
| `onEmailSubmit` | `(email: string) => void` | - | Called on submission |
| `config` | `EmailAutocorrectConfig` | `{}` | Configuration options |
| `showSuggestion` | `boolean` | `true` | Show inline suggestions |
| `showValidation` | `boolean` | `true` | Show validation errors |
| `...TextInputProps` | - | - | All React Native TextInput props |

### Hooks

#### `useEmailAutocorrect(config?)`

Returns an object with:

```tsx
{
  email: string;                    // Current email value
  setEmail: (email: string) => void; // Update email
  validation: {                     // Validation state
    isValid: boolean;
    error?: string;
  };
  suggestion: {                     // Current suggestion
    suggested: string;
    confidence: number;
    reason: string;
  } | null;
  acceptSuggestion: () => void;     // Accept suggestion
  rejectSuggestion: () => void;     // Reject suggestion
  isChecking: boolean;              // Loading state
}
```

### Functions

#### `correctEmail(email, config?)`
Returns `EmailSuggestion | null`

#### `validateEmail(email)`
Returns `ValidationResult`

## 💡 Examples

### With React Hook Form

```tsx
import { useForm, Controller } from 'react-hook-form';
import { EmailInput } from 'react-native-email-autocorrect';

function LoginForm() {
  const { control, handleSubmit } = useForm();

  return (
    <Controller
      control={control}
      name="email"
      render={({ field: { onChange, value } }) => (
        <EmailInput
          value={value}
          onEmailChange={(email, isValid) => {
            onChange(email);
          }}
          placeholder="Email address"
        />
      )}
    />
  );
}
```

### Custom Styling

```tsx
<EmailInput
  style={{
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 20,
  }}
  placeholderTextColor="#999"
  showSuggestion={true}
  config={{ country: 'USA' }}
/>
```

### With Formik

```tsx
import { Formik } from 'formik';
import { useEmailAutocorrect } from 'react-native-email-autocorrect';

function FormikExample() {
  const { validation, suggestion, acceptSuggestion } = useEmailAutocorrect();

  return (
    <Formik
      initialValues={{ email: '' }}
      validate={values => {
        const errors = {};
        if (!validation.isValid && values.email) {
          errors.email = validation.error;
        }
        return errors;
      }}
      onSubmit={values => console.log(values)}
    >
      {({ handleChange, handleBlur, values, errors }) => (
        <View>
          <TextInput
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            keyboardType="email-address"
          />
          {errors.email && <Text>{errors.email}</Text>}
          {suggestion && (
            <TouchableOpacity onPress={acceptSuggestion}>
              <Text>Use: {suggestion.suggested}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Formik>
  );
}
```

## 🌍 Supported Email Providers

The library recognizes and provides intelligent corrections for:

- **Global**: Gmail, Yahoo, Hotmail, Outlook, AOL, iCloud, ProtonMail
- **Regional**: Provider-specific TLDs for UK, Canada, Australia, France, Spain, and more
- **Business**: Custom domains via configuration

## 📱 React Native Compatibility

| React Native | This Library | Status |
|--------------|--------------|---------|
| 0.70+        | ✅           | Fully supported |
| 0.60-0.69    | ✅           | Fully supported |
| < 0.60       | ⚠️           | Requires manual linking |

Works with:
- ✅ iOS
- ✅ Android  
- ✅ Web (react-native-web)
- ✅ Expo
- ✅ New Architecture (Fabric/TurboModules)

## 🎯 Performance

- **Bundle Size**: ~3KB gzipped
- **Processing Time**: <1ms per validation
- **Memory**: Minimal overhead
- **Dependencies**: Zero

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Clone the repo
git clone https://github.com/anivar/react-native-email-autocorrect.git

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## 📄 License

MIT © [Anivar Aravind](https://github.com/anivar)

## 🙏 Support

If you find this library helpful, please consider:

- ⭐ Starring the repo
- 🐛 [Reporting bugs](https://github.com/anivar/react-native-email-autocorrect/issues)
- 💡 [Suggesting features](https://github.com/anivar/react-native-email-autocorrect/issues)
- ☕ [Buying me a coffee](https://www.buymeacoffee.com/anivar)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/anivar">Anivar Aravind</a>
</p>

<p align="center">
  <a href="https://github.com/anivar/react-native-email-autocorrect">
    <img src="https://img.shields.io/github/stars/anivar/react-native-email-autocorrect?style=social" alt="GitHub stars">
  </a>
</p>