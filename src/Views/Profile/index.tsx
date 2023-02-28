import { ClaimedNFT } from '@Views/NFTView/Claimed';
import { HistoryTables } from './Components/HistoryTable';
import { ProfileCards } from './Components/ProfileCards';
import { ReferralLink } from './Components/ReferralLink';
import { UserData } from './Components/UserData';
import {
  ArbitrumOnly,
  ChainNotSupported,
} from '@Views/Common/ChainNotSupported';

export const ProfilePage = () => {
  return (
    <ArbitrumOnly>
      <main className="content-drawer">
        <Profile />
      </main>
    </ArbitrumOnly>
  );
};
// const profileHeadingClass=
const Profile = () => {
  return (
    <div className="px-7 my-8 sm:px-3">
      <UserData />
      <ReferralLink />
      <ProfileCards />
      <div className="my-8 flex flex-col ">
        <div className="text-f22 mb-7">Trades</div>
        <HistoryTables />
      </div>
      <ClaimedNFT />
    </div>
  );
};
