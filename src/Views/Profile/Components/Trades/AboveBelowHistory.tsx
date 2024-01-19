import BufferTab from '@Views/Common/BufferTab';
import TabSwitch from '@Views/Common/TabSwitch';
import { useState } from 'react';

export const AboveBelowHistory = () => {
  const [activeTabIdx, changeActiveTab] = useState(0);
  return (
    <div>
      <div className="mb-5 sm:mb-[0]">
        <BufferTab
          value={activeTabIdx}
          handleChange={(e, t) => {
            changeActiveTab(t);
          }}
          tablist={[
            {
              name: 'Active',
            },
            { name: 'History' },
          ]}
        />
      </div>
      <TabSwitch
        value={activeTabIdx}
        childComponents={[<div>Active</div>, <div>History</div>]}
      />
    </div>
  );
};
