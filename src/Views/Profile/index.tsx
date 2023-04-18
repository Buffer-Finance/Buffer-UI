import { usePrice } from '@Hooks/usePrice';
import { ArbitrumOnly } from '@Views/Common/ChainNotSupported';
import { TokenDataNotIncludedWarning } from '@Views/Common/TokenDataNotIncludedWarning';
import { ClaimedNFT } from '@Views/NFTView/Claimed';
import { HistoryTables } from './Components/HistoryTable';
import { ProfileCards } from './Components/ProfileCards';
import { ReferralLink } from './Components/ReferralLink';
import { UserData } from './Components/UserData';
import { LBFR } from './LBFR';

export const ProfilePage = () => {
  return (
    <main className="content-drawer">
      <Profile />
    </main>
  );
};
const Profile = () => {
  usePrice(true);
  return (
    <div>
      {/* <TokenDataNotIncludedWarning /> */}
      <div className="px-7 my-8 sm:px-3">
        <UserData />
        <ReferralLink />
        <ArbitrumOnly hide>
          <LBFR />
        </ArbitrumOnly>
        <ProfileCards />
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
