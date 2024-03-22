import { useAtom } from 'jotai';
import BufferCheckbox from '@Views/Common/BufferCheckbox';
import { BlueBtn } from '@Views/Common/V2-Button';
import { claimRewardsAtom } from '../earnAtom';
import { useEarnWriteCalls } from '../Hooks/useEarnWriteCalls';

export const Claim = () => {
  const { claim } = useEarnWriteCalls('Router');
  const [claimState, setClaimState] = useAtom(claimRewardsAtom);
  const {
    shouldclaimesBFR,
    shouldclaimeth,
    shouldclaimiBFR,
    shouldconvertweth,
  } = claimState;
  return (
    <div className="min-w-[250px] tab:min-w-fit">
      <div className="text-f14 mb-5">Claim Rewards</div>
      <div className="flex flex-col gap-2">
        <div className="flex text-f14">
          <BufferCheckbox
            checked={shouldclaimiBFR}
            onCheckChange={() =>
              setClaimState((prvState) => {
                return {
                  ...prvState,
                  shouldclaimiBFR: !prvState.shouldclaimiBFR,
                };
              })
            }
            className="mr-3"
          />
          <div className={`${shouldclaimiBFR ? 'text-1' : 'text-2'}`}>
            Claim BFR Rewards
          </div>
        </div>
        <div className="flex text-f14">
          <BufferCheckbox
            checked={shouldclaimesBFR}
            onCheckChange={() =>
              setClaimState((prvState) => {
                return {
                  ...prvState,
                  shouldclaimesBFR: !prvState.shouldclaimesBFR,
                };
              })
            }
            className="mr-3"
          />
          <div className={`${shouldclaimesBFR ? 'text-1' : 'text-2'}`}>
            Claim esBFR Rewards
          </div>
        </div>
        <div className="flex text-f14">
          <BufferCheckbox
            checked={shouldclaimeth || shouldconvertweth}
            isDisabled={shouldconvertweth}
            onCheckChange={() =>
              setClaimState((prvState) => {
                return {
                  ...prvState,
                  shouldclaimeth:
                    !prvState.shouldclaimeth || prvState.shouldconvertweth,
                };
              })
            }
            className="mr-3"
          />
          <div
            className={`${
              shouldclaimeth && !shouldconvertweth ? 'text-1' : 'text-2'
            }`}
          >
            Claim USDC Rewards
          </div>
        </div>
        {/* <div className="flex text-f14">
          <BufferCheckbox
            checked={shouldconvertweth}
            onCheckChange={() =>
              setClaimState((prvState) => {
                return {
                  ...prvState,
                  shouldconvertweth: !prvState.shouldconvertweth,
                };
              })
            }
            className="mr-3"
          />
          <div className={`${shouldconvertweth ? "text-1" : "text-2"}`}>
            Convert WETH to ETH
          </div>
        </div> */}
      </div>
      <BlueBtn
        onClick={() =>
          claim(
            shouldclaimiBFR,
            shouldclaimesBFR,
            shouldconvertweth,
            shouldconvertweth
          )
        }
        className={'px-4 rounded-sm !h-7 w-full mt-5'}
      >
        Claim
      </BlueBtn>
    </div>
  );
};
