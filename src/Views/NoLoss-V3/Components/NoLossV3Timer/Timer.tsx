export const Timer = ({
  header,
  bottom,
}: {
  header: number;
  bottom: string;
}) => (
  <div className="flex gap-1">
    <div className="">{header.toString().padStart(2, '0')}</div>
    <div className=" ">{bottom}</div>
  </div>
);
