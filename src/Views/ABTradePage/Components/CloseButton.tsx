import { CLoseSVG } from './CloseSVG';

export const CloseButton: React.FC<{
  onClick: () => void;
  className?: string;
}> = ({ onClick, className = '' }) => {
  return (
    <div role="button" onClick={onClick} className={className}>
      <CLoseSVG />
    </div>
  );
};
