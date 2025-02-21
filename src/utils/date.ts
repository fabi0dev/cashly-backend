import { DateTime } from 'luxon';

export const formatDateUTCToISO = (dateString: string) =>
  DateTime.fromISO(dateString, { zone: 'utc' }).toISODate();
