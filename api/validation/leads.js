export const URGENCY_VALUES = ['low', 'medium', 'emergency'];
export const CONTACT_TIME_VALUES = ['any', 'morning', 'afternoon', 'evening'];
export const SOURCE_VALUES = ['webform', 'call'];
export const ADMIN_STATUSES = ['new', 'contacted', 'booked'];

function normalizeWhitespace(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function normalizeEmail(value) {
  const email = normalizeWhitespace(value).toLowerCase();
  if (!email) {
    return '';
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function normalizePhone(value) {
  const phone = normalizeWhitespace(value);
  if (!phone) {
    return '';
  }

  return /^[0-9+()\-\s]{8,20}$/.test(phone) ? phone : null;
}

function normalizeChoice(value, allowedValues, fallback = '') {
  const input = normalizeWhitespace(value).toLowerCase();
  if (!input) {
    return fallback;
  }

  return allowedValues.includes(input) ? input : null;
}

function normalizeServiceType(value) {
  const serviceType = normalizeWhitespace(value);
  return serviceType ? serviceType.slice(0, 100) : '';
}

function normalizeSuburb(value) {
  return normalizeWhitespace(value).slice(0, 100);
}

function normalizeMessage(value) {
  return normalizeWhitespace(value).slice(0, 2000);
}

function normalizePage(value) {
  const page = normalizeWhitespace(value);
  return page ? page.slice(0, 255) : '';
}

export function normalizeStatus(value) {
  return normalizeChoice(value, ADMIN_STATUSES);
}

export function coerceOptionalTimestamp(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function buildLeadPayload(input = {}) {
  const name = normalizeWhitespace(input.name).slice(0, 255);
  const phone = normalizePhone(input.phone);
  const email = normalizeEmail(input.email);
  const serviceType = normalizeServiceType(input.service_type);
  const urgency = normalizeChoice(input.urgency, URGENCY_VALUES, 'medium');
  const suburb = normalizeSuburb(input.suburb);
  const contactTime = normalizeChoice(input.contact_time, CONTACT_TIME_VALUES, 'any');
  const message = normalizeMessage(input.message);
  const source = normalizeChoice(input.source, SOURCE_VALUES, 'webform');
  const page = normalizePage(input.page);
  const nextActionAt = coerceOptionalTimestamp(input.next_action_at);
  const assignedTo = normalizeWhitespace(input.assigned_to).slice(0, 255);
  const rawQuoteAmount = input.quote_amount === '' ? null : input.quote_amount;
  const quoteAmount = rawQuoteAmount === null || rawQuoteAmount === undefined ? null : Number(rawQuoteAmount);
  const fields = {};

  if (!name) fields.name = 'Required';
  if (phone === '') fields.phone = 'Required';
  if (!serviceType) fields.service_type = 'Required';
  if (phone === null) fields.phone = 'Must be a valid phone number';
  if (email === null) fields.email = 'Must be a valid email address';
  if (urgency === null) fields.urgency = `Must be one of: ${URGENCY_VALUES.join(', ')}`;
  if (contactTime === null) fields.contact_time = `Must be one of: ${CONTACT_TIME_VALUES.join(', ')}`;
  if (source === null) fields.source = 'Must be webform or call';
  if (input.next_action_at && nextActionAt === null) fields.next_action_at = 'Must be a valid ISO date-time';
  if (rawQuoteAmount !== null && rawQuoteAmount !== undefined && (!Number.isFinite(quoteAmount) || quoteAmount < 0)) {
    fields.quote_amount = 'Must be a positive number';
  }

  if (Object.keys(fields).length) {
    return {
      ok: false,
      message: 'Validation failed',
      fields
    };
  }

  return {
    ok: true,
    value: {
      name,
      phone,
      email,
      service_type: serviceType,
      urgency,
      suburb,
      contact_time: contactTime,
      message,
      source,
      page,
      next_action_at: nextActionAt,
      assigned_to: assignedTo || null,
      quote_amount: rawQuoteAmount === null || rawQuoteAmount === undefined ? null : quoteAmount
    }
  };
}

export function buildLeadQueryFilters(query = {}) {
  const conditions = [];
  const values = [];
  const fields = {};
  const serviceType = normalizeServiceType(query.service_type);
  const status = normalizeStatus(query.status);

  if (serviceType) {
    values.push(serviceType);
    conditions.push(`service_type = $${values.length}`);
  }

  if (query.status) {
    if (!status) {
      fields.status = `Must be one of: ${ADMIN_STATUSES.join(', ')}`;
    } else {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }
  }

  if (query.from) {
    const fromDate = new Date(query.from);
    if (Number.isNaN(fromDate.getTime())) {
      fields.from = 'Must be a valid date';
    } else {
      values.push(fromDate.toISOString());
      conditions.push(`created_at >= $${values.length}`);
    }
  }

  if (query.to) {
    const toDate = new Date(`${query.to}T23:59:59`);
    if (Number.isNaN(toDate.getTime())) {
      fields.to = 'Must be a valid date';
    } else {
      values.push(toDate.toISOString());
      conditions.push(`created_at <= $${values.length}`);
    }
  }

  if (Object.keys(fields).length) {
    return {
      ok: false,
      message: 'Invalid query parameters',
      fields
    };
  }

  return {
    ok: true,
    value: { conditions, values }
  };
}
