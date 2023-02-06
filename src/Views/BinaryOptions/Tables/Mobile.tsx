import Background from "./style";

interface IPGMobileTable {
  className?: string;
}

const PGMobileTable: React.FC<IPGMobileTable> = ({ className }) => {
  return <Background className={className}></Background>;
};

export default PGMobileTable;
