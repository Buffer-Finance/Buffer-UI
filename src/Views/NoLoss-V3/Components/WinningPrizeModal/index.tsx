import { createArray } from '@Utils/JSUtils/createArray';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { WinningPirzeModalAtom } from '@Views/NoLoss-V3/atoms';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import { ModalBase } from 'src/Modals/BaseModal';
import { getValueOfPercentage } from '../TradePageTournamentCard';

export const WinningPrizeModal = () => {
  const [tournament, setTournament] = useAtom(WinningPirzeModalAtom);
  return (
    <ModalBase
      className="!p-[0px]"
      open={tournament !== null}
      onClose={() => setTournament(null)}
    >
      {tournament !== null ? (
        <WinnigPrizeModalBackground>
          <div className="capitalize text-f14 m-auto text-center mb-4">
            reward distribution
          </div>
          <TableAligner
            getClassName={(row, rowIndex) => {
              if (rowIndex === 0) {
                return 'bg-[#13131a]';
              }
              if (rowIndex % 2 === 0) {
                return 'bg-[#303044]';
              }
              return 'bg-[#1d1d28]';
            }}
            keyStyle="text-1 !text-f12 !p-[8px] "
            valueStyle="text-1 !text-f12 !p-[8px] "
            keysName={[
              'Position',
              ...createArray(
                tournament.tournamentLeaderboard.rewardPercentages.length
              ).map((_, idx) => idx + 1),
            ]}
            values={[
              'Prize',
              ...tournament.tournamentLeaderboard.rewardPercentages.map(
                (percentage) => (
                  <Display
                    data={getValueOfPercentage(
                      divide(
                        tournament.tournamentRewardPools.toString(),
                        tournament.rewardTokenDecimals
                      ) as string,
                      divide(percentage.toString(), 2) as string
                    )}
                    unit={tournament.rewardTokenSymbol}
                    precision={2}
                  />
                )
              ),
            ]}
          />
        </WinnigPrizeModalBackground>
      ) : (
        <></>
      )}
    </ModalBase>
  );
};

const WinnigPrizeModalBackground = styled.div`
  border-radius: 7px;
  padding: 12px;
  background: #12121a;
  width: 300px;

  .zebra-background {
    :nth-child(odd) {
      background: #1d1d28;
    }
    :nth-child(even) {
      background: #303044;
    }
  }
`;
