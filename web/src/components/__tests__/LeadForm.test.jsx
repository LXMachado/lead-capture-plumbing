import { renderWithRouter, screen } from '../../test-utils';
import LeadForm from '../LeadForm';
import { vi } from 'vitest';

// Mock axios to prevent actual API calls
vi.mock('axios');

describe('LeadForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders without crashing', () => {
    renderWithRouter(<LeadForm />);
    expect(screen.getByRole('heading', { name: /get a quick quote/i })).toBeInTheDocument();
  });

  test('shows form fields', () => {
    renderWithRouter(<LeadForm />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/suburb/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  test('has submit button', () => {
    renderWithRouter(<LeadForm />);
    const submitButton = screen.getByRole('button', { name: /send priority request/i });
    expect(submitButton).toBeInTheDocument();
  });
});