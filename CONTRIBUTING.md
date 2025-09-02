# Contributing to React Native Email Autocorrect

Thank you for your interest in contributing! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/anivar/email-autocorrect.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature`

## Development

```bash
# Build the library
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Clean build artifacts
npm run clean
```

## Guidelines

### Code Style
- We use TypeScript for type safety
- Follow the existing code style (enforced by ESLint and Prettier)
- Write clear, self-documenting code with meaningful variable names

### Testing
- Add tests for new features
- Ensure all tests pass before submitting
- Maintain or improve code coverage

### Commits
- Use clear, descriptive commit messages
- Reference issues in commits when applicable
- Keep commits focused and atomic

### Pull Requests
1. Update your branch with the latest main
2. Ensure all tests pass
3. Update documentation if needed
4. Submit PR with clear description
5. Link any related issues

## Adding New Email Providers

To add support for new email providers:

1. Update `src/data/emailData.ts`:
```typescript
export const PROVIDER_RULES: Record<string, string[]> = {
  // ... existing providers
  'newprovider': ['com', 'net'], // Add valid TLDs
};
```

2. Add common typos if applicable:
```typescript
export const TYPO_FIXES: Record<string, string> = {
  // ... existing fixes
  'newprovder.com': 'newprovider.com',
};
```

3. Add tests in `__tests__/emailCorrector.test.ts`

## Reporting Issues

- Use GitHub Issues
- Include React Native version
- Provide minimal reproduction steps
- Include expected vs actual behavior

## Questions?

Feel free to open an issue for questions or discussions!