import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
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
      const qs = new URLSearchParams(query).toString();
      const baseUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await axios.get(`${baseUrl}/leads?${qs}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setLeads(response.data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed loading leads');
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
      setError('API token is required');
      return;
    }

    localStorage.setItem('adminToken', value);
    setAuthToken(value);
    setError('');
  }

  async function updateStatus(id, nextStatus) {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await axios.patch(
        `${baseUrl}/leads/${id}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setLeads((current) =>
        current.map((lead) => (lead.id === id ? response.data : lead))
      );
    } catch {
      setError('Status update failed');
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
              This keeps the dashboard simple and deployable without introducing a full authentication system.
            </p>
            <form onSubmit={login} className="mt-8 space-y-4">
              <label className="field">
                <span>Admin Token</span>
                <input name="token" className="input" placeholder="Token from environment config" />
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
                Reviewing incoming service requests for Gold Coast and Brisbane.
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
                Current lead routing is optimised for Gold Coast, Brisbane Metro, and nearby growth suburbs. The dashboard stays intentionally simple, but still supports real follow-up workflow.
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
