export const ROLES = {
  CUSTOMER: 'customer',
  PROVIDER: 'provider',
  ADMIN: 'admin',
};

export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  RESCHEDULED: 'Rescheduled',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SERVICES: '/services',
  SERVICE_DETAIL: '/services/:id',
  BOOKING: '/booking',
  USER_DASHBOARD: '/user/dashboard',
  PROVIDER_DASHBOARD: '/provider/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
  PROFILE: '/profile',
  NOT_FOUND: '*',
};

export const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM',
  '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM',
];

export const SERVICE_CATEGORIES = [
  { id: 'electrician', label: 'Electrician', icon: '⚡', color: 'from-yellow-400 to-amber-500' },
  { id: 'plumber', label: 'Plumber', icon: '🔧', color: 'from-blue-400 to-cyan-500' },
  { id: 'ac-repair', label: 'AC Repair', icon: '❄️', color: 'from-sky-400 to-blue-500' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹', color: 'from-green-400 to-emerald-500' },
  { id: 'painting', label: 'Painting', icon: '🎨', color: 'from-pink-400 to-rose-500' },
  { id: 'carpentry', label: 'Carpentry', icon: '🪵', color: 'from-orange-400 to-amber-500' },
  { id: 'pest-control', label: 'Pest Control', icon: '🐛', color: 'from-lime-400 to-green-500' },
  { id: 'appliance', label: 'Appliances', icon: '🏠', color: 'from-violet-400 to-purple-500' },
];

export const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'reviews', label: 'Most Reviewed' },
];

export const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1500', min: 500, max: 1500 },
  { label: '₹1500 - ₹3000', min: 1500, max: 3000 },
  { label: 'Above ₹3000', min: 3000, max: Infinity },
];
