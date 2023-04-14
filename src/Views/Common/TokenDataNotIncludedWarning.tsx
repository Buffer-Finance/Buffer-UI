import { Warning } from './Notification/warning';

export const TokenDataNotIncludedWarning = ({
  tokenName = 'ARB',
}: {
  tokenName?: string;
}) => {
  return (
    <Warning
      closeWarning={() => {}}
      state={true}
      shouldAllowClose={false}
      body={
        <>
          <img
            src="/lightning.png"
            alt="lightning"
            className="mr-3 mt-2 h-[18px]"
          />
          Stats for trades under 100 USDC are currently not being displayed.
          This will be fixed shortly.
        </>
      }
      className="!mb-3"
    />
  );
};
