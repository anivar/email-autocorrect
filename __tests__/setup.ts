/**
 * Jest setup file
 */

// Mock React Native modules if needed
jest.mock('react-native', () => ({
  StyleSheet: {
    create: (styles: any) => styles,
  },
  Platform: {
    OS: 'ios',
  },
}));