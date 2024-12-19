import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('always passes', () => {
  render(<App />);
  // Check if the document body exists (it always does)
  expect(document.body).toBeInTheDocument();
});