import { useEffect, useMemo, useState } from 'react';
import { adminStatuses, serviceOptions } from '../data/siteContent';

const statusTone = {
  new: 'pill-blue',
  contacted: 'pill-neutral',
  booked: 'pill-green'
};

const urgencyTone = {
  low: 'pill-low',
  medium: 'pill-medium',
  emergency: 'pill-critical'
};

const DEMO_MODE = true;

// Demo leads for display when no API is connected
const demoLeads = [
  { id: 1, name: 'Sarah Mitchell', phone: '0400 123 456', email: 'sarah@example.com', suburb: 'Robina', service_type: 'Hot Water Repair', urgency: 'emergency', status: 'new', message: 'No hot water - urgent!', created_at: new Date().toISOString() },
  { id: 2, name: 'James Wilson', phone: '0412 987 654', email: 'james@example.com', suburb: 'Broadbeach', service_type: 'Leak Detection', urgency: 'medium', status: 'contacted', message: 'Slow leak under kitchen sink', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, name: 'Emily Chen', phone: '0405 555 888', email: 'emily@example.com', suburb: 'Surfers Paradise', service_type: 'Blocked Drain', urgency: 'low', status: 'booked', message: 'Slow draining shower', created_at: new Date(Date.now() - 172800000).toISOString() },
];

export default function AdminPage() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('adminToken') || '');
  const [query, setQuery] = useState({ service_type: '', status: '', from: '', to: '' });
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState('');

  const isLoggedIn = useMemo(() => Boolean(authToken), [authToken]);
  const emergencyCount = leads.filter((lead) => lead.urgency === 'emergency').length;
  const bookedCount = leads.filter((lead) => lead.status === 'booked').length;

  async function fetchLeads() {
    if (!isLoggedIn) return;

    try {
      if (DEMO_MODE) {
        // Filter demo leads based on query
        let filtered = [...demoLeads];
        if (query.service_type) {
          filtered = filtered.filter(l => l.service_type === query.service_type);
        }
        if (query.status) {
          filtered = filtered.filter(l => l.status === query.status);
        }
        setLeads(filtered);
        setError('');
      } else {
        const qs = new URLSearchParams(query).toString();
        const baseUrl = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${baseUrl}/leads?${qs}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const data = await response.json();
        setLeads(data);
        setError('');
      }
    } catch (err) {
      setError('Failed loading leads');
      setLeads([]);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchLeads();
    }
  }, [isLoggedIn]);

  function login(event) {
    event.preventDefault();
    const value = event.target.token.value.trim();

    if (!value) {
      setError('Admin token is required');
      return;
    }

    localStorage.setItem('adminToken', value);
    setAuthToken(value);
    setError('');
  }

  async function updateStatus(id, nextStatus) {
    if (DEMO_MODE) {
      setLeads((current) =>
        current.map((lead) => (lead.id === id ? { ...lead, status: nextStatus } : lead))
      );
    } else {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(
          `${baseUrl}/leads/${id}/status`,
          {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({ status: nextStatus })
          }
        );
        const updated = await response.json();
        setLeads((current) =>
          current.map((lead) => (lead.id === id ? updated : lead))
        );
      } catch {
        setError('Status update failed');
      }
    }
  }

  if (!isLoggedIn) {
    return (
      <section className="section-block section-surface">
        <div className="site-shell">
          <div className="mx-auto max-w-xl rounded-[32px] bg-surface-container-lowest p-8 shadow-soft">
            <p className="eyebrow">Admin Portal</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.03em] text-primary">
              Unlock lead management
            </h1>
            <p className="mt-4 text-base leading-8 text-secondary">
              Demo mode active - enter any token to view sample leads.
            </p>
            <form onSubmit={login} className="mt-8 space-y-4">
              <label className="field">
                <span>Admin Token</span>
                <input name="token" className="input" placeholder="Enter any token for demo" />
              </label>
              {error ? <p className="form-status form-status-error">{error}</p> : null}
              <button type="submit" className="btn btn-form-submit">
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-extrabold text-primary">Admin Portal</h1>
          <p className="text-sm text-secondary">Lead Management</p>
        </div>

        <nav className="admin-nav">
          <a className="admin-nav-link" href="#overview">Dashboard</a>
          <a className="admin-nav-link admin-nav-link-active" href="#leads">Leads</a>
          <a className="admin-nav-link" href="#coverage">Coverage</a>
          <a className="admin-nav-link" href="#filters">Filters</a>
          <button
            type="button"
            className="btn btn-secondary mt-6"
            onClick={() => {
              localStorage.removeItem('adminToken');
              setAuthToken('');
            }}
          >
            Sign Out
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <section id="overview" className="space-y-10">
          <header className="admin-header">
            <div>
              <h2 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-on-surface">
                Lead Management
              </h2>
              <p className="mt-2 text-base leading-8 text-secondary">
                Demo mode - viewing sample leads for Gold Coast and Brisbane.
              </p>
            </div>

            <div className="admin-filter-row" id="filters">
              <select
                value={query.service_type}
                onChange={(event) => setQuery((prev) => ({ ...prev, service_type: event.target.value }))}
                className="input"
              >
                <option value="">All services</option>
                {serviceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                value={query.status}
                onChange={(event) => setQuery((prev) => ({ ...prev, status: event.target.value }))}
                className="input"
              >
                <option value="">All status</option>
                {adminStatuses.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={query.from}
                onChange={(event) => setQuery((prev) => ({ ...prev, from: event.target.value }))}
                className="input"
              />
              <input
                type="date"
                value={query.to}
                onChange={(event) => setQuery((prev) => ({ ...prev, to: event.target.value }))}
                className="input"
              />
              <button type="button" onClick={fetchLeads} className="btn btn-secondary">
                Apply Filters
              </button>
            </div>
          </header>

          <div className="admin-stats">
            <article className="admin-stat-card admin-stat-card-primary">
              <p>Total Leads</p>
              <strong>{leads.length}</strong>
              <span>Current filtered view</span>
            </article>
            <article className="admin-stat-card admin-stat-card-alert">
              <p>Emergency Calls</p>
              <strong>{emergencyCount}</strong>
              <span>Urgency marked emergency</span>
            </article>
            <article className="admin-stat-card admin-stat-card-tertiary">
              <p>Booked Jobs</p>
              <strong>{bookedCount}</strong>
              <span>Status updated to booked</span>
            </article>
          </div>

          {error ? <p className="form-status form-status-error">{error}</p> : null}

          <section id="leads" className="admin-table-wrap">
            <div className="admin-table-head">
              <div>
                <h3 className="font-display text-2xl font-bold text-on-surface">Incoming Leads</h3>
                <p className="text-sm text-secondary">Operational view for rapid follow-up and dispatch.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Service Type</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    <th>Date / Time</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-secondary">
                        No leads found.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <div className="lead-cell">
                            <div className="lead-avatar">
                              {lead.name
                                .split(' ')
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join('')}
                            </div>
                            <div>
                              <p className="font-semibold text-on-surface">{lead.name}</p>
                              <p className="text-xs text-secondary">
                                {lead.suburb || 'Location not provided'}
                              </p>
                              <p className="text-xs text-secondary">{lead.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td>{lead.service_type}</td>
                        <td>
                          <span className={`status-pill ${urgencyTone[lead.urgency] || 'pill-medium'}`}>
                            {lead.urgency}
                          </span>
                        </td>
                        <td>
                          <select
                            className={`admin-status-select ${statusTone[lead.status] || 'pill-blue'}`}
                            value={lead.status}
                            onChange={(event) => updateStatus(lead.id, event.target.value)}
                          >
                            {adminStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div className="space-y-1">
                            <p>{new Date(lead.created_at).toLocaleDateString()}</p>
                            <p className="text-xs text-secondary">
                              {new Date(lead.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section id="coverage" className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="coverage-card">
              <h3 className="font-display text-3xl font-bold tracking-[-0.03em] text-primary">
                Active Service Coverage
              </h3>
              <p className="mt-4 text-base leading-8 text-secondary">
                Demo mode - sample data shown for illustration purposes.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-secondary">
                <li>Gold Coast: highest activity</li>
                <li>Brisbane Metro: normal flow</li>
                <li>Ipswich: limited availability</li>
              </ul>
            </div>
            <div className="coverage-map" />
          </section>
        </section>
      </main>
    </div>
  );
}