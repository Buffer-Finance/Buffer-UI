// replace all th occurances with a typescript enabled TableHead component that expects a prop called children in this file

import { ReactNode } from 'react';

const TableHead: React.FC<any> = ({ children }) => {
  return (
    <th className="text-left text-f12 text-[#808191] font-[500]">{children}</th>
  );
};

const TableCell: React.FC<{ className?: string; children?: ReactNode }> = ({
  children,
  className,
}) => {
  return (
    <td className={['font-[500] text-f12', className].join(' ')}>{children}</td>
  );
};
type UDEvent = {
  user: string;
  id: string;
  updatedAt: number;
  payout: string;
  event: string;
  expiration: string;
};
type ABEvent = {
  user: string;
  id: string;
  updatedAt: string;
  payout: string;
  event: string;
};
const events = [
  {
    user: '0xb66127377ff3618b595177b5e84f8ee9827cd061',
    id: '1:0x0e31a3011f1f5e6a14a4c31a376453ee94bf9c9c',
    updatedAt: '1712916421',
    payout: '8750000000000000008',
    event: 'WIN',
  },
  {
    user: '0x5a07da42847849a2f4c6253f9975d037981bf6fa',
    id: '0:0x0e31a3011f1f5e6a14a4c31a376453ee94bf9c9c',
    updatedAt: '1712912695',
    payout: '8750000000000000008',
    event: 'LOSE',
  },
];
const PlatformTradesTab: React.FC<{ events: UDEvent[] | ABEvent[] }> = ({}) => {
  return (
    <div className="flex flex-col">
      <div className="bg-[#282B39] rounded-[5px] mb-1 text-[14px] py-[5px] px-[12px] w-full h-full">
        Platform Trades
      </div>
      <table className=" border-spacing-3 border-spacing-x-2 border-separate px-3">
        <thead>
          <tr className="">
            <TableHead>Strike Price</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>ROI</TableHead>
            <TableHead>Expires in</TableHead>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr className="" key={e.id}>
              <TableCell className="text-red">433.12</TableCell>
              <TableCell>5.0000 ARB</TableCell>
              <TableCell>15%</TableCell>
              <TableCell>3h 40m</TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { PlatformTradesTab };
