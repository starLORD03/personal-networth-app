// Currency utilities for handling different currencies (INR, USD, EUR, JPY, etc.)

export const CURRENCY_CONFIG = {
  INR: { symbol: '₹', decimals: 2, locale: 'en-IN', name: 'Indian Rupee' },
  USD: { symbol: '$', decimals: 2, locale: 'en-US', name: 'US Dollar' },
  EUR: { symbol: '€', decimals: 2, locale: 'de-DE', name: 'Euro' },
  JPY: { symbol: '¥', decimals: 0, locale: 'ja-JP', name: 'Japanese Yen' },
  GBP: { symbol: '£', decimals: 2, locale: 'en-GB', name: 'British Pound' },
  AUD: { symbol: 'A$', decimals: 2, locale: 'en-AU', name: 'Australian Dollar' },
  CAD: { symbol: 'C$', decimals: 2, locale: 'en-CA', name: 'Canadian Dollar' },
};

/**
 * Convert display amount to minor units (paise/cents)
 * @param {string|number} amount - The amount in major units (e.g., 1234.50)
 * @param {string} currency - Currency code (INR, USD, etc.)
 * @returns {number} Amount in minor units (e.g., 123450 for INR)
 */
export function amountToMinorUnits(amount, currency = 'INR') {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
  const factor = Math.pow(10, config.decimals);
  
  // Remove any non-numeric characters except decimal point
  const cleanAmount = String(amount).replace(/[^\d.]/g, '');
  const numAmount = parseFloat(cleanAmount);
  
  if (isNaN(numAmount)) {
    return 0;
  }
  
  // Round to avoid floating point errors
  return Math.round(numAmount * factor);
}

/**
 * Convert minor units to display amount
 * @param {number} amountMinor - Amount in minor units (e.g., 123450)
 * @param {string} currency - Currency code
 * @returns {number} Amount in major units (e.g., 1234.50)
 */
export function minorUnitsToAmount(amountMinor, currency = 'INR') {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
  const factor = Math.pow(10, config.decimals);
  return amountMinor / factor;
}

/**
 * Format amount for display with currency symbol and locale
 * @param {number} amount - Amount in major units
 * @param {string} currency - Currency code
 * @param {boolean} includeSymbol - Whether to include currency symbol
 * @returns {string} Formatted amount (e.g., "₹1,234.50" or "1,234.50")
 */
export function formatCurrency(amount, currency = 'INR', includeSymbol = true) {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
  
  try {
    const formatted = new Intl.NumberFormat(config.locale, {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(amount);
    
    return includeSymbol ? `${config.symbol}${formatted}` : formatted;
  } catch (error) {
    // Fallback formatting
    const fixed = amount.toFixed(config.decimals);
    return includeSymbol ? `${config.symbol}${fixed}` : fixed;
  }
}

/**
 * Validate amount based on currency decimal rules
 * @param {string} amount - Amount string to validate
 * @param {string} currency - Currency code
 * @returns {object} { valid: boolean, error: string }
 */
export function validateAmount(amount, currency = 'INR') {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
  
  if (!amount || amount.trim() === '') {
    return { valid: false, error: 'Amount is required' };
  }
  
  // Remove commas and spaces
  const cleanAmount = amount.replace(/[,\s]/g, '');
  
  // Check if valid number
  if (!/^\d*\.?\d*$/.test(cleanAmount)) {
    return { valid: false, error: 'Invalid amount format' };
  }
  
  const numAmount = parseFloat(cleanAmount);
  
  if (isNaN(numAmount)) {
    return { valid: false, error: 'Invalid amount' };
  }
  
  if (numAmount <= 0) {
    return { valid: false, error: 'Amount must be greater than zero' };
  }
  
  // Check decimal places
  const decimalParts = cleanAmount.split('.');
  if (decimalParts.length === 2) {
    const decimalPlaces = decimalParts[1].length;
    
    if (config.decimals === 0 && decimalPlaces > 0) {
      return { 
        valid: false, 
        error: `${currency} does not allow decimal places` 
      };
    }
    
    if (decimalPlaces > config.decimals) {
      return { 
        valid: false, 
        error: `${currency} allows maximum ${config.decimals} decimal place${config.decimals > 1 ? 's' : ''}` 
      };
    }
  }
  
  return { valid: true, error: null };
}

/**
 * Parse and clean amount input
 * @param {string} input - User input
 * @param {string} currency - Currency code
 * @returns {string} Cleaned amount string
 */
export function parseAmountInput(input, currency = 'INR') {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
  
  // Remove currency symbols and spaces
  let cleaned = input.replace(/[^\d.,]/g, '');
  
  // Handle different decimal separators
  cleaned = cleaned.replace(/,/g, '.');
  
  // Keep only the last decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit decimal places
  if (parts.length === 2 && config.decimals === 0) {
    cleaned = parts[0]; // Remove decimal part for zero-decimal currencies
  } else if (parts.length === 2 && parts[1].length > config.decimals) {
    cleaned = parts[0] + '.' + parts[1].substring(0, config.decimals);
  }
  
  return cleaned;
}

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export function getCurrencySymbol(currency = 'INR') {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
  return config.symbol;
}

/**
 * Get currency decimals
 * @param {string} currency - Currency code
 * @returns {number} Number of decimal places
 */
export function getCurrencyDecimals(currency = 'INR') {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
  return config.decimals;
}
