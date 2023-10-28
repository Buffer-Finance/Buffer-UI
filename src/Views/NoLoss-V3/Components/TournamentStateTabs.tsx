import { useAtom } from 'jotai';
import { tournamentStateTabAtom } from '../atoms';

export const TournamentStateTabs = () => {
  const [activeState, setActiveState] = useAtom(tournamentStateTabAtom);

  return (
    <div className="flex gap-4 items-center w-fit my-3">
      {['live', 'upcoming', 'closed'].map((state) => {
        const className =
          activeState.toLowerCase() === state.toLowerCase()
            ? 'text-1'
            : 'text-[#808191]';
        return (
          <button
            className={`${className} text-f12 font-medium capitalize`}
            onClick={() => setActiveState(state)}
          >
            {state}
          </button>
        );
      })}
    </div>
  );
};
