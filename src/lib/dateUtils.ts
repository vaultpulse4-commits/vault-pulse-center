import { format, parseISO } from 'date-fns';

/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @param formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

/**
 * Format datetime to readable string with time
 * @param date - Date string or Date object
 * @returns Formatted datetime string
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

/**
 * Format date to short format
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "Jan 15")
 */
export const formatDateShort = (date: string | Date): string => {
  return formatDate(date, 'MMM dd');
};

/**
 * Format date for input[type="date"] value
 * @param date - Date string or Date object
 * @returns YYYY-MM-DD format
 */
export const formatDateForInput = (date: string | Date): string => {
  return formatDate(date, 'yyyy-MM-dd');
};

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
/**
 * Format date with day name for Event Order
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "FRIDAY, 5 DEC 2026")
 */
export const formatDateWithDay = (date: string | Date): string => {
  return formatDate(date, 'EEEE, d MMM yyyy').toUpperCase();
};

export const getRelativeTime = (date: string | Date): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    
    return formatDate(date);
  } catch (error) {
    return '-';
  }
};
