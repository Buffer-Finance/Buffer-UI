import BufferTransitionedTab from '@Views/Common/BufferTransitionedTab';
import { useState } from 'react';
import { PerpsInput, PlatfromFeeError } from './CollatralSelector';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { BuyTradeBackground, BuyTradeHeader, tabs } from '.';

export const BuyTrade: React.FC = () => {
  const [activeTab, setActiveTab] = useState('short');
  const { registeredOneCT } = useOneCTWallet();
  const balance = '23412234';
  const tradeToken = 'USDC';
  const minFee = '2';
  const platformFee = '1233';
  const maxTradeSize = '122220';
  return (
    <BuyTradeBackground>
      <div className="w-[250px] flex flex-col  gap-y-[10px]">
        <div>
          <BuyTradeHeader>Trade size</BuyTradeHeader>
          <BufferTransitionedTab.Container className="!w-full !p-[1.5px] !rounded-[5px]">
            {tabs.map((s) => (
              <BufferTransitionedTab.Tab
                key={s}
                onClick={() => {
                  setActiveTab(s);
                  // setTab(s);
                }}
                className={
                  '!w-full !py-[4px] !text-center !text-f14 !rounded-[5px] text-[#7F87A7] ' +
                  (activeTab === s && ' text-1 ')
                }
                active={activeTab === s}
              >
                {s}
              </BufferTransitionedTab.Tab>
            ))}
          </BufferTransitionedTab.Container>
        </div>
        <div>
          <BuyTradeHeader>Collatral</BuyTradeHeader>
          <PerpsInput />
          {registeredOneCT && (
            <PlatfromFeeError
              platfromFee={platformFee}
              tradeToken={tradeToken}
              balance={balance}
            />
          )}
        </div>
        <div>
          <BuyTradeHeader>Amount</BuyTradeHeader>
          <PerpsInput />
        </div>
      </div>
    </BuyTradeBackground>
  );
};
