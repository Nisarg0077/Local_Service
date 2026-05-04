// ──────────────────────────────────────────────
// CATEGORIES
// ──────────────────────────────────────────────
export const categories = [
  'Electrician', 'Plumber', 'AC Repair', 'Cleaning',
  'Painting', 'Carpentry', 'Pest Control', 'Appliances',
];

// ──────────────────────────────────────────────
// USERS
// ──────────────────────────────────────────────
export const mockUsers = [
  {
    id: 'u1', name: 'Rahul Verma', email: 'rahul@demo.com', password: 'Demo@123',
    role: 'customer', phone: '9876543210', avatar: 'https://i.pravatar.cc/150?u=u1',
    address: '12A, Lajpat Nagar, New Delhi', joinedAt: '2023-06-10',
    favorites: [101, 103, 105],
  },
  {
    id: 'u2', name: 'Priya Shah', email: 'priya@demo.com', password: 'Demo@123',
    role: 'customer', phone: '9988776655', avatar: 'https://i.pravatar.cc/150?u=u2',
    address: '45, Andheri West, Mumbai', joinedAt: '2023-09-22',
    favorites: [102],
  },
  {
    id: 'u3', name: 'Admin User', email: 'admin@demo.com', password: 'Admin@123',
    role: 'admin', phone: '9000000001', avatar: 'https://i.pravatar.cc/150?u=u3',
    address: 'HQ, Bangalore', joinedAt: '2022-01-01',
    favorites: [],
  },
];

// ──────────────────────────────────────────────
// PROVIDERS
// ──────────────────────────────────────────────
export const mockProviders = [
  {
    id: 'p1', userId: 'prov1', name: 'Aryan Sharma', email: 'aryan@demo.com', password: 'Demo@123',
    business: 'Aryan Electricals', category: 'Electrician', rating: 4.8, reviews: 120,
    experience: 5, area: 'Delhi South', avatar: 'https://i.pravatar.cc/150?u=p1',
    isAvailable: true, completedJobs: 340, earnings: 89000, bio: 'Certified electrician with 5+ years of residential and commercial experience.',
    verifiedBadge: true, joinedAt: '2022-03-15',
  },
  {
    id: 'p2', userId: 'prov2', name: 'Vikram Singh', email: 'vikram@demo.com', password: 'Demo@123',
    business: 'Vikram Plumbing Works', category: 'Plumber', rating: 4.9, reviews: 85,
    experience: 8, area: 'Delhi East', avatar: 'https://i.pravatar.cc/150?u=p2',
    isAvailable: true, completedJobs: 280, earnings: 72000, bio: 'Expert plumber handling all types of pipe, drainage and sanitation issues.',
    verifiedBadge: true, joinedAt: '2022-01-20',
  },
  {
    id: 'p3', userId: 'prov3', name: 'Neha Joshi', email: 'neha@demo.com', password: 'Demo@123',
    business: 'Neha Deep Cleaning', category: 'Cleaning', rating: 4.7, reviews: 300,
    experience: 3, area: 'Delhi North', avatar: 'https://i.pravatar.cc/150?u=p3',
    isAvailable: false, completedJobs: 512, earnings: 65000, bio: 'Professional cleaning service with eco-friendly products.',
    verifiedBadge: true, joinedAt: '2022-05-10',
  },
  {
    id: 'p4', userId: 'prov4', name: 'Suresh Kumar', email: 'suresh@demo.com', password: 'Demo@123',
    business: 'CoolBreeze AC Services', category: 'AC Repair', rating: 4.6, reviews: 210,
    experience: 6, area: 'West Delhi', avatar: 'https://i.pravatar.cc/150?u=p4',
    isAvailable: true, completedJobs: 420, earnings: 110000, bio: 'Authorized AC service technician for all major brands.',
    verifiedBadge: true, joinedAt: '2021-11-05',
  },
  {
    id: 'p5', userId: 'prov5', name: 'Mohan Lal', email: 'mohan@demo.com', password: 'Demo@123',
    business: 'Color Craft Painting', category: 'Painting', rating: 4.5, reviews: 95,
    experience: 10, area: 'South Delhi', avatar: 'https://i.pravatar.cc/150?u=p5',
    isAvailable: true, completedJobs: 180, earnings: 92000, bio: 'Interior and exterior painting with premium quality paints.',
    verifiedBadge: false, joinedAt: '2022-08-01',
  },
  {
    id: 'p6', userId: 'prov6', name: 'Deepak Carpenter', email: 'deepak@demo.com', password: 'Demo@123',
    business: 'WoodWorks by Deepak', category: 'Carpentry', rating: 4.9, reviews: 140,
    experience: 12, area: 'Noida', avatar: 'https://i.pravatar.cc/150?u=p6',
    isAvailable: true, completedJobs: 230, earnings: 115000, bio: 'Custom furniture, modular kitchens, and all woodwork repairs.',
    verifiedBadge: true, joinedAt: '2021-06-15',
  },
  {
    id: 'p7', userId: 'prov7', name: 'Rajan Pest Control', email: 'rajan@demo.com', password: 'Demo@123',
    business: 'BugFree Services', category: 'Pest Control', rating: 4.4, reviews: 67,
    experience: 4, area: 'Gurgaon', avatar: 'https://i.pravatar.cc/150?u=p7',
    isAvailable: true, completedJobs: 150, earnings: 48000, bio: 'Safe and effective pest control using certified chemicals.',
    verifiedBadge: false, joinedAt: '2023-02-20',
  },
  {
    id: 'p8', userId: 'prov8', name: 'Ananya Repairs', email: 'ananya@demo.com', password: 'Demo@123',
    business: 'HomeAppliance Experts', category: 'Appliances', rating: 4.7, reviews: 180,
    experience: 7, area: 'Bangalore', avatar: 'https://i.pravatar.cc/150?u=p8',
    isAvailable: true, completedJobs: 390, earnings: 98000, bio: 'Washing machine, refrigerator, microwave and TV repairs.',
    verifiedBadge: true, joinedAt: '2021-09-01',
  },
];

// ──────────────────────────────────────────────
// SERVICES
// ──────────────────────────────────────────────
export const mockServices = [
  {
    id: 101, title: 'Home Wiring & Safety Check', category: 'Electrician', providerId: 'p1',
    price: 1500, priceType: 'fixed', rating: 4.8, reviewCount: 98,
    description: 'Complete home electrical wiring check, fault detection, and safety upgrade with certified parts.',
    includes: ['Full wiring inspection', 'MCB & fuse box check', 'Safety certificate', '30-day warranty'],
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80',
    duration: '2-3 hours', popular: true,
  },
  {
    id: 102, title: 'Pipe Leakage Fix', category: 'Plumber', providerId: 'p2',
    price: 399, priceType: 'starting', rating: 4.9, reviewCount: 65,
    description: 'Quick fix for dripping or leaking taps, pipes, and fixtures using high-quality materials.',
    includes: ['Leak detection', 'Pipe repair/replacement', 'Pressure check', '15-day guarantee'],
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
    duration: '1-2 hours', popular: false,
  },
  {
    id: 103, title: 'Sofa & Carpet Deep Cleaning', category: 'Cleaning', providerId: 'p3',
    price: 899, priceType: 'fixed', rating: 4.7, reviewCount: 235,
    description: 'Professional steam foam cleaning for sofas, carpets, and upholstery. Eco-friendly products.',
    includes: ['Pre-vacuum treatment', 'Steam deep cleaning', 'Stain removal', 'Deodorizing'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    duration: '3-4 hours', popular: true,
  },
  {
    id: 104, title: 'Split AC Gas Refill & Service', category: 'AC Repair', providerId: 'p4',
    price: 1200, priceType: 'starting', rating: 4.6, reviewCount: 177,
    description: 'Full AC service including coil cleaning, gas refill, and performance check for all brands.',
    includes: ['Filter cleaning', 'Gas refill', 'Coil wash', 'Performance check'],
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80',
    duration: '1.5-2 hours', popular: true,
  },
  {
    id: 105, title: '2BHK Interior Painting', category: 'Painting', providerId: 'p5',
    price: 8500, priceType: 'starting', rating: 4.5, reviewCount: 62,
    description: 'Full 2BHK home interior painting with premium paints, putty, and primer included.',
    includes: ['Wall putty', 'Primer coat', '2 finish coats', 'Color consultation'],
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80',
    duration: '3-5 days', popular: false,
  },
  {
    id: 106, title: 'Modular Kitchen Installation', category: 'Carpentry', providerId: 'p6',
    price: 15000, priceType: 'starting', rating: 4.9, reviewCount: 110,
    description: 'Full modular kitchen design, fabrication, and installation with quality plywood and hardware.',
    includes: ['Design consultation', 'Material selection', 'Installation', '1-year warranty'],
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    duration: '3-7 days', popular: true,
  },
  {
    id: 107, title: 'Cockroach & Ant Treatment', category: 'Pest Control', providerId: 'p7',
    price: 699, priceType: 'fixed', rating: 4.4, reviewCount: 45,
    description: 'Targeted gel bait treatment for cockroaches and ants. Safe for children and pets.',
    includes: ['Gel bait application', 'All rooms covered', 'Kitchen safety', '3-month guarantee'],
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe39?w=400&q=80',
    duration: '1-2 hours', popular: false,
  },
  {
    id: 108, title: 'Washing Machine Repair', category: 'Appliances', providerId: 'p8',
    price: 499, priceType: 'starting', rating: 4.7, reviewCount: 142,
    description: 'Expert repair for all types of washing machines - front load, top load, semi-automatic.',
    includes: ['Fault diagnosis', 'Repair/part replacement', 'Test wash cycle', '30-day warranty'],
    image: 'https://images.unsplash.com/photo-1626806787461-102c1a7f1b3a?w=400&q=80',
    duration: '1-2 hours', popular: false,
  },
  {
    id: 109, title: 'Full Bathroom Renovation', category: 'Plumber', providerId: 'p2',
    price: 12000, priceType: 'starting', rating: 4.8, reviewCount: 38,
    description: 'Complete bathroom plumbing renovation with premium fittings, tiles, and modern fixtures.',
    includes: ['Demolition & prep', 'New plumbing layout', 'Fitting installation', 'Tiling & finishing'],
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80',
    duration: '5-7 days', popular: false,
  },
  {
    id: 110, title: 'Balcony & Terrace Waterproofing', category: 'Painting', providerId: 'p5',
    price: 4500, priceType: 'starting', rating: 4.3, reviewCount: 28,
    description: 'Chemical waterproofing treatment for balconies, terraces, and bathroom floors.',
    includes: ['Surface preparation', 'Primer coat', 'Waterproofing membrane', '5-year warranty'],
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80',
    duration: '1-2 days', popular: false,
  },
  {
    id: 111, title: 'Home Deep Cleaning (3BHK)', category: 'Cleaning', providerId: 'p3',
    price: 3299, priceType: 'fixed', rating: 4.8, reviewCount: 189,
    description: 'Full 3BHK deep cleaning covering kitchen, bathrooms, bedrooms, and living areas.',
    includes: ['Kitchen degreasing', 'Bathroom scrubbing', 'Floor mopping & dusting', 'Window cleaning'],
    image: 'https://images.unsplash.com/photo-1527515637462-cff94edd56f9?w=400&q=80',
    duration: '6-8 hours', popular: true,
  },
  {
    id: 112, title: 'Ceiling Fan Installation', category: 'Electrician', providerId: 'p1',
    price: 299, priceType: 'fixed', rating: 4.9, reviewCount: 210,
    description: 'Safe and professional ceiling fan installation including hook mounting, wiring, and testing.',
    includes: ['Hook/clamp installation', 'Wiring connection', 'Regulator testing', 'Cleaning'],
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
    duration: '30-45 mins', popular: true,
  },
];

// ──────────────────────────────────────────────
// BOOKINGS
// ──────────────────────────────────────────────
export const mockBookings = [
  {
    id: 'B-1001', customerId: 'u1', providerId: 'p1', serviceId: 101,
    date: '2024-05-15', time: '10:00 AM', status: 'Pending',
    amount: 1500, address: '12A, Lajpat Nagar, New Delhi',
    note: 'Please bring all tools.', createdAt: '2024-05-10T09:00:00Z',
  },
  {
    id: 'B-1002', customerId: 'u1', providerId: 'p2', serviceId: 102,
    date: '2024-04-12', time: '02:00 PM', status: 'Completed',
    amount: 450, address: '12A, Lajpat Nagar, New Delhi',
    note: '', createdAt: '2024-04-08T14:00:00Z',
  },
  {
    id: 'B-1003', customerId: 'u1', providerId: 'p3', serviceId: 103,
    date: '2024-04-20', time: '09:00 AM', status: 'Confirmed',
    amount: 899, address: '12A, Lajpat Nagar, New Delhi',
    note: 'Pet at home - is safe.', createdAt: '2024-04-15T11:00:00Z',
  },
  {
    id: 'B-1004', customerId: 'u1', providerId: 'p4', serviceId: 104,
    date: '2024-03-05', time: '11:00 AM', status: 'Cancelled',
    amount: 1200, address: '12A, Lajpat Nagar, New Delhi',
    note: '', createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'B-1005', customerId: 'u2', providerId: 'p6', serviceId: 106,
    date: '2024-05-20', time: '10:00 AM', status: 'Confirmed',
    amount: 18000, address: '45, Andheri West, Mumbai',
    note: 'Modern design preferred.', createdAt: '2024-05-12T10:00:00Z',
  },
];

// ──────────────────────────────────────────────
// REVIEWS
// ──────────────────────────────────────────────
export const mockReviews = [
  {
    id: 'r1', serviceId: 101, userId: 'u1', userName: 'Rahul V.',
    avatar: 'https://i.pravatar.cc/150?u=u1', rating: 5, comment: 'Excellent work! Aryan was punctual and very professional. Fixed all wiring issues in under 2 hours.',
    date: '2024-03-10',
  },
  {
    id: 'r2', serviceId: 101, userId: 'u2', userName: 'Priya S.',
    avatar: 'https://i.pravatar.cc/150?u=u2', rating: 4, comment: 'Good service, came well-prepared. Fixed the MCB box issue. Minor delay but overall excellent.',
    date: '2024-04-05',
  },
  {
    id: 'r3', serviceId: 103, userId: 'u1', userName: 'Rahul V.',
    avatar: 'https://i.pravatar.cc/150?u=u1', rating: 5, comment: 'The sofa looks brand new! Neha and team were very thorough. Will definitely rebook.',
    date: '2024-02-20',
  },
  {
    id: 'r4', serviceId: 103, userId: 'u2', userName: 'Priya S.',
    avatar: 'https://i.pravatar.cc/150?u=u2', rating: 5, comment: 'Amazing deep cleaning service. Used eco-friendly products that were safe for my kids.',
    date: '2024-04-10',
  },
  {
    id: 'r5', serviceId: 104, userId: 'u1', userName: 'Rahul V.',
    avatar: 'https://i.pravatar.cc/150?u=u1', rating: 4, comment: 'AC is working perfectly after service. Good value for money.',
    date: '2024-01-15',
  },
];

// ──────────────────────────────────────────────
// NOTIFICATIONS
// ──────────────────────────────────────────────
export const mockNotifications = [
  {
    id: 'n1', userId: 'u1', type: 'booking', title: 'Booking Confirmed!',
    message: 'Your booking for Home Wiring has been confirmed by Aryan Sharma.',
    read: false, createdAt: '2024-05-10T10:00:00Z', icon: '✅',
  },
  {
    id: 'n2', userId: 'u1', type: 'reminder', title: 'Service Reminder',
    message: 'Your Sofa Cleaning is scheduled for tomorrow at 9:00 AM.',
    read: false, createdAt: '2024-04-19T08:00:00Z', icon: '🔔',
  },
  {
    id: 'n3', userId: 'u1', type: 'promo', title: '20% Off This Weekend!',
    message: 'Book any cleaning service this weekend and get 20% off.',
    read: true, createdAt: '2024-04-18T12:00:00Z', icon: '🎁',
  },
  {
    id: 'n4', userId: 'u1', type: 'booking', title: 'Payment Successful',
    message: 'Payment of ₹450 received for Pipe Leakage Fix. Invoice sent to email.',
    read: true, createdAt: '2024-04-12T14:30:00Z', icon: '💳',
  },
];

// ──────────────────────────────────────────────
// STATS (Admin)
// ──────────────────────────────────────────────
export const stats = {
  users: 15234, providers: 1045, bookings: 54302, revenue: 8500240,
  pendingApprovals: 5, activeJobs: 312, avgRating: 4.7, refunds: 23,
};

export const revenueChartData = [
  { name: 'Jan', revenue: 420000, bookings: 3200 },
  { name: 'Feb', revenue: 380000, bookings: 2900 },
  { name: 'Mar', revenue: 510000, bookings: 4100 },
  { name: 'Apr', revenue: 490000, bookings: 3800 },
  { name: 'May', revenue: 620000, bookings: 5200 },
  { name: 'Jun', revenue: 580000, bookings: 4600 },
  { name: 'Jul', revenue: 710000, bookings: 5800 },
  { name: 'Aug', revenue: 650000, bookings: 5100 },
  { name: 'Sep', revenue: 780000, bookings: 6300 },
  { name: 'Oct', revenue: 820000, bookings: 6700 },
  { name: 'Nov', revenue: 760000, bookings: 6100 },
  { name: 'Dec', revenue: 890000, bookings: 7200 },
];

export const categoryChartData = [
  { name: 'Cleaning', value: 32, color: '#10B981' },
  { name: 'Electrician', value: 22, color: '#4F46E5' },
  { name: 'Plumber', value: 18, color: '#06B6D4' },
  { name: 'AC Repair', value: 12, color: '#F59E0B' },
  { name: 'Carpentry', value: 9, color: '#EF4444' },
  { name: 'Others', value: 7, color: '#8B5CF6' },
];

export const recentActivityLog = [
  { id: 1, action: 'New user registered', user: 'Amit Mehra', time: '2m ago', type: 'user' },
  { id: 2, action: 'Provider approved', user: 'Rajan Pest Control', time: '15m ago', type: 'provider' },
  { id: 3, action: 'Booking dispute raised', user: 'B-1098', time: '1h ago', type: 'alert' },
  { id: 4, action: 'Refund processed', user: '₹500 to Priya S.', time: '2h ago', type: 'payment' },
  { id: 5, action: 'New service listed', user: 'WoodWorks Painting', time: '3h ago', type: 'service' },
];

// Provider analytics
export const providerEarningsData = [
  { name: 'Mon', earnings: 1200 },
  { name: 'Tue', earnings: 2100 },
  { name: 'Wed', earnings: 800 },
  { name: 'Thu', earnings: 1600 },
  { name: 'Fri', earnings: 2800 },
  { name: 'Sat', earnings: 3200 },
  { name: 'Sun', earnings: 1500 },
];

export const testimonials = [
  {
    id: 1, name: 'Ananya Kapoor', avatar: 'https://i.pravatar.cc/150?img=11',
    service: 'Home Deep Cleaning', rating: 5,
    comment: 'Absolutely amazing service! The team arrived on time and left my home sparkling clean. Highly recommended!',
    city: 'Mumbai',
  },
  {
    id: 2, name: 'Rohan Mehta', avatar: 'https://i.pravatar.cc/150?img=12',
    service: 'AC Repair', rating: 5,
    comment: 'Suresh fixed my AC in under 2 hours. The pricing was transparent with zero hidden fees. Will book again!',
    city: 'Delhi',
  },
  {
    id: 3, name: 'Sunita Patel', avatar: 'https://i.pravatar.cc/150?img=13',
    service: 'Electrical Wiring', rating: 5,
    comment: 'Extremely professional service. Aryan identified the root cause quickly and resolved it. Great experience!',
    city: 'Bangalore',
  },
];
