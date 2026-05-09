import dayjs from 'dayjs';

export const formatDate = (date: string, isIncludeTime: boolean): string => {
  let formatted = 'D MMM YYYY';
  if (isIncludeTime) {
    formatted = formatted.concat(' — h:mm A');
  }
  return dayjs(date).format(formatted);
};

/**
 *
 * @param value local date/datetime string (without timezone)
 * @param tzOffset local timezone offset
 * @returns UTC datetime string (with offset timezone)
 */
export const localDateToUTC = (value: string, tzOffset: number): string => {
  const isIncludeTime = value.includes('T');
  // Interpret ISO date string at UTC+00:00
  const utcDate = isIncludeTime ? value + 'Z' : value + 'T00:00Z';
  const date = new Date(utcDate);
  date.setMinutes(date.getMinutes() + tzOffset); // timezone offset
  return date.toISOString();
};
