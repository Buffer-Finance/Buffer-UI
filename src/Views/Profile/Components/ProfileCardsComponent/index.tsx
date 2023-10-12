import { ArbitrumOnly, ExceptArbitrum } from '@Views/Common/ChainNotSupported';
import { ProfileCards } from './ProfileCards';
import { ProfileCardsV2 } from './ProfileCardsV2';

export const ProfileCardsComponent = () => {
  return (
    <>
      <ExceptArbitrum hide>
        <ProfileCards />
      </ExceptArbitrum>
      <ArbitrumOnly hide>
        <ProfileCardsV2 />
      </ArbitrumOnly>
    </>
  );
};
