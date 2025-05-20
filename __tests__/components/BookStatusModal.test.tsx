import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import BookStatusModal from '../../components/BookStatusModal';
import { ReadingStatus } from '../../types';

describe('BookStatusModal', () => {
  const mockOnClose = jest.fn();
  const mockOnStatusSelect = jest.fn();
  const mockOnRemove = jest.fn();

  const defaultProps = {
    visible: true,
    title: 'Test Book',
    onClose: mockOnClose,
    onStatusSelect: mockOnStatusSelect,
    onRemove: mockOnRemove,
    currentStatus: 'reading' as ReadingStatus
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with correct title', () => {
    const { getByTestId } = render(
      <BookStatusModal {...defaultProps} />
    );

    expect(getByTestId('modal-title')).toHaveTextContent('Test Book');
  });

  it('highlights current status button', () => {
    const { getByTestId } = render(
      <BookStatusModal {...defaultProps} />
    );

    const currentStatusButton = getByTestId('status-button-reading');
    const buttonStyles = Array.isArray(currentStatusButton.props.style) 
      ? currentStatusButton.props.style[0] 
      : currentStatusButton.props.style;
    
    expect(buttonStyles).toMatchObject({
      backgroundColor: '#BAE8F4',
      borderWidth: 1
    });
  });

  it('calls onStatusSelect when a status is selected', () => {
    const { getByTestId } = render(
      <BookStatusModal {...defaultProps} />
    );

    fireEvent.press(getByTestId('status-button-read'));
    expect(mockOnStatusSelect).toHaveBeenCalledWith('read');
  });

  it('calls onRemove when remove button is pressed', () => {
    const { getByTestId } = render(
      <BookStatusModal {...defaultProps} />
    );

    fireEvent.press(getByTestId('remove-button'));
    expect(mockOnRemove).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is pressed', () => {
    const { getByTestId } = render(
      <BookStatusModal {...defaultProps} />
    );

    fireEvent.press(getByTestId('cancel-button'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('applies theme colors to buttons', () => {
    const { getByTestId } = render(
      <BookStatusModal {...defaultProps} />
    );

    const removeButton = getByTestId('remove-button');
    expect(removeButton).toHaveStyle({
      backgroundColor: 'rgba(255, 59, 48, 0.1)'
    });
  });
});
