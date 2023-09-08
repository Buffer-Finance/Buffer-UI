import NumberTooltip from '@Views/Common/Tooltips';
import {
  InstantSVG,
  NonCustodialSVG,
  OneClickSVG,
  ZeroGasSVG,
} from './FeaturesSVGs';

const features = [
  {
    desc: 'Zero Gas',
    img: <ZeroGasSVG />,
    tooltip: `Trade gas-free without worrying about fluctuating gas price`,
  },
  {
    desc: 'Instant',
    img: <InstantSVG />,
    tooltip: `Get instant trade confirmation without waiting for block to be mined`,
  },
  {
    desc: '1 Click',
    img: <OneClickSVG />,
    tooltip: `Say goodbye to wallet confirmations and hello to 2x faster trading`,
  },

  {
    desc: 'Non Custodial',
    img: <NonCustodialSVG />,
    tooltip: `Trade with full custody of your funds. No deposit or signups required.`,
  },
];

export const Features = () => {
  return (
    <div className="flex justify-between mb-4 ">
      {features.map((s, idx) => {
        return (
          <NumberTooltip key={s.tooltip} content={s.tooltip}>
            <div
              className={`flex w-1/4 flex-col content-center items-center ${
                idx < features.length - 1 ? 'border-right' : ''
              }`}
            >
              {s.img}
              <div className="mt-3 whitespace-nowrap text-[#C2C1D3]">
                {s.desc}
              </div>
            </div>
          </NumberTooltip>
        );
      })}
    </div>
  );
};
