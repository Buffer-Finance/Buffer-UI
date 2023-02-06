interface ITypeChip {
  type: number | string;
  className?: string;
}

const VersionChip: React.FC<ITypeChip> = ({ type, className }) => {
  return <div className={`type-chip font1 ${className}`}>{type}</div>;
};

export default VersionChip;
