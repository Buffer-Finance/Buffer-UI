import { ClaimedNFT } from '@Views/NFTView/Claimed';

export const ProfilePage = () => {
  return (
    <main className="content-drawer">
      <Profile />
    </main>
  );
};

const Profile = () => {
  return (
    <>
      <ClaimedNFT />
    </>
  );
};
