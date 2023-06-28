import BufferTable from '@Views/Common/BufferTable';
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { rewardApiResponseType } from './useRewardData';
import TableErrorMsg from '@Views/Common/BufferTable/ErrorMsg';
import { TableHeader } from '@Views/Pro/Common/TableHead';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';

export const Table: React.FC<{
  isWinrateTable: boolean;
  data: rewardApiResponseType[] | undefined;
  count: number;
  activePage: number;
  decimals: number;
  unit: string;
  onpageChange: (page: number) => void;
}> = ({
  isWinrateTable,
  data,
  activePage,
  count,
  onpageChange,
  decimals,
  unit,
}) => {
  const params = useParams();
  const navigate = useNavigate();

  enum rewardColumns {
    'Rank',
    'User Address',
    'Volume',
    'Trades',
    'Net PnL (%)',
    'Total Payout',
  }

  const navigateToProfile = (address: string | undefined) => {
    let url = '/profile';
    if (params.chain) url = url + '/' + params.chain;
    if (address === undefined) return;
    navigate(`${url}?user_address=${address}`);
  };

  const firstColPadding = useMemo(() => {
    return {
      head: 'ml-6',
      body: 'ml-4',
    };
  }, []);

  const DailyCols = useMemo(() => {
    return [
      'Rank',
      'User Address',
      'Volume',
      isWinrateTable ? 'Total Trades' : 'Trades',
      isWinrateTable ? 'Trades Won' : 'Net PnL (%)',
      isWinrateTable ? 'Win Rate' : 'Total Payout',
    ];
  }, []);

  const HeaderFormatter = (col: number) => {
    return (
      <TableHeader
        col={col}
        headsArr={DailyCols}
        firstColClassName={firstColPadding.head}
      />
    );
  };

  const BodyFormatter = (row: number, col: number) => {
    if (!data) return <></>;
    const rowData = data[row];
    switch (col) {
      case rewardColumns['Rank']:
        return <div className={firstColPadding.body}>{row + 1}</div>;
      case rewardColumns['User Address']:
        return (
          <NumberTooltip content={rowData.user_address || ''}>
            <div>
              {rowData.user_address.slice(0, 7) +
                '...' +
                rowData.user_address.slice(-7)}
            </div>
          </NumberTooltip>
        );
      case rewardColumns['Volume']:
        return (
          <>
            <Display
              className="!justify-start"
              data={rowData.total_volume / 10 ** decimals}
              precision={2}
              unit={unit}
            />
          </>
        );
      case rewardColumns['Trades']:
        return <>{rowData.total_trades}</>;
      case rewardColumns['Net PnL (%)']:
        const pnlPercent = rowData.absolute_net_pnl / rowData.total_volume;
        return (
          <>
            <Display
              data={pnlPercent * 100}
              className={`!justify-start ${pnlPercent > 0 ? 'green' : 'red'}`}
              precision={2}
              unit="%"
            />
          </>
        );
      case rewardColumns['Total Payout']:
        return (
          <>
            <Display
              data={rowData.total_payout / 10 ** decimals}
              className={`!justify-start ${
                rowData.total_payout > 0 ? 'green' : 'red'
              }`}
              precision={2}
              unit={unit}
            />
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <BufferTable
      widths={['16%', '22%', '16%', '14%', '16%', '16%']}
      className="mt-4 tab:mt-[0] tab:mb-6"
      bodyJSX={BodyFormatter}
      cols={DailyCols.length}
      rows={data?.length ?? 0}
      headerJSX={HeaderFormatter}
      // topDecorator={topDecorator}
      onRowClick={(idx) => {
        if (data) navigateToProfile(data[idx].user_address);
      }}
      count={count}
      activePage={activePage}
      onPageChange={(a, p) => {
        onpageChange(p);
      }}
      loading={!data}
      error={<TableErrorMsg msg="No data found." onClick={() => {}} />}
    />
  );
};
