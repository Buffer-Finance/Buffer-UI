import { useAtom } from 'jotai';
import BufferCheckbox from '@Views/Common/BufferCheckbox';
import { BlueBtn } from '@Views/Common/V2-Button';
import { compoundRewardsAtom, compoundRewardsAtom2 } from '../earnAtom';
import { useEarnWriteCalls } from '../Hooks/useEarnWriteCalls';

export const Compound2 = () => {
  const { compound2 } = useEarnWriteCalls('Router');
  const [compoundState, setCompoundState] = useAtom(compoundRewardsAtom2);

  const {
    shouldclaimiBFR,
    shouldstakeiBFR,
    shouldclaimesBFR,
    shouldstakeesBFR,
    shouldclaimarb,
  } = compoundState;

  return (
    <div className="min-w-[250px] tab:min-w-fit">
      <div className="text-f14 mb-5">Compound Rewards</div>
      <div className="flex flex-col gap-3">
        {/* <div className="flex text-f13">
          <BufferCheckbox
            checked={true}
            isDisabled={true}
            onCheckChange={() =>
              setCompoundState((prvState) => {
                return {
                  ...prvState,
                  // shouldstakemultiplierpoints:
                  //   !prvState.shouldstakemultiplierpoints,
                };
              })
            }
            className="mr-3"
          />
          <div className={`${false ? 'text-1' : 'text-2'}`}>
            Stake Multiplier Points
          </div>
        </div> */}
        <div className="flex text-f13">
          <BufferCheckbox
            checked={shouldclaimiBFR || shouldstakeiBFR}
            isDisabled={shouldstakeiBFR}
            onCheckChange={() =>
              setCompoundState((prvState) => {
                return {
                  ...prvState,
                  shouldclaimiBFR: !prvState.shouldclaimiBFR || shouldstakeiBFR,
                };
              })
            }
            className="mr-3"
          />
          <div
            className={`${
              shouldclaimiBFR && !shouldstakeiBFR ? 'text-1' : 'text-2'
            }`}
          >
            Claim BFR Rewards
          </div>
        </div>
        <div className="flex text-f13">
          <BufferCheckbox
            checked={shouldstakeiBFR}
            onCheckChange={() =>
              setCompoundState((prvState) => {
                return {
                  ...prvState,
                  shouldstakeiBFR: !prvState.shouldstakeiBFR,
                };
              })
            }
            className="mr-3"
          />
          <div className={`${shouldstakeiBFR ? 'text-1' : 'text-2'}`}>
            Stake BFR Rewards
          </div>
        </div>
        <div className="flex text-f13">
          <BufferCheckbox
            checked={shouldclaimesBFR || shouldstakeesBFR}
            isDisabled={shouldstakeesBFR}
            onCheckChange={() =>
              setCompoundState((prvState) => {
                return {
                  ...prvState,
                  shouldclaimesBFR:
                    !prvState.shouldclaimesBFR || shouldstakeesBFR,
                };
              })
            }
            className="mr-3"
          />
          <div
            className={`${
              shouldclaimesBFR && !shouldstakeesBFR ? 'text-1' : 'text-2'
            }`}
          >
            Claim esBFR Rewards
          </div>
        </div>
        <div className="flex text-f13">
          <BufferCheckbox
            checked={shouldstakeesBFR}
            onCheckChange={() =>
              setCompoundState((prvState) => {
                return {
                  ...prvState,
                  shouldstakeesBFR: !prvState.shouldstakeesBFR,
                };
              })
            }
            className="mr-3"
          />
          <div className={`${shouldstakeesBFR ? 'text-1' : 'text-2'}`}>
            Stake esBFR Rewards
          </div>
        </div>
        <div className="flex text-f13">
          <BufferCheckbox
            checked={shouldclaimarb}
            isDisabled={true}
            onCheckChange={
              () => {}
              //   setCompoundState((prvState) => {
              //     return {
              //       ...prvState,
              //       shouldclaimarb: !prvState.shouldclaimarb,
              //     };
              //   })
            }
            className="mr-3"
          />
          <div className={`${false ? 'text-1' : 'text-2'}`}>
            Claim ARB Rewards
          </div>
        </div>
        {/* <div className="flex text-f13">
          <BufferCheckbox
            checked={shouldconvertweth}
            onCheckChange={() =>
              setCompoundState((prvState) => {
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
          compound2(
            shouldclaimiBFR,
            shouldstakeiBFR,
            shouldclaimesBFR,
            shouldstakeesBFR,
            shouldclaimarb
          )
        }
        className={'px-4 rounded-sm !h-7 w-full mt-5'}
      >
        Compound
      </BlueBtn>
    </div>
  );
};
