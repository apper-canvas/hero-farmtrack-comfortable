import { format, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';

/**
 * Validates if a value is a valid date
 * @param {*} date - Value to validate
 * @returns {boolean} - True if valid date
 */
export function isValidDate(date) {
  if (date === null || date === undefined) {
    return false;
  }

  // Handle Date objects
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }

  // Handle timestamps
  if (typeof date === 'number') {
    return !isNaN(date) && isFinite(date);
  }

  // Handle strings - try to parse
  if (typeof date === 'string') {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }

  return false;
}

/**
 * Safely parses various date formats to Date object
 * @param {*} date - Date value to parse
 * @returns {Date|null} - Parsed Date object or null
 */
export function parseDate(date) {
  if (!date) return null;

  if (date instanceof Date) {
    return isValidDate(date) ? date : null;
  }

  if (typeof date === 'number') {
    const parsed = new Date(date);
    return isValidDate(parsed) ? parsed : null;
  }

  if (typeof date === 'string') {
    const parsed = new Date(date);
    return isValidDate(parsed) ? parsed : null;
  }

  return null;
}

/**
 * Safe wrapper around date-fns format function
 * @param {*} date - Date to format
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy')
 * @param {string} fallback - Fallback string if date invalid (default: 'N/A')
 * @returns {string} - Formatted date string or fallback
 */
export function safeFormat(date, formatStr = 'MMM dd, yyyy', fallback = 'N/A') {
  try {
    const parsedDate = parseDate(date);
    
    if (!parsedDate) {
      console.warn('safeFormat: Invalid date provided:', date);
      return fallback;
    }

    return format(parsedDate, formatStr);
  } catch (error) {
    console.error('safeFormat: Error formatting date:', error, 'Date value:', date);
    return fallback;
  }
}

/**
 * Safe wrapper around date-fns startOfMonth function
 * @param {*} date - Date to get month start
 * @returns {Date} - Start of month or current month start if invalid
 */
export function safeStartOfMonth(date) {
  try {
    const parsedDate = parseDate(date);
    
    if (!parsedDate) {
      console.warn('safeStartOfMonth: Invalid date provided, using current date:', date);
      return startOfMonth(new Date());
    }

    return startOfMonth(parsedDate);
  } catch (error) {
    console.error('safeStartOfMonth: Error getting month start:', error, 'Date value:', date);
    return startOfMonth(new Date());
  }
}

/**
 * Safe wrapper around date-fns endOfMonth function
 * @param {*} date - Date to get month end
 * @returns {Date} - End of month or current month end if invalid
 */
export function safeEndOfMonth(date) {
  try {
    const parsedDate = parseDate(date);
    
    if (!parsedDate) {
      console.warn('safeEndOfMonth: Invalid date provided, using current date:', date);
      return endOfMonth(new Date());
    }

    return endOfMonth(parsedDate);
  } catch (error) {
    console.error('safeEndOfMonth: Error getting month end:', error, 'Date value:', date);
    return endOfMonth(new Date());
  }
}

/**
 * Safe wrapper around date-fns differenceInDays function
 * @param {*} dateLeft - Later date
 * @param {*} dateRight - Earlier date
 * @param {number} fallback - Fallback value if dates invalid (default: 0)
 * @returns {number} - Difference in days or fallback
 */
export function safeDifferenceInDays(dateLeft, dateRight, fallback = 0) {
  try {
    const parsedLeft = parseDate(dateLeft);
    const parsedRight = parseDate(dateRight);
    
    if (!parsedLeft || !parsedRight) {
      console.warn('safeDifferenceInDays: Invalid date(s) provided:', {
        dateLeft,
        dateRight
      });
      return fallback;
    }

    return differenceInDays(parsedLeft, parsedRight);
  } catch (error) {
    console.error('safeDifferenceInDays: Error calculating difference:', error, {
      dateLeft,
      dateRight
    });
    return fallback;
  }
}

/**
 * Formats date for input fields (YYYY-MM-DD format)
 * @param {*} date - Date to format
 * @returns {string} - Formatted date string or empty string
 */
export function formatForInput(date) {
  return safeFormat(date, 'yyyy-MM-dd', '');
}

/**
 * Formats date with time (MMM dd, yyyy HH:mm format)
 * @param {*} date - Date to format
 * @returns {string} - Formatted date-time string
 */
export function formatDateTime(date) {
  return safeFormat(date, 'MMM dd, yyyy HH:mm', 'N/A');
}

/**
 * Formats date in short format (MMM dd format)
 * @param {*} date - Date to format
 * @returns {string} - Formatted short date string
 */
export function formatShortDate(date) {
  return safeFormat(date, 'MMM dd', 'N/A');
}

/**
 * Gets current date safely
 * @returns {Date} - Current date
 */
export function getCurrentDate() {
  return new Date();
}

/**
 * Gets ISO string safely
 * @param {*} date - Date to convert
 * @returns {string|null} - ISO string or null
 */
export function safeToISOString(date) {
  const parsedDate = parseDate(date);
  return parsedDate ? parsedDate.toISOString() : null;
}