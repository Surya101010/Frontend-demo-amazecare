import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AmazeCare title', () => {
  render(<App />);
  const title = screen.getByText(/AmazeCare/i);
  expect(title).toBeInTheDocument();
});
