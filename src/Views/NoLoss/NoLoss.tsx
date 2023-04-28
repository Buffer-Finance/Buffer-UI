import { useNoLossConfig } from './useNoLossConfig';

const NoLoss: React.FC<any> = ({}) => {
  const { hello } = useNoLossConfig();
  return <div>I am no loss</div>;
};

export { NoLoss };
