import { ArbitrumOnly } from '@Views/Common/ChainNotSupported';
import { ClaimedNFT } from '@Views/NFTView/Claimed';
import { useEffect } from 'react';
import { ProfileCardsComponent } from './Components/ProfileCardsComponent';
import { ReferralLink } from './Components/ReferralLink';
import { UserDataComponent } from './Components/UserDataComponent';
import { Trades } from './Components/Trades';

export const ProfilePage = () => {
  useEffect(() => {
    document.title = 'Buffer | Profile';
  }, []);
  return (
    <main className="content-drawer">
      <Profile />
    </main>
  );
};
const Profile = () => {
  return (
    <div>
      <div className="px-7 my-8 sm:px-3">
        <UserDataComponent />
        <ReferralLink />
        <ProfileCardsComponent />
        <ArbitrumOnly hide>
          <ClaimedNFT />
        </ArbitrumOnly>
        <div className="my-7 flex flex-col ">
          <div className="text-f22 mb-7">Trades</div>
          <Trades />
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
