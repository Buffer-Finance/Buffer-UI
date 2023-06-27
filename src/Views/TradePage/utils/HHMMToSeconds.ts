export default function HHMMToSeconds(time: string) {
  const [hours, minutes] = time.split(':');
  return Number(hours) * 3600 + Number(minutes) * 60;
}
