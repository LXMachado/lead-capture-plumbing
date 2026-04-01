import axios from 'axios';
import { useState } from 'react';
import { serviceOptions, urgencyOptions } from '../data/siteContent';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  service_type: '',
  urgency: 'medium',
  suburb: '',
  contact_time: '',
  message: ''
};

export default function LeadForm({
  title = 'Get a Quick Quote',
  subtitle = "We'll respond as soon as possible with the next step.",
  compact = false
}) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.phone || !form.service_type) {
      setStatus({ type: 'error', message: 'Name, phone, and service type are required.' });
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '/api';
      await axios.post(`${baseUrl}/leads`, form, {
        headers: { 'Content-Type': 'application/json' }
      });
      setStatus({ type: 'success', message: 'Request received. We will contact you shortly.' });
      setForm(initialForm);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || 'Submission failed. Please call if the issue is urgent.'
      });
    }
  };

  return (
    <form onSubmit={submit} className={`quote-form${compact ? ' quote-form-compact' : ''}`}>
      <div className="space-y-2">
        <h2 className="font-display text-3xl font-extrabold tracking-[-0.03em] text-primary">
          {title}
        </h2>
        <p className="text-sm leading-6 text-secondary">{subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field">
          <span>Full Name</span>
          <input value={form.name} onChange={update('name')} placeholder="John Doe" className="input" />
        </label>
        <label className="field">
          <span>Phone Number</span>
          <input value={form.phone} onChange={update('phone')} placeholder="0400 000 000" className="input" />
        </label>
        <label className="field">
          <span>Email</span>
          <input value={form.email} onChange={update('email')} placeholder="name@email.com" className="input" />
        </label>
        <label className="field">
          <span>Suburb</span>
          <input value={form.suburb} onChange={update('suburb')} placeholder="Robina" className="input" />
        </label>
        <label className="field">
          <span>Service Type</span>
          <select value={form.service_type} onChange={update('service_type')} className="input">
            <option value="">Select a service</option>
            {serviceOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Urgency</span>
          <select value={form.urgency} onChange={update('urgency')} className="input">
            {urgencyOptions.map((urgency) => (
              <option key={urgency} value={urgency}>
                {urgency}
              </option>
            ))}
          </select>
        </label>
        <label className="field sm:col-span-2">
          <span>Preferred Contact Time</span>
          <input
            value={form.contact_time}
            onChange={update('contact_time')}
            placeholder="Call after 3pm"
            className="input"
          />
        </label>
      </div>

      <label className="field">
        <span>Problem Description</span>
        <textarea
          value={form.message}
          onChange={update('message')}
          placeholder="Briefly describe the issue..."
          className="input min-h-32 resize-y"
        />
      </label>

      {status ? (
        <div className={`form-status ${status.type === 'success' ? 'form-status-success' : 'form-status-error'}`}>
          {status.message}
        </div>
      ) : null}

      <button type="submit" className="btn btn-form-submit">
        Send Priority Request
      </button>
    </form>
  );
}
