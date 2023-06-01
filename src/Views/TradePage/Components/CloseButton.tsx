import { CLoseSVG } from './CloseSVG';

export const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div role="button" onClick={onClick}>
      <CLoseSVG />
    </div>
  );
};
