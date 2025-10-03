// Date utilities for transaction dates

/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 * @returns {string} Today's date
 */
export function getTodayDate() {
  const today = new Date();
  return formatDateToISO(today);
}

/**
 * Format Date object to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
export function formatDateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string to Date object
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date} Date object
 */
export function parseISODate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format date for display (e.g., "Jan 15, 2025")
 * @param {string|Date} date - Date string or Date object
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} Formatted date
 */
export function formatDateForDisplay(date, locale = 'en-US') {
  const dateObj = typeof date === 'string' ? parseISODate(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Validate that date is not in the future
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {object} { valid: boolean, error: string }
 */
export function validateDate(dateString) {
  if (!dateString || dateString.trim() === '') {
    return { valid: false, error: 'Date is required' };
  }
  
  // Validate YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return { valid: false, error: 'Invalid date format (use YYYY-MM-DD)' };
  }
  
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Validate date values
  if (year < 1900 || year > 2100) {
    return { valid: false, error: 'Invalid year' };
  }
  
  if (month < 1 || month > 12) {
    return { valid: false, error: 'Invalid month' };
  }
  
  if (day < 1 || day > 31) {
    return { valid: false, error: 'Invalid day' };
  }
  
  // Check if date is valid (e.g., not Feb 30)
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return { valid: false, error: 'Invalid date' };
  }
  
  // Check if date is in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  if (date > today) {
    return { valid: false, error: 'Date cannot be in the future' };
  }
  
  return { valid: true, error: null };
}

/**
 * Check if date is today
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {boolean}
 */
export function isToday(dateString) {
  return dateString === getTodayDate();
}

/**
 * Get date range options for filtering
 * @returns {object} Date range presets
 */
export function getDateRangePresets() {
  const today = new Date();
  const todayISO = formatDateToISO(today);
  
  // This week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  // This month
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Last 7 days
  const last7Days = new Date(today);
  last7Days.setDate(today.getDate() - 7);
  
  // Last 30 days
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 30);
  
  return {
    today: { start: todayISO, end: todayISO },
    thisWeek: { start: formatDateToISO(startOfWeek), end: todayISO },
    thisMonth: { start: formatDateToISO(startOfMonth), end: todayISO },
    last7Days: { start: formatDateToISO(last7Days), end: todayISO },
    last30Days: { start: formatDateToISO(last30Days), end: todayISO },
  };
}
