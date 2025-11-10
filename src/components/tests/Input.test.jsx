import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../Input';

test('renders input with placeholder', () => {
  render(<Input placeholder="Enter name" />);
  expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
});

test('input accepts text', () => {
  render(<Input placeholder="Enter name" />);
  const input = screen.getByPlaceholderText('Enter name');
  fireEvent.change(input, { target: { value: 'John' } });
  expect(input.value).toBe('John');
});
