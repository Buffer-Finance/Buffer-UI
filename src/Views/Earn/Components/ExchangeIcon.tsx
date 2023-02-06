import { ExpandMoreRounded } from '@mui/icons-material';

export const ExchangeIcon = ({ className = '' }) => (
  <div className={`rounded-full p-2 bg-1 w-fit m-auto ${className}`}>
    <ExpandMoreRounded className="!w-7 !h-7" />
  </div>
);
