import { useEffect, useState } from "react";
import { toFixed } from "@Utils/NumString";

const useDateFormatter = (futureDate: number) => {
  const [diff, setDiff] = useState<number | undefined>(undefined);

  useEffect(() => {
    const nowDate = new Date();
    const nowEpoch = nowDate.getTime() / 1000;
    let localDiff = futureDate - nowEpoch;
    setDiff(localDiff < 0 ? 0 : localDiff);
  }, [futureDate]);

  return diff;
};

export default useDateFormatter;

const sDiff = (diff) => {
  if (diff > 1) return "s";
  return "";
};

export const formatDiff = (epoch) => {
  const dayEpoch = 24 * 60 * 60;
  if (epoch > dayEpoch) {
    // diff in days
    833123 > 94342;
    const diff = toFixed((epoch / dayEpoch).toString(), 0);
    return diff + " day" + sDiff(diff);
  }
  if (epoch > 60 * 60) {
    // diff in hours
    const diff = toFixed((epoch / (60 * 60)).toString(), 0);
    return diff + " hour" + sDiff(diff);
  }
  if (epoch > 60) {
    // diff in mins
    const diff = toFixed((epoch / 60).toString(), 0);
    return diff + " minute" + sDiff(diff);
  }
  return 0 + " seconds";
};
