import Background from "./style";
interface IGraphView {
  className?: string;
}

const GraphView: React.FC<IGraphView> = ({ className, children }) => {
  return <Background className={className}>{children}</Background>;
};

export default GraphView;
