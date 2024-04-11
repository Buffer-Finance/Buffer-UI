// replace all th occurances with a typescript enabled TableHead component that expects a prop called children in this file

import { ReactNode } from 'react';

const TableHead: React.FC<any> = ({ children }) => {
  return <th className="text-left text-f12">{children}</th>;
};

const TableCell: React.FC<{ className?: string; children?: ReactNode }> = ({
  children,
  className,
}) => {
  return (
    <td className={['font-[500] text-f12', className].join(' ')}>{children}</td>
  );
};

const PlatformTradesTab: React.FC<any> = ({}) => {
  return (
    <div className="flex flex-col">
      <div className="bg-[#282B39] text-[14px] py-[5px] px-[12px] w-full h-full">
        Platform Trades
      </div>
      <table>
        <thead>
          <tr>
            <TableHead>Strike Price</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>ROI</TableHead>
            <TableHead>Expires in</TableHead>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell className="text-red">433.12</TableCell>
            <TableCell>5.0000 ARB</TableCell>
            <TableCell>15%</TableCell>
            <TableCell>3h 40m</TableCell>
          </tr>
          <tr>
            <TableCell>433.12</TableCell>
            <TableCell>5.0000 ARB</TableCell>
            <TableCell>15%</TableCell>
            <TableCell>3h 40m</TableCell>
          </tr>
          <tr>
            <TableCell>433.12</TableCell>
            <TableCell>5.0000 ARB</TableCell>
            <TableCell>15%</TableCell>
            <TableCell>3h 40m</TableCell>
          </tr>
          <tr>
            <TableCell>433.12</TableCell>
            <TableCell>5.0000 ARB</TableCell>
            <TableCell>15%</TableCell>
            <TableCell>3h 40m</TableCell>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export { PlatformTradesTab };
