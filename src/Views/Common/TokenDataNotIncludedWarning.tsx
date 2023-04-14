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
          Trades under 100 USDC are not accounted for currently, stats for the
          same will be live shortly.
        </>
      }
      className="!mb-3"
    />
  );
};
