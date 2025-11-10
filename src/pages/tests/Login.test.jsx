import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';

test('renders login form inputs', () => {
  render(<Login />);
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});

test('shows validation errors for empty input', async () => {
  render(<Login />);
  fireEvent.click(screen.getByText(/submit/i));
  expect(await screen.findAllByText(/required/i)).toHaveLength(2);
});
