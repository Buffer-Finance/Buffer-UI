import { Warning } from '@Views/Common/Notification/warning';

export const ContestEndWarning: React.FC<{
  isClosed: boolean | undefined;
  endDate: string;
}> = ({ isClosed, endDate }) => {
  return (
    <Warning
      closeWarning={() => {}}
      state={isClosed}
      shouldAllowClose={false}
      body={
        <div className="flex gap-3 items-start">
          <img
            src="/lightning.png"
            alt="lightning"
            className="mr-3 mt-2 h-[18px]"
          />
          The competition ended on {endDate} 4pm UTC.
        </div>
      }
      className="!mb-3 text-f16"
    />
  );
};
