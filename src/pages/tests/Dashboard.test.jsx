import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDoctorDashboard from '../AdminDoctorDashboard';
import axios from 'axios';

jest.mock('axios');

test('shows Delete Doctor form when Delete Doctor button clicked', () => {
  render(
    <MemoryRouter>
      <AdminDoctorDashboard />
    </MemoryRouter>
  );

  const deleteButton = screen.getByText(/Delete Doctor/i);
  fireEvent.click(deleteButton);

  const deleteForm = screen.getByPlaceholderText(/Enter Doctor ID to delete/i);
  expect(deleteForm).toBeInTheDocument();
});
