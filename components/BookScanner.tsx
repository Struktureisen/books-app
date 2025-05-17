import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions, Platform, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useTheme } from '../context/ThemeContext';

type BookData = {
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

interface BookScannerProps {
  isVisible: boolean;
  onClose: () => void;
  onBookScanned: (bookData: BookData) => void;
}

export default function BookScanner({ isVisible, onClose, onBookScanned }: BookScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isbn, setIsbn] = useState('');
  const { theme } = useTheme();
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (!isWeb) {
      const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      };
      getBarCodeScannerPermissions();
    }
  }, []);

  const searchBook = async () => {
    if (!isbn) return;
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyB7x5_v_JM9qEdQ2aNG5Z1rs_nymQnFtOI`
      );
      const json = await response.json();

      if (json.items && json.items.length > 0) {
        const bookInfo = json.items[0].volumeInfo;
        onBookScanned(bookInfo);
        onClose();
        setIsbn('');
      } else {
        alert('Buch nicht gefunden');
      }
    } catch (error) {
      console.error('Error fetching book data:', error);
      alert('Fehler beim Abrufen der Buchdaten');
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (type === BarCodeScanner.Constants.BarCodeType.ean13) {
      setScanned(true);
      setIsbn(data);
      await searchBook();
      setScanned(false);
    }
  };

  if (!isWeb && hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.text, { color: theme.text }]}>Kamerazugriff wird angefordert...</Text>
      </View>
    );
  }

  if (!isWeb && hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.text, { color: theme.text }]}>Kein Zugriff auf die Kamera</Text>
      </View>
    );
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {isWeb ? (
          <View style={styles.webContainer}>
            <Text style={[styles.text, { color: theme.text }]}>ISBN eingeben:</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }]}
              value={isbn}
              onChangeText={setIsbn}
              placeholder="ISBN-13 eingeben"
              placeholderTextColor={theme.textMuted}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[styles.searchButton, { backgroundColor: theme.card }]}
              onPress={searchBook}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>Suchen</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.scanner}
          >
            <View style={styles.layerTop} />
            <View style={styles.layerCenter}>
              <View style={styles.layerLeft} />
              <View style={styles.focused} />
              <View style={styles.layerRight} />
            </View>
            <View style={styles.layerBottom} />
          </BarCodeScanner>
        )}

        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: theme.card }]}
          onPress={onClose}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Schließen</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const opacity = 'rgba(0, 0, 0, .6)';
const { width } = Dimensions.get('window');
const SCANNING_AREA_SIZE = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  webContainer: {
    padding: 20,
    alignItems: 'center',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    maxWidth: 300,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
  },
  searchButton: {
    padding: 15,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  layerTop: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row',
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    width: SCANNING_AREA_SIZE,
    height: SCANNING_AREA_SIZE,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity,
  },
});
