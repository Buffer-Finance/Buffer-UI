export const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
export function formatAMPM(date: any) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}
export function dateGiver(ep: Date) {
  const d = ep;
  const str = `${month[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  return str;
}
export const getFutureDelayedDate = (period: number) => {
  const currentDate = new Date();
  const now = parseInt(currentDate.getTime().toString().slice(0, -3), 10);

  const timestamp = now + period;
  const targetDate = new Date(timestamp * 1e3);
  const str = dateGiver(targetDate);

  return str;
};
export const getDisplayDate = (date: number) => {
  const targetDate = new Date(date * 1e3);
  return dateGiver(targetDate);
};

export const getDisplayTime = (timestamp) => {
  const currentDate = new Date(timestamp * 1e3);
  return `${currentDate.getHours().toString().padStart(2, "0")}:${currentDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${currentDate.getSeconds().toString().padStart(2, "0")}`;
};
export const getDisplayDateUTC = (date: number) => {
  const d = new Date(date * 1e3);
  return `${month[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};

export const getDisplayTimeUTC = (timestamp) => {
  const currentDate = new Date(timestamp * 1e3);
  return `${currentDate.getUTCHours().toString().padStart(2, "0")}:${currentDate
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}:${currentDate
    .getUTCSeconds()
    .toString()
    .padStart(2, "0")}`;
};

export const getDHMSFromSeconds = (seconds: number) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
  const hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
  const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
};
