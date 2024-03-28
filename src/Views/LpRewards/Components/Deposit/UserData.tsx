import { BlueBtn } from '@Views/Common/V2-Button';
import { poolToTokenMapping } from '../../config';
import { poolsType } from '../../types';
import { DataColumn, defaultDataStyle } from '../DataColumn';

import { Container } from './Styles';

export const UserData: React.FC<{ activePool: poolsType }> = ({
  activePool,
}) => {
  return (
    <Container>
      <div className="flex flex-col gap-6">
        <DataColumn
          title="Total value"
          value={<span className={defaultDataStyle}>1,0567 USDC</span>}
        />
        <DataColumn
          title="Current APR"
          value={<span className={defaultDataStyle}>67%</span>}
        />
        <DataColumn
          title={`${poolToTokenMapping[activePool]} rewards`}
          value={<span className={defaultDataStyle}>1.23,458</span>}
        />
        <DataColumn
          title="esBFR rewards"
          value={<span className={defaultDataStyle}>56,661</span>}
        />
      </div>
      <BlueBtn onClick={() => {}} className="!w-fit px-5 py-[0]">
        Claim
      </BlueBtn>
    </Container>
  );
};
