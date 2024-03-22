import { ArbitrumOnly } from '@Views/Common/ChainNotSupported';
import { ClaimedNFT } from '@Views/NFTView/Claimed';
import { useEffect } from 'react';
import { HistoryTables } from './Components/HistoryTable';
import { ProfileCardsComponent } from './Components/ProfileCardsComponent';
import { ReferralLink } from './Components/ReferralLink';
import { UserDataComponent } from './Components/UserDataComponent';

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
      {/* <TokenDataNotIncludedWarning /> */}
      <div className="px-7 my-8 sm:px-3">
        <UserDataComponent />
        <ReferralLink />
        {/* <ArbitrumOnly hide>
          <LBFR />
        </ArbitrumOnly> */}
        <ProfileCardsComponent />
        <ArbitrumOnly hide>
          <ClaimedNFT />
        </ArbitrumOnly>
        <div className="my-7 flex flex-col ">
          <div className="text-f22 mb-7">Trades</div>
          <HistoryTables />
        </div>
      </div>
    </div>
  );
};
