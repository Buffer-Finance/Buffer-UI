import {
  DOwnTriangle,
  DOwnTriangleLg,
} from '@Public/ComponentSVGS/DownTriangle';
import { UpTriangle, UpTriangleLg } from '@Public/ComponentSVGS/UpTriangle';

export const UpDownChipWOText: React.FC<{
  isUp: boolean;
  ab: boolean;
}> = ({ isUp }) => {
  return isUp ? (
    <UpTriangle className={`ml-2 scale-[0.90]`} />
  ) : (
    <DOwnTriangle className={`ml-2`} />
  );
};
export const UpDownChipWOTextSm: React.FC<{
  isUp: boolean;
}> = ({ isUp }) => {
  return isUp ? (
    <UpTriangleLg clasName={'mt-[18px]'} />
  ) : (
    <DOwnTriangleLg className={'mt-[18px]'} />
  );
};
