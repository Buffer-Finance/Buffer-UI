import { atom } from "jotai";

interface ILeaderboardpageAtom {
  active: Ileagues;
  total: Ileagues;
}
interface Ileagues {
  arbitrum: number;
}

const leaderboardPageAtom = atom<ILeaderboardpageAtom>({
  active: { arbitrum: 1 },
  total: { arbitrum: 1 },
});

export const updateLeaderboardActivePageAtom = atom(
  null,
  (get, set, update: Ileagues) => {
    set(leaderboardPageAtom, {
      total: get(readLeaderboardPageTotalPageAtom),
      active: update,
    });
  }
);
export const updateLeaderboardTotalPageAtom = atom(
  null,
  (get, set, update: Ileagues) => {
    set(leaderboardPageAtom, {
      active: get(readLeaderboardPageActivePageAtom),
      total: update,
    });
  }
);

export const readLeaderboardPageActivePageAtom = atom(
  (get) => get(leaderboardPageAtom).active
);
export const readLeaderboardPageTotalPageAtom = atom(
  (get) => get(leaderboardPageAtom).total
);
