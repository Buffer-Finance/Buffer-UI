import SafeProvider from '@safe-global/safe-apps-react-sdk';
import { atom, useAtomValue } from 'jotai';
import { GrantRole } from 'src/Admin/GrantRole';
import { AdminActiveTabAtom, AdminTabs } from './AdminTabs';
import { CircuitBreaker } from './CircuitBreaker';
import { Options } from './Options';
import { SettlementFeeConfigs } from './SettlementFeeConfigs';
import { UpdateDB } from './UpdateDB';
import { SendToSafe } from './sendToSafe';

export const safeTxnsAtom = atom<
  {
    setter: string;
    prevvalue: any;
    id: string;
    to: string;
    value: string;
    data: string;
  }[]
>([]);

const AdminConfig: React.FC<any> = ({}) => {
  const txnBatch = useAtomValue(safeTxnsAtom);
  const activeTab = useAtomValue(AdminActiveTabAtom);

  let tab = <></>;
  if (activeTab.toLowerCase() === 'options') {
    tab = <Options />;
  } else if (activeTab.toLowerCase() === 'settlement fee') {
    tab = <SettlementFeeConfigs />;
  } else if (activeTab.toLowerCase() === 'circuit breaker') {
    tab = <CircuitBreaker />;
  } else if (activeTab.toLowerCase() === 'role manager') {
    tab = <GrantRole />;
  } else if (activeTab.toLowerCase() === 'update db') {
    tab = <UpdateDB />;
  } else tab = <>Select A Tab</>;

  return (
    <div>
      {/* <div className="text-f12 text-2 mt-4">
        Tip: Page is fully accessible via keyboard for a faster experience. Use
        Tab for switching between fields, "Enter" on inputs for launching
        transactions.
      </div> */}
      <AdminTabs />
      {tab}
      <div className="mx-[20px] mt-[10px]">
        {txnBatch.length ? (
          <>
            <SafeProvider
              opts={{
                allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
                debug: false,
              }}
              loader={
                <div className="bg-2 !w-fit text-f14 p-3 rounded-sm mb-4 text-blue-1">
                  Note: Please visit from Gnosis App to do multi-send
                </div>
              }
            >
              <SendToSafe />
            </SafeProvider>
            <h2 className="text-2 text-f12 mb-[20px]">Batched Txns:</h2>{' '}
          </>
        ) : null}
        {txnBatch.map((txn) => (
          <div key={txn.id} className="flex gap-x-[5px]">
            <div>{txn.setter}</div>
            <div>{txn.prevvalue ? JSON.stringify(txn.prevvalue) : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { AdminConfig };
