// Formatting
export const formatCurrency = (amount, currency = '₹') =>
  `${currency}${Number(amount).toLocaleString('en-IN')}`;

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatRelativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const formatRating = (rating) => Number(rating).toFixed(1);

// Validation
export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePhone = (phone) =>
  /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = [
    { label: 'Weak', color: 'bg-danger' },
    { label: 'Fair', color: 'bg-accent' },
    { label: 'Good', color: 'bg-secondary' },
    { label: 'Strong', color: 'bg-success' },
  ];
  return { score, ...(map[score - 1] || { label: '', color: '' }) };
};

// JWT helpers (mock)
export const parseJwtPayload = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 < Date.now();
};

// Mock JWT generator
export const generateMockToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours
  const payload = btoa(JSON.stringify({ ...user, exp }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

// Misc
export const getInitials = (name) => (name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
export const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-');
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};

export const classNames = (...classes) => classes.filter(Boolean).join(' ');
