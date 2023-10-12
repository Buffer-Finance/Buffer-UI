import { Card } from '@Views/Earn/Components/Card';
import { profileCardClass } from './ProfileCards';

export const WalletNotConnectedCard = ({ heading }: { heading: string }) => (
  <Card
    top={heading}
    middle={<div className="mt-3">Wallet not connected.</div>}
    className={profileCardClass}
    shouldShowDivider={false}
  />
);
