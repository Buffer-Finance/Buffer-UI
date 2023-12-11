import { Cancel, Done } from '@mui/icons-material';
import './index.css';

export function ValidationRow({
  isValid,
  children,
}: {
  isValid: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="ValidationRow">
      <div className="ValidationRow-icon-container">
        {isValid && <Done className="ValidationRow-icon" />}
        {!isValid && <Cancel className="ValidationRow-icon" />}
      </div>
      <div>{children}</div>
    </div>
  );
}
