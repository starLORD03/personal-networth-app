// Transaction categories with fallback defaults

export const EXPENSE_CATEGORIES = [
  // Housing
  { id: 'rent-mortgage', name: 'Rent / Mortgage', icon: 'home', color: '#EF4444' },
  { id: 'utilities', name: 'Utilities', icon: 'flash', color: '#F59E0B' },
  { id: 'internet-mobile', name: 'Internet & Mobile', icon: 'phone-portrait', color: '#8B5CF6' },
  { id: 'home-maintenance', name: 'Home Maintenance', icon: 'construct', color: '#6B7280' },
  { id: 'furniture-appliances', name: 'Furniture & Appliances', icon: 'bed', color: '#059669' },
  
  // Food
  { id: 'groceries', name: 'Groceries', icon: 'cart', color: '#10B981' },
  { id: 'restaurants', name: 'Restaurants', icon: 'restaurant', color: '#F97316' },
  { id: 'cafes', name: 'Cafes / Coffee', icon: 'cafe', color: '#92400E' },
  { id: 'takeout', name: 'Takeout / Delivery', icon: 'fast-food', color: '#DC2626' },
  { id: 'snacks-beverages', name: 'Snacks & Beverages', icon: 'ice-cream', color: '#EC4899' },
  
  // Transportation
  { id: 'fuel', name: 'Fuel', icon: 'speedometer', color: '#7C3AED' },
  { id: 'public-transport', name: 'Public Transport', icon: 'bus', color: '#2563EB' },
  { id: 'ride-hailing', name: 'Taxi / Ride-hailing', icon: 'car', color: '#0891B2' },
  { id: 'parking', name: 'Parking', icon: 'stopwatch', color: '#64748B' },
  { id: 'vehicle-maintenance', name: 'Vehicle Maintenance', icon: 'build', color: '#475569' },
  
  // Shopping
  { id: 'online-shopping', name: 'Online Shopping', icon: 'bag', color: '#F472B6' },
  { id: 'clothes-accessories', name: 'Clothes & Accessories', icon: 'shirt', color: '#A855F7' },
  { id: 'electronics', name: 'Electronics', icon: 'phone-portrait', color: '#3B82F6' },
  { id: 'personal-care', name: 'Personal Care', icon: 'sparkles', color: '#EC4899' },
  { id: 'household-items', name: 'Household Items', icon: 'pricetag', color: '#14B8A6' },
  
  // Entertainment
  { id: 'movies-shows', name: 'Movies / Shows', icon: 'film', color: '#DC2626' },
  { id: 'music-streaming', name: 'Music / Streaming', icon: 'musical-notes', color: '#7C3AED' },
  { id: 'games', name: 'Games', icon: 'game-controller', color: '#2563EB' },
  { id: 'hobbies', name: 'Hobbies', icon: 'color-palette', color: '#F59E0B' },
  
  // Financial
  { id: 'loan-payments', name: 'Loan Payments', icon: 'card', color: '#DC2626' },
  { id: 'credit-card', name: 'Credit Card', icon: 'card', color: '#EF4444' },
  { id: 'insurance', name: 'Insurance', icon: 'shield-checkmark', color: '#059669' },
  { id: 'investments', name: 'Investments', icon: 'trending-up', color: '#10B981' },
  { id: 'savings', name: 'Savings', icon: 'wallet', color: '#0891B2' },
  { id: 'taxes', name: 'Taxes', icon: 'document-text', color: '#7C3AED' },
  
  // Health & Fitness
  { id: 'doctor-hospital', name: 'Doctor / Hospital', icon: 'medical', color: '#DC2626' },
  { id: 'pharmacy', name: 'Pharmacy', icon: 'medkit', color: '#EF4444' },
  { id: 'health-insurance', name: 'Health Insurance', icon: 'fitness', color: '#10B981' },
  { id: 'fitness', name: 'Gym / Fitness', icon: 'barbell', color: '#F97316' },
  { id: 'sports', name: 'Sports', icon: 'football', color: '#3B82F6' },
  
  // Education
  { id: 'tuition-fees', name: 'Tuition Fees', icon: 'school', color: '#7C3AED' },
  { id: 'courses-training', name: 'Courses / Training', icon: 'book', color: '#2563EB' },
  { id: 'books-material', name: 'Books & Material', icon: 'library', color: '#059669' },
  { id: 'office-supplies', name: 'Office Supplies', icon: 'briefcase', color: '#64748B' },
  
  // Travel
  { id: 'flights-train-bus', name: 'Travel Tickets', icon: 'airplane', color: '#0EA5E9' },
  { id: 'hotels', name: 'Hotels', icon: 'bed', color: '#8B5CF6' },
  { id: 'tours-activities', name: 'Tours / Activities', icon: 'compass', color: '#10B981' },
  { id: 'visa-travel-insurance', name: 'Travel Insurance', icon: 'document', color: '#6366F1' },
  
  // Subscriptions
  { id: 'subscriptions-saas', name: 'Subscriptions', icon: 'repeat', color: '#6366F1' },
  
  // Others
  { id: 'childcare', name: 'Childcare', icon: 'people', color: '#EC4899' },
  { id: 'gifts-donations', name: 'Gifts & Donations', icon: 'gift', color: '#F472B6' },
  { id: 'pet-care', name: 'Pet Care', icon: 'paw', color: '#92400E' },
  { id: 'events-celebrations', name: 'Events', icon: 'balloon', color: '#F59E0B' },
  { id: 'other', name: 'Other', icon: 'ellipsis-horizontal', color: '#6B7280' },
];

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', icon: 'cash', color: '#10B981' },
  { id: 'business', name: 'Business Income', icon: 'briefcase', color: '#3B82F6' },
  { id: 'freelance', name: 'Freelance', icon: 'code-slash', color: '#8B5CF6' },
  { id: 'investment-returns', name: 'Investment Returns', icon: 'trending-up', color: '#059669' },
  { id: 'rental', name: 'Rental Income', icon: 'home', color: '#0891B2' },
  { id: 'interest', name: 'Interest', icon: 'stats-chart', color: '#10B981' },
  { id: 'dividends', name: 'Dividends', icon: 'pie-chart', color: '#14B8A6' },
  { id: 'bonus', name: 'Bonus', icon: 'gift', color: '#F59E0B' },
  { id: 'refund', name: 'Refund', icon: 'arrow-undo', color: '#6366F1' },
  { id: 'gift-received', name: 'Gift Received', icon: 'heart', color: '#EC4899' },
  { id: 'other-income', name: 'Other Income', icon: 'add-circle', color: '#6B7280' },
];

// Get all categories
export function getAllCategories() {
  return [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
}

// Get category by ID
export function getCategoryById(id) {
  return getAllCategories().find(cat => cat.id === id);
}

// Get categories by type
export function getCategoriesByType(type = 'expense') {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

// Get popular categories
export function getPopularCategories(limit = 8) {
  return EXPENSE_CATEGORIES.slice(0, limit);
}
