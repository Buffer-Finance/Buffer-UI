interface IButtonLoader {
  className?: string;
}

const ButtonLoader: React.FC<IButtonLoader> = ({ className }) => {
  return (
    <div className={`snippet ${className}`} data-title=".dot-carousel">
      <div className="stage">
        <div className="dot-carousel"></div>
      </div>
    </div>
  );
};

export default ButtonLoader;
