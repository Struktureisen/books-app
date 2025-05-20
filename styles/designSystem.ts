import { StyleSheet } from 'react-native';

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Typography system
export const typography = {
  h1: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

// Shadows
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
};

// Animations
export const animations = {
  button: {
    scale: 0.98,
    duration: 100,
  },
  modal: {
    duration: 300,
  },
};

// Border radiuses
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

// Common styles
export const commonStyles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.medium,
  },
  button: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...typography.body1,
    fontWeight: '600',
  },
  input: {
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    borderWidth: 1,
  },
});

// Loading state animations
export const loadingAnimation = {
  duration: 1000,
  opacity: {
    start: 0.5,
    end: 1,
  },
};

// Accessibility
export const accessibility = {
  minimumTouchSize: 44, // Minimum touch target size
  buttonPressedOpacity: 0.7,
};
