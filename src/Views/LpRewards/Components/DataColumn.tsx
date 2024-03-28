export const defaultDataStyle = 'text-[##EFF0F0] text-f22 font-medium';

export const DataColumn: React.FC<{
  title: string;
  value: React.ReactNode;
}> = ({ title, value }) => {
  return (
    <div>
      <div className="text-[#7F87A7] text-f14 font-medium leading-[14px] mb-3">
        {title}
      </div>
      {value}
    </div>
  );
};
