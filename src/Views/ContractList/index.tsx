import { useActiveChain } from '@Hooks/useActiveChain';
import CopyIcon from '@SVG/Elements/CopyIcon';
import copyToClipboard from '@Utils/copyToClipboard';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { ArrowDropDown, ArrowRight } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import axios from 'axios';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

interface IContract {
  configContract: any;
  routerContract: string;
  address: string;
  isPaused: boolean;
  category: number;
  asset: string;
  pool: string;
}

const routerToNameMapping: { [routerAddress: string]: string } = {
  '0x0e0A1241C9cE6649d5D30134a194BA3E24130305': 'V1',
  '0x3890F9664188a2A7292319Ce67320037BE634D3a': 'V2',
  '0x075EEA84D1122A0c2F2A6C9265F8126F64087d44': 'V2.5',
  '0xFd1EDa553d25448383FBD72bBE4530182266ed8D': 'V2.5.3',
};

export const ContractList = () => {
  const { activeChain } = useActiveChain();
  const config = getConfig(activeChain.id);

  async function fetcher() {
    try {
      const { data, status } = await axios.post(config.graph.MAIN, {
        query: `{ 
                optionContracts(first:10000){
                          configContract {
                            address
                          }
                          routerContract
                          address
                          isPaused
                          category
                          asset
                          pool
                        }
                    }`,
      });
      if (status !== 200) throw new Error('Error fetching contracts');
      if (data?.data?.optionContracts === undefined)
        throw new Error('Error fetching contracts', data);
      return data.data.optionContracts;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  const { data: contracts } = useSWR<IContract[]>(config.graph, {
    fetcher,
  });
  const routerWiseContracts = useMemo(() => {
    if (contracts === undefined) return null;
    const response: { [routerAddress: string]: IContract[] } = {};
    contracts.forEach((contract) => {
      if (response[contract.routerContract] === undefined)
        response[contract.routerContract] = [];
      response[contract.routerContract].push(contract);
    });
    return response;
  }, [contracts]);
  if (routerWiseContracts === null)
    return <div className="text-f15">No Contracts Found.</div>;
  console.log(routerWiseContracts, 'routerWiseContracts');
  return (
    <div className="flex flex-col p-4 ">
      {Object.entries(routerWiseContracts).map(([router, contracts]) => {
        return <ContractsList router={router} contracts={contracts} />;
      })}
    </div>
  );
};

const List: React.FC<{
  Header: JSX.Element;
  List: JSX.Element;
  defaultExpanded: boolean;
  className?: string;
  onCopy: () => void;
}> = ({ Header, List, className = '', defaultExpanded, onCopy }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`text-f15 ${className}`}>
      <div className="flex items-center gap-4">
        <IconButton
          onClick={() => {
            setIsExpanded((prv) => !prv);
          }}
        >
          {!isExpanded ? (
            <ArrowRight className="text-1" />
          ) : (
            <ArrowDropDown className="text-1" />
          )}
        </IconButton>
        <div className="flex items-center">
          {Header}
          <IconButton onClick={onCopy} title="Copy Contrats">
            <CopyIcon className="text-1" />
          </IconButton>
        </div>
      </div>
      {isExpanded && List}
    </div>
  );
};

const ContractsList: React.FC<{ router: string; contracts: IContract[] }> = ({
  contracts,
  router,
}) => {
  const routerName = routerToNameMapping[router] ?? 'Unknown';

  const poolWiseContracts = useMemo(() => {
    const response: { [poolName: string]: IContract[] } = {};
    contracts.forEach((contract) => {
      if (response[contract.pool] === undefined) response[contract.pool] = [];
      response[contract.pool].push(contract);
    });
    return response;
  }, [contracts]);
  return (
    <List
      onCopy={() => {
        const copyAbleContractsJson = JSON.stringify(
          contracts.map((contract) => contract.address)
        );

        copyToClipboard(copyAbleContractsJson);
      }}
      defaultExpanded={true}
      Header={
        <div>
          {router} - {routerName}
        </div>
      }
      List={
        <div>
          {Object.entries(poolWiseContracts).map(([pool, contracts]) => {
            return (
              <List
                onCopy={() => {
                  const copyAbleContractsJson = JSON.stringify(
                    contracts.map((contract) => contract.address)
                  );
                  copyToClipboard(copyAbleContractsJson);
                }}
                defaultExpanded={false}
                Header={<div>{pool || 'Unknown'}</div>}
                List={
                  <div className="ml-[42px]">
                    {contracts.map((contract) => (
                      <div className="flex items-center gap-3">
                        <div>{contract.address}</div>
                        <div>
                          {contract.asset} - {contract.pool}
                        </div>
                        <div>{contract.isPaused ? 'Paused' : 'Running'}</div>
                      </div>
                    ))}
                  </div>
                }
                className="ml-8"
              />
            );
          })}
        </div>
      }
    />
  );
};

export default ContractList;
