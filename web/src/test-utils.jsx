import { MemoryRouter } from 'react-router-dom';

/**
 * Custom render function that includes router context
 */
export function renderWithRouter(ui, options = {}) {
  function Wrapper({ children }) {
    return <MemoryRouter initialEntries={[options.route || '/']}>{children}</MemoryRouter>;
  }

  // Import render from @testing-library/react inside the function to avoid circular dependencies
  const { render } = require('@testing-library/react');
  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from testing-library/react
const testingLib = require('@testing-library/react');
Object.keys(testingLib).forEach(key => {
  if (key !== 'render') {
    exports[key] = testingLib[key];
  }
});