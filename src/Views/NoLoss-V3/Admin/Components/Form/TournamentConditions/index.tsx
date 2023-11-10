import { TournamentConditionsAtom } from '@Views/NoLoss-V3/Admin/Atoms/Form';
import { useAtom } from 'jotai';
import { InputField } from '../Common/InputField';
import { LabelWrapper } from '../Common/LabelWrapper';

export const TournamentConditions: React.FC = () => {
  const [tournamentConditions, setTournamentConditions] = useAtom(
    TournamentConditionsAtom
  );
  return (
    <div className="flex flex-col gap-4 text-f14 p-4">
      <LabelWrapper
        label="Max Buyins Per Walllet (Number)"
        input={
          <InputField
            placeholder="Max buyins per wallet"
            value={tournamentConditions.maxBuyinsPerWallet}
            onChange={(changeEvent) => {
              setTournamentConditions({
                ...tournamentConditions,
                maxBuyinsPerWallet: changeEvent.target.value,
              });
            }}
          />
        }
      />
      <LabelWrapper
        label="Minimum Participants (Number)"
        input={
          <InputField
            placeholder="Max buyins per ticket"
            value={tournamentConditions.minParticipants}
            onChange={(changeEvent) => {
              setTournamentConditions({
                ...tournamentConditions,
                minParticipants: changeEvent.target.value,
              });
            }}
          />
        }
      />

      <LabelWrapper
        label="Maximum Participants (Number)"
        input={
          <InputField
            placeholder="Max buyins per ticket"
            value={tournamentConditions.maxParticipants}
            onChange={(changeEvent) => {
              setTournamentConditions({
                ...tournamentConditions,
                maxParticipants: changeEvent.target.value,
              });
            }}
          />
        }
      />

      <LabelWrapper
        label="Guaranteed Winning Amount (With Decimals)"
        input={
          <InputField
            placeholder="Max buyins per ticket"
            value={tournamentConditions.guaranteedWinningAmount}
            onChange={(changeEvent) => {
              setTournamentConditions({
                ...tournamentConditions,
                guaranteedWinningAmount: changeEvent.target.value,
              });
            }}
          />
        }
      />

      <LabelWrapper
        label="Start Price Money (With Decimals)"
        input={
          <InputField
            placeholder="Max buyins per ticket"
            value={tournamentConditions.startPriceMoney}
            onChange={(changeEvent) => {
              setTournamentConditions({
                ...tournamentConditions,
                startPriceMoney: changeEvent.target.value,
              });
            }}
          />
        }
      />

      <LabelWrapper
        label="Rake Percent (Number)"
        input={
          <InputField
            placeholder="Max buyins per ticket"
            value={tournamentConditions.rakePercent}
            onChange={(changeEvent) => {
              setTournamentConditions({
                ...tournamentConditions,
                rakePercent: changeEvent.target.value,
              });
            }}
          />
        }
      />
    </div>
  );
};
