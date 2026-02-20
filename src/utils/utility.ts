export const now_ts = () => Math.floor(Date.now() / 1000);

export const dateToUnixTimestamp = (date: Date): number =>
  Math.floor(date.getTime() / 1000);
