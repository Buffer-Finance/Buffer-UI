import { gt } from '@Utils/NumString/stringArithmatics';

export function getUserError(maxTimeInHHMM: string) {
  let hours = maxTimeInHHMM.toString().split(':')[0];
  let minutes = maxTimeInHHMM.toString().split(':')[1];
  if (hours.charAt(0) == '0') hours = hours.charAt(1);
  if (minutes.charAt(0) == '0') minutes = minutes.charAt(1);
  if (minutes == '0') return `${hours} hour${gt(hours, '1') ? 's' : ''}`;
  else if (hours == '0')
    return `${minutes} minute${gt(minutes, '1') ? 's' : ''}`;
  else
    return `${hours} hour${gt(hours, '1') ? 's' : ''} ${minutes} minute${
      gt(minutes, '1') ? 's' : ''
    }`;
}
