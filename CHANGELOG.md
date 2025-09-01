# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-09

### Added
- Initial release
- Smart email validation with real-time feedback
- Autocorrection for common email typos
- Support for 50+ email providers
- Regional TLD suggestions based on country
- Mobile-optimized corrections (autocorrect, voice input)
- Ready-to-use `EmailInput` component
- `useEmailAutocorrect` hook for custom implementations
- TypeScript support with full type definitions
- Zero runtime dependencies
- Comprehensive test coverage

### Features
- ✅ Smart validation - Real-time email format checking
- 🔧 Autocorrection - Suggests fixes for common typos
- 🎯 High accuracy - Only shows high-confidence suggestions
- 📱 Mobile optimized - Handles autocorrect & voice input errors
- 🌍 Regional support - Suggests appropriate TLDs by country
- 🔒 Privacy-first - All processing on-device, no server calls

### Supported Corrections
- Missing dots: `gmailcom` → `gmail.com`
- Common typos: `gmial.com` → `gmail.com`
- Missing TLDs: `user@yahoo` → `user@yahoo.com`
- Autocorrect issues: `Gmail.com` → `gmail.com`
- Voice input: `g mail.com` → `gmail.com`
- Regional variants: `yahoo` → `yahoo.co.uk` (in UK)