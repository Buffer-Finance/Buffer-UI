export const defaultDataStyle = 'text-[##EFF0F0] text-f22 font-medium';

export const DataColumn: React.FC<{
  title: string;
  value: React.ReactNode;
}> = ({ title, value }) => {
  return (
    <div className="flex flex-col items-start gap-3 h-full">
      <div className="text-[#7F87A7] text-f14 font-medium leading-[14px]">
        {title}
      </div>
      {value}
    </div>
  );
};
