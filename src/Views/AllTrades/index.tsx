import { useAllTradesGraphQl } from './useAllTradesGraphQl';

export const AllTradesPage = () => {
  return (
    <main className="content-drawer">
      <AllTrades />
    </main>
  );
};

const AllTrades = () => {
  const { data } = useAllTradesGraphQl({
    activefirst: 1000,
    activeskip: 0,
    currentTime: Math.floor(new Date().getTime() / 1000),
    historyfirst: 1000,
    historyskip: 0,
  });
  console.log('alltrades', data);
  return <div className="px-7 my-8 sm:px-3">Trades</div>;
};
