import '@testing-library/jest-native/extend-expect';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock expo vector icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock the useBooks hook
jest.mock('../context/BooksContext', () => ({
  useBooks: () => ({
    currentlyReading: [],
    wantToReadBooks: [],
    username: 'Test User',
    getBookStatus: jest.fn((id) => 'reading'),
    isBookWishlisted: jest.fn((id) => false),
    toggleWishlist: jest.fn(),
    addBook: jest.fn(),
    removeBook: jest.fn(),
    updateBookStatus: jest.fn(),
  }),
}));

// Mock the useTheme hook
jest.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      background: '#FFFFFF',
      text: '#000000',
      primary: '#007AFF',
      card: '#FFFFFF',
      activeStatus: '#BAE8F4',
      error: '#FF3B30',
      textMuted: '#8E8E93',
    },
  }),
}));

// Mock react-native components
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.NativeModules.StatusBarManager = {
    getHeight: jest.fn(),
  };
  return RN;
});

// Set up global mocks
global.jest = jest;
