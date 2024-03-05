import { TimeElapsedBar } from '@Views/TradePage/Components/TimeElapsedBar';
import { TradeType } from '@Views/TradePage/type';

export const TimerBar: React.FC<{
  trade: TradeType;
}> = ({ trade }) => {
  //   const [count, setCount] = useState(0);
  //   useEffect(() => {
  //     if (!stopTime) {
  //       const timer = setInterval(() => {
  //         setCount(count + 1);
  //       }, 1000);
  //       return () => clearInterval(timer);
  //     }
  //   }, [count]);

  let currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = trade.expiration_time;
  const startTime = trade.open_timestamp;
  if (!expirationTime) return <TimeElapsedBar progressPercent={0} />;
  if (!startTime) return <TimeElapsedBar progressPercent={0} />;
  let timeElapsedPercent = 0;

  const elapsedTime = currentTime - +startTime;
  const period = expirationTime - startTime;
  timeElapsedPercent = Math.round((elapsedTime / +period) * 100);
  timeElapsedPercent = Math.min(timeElapsedPercent, 100);
  return (
    <div className="my-3">
      <TimeElapsedBar progressPercent={timeElapsedPercent} />
    </div>
  );
};
