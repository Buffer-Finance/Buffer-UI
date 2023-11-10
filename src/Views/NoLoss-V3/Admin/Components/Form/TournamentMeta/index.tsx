import { TournamentMetaDataAtom } from '@Views/NoLoss-V3/Admin/Atoms/Form';
import { useAtom } from 'jotai';
import { InputField } from '../Common/InputField';
import { LabelWrapper } from '../Common/LabelWrapper';
import { MultiOption } from '../Common/MultiOption';

const booleanOptions = [true, false];
const typesOfTournament = [0, 1, 2];

export const TournamentMeta = () => {
  const [tournamentMetaData, setTournamentMetaData] = useAtom(
    TournamentMetaDataAtom
  );

  return (
    <div className="flex flex-col gap-4 text-f14 p-4">
      <LabelWrapper
        label="Tournament Name"
        input={
          <InputField
            value={tournamentMetaData.name}
            placeholder="Enter tournament name"
            onChange={(changeEvent) => {
              setTournamentMetaData({
                ...tournamentMetaData,
                name: changeEvent.target.value,
              });
            }}
          />
        }
      />
      <LabelWrapper
        label="Start Timestamp Number (UNIX)"
        input={
          <InputField
            value={tournamentMetaData.startTime.toString()}
            placeholder="Enter start timestamp number"
            onChange={(changeEvent) => {
              setTournamentMetaData({
                ...tournamentMetaData,
                startTime: +changeEvent.target.value,
              });
            }}
          />
        }
      />
      <LabelWrapper
        label="Close Timestamp Number (UNIX)"
        input={
          <InputField
            value={tournamentMetaData.closeTime.toString()}
            placeholder="Enter close timestamp number"
            onChange={(changeEvent) => {
              setTournamentMetaData({
                ...tournamentMetaData,
                closeTime: +changeEvent.target.value,
              });
            }}
          />
        }
      />

      <LabelWrapper
        label="Ticket Cost (With token decimals)"
        input={
          <InputField
            value={tournamentMetaData.ticketCost}
            placeholder="Enter ticket cost"
            onChange={(changeEvent) => {
              setTournamentMetaData({
                ...tournamentMetaData,
                ticketCost: changeEvent.target.value,
              });
            }}
          />
        }
      />

      <LabelWrapper
        label="Play Token Mint Amount (With token decimals)"
        input={
          <InputField
            value={tournamentMetaData.playTokenMintAmount}
            placeholder="Enter play token mint amount"
            onChange={(changeEvent) => {
              setTournamentMetaData({
                ...tournamentMetaData,
                playTokenMintAmount: changeEvent.target.value,
              });
            }}
          />
        }
      />

      <LabelWrapper
        label="Is Tournament Closed"
        input={
          <MultiOption
            onClick={(clickedOptionIndex) => {
              setTournamentMetaData({
                ...tournamentMetaData,
                isClosed: booleanOptions[clickedOptionIndex],
              });
            }}
            options={booleanOptions.map((option) => (
              <div className="capitalize">{option.toString()}</div>
            ))}
            selectedOptionIndexes={[
              booleanOptions.indexOf(tournamentMetaData.isClosed),
            ]}
          />
        }
      />

      <LabelWrapper
        label="Is Tournament Verified"
        input={
          <MultiOption
            onClick={(clickedOptionIndex) => {
              setTournamentMetaData({
                ...tournamentMetaData,
                isVerified: booleanOptions[clickedOptionIndex],
              });
            }}
            options={booleanOptions.map((option) => (
              <div className="capitalize">{option.toString()}</div>
            ))}
            selectedOptionIndexes={[
              booleanOptions.indexOf(tournamentMetaData.isVerified),
            ]}
          />
        }
      />

      <LabelWrapper
        label="Has Trading Started"
        input={
          <MultiOption
            onClick={(clickedOptionIndex) => {
              setTournamentMetaData({
                ...tournamentMetaData,
                hasTradingStarted: booleanOptions[clickedOptionIndex],
              });
            }}
            options={booleanOptions.map((option) => (
              <div className="capitalize">{option.toString()}</div>
            ))}
            selectedOptionIndexes={[
              booleanOptions.indexOf(tournamentMetaData.hasTradingStarted),
            ]}
          />
        }
      />

      <LabelWrapper
        label="Should Refund Tickets"
        input={
          <MultiOption
            onClick={(clickedOptionIndex) => {
              setTournamentMetaData({
                ...tournamentMetaData,
                shouldRefundTickets: booleanOptions[clickedOptionIndex],
              });
            }}
            options={booleanOptions.map((option) => (
              <div className="capitalize">{option.toString()}</div>
            ))}
            selectedOptionIndexes={[
              booleanOptions.indexOf(tournamentMetaData.shouldRefundTickets),
            ]}
          />
        }
      />

      <LabelWrapper
        label="Tournament Type"
        input={
          <MultiOption
            onClick={(clickedOptionIndex) => {
              setTournamentMetaData({
                ...tournamentMetaData,
                tournamentType: typesOfTournament[clickedOptionIndex],
              });
            }}
            options={typesOfTournament.map((option) => (
              <div className="capitalize">{option.toString()}</div>
            ))}
            selectedOptionIndexes={[
              typesOfTournament.indexOf(tournamentMetaData.tournamentType),
            ]}
          />
        }
      />

      <LabelWrapper
        label="Buyin Token (Address)"
        input={
          <InputField
            value={tournamentMetaData.buyInToken}
            placeholder="Enter tournament token"
            onChange={(changeEvent) => {
              setTournamentMetaData({
                ...tournamentMetaData,
                buyInToken: changeEvent.target.value,
              });
            }}
          />
        }
      />

      <LabelWrapper
        label="Reward Token (Address)"
        input={
          <InputField
            value={tournamentMetaData.rewardToken}
            placeholder="Enter play token"
            onChange={(changeEvent) => {
              setTournamentMetaData({
                ...tournamentMetaData,
                rewardToken: changeEvent.target.value,
              });
            }}
          />
        }
      />

      <LabelWrapper
        label="Creator (Address)"
        input={
          <InputField
            value={tournamentMetaData.creator}
            placeholder="Enter play token"
            onChange={(changeEvent) => {
              setTournamentMetaData({
                ...tournamentMetaData,
                creator: changeEvent.target.value,
              });
            }}
          />
        }
      />
    </div>
  );
};
