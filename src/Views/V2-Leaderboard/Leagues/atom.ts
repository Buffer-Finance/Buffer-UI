import { atom } from 'jotai';

export type leagueType = 'silver' | 'gold' | 'platinum' | 'diamond' | 'bronze';
export const leagueUsersAtom = atom<Record<leagueType, string[]>>({
  silver: [],
  gold: [],
  platinum: [],
  diamond: [],
  bronze: [],
});

export const setLeagueUsersAtom = atom(
  null,
  (get, set, update: { league: leagueType; users: string[] }) => {
    const users = get(leagueUsersAtom);
    set(leagueUsersAtom, { ...users, [update.league]: update.users });
  }
);
