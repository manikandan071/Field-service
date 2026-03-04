import * as dayjs from "dayjs";

export const getTime = (Date: string) => {
  return Date ? dayjs(Date).format("hh:mm A") : "--:-- --";
};

import * as utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const getTimeAgo = (dateString: string) => {
  const now = dayjs();
  const input = dayjs.utc(dateString).local();

  const diffMinutes = now.diff(input, "minute");
  const diffHours = now.diff(input, "hour");
  const diffDays = now.diff(input, "day");
  const diffWeeks = now.diff(input, "week");
  const diffMonths = now.diff(input, "month");
  const diffYears = now.diff(input, "year");

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  if (diffDays === 1) {
    return "yesterday";
  }

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  if (diffWeeks === 1) {
    return "last week";
  }

  if (diffWeeks < 4) {
    return `${diffWeeks}w ago`;
  }

  if (diffMonths === 1) {
    return "last month";
  }

  if (diffMonths < 12) {
    return `${diffMonths}m ago`;
  }

  if (diffYears === 1) {
    return "last year";
  }

  return `${diffYears}y ago`;
};
