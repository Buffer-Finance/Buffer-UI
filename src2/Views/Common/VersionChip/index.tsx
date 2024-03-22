interface IVersionChip {
  version: number | string;
  className?: string;
  isCallBooster?: boolean;
}

const VersionChip: React.FC<IVersionChip> = ({
  version,
  className,
  isCallBooster,
}) => {
  return (
    <div className={`version-chip font3 ${className}`}>
      {isCallBooster ? version : "V" + version}
    </div>
  );
};

export default VersionChip;
