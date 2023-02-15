import { ClaimedNFT } from '@Views/NFTView/Claimed';
import { HistoryTables } from './Components/HistoryTable';
import { ProfileCards } from './Components/ProfileCards';
import { UserData } from './Components/UserData';

export const ProfilePage = () => {
  return (
    <main className="content-drawer">
      <Profile />
    </main>
  );
};

const Profile = () => {
  return (
    <div className="px-7 my-8">
      <UserData />
      <div className="my-8 flex flex-col ">
        <div className="text-f22 mb-7">Trade History</div>

        <HistoryTables />
      </div>
      {/* <ProfileCards /> */}
      <ClaimedNFT />
    </div>
  );
};
