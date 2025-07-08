import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Devices from './Devices';
import '@testing-library/jest-dom';

describe('Devices Page', () => {
  it('renders Devices page title', () => {
    render(<Devices />);
    expect(screen.getByText(/Devices/i)).toBeInTheDocument();
  });

  it('shows validation error when adding device with empty name', async () => {
    render(<Devices />);
    fireEvent.click(screen.getByRole('button', { name: /Add Device/i }));
    const idInput = screen.getByPlaceholderText('ID');
    fireEvent.change(idInput, { target: { value: 'test-id' } });
    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
  });
}); 