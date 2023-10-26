import { DOwnTriangle } from '@Public/ComponentSVGS/DownTriangle';
import { UpTriangle } from '@Public/ComponentSVGS/UpTriangle';

export const UpDownChipWOText: React.FC<{
  isUp: boolean;
}> = ({ isUp }) => {
  return isUp ? (
    <UpTriangle className={`ml-2 scale-[0.90]`} />
  ) : (
    <DOwnTriangle className={`ml-2`} />
  );
};
