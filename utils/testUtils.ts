import { BookData } from '../types';

export const mockRecommendations: BookData[] = [
  {
    id: 'test1',
    title: 'Test Book 1',
    authors: ['Author 1'],
    description: 'Test description 1',
    imageLinks: {
      thumbnail: 'https://example.com/book1.jpg'
    }
  },
  {
    id: 'test2',
    title: 'Test Book 2',
    authors: ['Author 2'],
    description: 'Test description 2',
    imageLinks: {
      thumbnail: 'https://example.com/book2.jpg'
    }
  }
];

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockFetchRecommendations = async () => {
  await delay(1000); // Simulate network delay
  return mockRecommendations;
};

export const testHorizontalScroll = async (scrollView: any) => {
  const initialOffset = { x: 0, y: 0 };
  const finalOffset = { x: 200, y: 0 };
  
  // Test scroll to right
  scrollView.scrollTo(finalOffset);
  await delay(500);
  
  // Test scroll back to left
  scrollView.scrollTo(initialOffset);
  await delay(500);
  
  return true;
};

export const testBookStatusChanges = async (book: BookData, updateStatus: Function) => {
  const statuses = ['reading', 'read', 'wantToRead'];
  const results = [];
  
  for (const status of statuses) {
    await updateStatus(book.id, status);
    await delay(500);
    results.push(status);
  }
  
  return results;
};

export const testWishlistPersistence = async (
  addToWishlist: Function,
  removeFromWishlist: Function,
  getWishlistStatus: Function,
  book: BookData
) => {
  // Add to wishlist
  await addToWishlist(book);
  await delay(500);
  const addedStatus = getWishlistStatus(book.id);
  
  // Remove from wishlist
  await removeFromWishlist(book);
  await delay(500);
  const removedStatus = getWishlistStatus(book.id);
  
  return {
    addedSuccessfully: addedStatus === true,
    removedSuccessfully: removedStatus === false
  };
};
