import Background from "./style";
import { useGlobal } from "@Contexts/Global";

interface ILiquidity {
  head: string | JSX.Element;
  subhead: string;
  children?: React.ReactChild;
  pageName: string;
  className?: string;
}

const HeroCard: React.FC<ILiquidity> = ({
  head,
  subhead,
  pageName,
  children,
  className,
}) => {
  const { state } = useGlobal();
  return (
    <Background className={className}>
      <span className={`f24 text-1 `}>{pageName}</span>
      {head && <span className="f40 c-lb ">{head}</span>}
      {subhead && <span className="f14 text-6 mb11">{subhead}</span>}
      <div>{children}</div>
    </Background>
  );
};

export default HeroCard;
