import { Section } from '@Views/Earn/Components/Section';
import { descStyles, topStyles } from '.';
import { PoolSelectorRadio } from '../Markets/PoolSelectorRadio';
import { Markets } from '../Markets';
import { usePrice, usePriceRetriable } from '@Hooks/usePrice';

const MarketsSection = () => {
  usePriceRetriable();

  return (
    <Section
      Heading={<div className={topStyles}>Markets</div>}
      subHeading={
        <div className={descStyles}>Discover new Pairs available on Buffer</div>
      }
      other={<Markets />}
      HeadingRight={
        <div className="mx-3">
          <PoolSelectorRadio />
        </div>
      }
    />
  );
};

export default MarketsSection;
