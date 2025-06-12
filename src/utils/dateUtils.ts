
import { format } from 'date-fns';

export const formatGregorianDate = (date: string | Date, formatString: string = 'yyyy-MM-dd') => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return typeof date === 'string' ? date : date.toISOString();
  }
};

export const formatGregorianDateTime = (date: string | Date) => {
  return formatGregorianDate(date, 'yyyy-MM-dd HH:mm:ss');
};

export const formatGregorianDateShort = (date: string | Date) => {
  return formatGregorianDate(date, 'dd/MM/yyyy');
};
