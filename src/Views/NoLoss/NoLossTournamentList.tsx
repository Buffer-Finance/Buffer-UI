import { atom, useAtom, useAtomValue } from 'jotai';
import useSWR from 'swr';
import {
  ITournament,
  useNoLossTournaments,
  useTournamentData,
} from './useNoLossTournamets';
import TournamentManagerAbi from '@Views/NoLoss/ABI/TournamentsManager.json';
import { SVGProps, useEffect } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { activetIdAtom } from './NoLoss';

import { useState } from 'react';
import { useTimer } from '@Hooks/Utilities/useStopWatch';
import { Skeleton } from '@mui/material';
import { divide } from '@Utils/NumString/stringArithmatics';
import { useWriteCall } from '@Hooks/useWriteCall';
import { useIndependentWriteCall } from '@Hooks/writeCall';
import { useNoLossStaticConfig } from './useNoLossConfig';
import { useActiveTournamentState } from './NoLossOptionBuying';
import { MarketInterface } from 'src/MultiChart';
import { getCallId } from '@Utils/Contract/multiContract';
import { Display } from '@Views/Common/Tooltips/Display';
export const tournamentButtonStyles =
  'bg-blue flex gap-x-2 px-[8px] py-[2px] text-f12 items-center rounded-[4px] ';
export const touramentsAtom = atom([]);
const tournamentTypes = ['Live', 'Upcoming', 'Closed'];
const NoLossTournamentList: React.FC<{
  markets: { [a: string]: MarketInterface };
  activeTournament: ITournament;
}> = ({ markets, activeTournament }) => {
  const data = useNoLossTournaments();
  const [activeTid, setActiveTid] = useAtom(activetIdAtom);

  console.log(`data: `, data);
  const [activeTournamentType, setActiveTournamentType] = useState<
    'Live' | 'Upcoming' | 'Closed'
  >(tournamentTypes[0]);

  useEffect(() => {
    if (activeTid) return;
    if (!data?.['Live']?.[0]) return;
    setActiveTid(data?.['Live']?.[0].id);
  }, [activeTid, data, setActiveTid]);
  const { data: state } = useActiveTournamentState(activeTournament, markets);
  const config = useNoLossStaticConfig();
  return (
    <div className="w-[220px] px-[10px] mt-4 ">
      <div className="flex items-center justify-evenly text-2 mb-2">
        {tournamentTypes.map((s) => (
          <div
            className={`flex gap-x-[3px] items-center cursor-pointer text-f12 font-semibold ${
              s == activeTournamentType ? 'text-1' : ''
            }`}
            onClick={() => setActiveTournamentType(s)}
          >
            {s}
            {s == 'Live' && data?.['Live']?.length && (
              <div className="text-1 text-center   p-0 text-[8px]  bold pt-[-8px] bg-red w-[13px] h-[13px] rounded-sm">
                {data?.['Live']?.length}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex-col">
        {data?.[activeTournamentType]
          ? data[activeTournamentType].map((s) => {
              return (
                <TournamentCard
                  tournament={s}
                  key={s.id}
                  balance={
                    state?.[
                      getCallId(config.tournament.manager, 'balanceOf', s.id)
                    ]
                  }
                />
              );
            })
          : `We can't find any ${activeTournamentType} tornaments...`}{' '}
      </div>
    </div>
  );
};
const Timer = ({ header, bottom }: { header: number; bottom: string }) => (
  <div className="flex-col">
    <div className="text-f14  font-semibold">
      {header.toString().padStart(2, '0')}
    </div>
    <div className="text-[9px] ">{bottom}</div>
  </div>
);

const NoLossTournamentTimer = ({ close }: { close: string }) => {
  const timer = useTimer(close);
  return (
    <div className="flex gap-x-[8px] mt-[8px] mb-[10px]">
      <Timer header={timer.days} bottom="Days" />
      <Timer header={timer.hours} bottom="Hours" />
      <Timer header={timer.minutes} bottom="Minutes" />
      <Timer header={timer.seconds} bottom="Seconds" />
    </div>
  );
};

const TournamentCard = ({
  tournament,
  balance,
}: {
  tournament: ITournament;
  balance: string | undefined;
}) => {
  const { data } = useTournamentData();
  const tournamentInfo = data?.[tournament.id];
  const [activeTid, setactiveTid] = useAtom(activetIdAtom);
  const activeTournament = data?.[tournament.id];
  const config = useNoLossStaticConfig();
  const { writeCall } = useIndependentWriteCall();
  const buyPlayTokens = () => {
    writeCall(
      config.tournament.manager,
      TournamentManagerAbi,
      () => console.log,
      'buyTournamentTokens',
      [activeTid]
    );
  };
  return activeTournament ? (
    <div
      className={`w-[100%]  background-vertical-gradient rounded-[4px] left-border px-[12px] py-[10px] pb-[20px] ${
        tournament.id == activeTid
          ? 'border-[var(--bg-signature)] '
          : 'border-[transparent]'
      }`}
      role="button"
      onClick={() => {
        setactiveTid(tournament.id);
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-3 font-semibold text-f12">
          {data[tournament.id].tournamentMeta.name}
        </div>
        <div className="text-[8px] text-green font-semibold bg-green    bg-opacity-20 chip-green-border px-[8px] py-[2px]">
          {tournament.state}
        </div>
      </div>
      <div className="flex items-center">
        <NoLossTournamentTimer close={tournamentInfo?.tournamentMeta.close} />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex-col items-center">
          <div className="text-3">Prize Pool</div>
          <div>{activeTournament.prizePool}</div>
        </div>
        <div className="flex-col  items-center">
          <div className="text-3">Play Tokens</div>
          <div>
            {balance ? (
              <Display data={divide(balance, 18)} />
            ) : (
              <Skeleton className="lc sr !w-[20px] !h-[14px]" />
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-ce">
          <TournamentRank />
          <div className="mt-1 ml-2">{activeTournament.rewards[0]}</div>
        </div>

        <div className="flex items-center gap-x-2">
          <MIcon />
          Upto {activeTournament.tournamentConditions.maxParticipants}
        </div>
      </div>
      <div className="flex items-center justify-center gap-x-[5px] mt-4">
        <button
          className={tournamentButtonStyles}
          onClick={() => {
            setactiveTid(tournament.id);
          }}
        >
          <TradeIcon />
          Trade
        </button>
        <button className={tournamentButtonStyles} onClick={buyPlayTokens}>
          Entry ${divide(activeTournament.tournamentMeta.ticketCost, 6)}
        </button>
      </div>
    </div>
  ) : (
    <Skeleton variant="rectangular" className="full-width sr !h-[200px] lc" />
  );
};

export { NoLossTournamentList };
const TournamentRank = (props: SVGProps<SVGSVGElement>) => (
  <div className="flex items-center gap-x-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={17}
      height={18}
      fill="none"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeWidth={0.571}
        d="M11.857 5.186a6.286 6.286 0 1 0 .571 7.93"
      />
      <path
        fill="currentColor"
        d="M6.949 13.929c-.076 0-.114-.038-.114-.115V7.437l-1.44.8a.27.27 0 0 1-.115.035c-.06 0-.091-.035-.091-.103v-.995c0-.076.042-.133.126-.171l1.874-1.017a.327.327 0 0 1 .171-.057h.526c.076 0 .114.038.114.114v7.771c0 .077-.038.115-.114.115h-.937ZM11.167 11.36c-.338 0-.645-.068-.919-.205a1.664 1.664 0 0 1-.651-.562 1.405 1.405 0 0 1-.24-.803c0-.045.022-.068.068-.068h.576c.023 0 .039.007.048.02.01.01.016.025.02.048.019.28.129.5.33.665.201.16.464.24.788.24.339 0 .602-.066.789-.198a.65.65 0 0 0 .288-.57c0-.192-.103-.345-.309-.459-.2-.119-.489-.226-.864-.322-.539-.137-.944-.311-1.213-.521-.265-.21-.398-.503-.398-.878 0-.279.075-.517.226-.713.151-.201.35-.352.597-.453.251-.105.526-.158.823-.158.333 0 .628.064.884.192s.453.298.59.508c.142.21.217.439.226.686 0 .045-.023.068-.068.068h-.576c-.023 0-.04-.004-.048-.014a.154.154 0 0 1-.02-.054.697.697 0 0 0-.316-.528 1.155 1.155 0 0 0-.68-.192c-.269 0-.49.054-.664.164a.516.516 0 0 0-.26.46c0 .21.1.374.3.493.207.12.508.231.906.336.498.137.885.307 1.159.508a.944.944 0 0 1 .418.816c0 .48-.164.85-.494 1.11-.324.257-.763.385-1.316.385Zm3.578-.068c-.046 0-.069-.023-.069-.069V7.157h-1.378c-.046 0-.069-.023-.069-.068V6.56c0-.046.023-.069.069-.069h3.47c.045 0 .068.023.068.069v.528c0 .045-.023.068-.068.068h-1.379v4.066c0 .046-.023.069-.068.069h-.576Z"
      />
    </svg>
  </div>
);

const MIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    fill="none"
    {...props}
  >
    <circle
      cx={8.5}
      cy={8.5}
      r={8.25}
      stroke="currentColor"
      strokeWidth={0.5}
    />
    <path
      fill="currentColor"
      d="M5.176 13c-.08 0-.12-.04-.12-.12V4.72c0-.08.04-.12.12-.12H6.28c.096 0 .16.04.192.12l2.364 5.424L11.2 4.72c.032-.08.096-.12.192-.12h1.104c.08 0 .12.04.12.12v8.16c0 .08-.04.12-.12.12h-.744c-.08 0-.12-.04-.12-.12V6.124l-2.376 5.364c-.032.072-.084.108-.156.108h-.528c-.072 0-.124-.036-.156-.108L6.04 6.124v6.756c0 .08-.04.12-.12.12h-.744Z"
    />
  </svg>
);

const TradeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M11.028 8.627a.443.443 0 0 1 0 .626l-1.541 1.541h1.018a.443.443 0 0 1 0 .886H8.418a.443.443 0 0 1-.443-.443V9.15a.443.443 0 1 1 .886 0v1.019l1.541-1.541a.443.443 0 0 1 .627 0ZM.13 3.874a.443.443 0 0 0 .626 0l1.541-1.541v1.019a.443.443 0 0 0 .886 0V1.263A.443.443 0 0 0 2.74.82H.652a.443.443 0 1 0 0 .886H1.67L.13 3.247a.443.443 0 0 0 0 .627Z"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M3.467 11.473a3.544 3.544 0 0 0 3.906-3.526 3.544 3.544 0 1 0-3.544-3.544 3.544 3.544 0 0 0-.362 7.07Zm-2-3.526a2.363 2.363 0 0 1 2.567-2.354c.356 1 1.149 1.793 2.149 2.15a2.363 2.363 0 1 1-4.717.205ZM5.01 4.403a2.363 2.363 0 1 1 4.726 0 2.363 2.363 0 0 1-4.726 0Z"
      clipRule="evenodd"
    />
  </svg>
);
