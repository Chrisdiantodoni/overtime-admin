import moment from 'moment';

export const getFormattedDate = (startDate, endDate) => {
  let start = moment.utc(startDate).format('YYYY-MM-DD[T]HH:mm:ssZ');
  let end = moment.utc(endDate).format('YYYY-MM-DD[T]HH:mm:ssZ');
  if (moment(start).isSame(moment(), 'day') || moment(end).isSame(moment(), 'day')) {
    start = moment.utc(startDate).format('YYYY-MM-DD[T]HH:mm:ssZ');
    end = moment.utc(endDate).format('YYYY-MM-DD[T]HH:mm:ssZ');
  }
  return { start, end };
};
