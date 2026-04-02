import { useState } from 'react';
import { Route, Routes, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import { business } from './data/siteContent';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
  { to: '/admin', label: 'Lead Portal' }
];

const linkClass = ({ isActive }) =>
  `nav-link${isActive ? ' nav-link-active' : ''}`;

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-50 border-b border-outline-variant/15 bg-white/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <NavLink
              to="/"
              className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-primary sm:text-base"
            >
              {business.name}
            </NavLink>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center p-2 md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <NavLink
              to="/contact"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/6 lg:inline-flex"
            >
              Request Quote
            </NavLink>
            <a href={business.phoneHref} className="btn btn-emergency text-sm">
              Emergency Call
            </a>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="flex flex-col border-t border-outline-variant/15 bg-white px-4 py-4 md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-base font-semibold text-primary transition hover:bg-primary/6"
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 block rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Request Quote
            </NavLink>
          </nav>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      <footer className="bg-[#11192d] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <p className="font-display text-lg font-extrabold">{business.legalName}</p>
            <p className="max-w-sm text-sm text-white/72">
              Excellence in high-end plumbing infrastructure. Managing precision flow across South East Queensland.
            </p>
          </div>
          <div className="space-y-3 text-sm text-white/72">
            <p className="footer-heading">Services</p>
            <p>Emergency Plumbing</p>
            <p>Hot Water Systems</p>
            <p>Blocked Drains</p>
          </div>
          <div className="space-y-3 text-sm text-white/72">
            <p className="footer-heading">Local</p>
            <p>Gold Coast</p>
            <p>Brisbane</p>
            <p>Ipswich</p>
          </div>
        </div>
      </footer>

      <a href={business.phoneHref} className="mobile-call md:hidden">
        Call {business.phoneDisplay}
      </a>
    </div>
  );
}
