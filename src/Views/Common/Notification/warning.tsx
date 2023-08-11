import { CloseOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export const Warning: React.FC<{
  body: JSX.Element;
  state?: boolean;
  closeWarning: () => void;
  shouldAllowClose?: boolean;
  className?: string;
}> = ({
  body,
  state = true,
  closeWarning,
  shouldAllowClose = true,
  className = '',
}) => {
  if (state)
    return (
      <div
        className={`flex font-normal sm:text-f14 text-1 bg-[#191b20] rounded-md mt-4 px-6 sm:px-5 py-4 mb-6 tab:mb-1 hover:brightness-125 w-fit mx-auto ${className}`}
      >
        {body}
        {shouldAllowClose && (
          <IconButton className="text-1 !mt-[3px]" onClick={closeWarning}>
            <CloseOutlined />
          </IconButton>
        )}
      </div>
    );
  else return <></>;
};
