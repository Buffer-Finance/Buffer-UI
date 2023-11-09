import { useAtom } from 'jotai';
import { TournamentMetaDataAtom } from '../../Atoms/Form';
import { InputField } from './InputField';
import { LabelWrapper } from './LabelWrapper';

export const TournamentMeta = () => {
  const [tournamentMetaData, setTournamentMetaData] = useAtom(
    TournamentMetaDataAtom
  );
  return (
    <div className="flex flex-col text-f14 p-4">
      <LabelWrapper
        label="Tournament Name"
        input={
          <InputField
            value={tournamentMetaData.name}
            onChange={(changeEvent) => {
              setTournamentMetaData({
                ...tournamentMetaData,
                name: changeEvent.target.value,
              });
            }}
          />
        }
      />
    </div>
  );
};
