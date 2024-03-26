import { PairTokenImage } from '@Views/ABTradePage/Views/PairTokenImage';
import { Display } from '@Views/Common/Tooltips/Display';
import { IBLP } from '@Views/Dashboard/interface';
import { Card } from '@Views/Earn/Components/Card';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import {
  keyClasses,
  tooltipKeyClasses,
  tooltipValueClasses,
  valueClasses,
} from '@Views/Earn/Components/VestCards';
import { getAssetImageUrl } from '@Views/ABTradePage/utils/getAssetImageUrl';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { Skeleton } from '@mui/material';

export const BLPcard = ({
  data,
  tokenName,
  poolName,
}: {
  data: IBLP | null;
  tokenName: string;
  poolName: string;
}) => {
  const shouldDisplayPOL = poolName !== 'aBLP';

  if (!data)
    return <Skeleton className="!transform-none !h-full min-h-[190px] !bg-1" />;
  return (
    <Card
      top={
        <div className="flex items-center">
          <div className="w-[28px] h-[28px] mr-[6px]">
            <PairTokenImage
              image2={'/BLPlogo.png'}
              image1={getAssetImageUrl(tokenName)}
            />
          </div>
          <div className="flex flex-col ml-2">
            <div>{poolName}</div>
          </div>
        </div>
      }
      middle={
        <TableAligner
          keyStyle={keyClasses}
          valueStyle={valueClasses}
          keysName={[
            'Exchange Rate',
            'Total Supply',
            `Total ${tokenName} Amount`,
            // shouldDisplayPOL && `POL(${tokenName})`,
            'APR',
          ].filter((key) => key)}
          values={[
            <div className={wrapperClasses}>
              <Display data={data.price} unit={tokenName} precision={4} />
            </div>,
            <div className={wrapperClasses}>
              <Display data={data.supply} unit={poolName} />
            </div>,

            <div className={wrapperClasses}>
              <Display data={data.total_usdc} unit={tokenName} />
            </div>,
            // shouldDisplayPOL && (
            //   <div className={wrapperClasses}>
            //     {data.usdc_pol ? (
            //       <NumberTooltip
            //         content={
            //           toFixed(
            //             multiply(
            //               divide(data.usdc_pol, data.usdc_total) as string,
            //               2
            //             ),
            //             2
            //           ) + `% of total liquidity in the ${tokenName} vault.`
            //         }
            //       >
            //         <div>
            //           <Display
            //             data={multiply(data.usdc_pol, data.price) || '0'}
            //             unit={tokenName}
            //             disable
            //             className={underLineClass}
            //           />
            //         </div>
            //       </NumberTooltip>
            //     ) : (
            //       <>-</>
            //     )}
            //   </div>
            // ),
            <div className={`${wrapperClasses}`}>
              <Display
                className="!justify-end"
                data={data.apr.value}
                placement="bottom"
                unit="%"
                content={
                  <span>
                    <TableAligner
                      keysName={data.apr.tooltip.map((s) => s.key)}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={data.apr.tooltip.map((s) => (
                        <Display
                          className="!justify-end"
                          data={s.value}
                          unit="%"
                        />
                      ))}
                    ></TableAligner>
                    {/* <div className="text-left mt-3 font-normal">
                        {data.apr.description}
                      </div> */}
                  </span>
                }
              />{' '}
            </div>,
          ].filter((value) => value)}
        />
      }
    />
  );
};
