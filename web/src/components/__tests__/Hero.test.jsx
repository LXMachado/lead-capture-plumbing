import { renderWithRouter, screen } from '../../test-utils';
import Hero from '../Hero';

describe('Hero', () => {
  test('renders without crashing', () => {
    renderWithRouter(<Hero />);
    expect(screen.getByText(/Available 24\/7/i)).toBeInTheDocument();
  });
});