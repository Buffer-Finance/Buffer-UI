import { Display } from '@Views/Common/Tooltips/Display';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import { keyClasses, valueClasses } from '@Views/Earn/Components/VestCards';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';

export const ProfileCards = () => {
  return (
    <TableAligner
      keysName={['Total']}
      values={[
        <div className={`${wrapperClasses}`}>
          <Display className="!justify-end" data={'101'} label="$" />
        </div>,
      ]}
      keyStyle={keyClasses}
      valueStyle={valueClasses}
    />
  );
};
