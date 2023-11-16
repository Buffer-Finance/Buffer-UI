import { createArray } from '@Utils/JSUtils/createArray';
import { LeaderboardRulesAtom } from '@Views/NoLoss-V3/Admin/Atoms/Form';
import { useAtom } from 'jotai';
import { InputField } from '../Common/InputField';
import { LabelWrapper } from '../Common/LabelWrapper';

export const LeaderboardRules = () => {
  const [leaderboardRules, setLeaderboardRules] = useAtom(LeaderboardRulesAtom);
  return (
    <div className="flex flex-col gap-4 text-f14 p-4">
      <LabelWrapper
        input={<div>{leaderboardRules.rankFirst}</div>}
        label="rankFirst"
      />
      <LabelWrapper
        input={<div>{leaderboardRules.rankLast}</div>}
        label="rankSecond"
      />
      <LabelWrapper
        label="User Count (Number)"
        input={
          <InputField
            value={leaderboardRules.userCount}
            placeholder="User Count"
            onChange={(event) => {
              setLeaderboardRules({
                ...leaderboardRules,
                userCount: event.target.value,
              });
            }}
          />
        }
      />
      <LabelWrapper
        label="Total Buyins (Number)"
        input={
          <InputField
            value={leaderboardRules.totalBuyins}
            placeholder="Total Buyins"
            onChange={(event) => {
              setLeaderboardRules({
                ...leaderboardRules,
                totalBuyins: event.target.value,
              });
            }}
          />
        }
      />

      <LabelWrapper
        label="Rake Collected (With Decimals)"
        input={
          <InputField
            value={leaderboardRules.rakeCollected}
            placeholder="Rake Collected"
            onChange={(event) => {
              setLeaderboardRules({
                ...leaderboardRules,
                rakeCollected: event.target.value,
              });
            }}
          />
        }
      />

      <LabelWrapper
        label="Total Winners (Number)"
        input={
          <InputField
            value={leaderboardRules.totalWinners}
            placeholder="Total Winners"
            onChange={(event) => {
              setLeaderboardRules({
                ...leaderboardRules,
                totalWinners: event.target.value,
              });
            }}
          />
        }
      />

      <LabelWrapper
        label="Reward Percentages (Numbers*e2)"
        input={
          leaderboardRules.totalWinners &&
          +leaderboardRules.totalWinners > 0 ? (
            <div className="flex flex-col gap-3">
              {createArray(+leaderboardRules.totalWinners).map((_, index) => {
                return (
                  <div key={index} className="flex gap-3 items-center text-f13">
                    {index + 1}{' '}
                    <InputField
                      value={leaderboardRules.rewardPercentages[index]}
                      placeholder="Reward Percentages"
                      onChange={(event) => {
                        const rewardPercentages = [
                          ...leaderboardRules.rewardPercentages,
                        ];
                        rewardPercentages[index] = event.target.value;
                        setLeaderboardRules({
                          ...leaderboardRules,
                          rewardPercentages,
                        });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-f13">Set Total Winners first</div>
          )
        }
      />
    </div>
  );
};
