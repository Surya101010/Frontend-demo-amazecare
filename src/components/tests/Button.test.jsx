import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

test('renders button with given text', () => {
  render(<Button text="Click Me" />);
  expect(screen.getByText(/Click Me/i)).toBeInTheDocument();
});

test('button click triggers callback', () => {
  const mockFn = jest.fn();
  render(<Button text="Submit" onclick={mockFn} />);
  fireEvent.click(screen.getByText('Submit'));
  expect(mockFn).toHaveBeenCalledTimes(1);
});
