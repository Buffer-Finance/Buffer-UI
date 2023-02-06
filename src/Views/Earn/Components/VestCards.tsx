import { Skeleton } from '@mui/material';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { IEarn, IVestToken } from '../earnAtom';
import { Card } from './Card';
import { EarnButtons } from './EarnButtons';

export const keyClasses = '!text-f15 !text-2 !text-left !py-2 !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-2 !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';

export const getVestCards = (data: IEarn) => {
  if (!data.vest)
    return [0, 1].map((index) => (
      <Skeleton key={index} className="w-full !h-full min-h-[250px] !bg-1" />
    ));
  return [
    <Card
      top="BFR Vault"
      middle={<VestCard data={data.vest.ibfr} unit="esBFR" />}
      bottom={
        <div className="mt-5">
          <EarnButtons cardNum={4} />
        </div>
      }
    />,
    <Card
      top="BLP Vault"
      middle={<VestCard data={data.vest.blp} unit="BLP" />}
      bottom={
        <div className="mt-5">
          <EarnButtons cardNum={5} />
        </div>
      }
    />,
  ];
};

const VestCard = ({ data, unit }: { data: IVestToken; unit: string }) => {
  const isBLPCard = unit === 'BLP';
  return (
    <TableAligner
      keysName={[
        'Staked Tokens',
        'Reserved for Vesting',
        'Vesting Status',
        'Claimable',
      ]}
      values={[
        <div className="flex justify-end">
          <Display
            className="!justify-end"
            data={data.staked_tokens.value}
            content={
              !isBLPCard ? (
                <TableAligner
                  keysName={data.staked_tokens.tooltip.map((t) => t.key)}
                  keyStyle={tooltipKeyClasses}
                  valueStyle={tooltipValueClasses}
                  values={data.staked_tokens.tooltip.map((s) => (
                    <Display className="!justify-end" data={s.value} unit="" />
                  ))}
                ></TableAligner>
              ) : null
            }
            unit={isBLPCard && unit}
          />
        </div>,
        <div className="flex justify-end flex-wrap">
          <Display
            className="!justify-end"
            data={data.reserved_for_vesting[0]}
          />
          &nbsp;/&nbsp;
          <Display
            className="!justify-end"
            // content={<div>Helo there i am the custom content</div>}
            data={data.reserved_for_vesting[1]}
          />
        </div>,
        <NumberTooltip
          content={
            <div>
              <Display
                className="!justify-end inline"
                data={data.vesting_status.claimed}
                unit=" esBFR"
              />
              &nbsp;
              <span> tokens have been converted to BFR from the </span>
              <Display
                className="!justify-end inline"
                data={data.vesting_status.vested}
                unit="esBFR"
              />{' '}
              deposited for vesting.
            </div>
          }
        >
          <div className={`flex justify-end ${underLineClass}`}>
            <Display
              className="!justify-end"
              disable
              data={data.vesting_status.claimed}
            />
            &nbsp;/&nbsp;
            <Display
              className="!justify-end"
              disable
              data={data.vesting_status.vested}
            />
          </div>
        </NumberTooltip>,
        <div className="flex justify-end">
          <Display
            className="!justify-end"
            data={data.claimable}
            // placement="bottom"
            unit="BFR"
            content={
              <div>
                <Display
                  className="!justify-end inline"
                  data={data.claimable}
                  unit=" BFR"
                />{' '}
                tokens can be claimed, use the options under the Total Rewards
                section to claim them.
              </div>
            }
          />
        </div>,
      ]}
      keyStyle={keyClasses}
      valueStyle={valueClasses}
    />
  );
};
