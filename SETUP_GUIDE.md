# Setup Guide for react-native-email-autocorrect

## Prerequisites

1. **Node.js**: Version 14 or higher
2. **npm account**: Create at https://www.npmjs.com/signup
3. **GitHub account**: For repository hosting

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/anivar/react-native-email-autocorrect.git
cd react-native-email-autocorrect

# Install dependencies
npm install

# Build the package
npm run build
```

## Step 2: Test Everything Works

```bash
# Run tests
npm test

# Check TypeScript
npm run typecheck

# Run linter
npm run lint

# Build the package
npm run build

# Check what will be published
npm pack --dry-run
```

## Step 3: Setup npm Publishing

### First Time Setup

1. **Create npm account** (if you don't have one):
   - Go to https://www.npmjs.com/signup
   - Verify your email

2. **Login to npm**:
   ```bash
   npm login
   # Enter your username, password, and email
   ```

3. **Generate npm token** (for CI/CD):
   - Go to https://www.npmjs.com/settings/[your-username]/tokens
   - Click "Generate New Token"
   - Select "Automation" type
   - Copy the token

4. **Add token to GitHub**:
   - Go to your repo settings on GitHub
   - Navigate to Settings → Secrets and variables → Actions
   - Add new secret: `NPM_TOKEN` with your token

## Step 4: Publish Your First Version

### Manual Publishing (Recommended for first release)

```bash
# Ensure you're on main branch
git checkout main

# Update version (for first release, it's already 1.0.0)
# For future releases: npm version patch/minor/major

# Build fresh
npm run clean
npm run build

# Publish to npm
npm publish

# If package name is taken, update name in package.json
# Then retry: npm publish
```

### Check Publication

1. Visit: https://www.npmjs.com/package/react-native-email-autocorrect
2. Verify package appears correctly

## Step 5: Test Installation

In a different directory:

```bash
# Create test React Native app
npx react-native init TestEmailApp
cd TestEmailApp

# Install your package
npm install react-native-email-autocorrect

# For iOS
cd ios && pod install && cd ..

# Test in your app
```

Add to your App.js:
```javascript
import { EmailInput } from 'react-native-email-autocorrect';

// Use in your component
<EmailInput 
  placeholder="Enter email"
  onEmailChange={(email, isValid) => console.log(email, isValid)}
/>
```

## Step 6: Setup Automated Releases (Optional)

1. **Enable GitHub Actions**:
   - The `.github/workflows/publish.yml` is already set up
   - It will auto-publish when you create a GitHub release

2. **Create a release**:
   ```bash
   # Tag your release
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **Go to GitHub**:
   - Navigate to "Releases"
   - Click "Create release"
   - Select your tag
   - Add release notes
   - Publish release

## Common Issues & Solutions

### Issue: Package name already taken
**Solution**: Update package name in `package.json`:
```json
{
  "name": "@anivar/react-native-email-autocorrect"
}
```

### Issue: Build fails
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: TypeScript errors
**Solution**: Ensure all types are properly exported in `src/index.ts`

### Issue: npm publish fails with 403
**Solution**: 
- Check you're logged in: `npm whoami`
- Check package doesn't exist: `npm view [package-name]`
- For scoped packages, ensure org exists

## Maintenance

### Releasing Updates

1. **Make changes** and commit
2. **Update version**:
   ```bash
   npm version patch  # 1.0.0 → 1.0.1
   # or
   npm version minor  # 1.0.0 → 1.1.0
   # or
   npm version major  # 1.0.0 → 2.0.0
   ```
3. **Push tags**:
   ```bash
   git push origin main --tags
   ```
4. **Publish**:
   ```bash
   npm publish
   ```

### Best Practices

1. **Always test** before publishing
2. **Update README** with new features
3. **Use semantic versioning**:
   - PATCH: Bug fixes (1.0.0 → 1.0.1)
   - MINOR: New features (1.0.0 → 1.1.0)  
   - MAJOR: Breaking changes (1.0.0 → 2.0.0)
4. **Tag releases** in git
5. **Write release notes**

## Support

If you encounter issues:
1. Check this guide
2. Open an issue on GitHub
3. Check npm documentation: https://docs.npmjs.com/

---

## Quick Commands Reference

```bash
# Development
npm install          # Install dependencies
npm test            # Run tests
npm run lint        # Check code style
npm run build       # Build package
npm run typecheck   # Check TypeScript

# Publishing
npm login           # Login to npm
npm version patch   # Bump version
npm publish         # Publish to npm
npm pack           # Create tarball

# Verification
npm view react-native-email-autocorrect  # Check published package
```