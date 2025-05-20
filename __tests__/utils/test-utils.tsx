import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../../context/ThemeContext';
import { BooksProvider } from '../../context/BooksContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <BooksProvider>
        {children}
      </BooksProvider>
    </ThemeProvider>
  );
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react-native';
export { customRender as render };
