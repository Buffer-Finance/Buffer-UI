import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useWriteCall } from '@Hooks/useWriteCall';
import { group2abi } from '@Views/AdminConfigs/helpers';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { useState } from 'react';
import { useReadContracts } from 'wagmi';
const PAUSER_IDX = 0;
const UNPAUSER_IDX = 1;
const GrantRole: React.FC<any> = ({}) => {
  const { activeChain } = useActiveChain();
  const config = getConfig(activeChain.id);
  const { writeCall } = useWriteCall(
    config.config_setter,
    group2abi['config_setter']
  );
  const onChange = (address: string, role: string) => {
    console.log(`GrantRole-role: `, role);
    writeCall((a) => {}, 'grantRole', [role, address], null, null, null);
    return console.log;
  };
  const roles = useReadContracts({
    contracts: [
      {
        address: config.config_setter,
        abi: group2abi['config_setter'],
        functionName: 'PAUSER_ROLE',
        args: [],
      },
      {
        address: config.config_setter,
        abi: group2abi['config_setter'],
        functionName: 'UNPAUSER_ROLE',
        args: [],
      },
    ],
  });
  return (
    <div className="m-[20px] ">
      <h1 className="text-f20">Manage Roles</h1>
      {roles.data?.map((s, idx) => {
        return (
          <div key={s.result} className="my-[10px] ">
            <div className="mb-[5px] text-f14">
              Grant <b>{idx == PAUSER_IDX ? 'Pause' : 'Unpause'}</b> Role
            </div>
            <RoleInput onChange={onChange} type={s.result} />
          </div>
        );
      })}
    </div>
  );
};

export const validateAddress = (adds, toastify) => {
  return true;
};

export { GrantRole };
const RoleInput = ({
  onChange,
  type,
}: {
  onChange: (val: string, role: string) => void;
  type: string;
}) => {
  const toastify = useToast();
  const [val, setVal] = useState('');
  return (
    <div className="flex items-center gap-x-[5px]">
      <input
        className="bg-[#2b3054] rounded-md p-2"
        value={val}
        placeholder="Enter the account address"
        onChange={(e) => setVal(e.target.value)}
      />
      <button
        onClick={() => {
          validateAddress(val, toastify) && onChange(val, type);
        }}
      >
        Grant
      </button>
    </div>
  );
};
