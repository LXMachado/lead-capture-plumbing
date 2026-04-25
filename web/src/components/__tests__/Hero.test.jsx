import { renderWithRouter, screen } from '../../test-utils';
import Hero from '../Hero';

describe('Hero', () => {
  test('renders without crashing', () => {
    renderWithRouter(<Hero />);
    expect(screen.getByRole('heading', { name: /Trusted Gold Coast Plumbing/i })).toBeInTheDocument();
  });
});
