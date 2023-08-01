import { useCall2Data } from '@Utils/useReadCall';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { erc20ABI } from 'wagmi';

const Test: React.FC<any> = ({}) => {
  // const d = useOneCTWallet();
  const calls = [
    {
      address: '0x50E345c95a3c1E5085AE886FF4AF05Efa2403c90',
      abi: erc20ABI,
      name: 'balanceOf',
      params: ['0x51bD283D59938A6A7fA52847dCDD7A17eFDEA6Fa'],
    },
  ];
  const { data, error } = useCall2Data(calls, 'hello-i0a');
  console.log(`test-data,error: `, data, error);
  return <div></div>;
};

export { Test };
