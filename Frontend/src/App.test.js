import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders main content area', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const mainContent = screen.getByRole('main');
  expect(mainContent).toBeInTheDocument();
});

test('renders navigation with accessible label', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const nav = screen.getByRole('navigation', { name: /navegación principal/i });
  expect(nav).toBeInTheDocument();
});
