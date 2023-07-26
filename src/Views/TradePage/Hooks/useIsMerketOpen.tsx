import { atom } from 'jotai';
export const knowTillAtom = atom<boolean | null>(null);

export const marketTimingsMessage = (knowTill: {
  date: null | number;
  open: boolean | null;
}) => {
  if (knowTill.date === null) return 'Fetching Market Data...';
  if (knowTill.date > Date.now()) {
    if (knowTill.open) return 'Market is Open';
    const date = new Date(knowTill.date);
    return `Market will open at ${date.toLocaleTimeString()}`;
  }
};
