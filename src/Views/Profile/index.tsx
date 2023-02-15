import { ClaimedNFT } from '@Views/NFTView/Claimed';
import { HistoryTables } from './Components/HistoryTable';

export const ProfilePage = () => {
  return (
    <main className="content-drawer">
      <Profile />
    </main>
  );
};

const Profile = () => {
  return (
    <div>
      <ClaimedNFT />
      <div className="px-7 my-5">
        <HistoryTables />
      </div>
    </div>
  );
};
