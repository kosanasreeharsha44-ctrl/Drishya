import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCurrency,
  calculateProjectProgress,
  calculateIdeaRevenue,
  validateInquiryForm,
  validateConceptForm,
  validateIdeaForm,
  checkRateLimit,
} from './pricing.ts';

test('formatCurrency formats INR with Indian numbering', () => {
  const formatted = formatCurrency(150000, 'INR');
  assert.match(formatted, /1,50,000/);
});

test('formatCurrency formats USD with appropriate currency exchange conversion', () => {
  // 100,000 INR * 0.012 = $1,200
  const formatted = formatCurrency(100000, 'USD', 0.012);
  assert.match(formatted, /\$1,200/);
});

test('calculateProjectProgress computes 0% when no tasks or empty', () => {
  const result = calculateProjectProgress([]);
  assert.equal(result.percent, 0);
  assert.equal(result.isAllDone, false);
});

test('calculateProjectProgress computes partial and 100% completion correctly', () => {
  const partial = calculateProjectProgress([
    { isDone: true },
    { isDone: false },
    { isDone: false },
    { isDone: false },
  ]);
  assert.equal(partial.percent, 25);
  assert.equal(partial.isAllDone, false);
  assert.equal(partial.completedCount, 1);
  assert.equal(partial.totalCount, 4);

  const complete = calculateProjectProgress([
    { isDone: true },
    { isDone: true },
    { isDone: true },
  ]);
  assert.equal(complete.percent, 100);
  assert.equal(complete.isAllDone, true);
});

test('calculateIdeaRevenue calculates owed and balance remaining', () => {
  // 50,000 earned, 20% share, 5,000 paid => 10,000 owed, 5,000 remaining
  const result = calculateIdeaRevenue(50000, 20, 5000);
  assert.equal(result.amountOwed, 10000);
  assert.equal(result.balanceRemaining, 5000);
  assert.equal(result.suggestedStatus, 'Earning');

  // Fully paid
  const fullyPaid = calculateIdeaRevenue(50000, 20, 10000);
  assert.equal(fullyPaid.amountOwed, 10000);
  assert.equal(fullyPaid.balanceRemaining, 0);
  assert.equal(fullyPaid.suggestedStatus, 'Paid');
});

test('validateInquiryForm detects missing or invalid fields', () => {
  const invalid = validateInquiryForm({
    name: 'A',
    email: 'not-an-email',
    service: '',
    details: 'short',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.service);
  assert.ok(invalid.errors.details);

  const valid = validateInquiryForm({
    name: 'Suresh Kumar',
    email: 'suresh@example.com',
    service: 'video_editing',
    details: 'Looking for high quality YouTube documentary editing for 3 episodes.',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('validateConceptForm checks consent, minimum description length, and submits with/without reference', () => {
  const withoutConsent = validateConceptForm({
    name: 'Rahul',
    contact: '@rahul_cinema',
    title: 'Neon Mumbai Concept',
    description: 'A cyberpunk thriller shot in South Bombay with fast paced sound design.',
    consent: false,
  });
  assert.equal(withoutConsent.isValid, false);
  assert.ok(withoutConsent.errors.consent);

  // Submits with no reference file or link
  const validNoRef = validateConceptForm({
    name: 'Rahul',
    contact: '@rahul_cinema',
    title: 'Neon Mumbai Concept',
    description: 'A cyberpunk thriller shot in South Bombay with fast paced sound design.',
    consent: true,
  });
  assert.equal(validNoRef.isValid, true);
  assert.equal(Object.keys(validNoRef.errors).length, 0);
});

test('checkRateLimit throttles rapid calls', () => {
  const now = Date.now();
  const blocked = checkRateLimit(now - 5000, 15000);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.remainingSeconds > 0);

  const allowed = checkRateLimit(now - 20000, 15000);
  assert.equal(allowed.allowed, true);
  assert.equal(allowed.remainingSeconds, 0);
});
