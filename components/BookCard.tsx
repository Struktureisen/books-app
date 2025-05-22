// Bücher werden nun in Reihen gespeichert, von links nach rechts verteilt
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
    <View style={[styles.contentContainer, horizontal && styles.horizontalContentContainer]}>
      <View style={styles.coverContainer}>
        {thumbnailUrl && (
          <Image
            source={{ uri: thumbnailUrl }}
            style={[styles.cover, horizontal && styles.horizontalCover]}
            resizeMode="cover"
          />
        )}
        {showStatus && currentStatus && (
  <View
    style={[
      styles.statusBadge,
      {
        backgroundColor:
          currentStatus === 'reading' ? '#007AFF' : // Blau
          currentStatus === 'read' ? '#34C759' :    // Grün
          '#FFD60A',                                // Gelb
        borderColor: 'transparent',
      }
    ]}
  >
    <Text style={[styles.statusText, { color: '#000' }]}>
      {currentStatus === 'reading' ? 'Wird gelesen' :
       currentStatus === 'read' ? 'Gelesen' : 'Möchte lesen'}
    </Text>
  </View>
)}
      </View>

      <View style={[styles.info, horizontal && styles.horizontalInfo]}>
  <View style={styles.infoWrapper}>
    <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
      {book.title}
    </Text>

    <View style={styles.author}>
      {Array.isArray(book.authors) && book.authors.length > 0 && (
        <Text style={[styles.authorText, { color: theme.text }]} numberOfLines={1}>
          {Array.isArray(book.authors) ? book.authors.join(', ') : ''}
        </Text>
      )}
      {showWishlistButton && (
        <TouchableOpacity
          style={[styles.wishlistButton, inWishlist && { backgroundColor: theme.activeStatus }]}
          onPress={handleWishlistToggle}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.6}
          disabled={isProcessingWishlist}
        >
          <Text style={[styles.wishlistIcon, { color: inWishlist ? theme.text : theme.primary }]}>★</Text>
        </TouchableOpacity>
      )}
    </View>

    {!horizontal && (
      <View style={styles.detailsContainer}>
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
      </View>
    )}
  </View>
</View>


      {showRemoveButton && (
        <TouchableOpacity style={styles.removeButton} onPress={handleRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.removeButtonText, { color: theme.text }]}>×</Text>
        </TouchableOpacity>
      )}

      {showActions && (
        <BookStatusModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onStatusSelect={handleStatusSelect}
          onRemove={handleRemove}
          currentStatus={currentStatus || undefined}
          title={book.title}
        />
      )}
    </View>
  );

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.card }, horizontal && styles.horizontalContainer]}
      onPress={onPress || (showActions ? () => setModalVisible(true) : undefined)}
      activeOpacity={0.7}
    >
      <CardContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
    marginVertical: 4,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    flexBasis: '30%',          // oder ca. 48% bei 2 Spalten
    maxWidth: 140,
    minWidth: 120,
    flexGrow: 1,
    flexShrink: 1,
    height: 360,
    position: 'relative',
  },
  coverContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    height: 200,
  },
  contentContainer: { flex: 1 },
  horizontalContentContainer: { flexDirection: 'row', alignItems: 'center' },
  cover: { width: 115, height: 210, borderRadius: 4, backgroundColor: '#f0f0f0' },
  horizontalCover: { width: 120, height: 180 },
  info: {
    flex: 1,
    marginTop: 8,
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  horizontalInfo: { marginLeft: 12, height: 180 },
  title: { fontSize: 13, fontWeight: 'bold', minHeight: 34, marginBottom: 2 },
  author: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 20, marginBottom: 2 },
  authorText: { fontSize: 12, flex: 1, marginRight: 8, lineHeight: 18 },
  detailsContainer: { marginTop: 4 },
  details: { fontSize: 12, marginBottom: 1 },
  statusBadge: {
    marginTop: 6,
  width: 115, // exakt so breit wie das Cover
  alignSelf: 'center',
  paddingVertical: 4,
  borderRadius: 6,
  alignItems: 'center',
  justifyContent: 'center',
  },
  statusText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
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
  wishlistIcon: { fontSize: 18, lineHeight: 18 },
  removeButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
    textAlign: 'center',
    includeFontPadding: false,
  },
  infoWrapper: {
  flex: 1,
  justifyContent: 'space-between',
  marginTop: 0,
},
});

export default memo(BookCard);
