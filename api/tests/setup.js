// This file is loaded by Jest BEFORE any test files
// It ensures our test environment variables are set before any modules are imported

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.ADMIN_TOKEN = 'secret-token';
// Always use test database for integration tests to avoid conflicts
process.env.DATABASE_URL = 'postgres://localhost:5432/lead_capture_plumbing_test';

console.log('Test environment setup complete:', {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
  ADMIN_TOKEN_SET: !!process.env.ADMIN_TOKEN
});