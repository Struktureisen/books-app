import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type BookData = {
  id?: string;
  title: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    thumbnail: string;
  };
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
};

type ReadingStatus = 'reading' | 'read' | 'wantToRead';
type OwnershipStatus = 'owned' | 'wishlist' | null;

type BookWithStatus = BookData & {
  id: string;
  status: ReadingStatus;
  ownership: OwnershipStatus;
  addedAt: number;
};

interface BooksContextType {
  currentlyReading: BookWithStatus[];
  readBooks: BookWithStatus[];
  wantToReadBooks: BookWithStatus[];
  wishlistBooks: BookWithStatus[];
  recommendations: BookData[];
  addBook: (book: BookData, status: ReadingStatus) => void;
  removeBook: (bookId: string) => void;
  updateBookStatus: (bookId: string, newStatus: ReadingStatus) => void;
  getBookStatus: (bookId: string) => ReadingStatus | null;
  toggleWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
}

export const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<BookWithStatus[]>([]);
  const [recommendations, setRecommendations] = useState<BookData[]>([]);

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedBooks = await AsyncStorage.getItem('books');
        const savedRecommendations = await AsyncStorage.getItem('recommendations');
        
        if (savedBooks) {
          setBooks(JSON.parse(savedBooks));
        }
        if (savedRecommendations) {
          setRecommendations(JSON.parse(savedRecommendations));
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    loadSavedData();
  }, []);

  // Save books to AsyncStorage whenever they change
  useEffect(() => {
    const saveBooks = async () => {
      try {
        await AsyncStorage.setItem('books', JSON.stringify(books));
      } catch (error) {
        console.error('Error saving books:', error);
      }
    };

    saveBooks();
  }, [books]);

  // Save recommendations to AsyncStorage whenever they change
  useEffect(() => {
    const saveRecommendations = async () => {
      try {
        await AsyncStorage.setItem('recommendations', JSON.stringify(recommendations));
      } catch (error) {
        console.error('Error saving recommendations:', error);
      }
    };

    saveRecommendations();
  }, [recommendations]);

  const currentlyReading = books.filter(book => book.status === 'reading');
  const readBooks = books.filter(book => book.status === 'read');
  const wantToReadBooks = books.filter(book => book.status === 'wantToRead');
  const wishlistBooks = books.filter(book => book.ownership === 'wishlist');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Start with empty recommendations to prevent loading issues
        setRecommendations([]);
        
        const subjects = [
          'fiction', 'mystery', 'romance', 'science', 'history',
          'biography', 'fantasy', 'thriller', 'poetry', 'business'
        ];
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${randomSubject}&maxResults=10&orderBy=newest&key=AIzaSyB7x5_v_JM9qEdQ2aNG5Z1rs_nymQnFtOI`
        ).catch(() => null);

        if (!response || !response.ok) {
          console.warn('Could not fetch recommendations, using empty array');
          return;
        }

        const data = await response.json();
        if (data.items) {
          const books = data.items.map((item: any) => ({
            id: item.id,
            ...item.volumeInfo
          }));
          setRecommendations(books);
        }
      } catch (error) {
        console.warn('Error fetching recommendations, using empty array:', error);
        setRecommendations([]);
      }
    };

    // Delay the API call to ensure the app loads first
    setTimeout(fetchRecommendations, 1000);
  }, []);

  const addBook = useCallback((book: BookData, status: ReadingStatus) => {
    setBooks(prevBooks => {
      const id = book.id ? book.id : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      const existingBook = prevBooks.find(b => 
        b.title === book.title && 
        JSON.stringify(b.authors) === JSON.stringify(book.authors)
      );
      
      if (existingBook) {
        return prevBooks.map(b => 
          b.id === existingBook.id 
            ? { ...b, status }
            : b
        );
      }

      const existingWishlistBook = prevBooks.find(b => b.id === book.id && b.ownership === 'wishlist');
      
      return [...prevBooks, {
        ...book,
        id,
        status,
        ownership: existingWishlistBook ? 'wishlist' : 'owned',
        addedAt: Date.now()
      }];
    });
  }, []);

  const removeBook = useCallback((bookId: string) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
  }, []);

  const updateBookStatus = useCallback((bookId: string, newStatus: ReadingStatus) => {
    setBooks(prevBooks => {
      const existingBook = prevBooks.find(b => b.id === bookId);
      const recommendedBook = recommendations.find(b => b.id === bookId);
      
      if (existingBook) {
        return prevBooks.map(book => 
          book.id === bookId 
            ? { ...book, status: newStatus, ownership: 'owned' }
            : book
        );
      } else if (recommendedBook) {
        const newBook: BookWithStatus = {
          ...recommendedBook,
          id: bookId,
          status: newStatus,
          ownership: 'owned',
          addedAt: Date.now()
        };
        return [...prevBooks, newBook];
      }
      return prevBooks;
    });
  }, [recommendations]);

  const getBookStatus = useCallback((bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.status : null;
  }, [books]);

  const toggleWishlist = useCallback((bookId: string) => {
    setBooks(prevBooks => {
      const book = prevBooks.find(b => b.id === bookId);
      const recommendedBook = recommendations.find(b => b.id === bookId);
      
      if (book) {
        return prevBooks.map(b => 
          b.id === bookId 
            ? { ...b, ownership: b.ownership === 'wishlist' ? null : 'wishlist' }
            : b
        );
      } else if (recommendedBook) {
        const newBook: BookWithStatus = {
          ...recommendedBook,
          id: bookId,
          status: 'wantToRead',
          ownership: 'wishlist',
          addedAt: Date.now()
        };
        return [...prevBooks, newBook];
      }
      return prevBooks;
    });
  }, [recommendations]);

  const isInWishlist = useCallback((bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book?.ownership === 'wishlist';
  }, [books]);

  return (
    <BooksContext.Provider value={{
      currentlyReading,
      readBooks,
      wantToReadBooks,
      wishlistBooks,
      recommendations,
      addBook,
      removeBook,
      updateBookStatus,
      getBookStatus,
      toggleWishlist,
      isInWishlist,
    }}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
};

export type { BookData, BookWithStatus, OwnershipStatus, ReadingStatus };

