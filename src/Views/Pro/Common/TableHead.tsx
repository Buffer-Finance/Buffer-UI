import { TableHeads } from "@Views/Common/TableComponents/TableComponents.tsx";
interface ITableHeader {
  col: number;
  headsArr: (string | JSX.Element)[];
  className?: string;
  firstColClassName?: string;
}
export const TableHeader: React.FC<ITableHeader> = ({
  col,
  headsArr,
  className,
  firstColClassName,
}) => {
  if (col > headsArr.length) return <div>Unhandled col of header</div>;
  return (
    <TableHeads
      style={col === 0 ? firstColClassName + " " + className : className}
    >
      {headsArr[col]}
    </TableHeads>
  );
};
