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
        <div className="flex gap-3 items-start">
          <img
            src="/lightning.png"
            alt="lightning"
            className="mr-3 mt-2 h-[18px]"
          />
          Data for trades under 100 USDC is currently not being accounted for.
          This will be fixed shortly.
        </div>
      }
      className="!mb-3"
    />
  );
};
