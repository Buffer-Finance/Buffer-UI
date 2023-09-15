import styled from '@emotion/styled';
import { CloseOutlined } from '@mui/icons-material';

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
      <WarningBody
        className={`flex font-normal sm:text-f14 text-1 bg-[#191b20] rounded-md mt-4 px-6 sm:px-5 py-4 mb-6 tab:mb-1 hover:brightness-125 w-fit mx-auto  ${className}`}
      >
        <div className="warning-body">
          {body}{' '}
          {shouldAllowClose && (
            <CloseOutlined
              className="mt-[3px] cursor-pointer"
              onClick={closeWarning}
            />
          )}
        </div>
      </WarningBody>
    );
  else return <></>;
};

const WarningBody = styled.div`
  .warning-body {
    display: grid;
    grid-template-columns: 1fr fit-content(1rem);
    width: 100%;
    gap: 2px;
  }

  /* @media screen and (max-width: 800px) {
    .warning-body {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
    }
  } */
`;
