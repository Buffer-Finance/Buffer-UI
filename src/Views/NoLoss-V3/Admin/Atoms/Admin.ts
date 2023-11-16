import { atom } from 'jotai';

export const activeTabAtom = atom<{
  allTabs: ['create', 'verify', 'start', 'end'];
  activeTab: 'create' | 'verify' | 'start' | 'end';
}>({
  allTabs: ['create', 'verify', 'start', 'end'],
  activeTab: 'create',
});
