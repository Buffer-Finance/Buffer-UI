import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import { useAtomValue } from 'jotai';
import { useAllTournamentData } from '../Hooks/useAllTournamentdata';
import { useTournamentIds } from '../Hooks/useTournamentIds';
import { activeTabAtom } from './Atoms/Admin';
import { Create } from './Components/Create';
import { End } from './Components/End';
import { Start } from './Components/Start';
import { Tabs } from './Components/Tabs';
import { Verify } from './Components/Verify';

export const NoLossAdmin = () => {
  useTournamentIds();
  useAllTournamentData();
  const { activeTab, allTabs } = useAtomValue(activeTabAtom);
  return (
    <div className="m-auto mt-3">
      <Tabs />
      <HorizontalTransition value={allTabs.indexOf(activeTab)}>
        <Create />
        <Verify />
        <Start />
        <End />
      </HorizontalTransition>
    </div>
  );
};
