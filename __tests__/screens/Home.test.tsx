import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import HomeScreen from '../../app/(tabs)/home';
import { BookWithStatus } from '../../types';

// Mock the router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the styles
jest.mock('../../styles/designSystem', () => ({
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    body1: {
      fontSize: 16,
    },
  },
}));

const mockCurrentlyReading: BookWithStatus[] = [
  {
    id: '1',
    title: 'Currently Reading Book',
    authors: ['Author 1'],
    description: 'Test Description',
    imageLinks: {
      thumbnail: 'https://example.com/image.jpg'
    },
    publishedDate: '2023',
    publisher: 'Test Publisher',
    status: 'reading',
    addedAt: Date.now(),
  },
];

const mockRecommendations: BookWithStatus[] = [
  {
    id: '2',
    title: 'Recommended Book',
    authors: ['Author 2'],
    description: 'Test Description',
    imageLinks: {
      thumbnail: 'https://example.com/image.jpg'
    },
    publishedDate: '2023',
    publisher: 'Test Publisher',
    status: 'wantToRead',
    addedAt: Date.now(),
  },
];

// Mock the useBooks hook
const mockUseBooks = {
  currentlyReading: mockCurrentlyReading,
  wantToReadBooks: mockRecommendations,
  username: 'Test User',
  getBookStatus: jest.fn((id) => 'reading'),
  isBookWishlisted: jest.fn((id) => false),
  toggleWishlist: jest.fn(),
};

jest.mock('../../context/BooksContext', () => ({
  useBooks: () => mockUseBooks
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders welcome section with username', () => {
    const { getByText } = render(<HomeScreen />);
    
    expect(getByText('Willkommen zurück,')).toBeTruthy();
    expect(getByText('Test User')).toBeTruthy();
  });

  it('renders currently reading section with books', () => {
    const { getByText } = render(<HomeScreen />);
    
    expect(getByText('Aktuelle Lektüre')).toBeTruthy();
    expect(getByText('Currently Reading Book')).toBeTruthy();
    expect(getByText('Author 1')).toBeTruthy();
  });

  it('renders recommendations section', () => {
    const { getByText } = render(<HomeScreen />);
    
    expect(getByText('Empfehlungen für dich')).toBeTruthy();
    expect(getByText('Recommended Book')).toBeTruthy();
    expect(getByText('Author 2')).toBeTruthy();
  });

  it('shows empty state when no books are available', () => {
    mockUseBooks.currentlyReading = [];
    mockUseBooks.wantToReadBooks = [];

    const { getByText } = render(<HomeScreen />);
    
    expect(getByText('Keine Bücher in aktueller Lektüre')).toBeTruthy();
    expect(getByText('Keine Empfehlungen verfügbar')).toBeTruthy();

    // Reset the mock data
    mockUseBooks.currentlyReading = mockCurrentlyReading;
    mockUseBooks.wantToReadBooks = mockRecommendations;
  });

  it('navigates to book details when a book is pressed', () => {
    const { getAllByTestId } = render(<HomeScreen />);
    
    const bookCards = getAllByTestId('book-card');
    fireEvent.press(bookCards[0]); // Press the first book card (Currently Reading Book)
    expect(mockPush).toHaveBeenCalledWith('/book/1');
  });

  it('navigates to my-books when see all is pressed', () => {
    const { getByText } = render(<HomeScreen />);
    
    fireEvent.press(getByText('Alle anzeigen'));
    expect(mockPush).toHaveBeenCalledWith('/my-books');
  });
});
