export const Timer = ({
  header,
  bottom,
}: {
  header: number;
  bottom: string;
}) => (
  <div className="flex-col">
    <div className="text-f14  font-[500]">
      {header.toString().padStart(2, '0')}
    </div>
    <div className="text-[9px] font-[500] ">{bottom}</div>
  </div>
);
