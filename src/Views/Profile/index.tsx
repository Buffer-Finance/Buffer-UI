import { ArbitrumOnly } from '@Views/Common/ChainNotSupported';
import { ChainSwitchDropdown } from '@Views/Dashboard';
import { ClaimedNFT } from '@Views/NFTView/Claimed';
import { useLocation } from 'react-router-dom';
import { HistoryTables } from './Components/HistoryTable';
import { ProfileCards } from './Components/ProfileCards';
import { ReferralLink } from './Components/ReferralLink';
import { UserData } from './Components/UserData';

export const ProfilePage = () => {
  return (
    <main className="content-drawer">
      <Profile />
    </main>
  );
};
// const profileHeadingClass=
const Profile = () => {
  return (
    <div className="px-7 my-8 sm:px-3">
      <div className="mb-3">
        <ChainSwitchDropdown baseUrl="/profile" />
      </div>
      <UserData />
      <ReferralLink />
      <ProfileCards />
      <div className="my-8 flex flex-col ">
        <div className="text-f22 mb-7">Trades</div>
        <HistoryTables />
      </div>
      <ArbitrumOnly hide>
        <ClaimedNFT />
      </ArbitrumOnly>
    </div>
  );
};
