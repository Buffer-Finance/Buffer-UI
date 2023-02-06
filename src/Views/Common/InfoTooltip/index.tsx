interface IInfoTooltip {
  className?: string;
}

const InfoTooltip: React.FC<IInfoTooltip> = ({ className }) => {
  return (
    <img
      src="/PredictionGames/info.svg"
      className={`info-tooltip ${className}`}
    ></img>
  );
};

export default InfoTooltip;
