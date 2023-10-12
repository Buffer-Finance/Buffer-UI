import { ArbitrumOnly, ExceptArbitrum } from '@Views/Common/ChainNotSupported';
import { UserData } from './UserData';
import { UserDataV2 } from './UserDataV2';

export const UserDataComponent = () => {
  return (
    <>
      {' '}
      <ExceptArbitrum hide>
        <UserData />
      </ExceptArbitrum>
      <ArbitrumOnly hide>
        <UserDataV2 />
      </ArbitrumOnly>
    </>
  );
};
