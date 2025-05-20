import '@testing-library/jest-native/extend-expect';
import { jest } from '@jest/globals';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock react-native components
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock expo vector icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: '',
}));

// Setup global mocks
global.jest = jest;
