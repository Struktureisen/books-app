import React, { memo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBooks } from '../context';
import { useTheme } from '../context/ThemeContext';
import { BookData, BookWithStatus, ReadingStatus } from '../types';
import BookStatusModal from './BookStatusModal';

interface BookCardProps {
  book: BookData | BookWithStatus;
  showStatus?: boolean;
  showActions?: boolean;
  horizontal?: boolean;
  showRemoveButton?: boolean;
  onRemove?: () => void;
  onPress?: () => void;
  showWishlistButton?: boolean;
}

const BookCard = ({ 
  book, 
  showStatus = true, 
  showActions = true,
  horizontal,
  showRemoveButton,
  onPress,
  onRemove,
  showWishlistButton
}: BookCardProps) => {
  const { theme } = useTheme();
  const { getBookStatus, toggleWishlist, isInWishlist, updateBookStatus, removeBook } = useBooks();
  const currentStatus = book.id ? getBookStatus(book.id) : null;
  const inWishlist = book.id ? isInWishlist(book.id) : false;
  const [isProcessingWishlist, setIsProcessingWishlist] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Fix HTTPS for Google Books API images
  const getSecureImageUrl = (url?: string) => {
    if (!url) return undefined;
    return url.replace('http://', 'https://');
  };

  const thumbnailUrl = getSecureImageUrl(book.imageLinks?.thumbnail);

  const handleWishlistToggle = (event: any) => {
    event.stopPropagation();
    if (book.id && !isProcessingWishlist) {
      setIsProcessingWishlist(true);
      toggleWishlist(book.id);
      // Add a small delay to prevent double-taps
      setTimeout(() => setIsProcessingWishlist(false), 500);
    }
  };

  const handleStatusSelect = (status: ReadingStatus) => {
    if (book.id) {
      updateBookStatus(book.id, status);
      setModalVisible(false);
    }
  };

  const handleRemove = () => {
    if (book.id) {
      removeBook(book.id);
    }
  };

  const CardContent = () => (
    <View style={[
      styles.contentContainer,
      horizontal && styles.horizontalContentContainer
    ]}>
      <View style={styles.coverContainer}>
        {thumbnailUrl && (
          <Image
            source={{ uri: thumbnailUrl }}
            style={[
              styles.cover,
              horizontal && styles.horizontalCover
            ]}
            resizeMode="cover"
          />
        )}
        {showStatus && currentStatus && (
          <View style={[
            styles.statusBadge, 
            { 
              backgroundColor: theme.activeStatus,
              borderColor: theme.activeStatus,
            }
          ]}>
            <Text style={[styles.statusText, { color: theme.text }]}>
              {currentStatus === 'reading' ? 'Wird gelesen' :
               currentStatus === 'read' ? 'Gelesen' : 'Möchte lesen'}
            </Text>
          </View>
        )}
      </View>
      <View style={[
        styles.info,
        horizontal && styles.horizontalInfo
      ]}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {book.title}
        </Text>
        <View style={styles.author}>
          {book.authors && book.authors.length > 0 && (
            <Text style={[styles.authorText, { color: theme.text }]} numberOfLines={1}>
              {book.authors.join(', ')}
            </Text>
          )}
          {showWishlistButton && (
            <TouchableOpacity
              style={[
                styles.wishlistButton,
                inWishlist && { backgroundColor: theme.activeStatus }
              ]}
              onPress={handleWishlistToggle}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.6}
              disabled={isProcessingWishlist}
            >
              <Text style={[
                styles.wishlistIcon,
                { color: inWishlist ? theme.text : theme.primary }
              ]}>
                ★
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {!horizontal && (
          <>
            {book.publishedDate && (
              <Text style={[styles.details, { color: theme.textMuted }]}>
                {book.publishedDate.substring(0, 4)}
              </Text>
            )}
            {book.publisher && (
              <Text style={[styles.details, { color: theme.textMuted }]} numberOfLines={1}>
                {book.publisher}
              </Text>
            )}
            {book.description && (
              <Text style={[styles.description, { color: theme.text }]} numberOfLines={2}>
                {book.description}
              </Text>
            )}
          </>
        )}
      </View>
      {showRemoveButton && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.removeButtonText, { color: theme.text }]}>×</Text>
        </TouchableOpacity>
      )}

      <BookStatusModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStatusSelect={handleStatusSelect}
        onRemove={handleRemove}
        currentStatus={currentStatus || undefined}
        title={book.title}
      />
    </View>
  );

  return onPress ? (
    <TouchableOpacity 
      style={[
        styles.container,
        { backgroundColor: theme.card },
        horizontal && styles.horizontalContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <CardContent />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity 
      style={[
        styles.container,
        { backgroundColor: theme.card },
        horizontal && styles.horizontalContainer
      ]}
      onPress={() => setModalVisible(true)}
      activeOpacity={0.7}
    >
      <CardContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    height: 240, // Increased to accommodate status below cover
    position: 'relative',
  },
  coverContainer: {
    position: 'relative',
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  horizontalContentContainer: {
    alignItems: 'center',
  },
  cover: {
    width: 120,
    height: 180,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  horizontalCover: {
    width: 120,
    height: 180,
  },
  info: {
    flex: 1,
    marginLeft: 15,
    height: 180,
    justifyContent: 'flex-start',
  },
  horizontalInfo: {
    marginLeft: 12,
    height: 180,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    minHeight: 40, // Fixed height for 2 lines
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 24, // Fixed height for author line
    marginBottom: 4,
  },
  authorText: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
    lineHeight: 24, // Match minHeight for vertical centering
  },
  details: {
    fontSize: 14,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    marginTop: 8,
  },
  statusBadge: {
    position: 'absolute',
    left: 0,
    top: 190, // Position below cover (180px height + 10px spacing)
    width: 120, // Match cover width
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    minHeight: 28,
    alignItems: 'center', // Center text horizontally
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  wishlistButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  wishlistIcon: {
    fontSize: 18,
    lineHeight: 18,
  },
  removeButton: {
    position: 'absolute',
    top: -2,// Align with title text
    right: 15,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  removeButtonText: {
    fontSize: 20,
    lineHeight: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default memo(BookCard);
