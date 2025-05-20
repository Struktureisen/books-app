import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import BookCard from '../../components/BookCard';
import { BookData } from '../../types';

const mockBook: BookData = {
  id: '1',
  title: 'Test Book',
  authors: ['Test Author'],
  description: 'Test Description',
  imageLinks: {
    thumbnail: 'https://example.com/image.jpg'
  },
  publishedDate: '2023',
  publisher: 'Test Publisher'
};

// Mock the useBooks hook implementation
const mockGetBookStatus = jest.fn((id) => 'reading');
const mockIsBookWishlisted = jest.fn((id) => false);
const mockToggleWishlist = jest.fn();

jest.mock('../../context/BooksContext', () => ({
  useBooks: () => ({
    getBookStatus: mockGetBookStatus,
    isBookWishlisted: mockIsBookWishlisted,
    toggleWishlist: mockToggleWishlist
  })
}));

describe('BookCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders book information correctly', () => {
    const { getByTestId } = render(
      <BookCard book={mockBook} />
    );

    expect(getByTestId('book-title')).toHaveTextContent('Test Book');
    expect(getByTestId('book-author')).toHaveTextContent('Test Author');
    expect(getByTestId('book-date')).toHaveTextContent('2023');
    expect(getByTestId('book-publisher')).toHaveTextContent('Test Publisher');
  });

  it('shows status when book has a status', () => {
    const { getByTestId } = render(
      <BookCard book={mockBook} />
    );

    expect(mockGetBookStatus).toHaveBeenCalledWith('1');
    expect(getByTestId('status-badge')).toHaveTextContent('Wird gelesen');
  });

  it('calls onPress when card is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <BookCard book={mockBook} onPress={mockOnPress} />
    );

    fireEvent.press(getByTestId('book-card'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('shows wishlist button when showWishlistButton prop is true', () => {
    const { getByTestId } = render(
      <BookCard book={mockBook} showWishlistButton />
    );

    const wishlistButton = getByTestId('wishlist-button');
    expect(wishlistButton).toBeTruthy();

    // Create a mock event object
    const mockEvent = {
      stopPropagation: jest.fn()
    };

    fireEvent.press(wishlistButton, mockEvent);
    expect(mockToggleWishlist).toHaveBeenCalledWith(mockBook);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('applies theme styles correctly', () => {
    const { getByTestId } = render(
      <BookCard book={mockBook} />
    );

    const card = getByTestId('book-card');
    const cardStyles = Array.isArray(card.props.style) 
      ? card.props.style[0] 
      : card.props.style;

    expect(cardStyles).toMatchObject({
      backgroundColor: expect.any(String)
    });
  });
});
