export type ReadingStatus = 'reading' | 'read' | 'wantToRead';
export type OwnershipStatus = 'owned' | 'wishlist' | null;

export type BookData = {
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

export type BookWithStatus = BookData & {
  id: string;
  status: ReadingStatus;
  ownership: OwnershipStatus;
  addedAt: number;
};

export interface BookCardProps {
  book: BookWithStatus;
  showStatus?: boolean;
  showActions?: boolean;
  horizontal?: boolean;
  showRemoveButton?: boolean;
  onRemove?: () => void;
  onPress?: () => void;
}
