import { ShowIcon } from '@SVG/Elements/ShowIcon';
import { visualizeddAtom } from '@Views/TradePage/atoms';
import { useAtom } from 'jotai';

export const Visualized: React.FC<{ queue_id: number; className?: string }> = ({
  queue_id,
  className = '',
}) => {
  const [visualized, setVisualized] = useAtom(visualizeddAtom);
  const isVisualized = visualized.includes(queue_id);

  return (
    <div className={className}>
      <ShowIcon
        show={!isVisualized}
        onToggle={() => {
          if (isVisualized) {
            let temp = [...visualized];
            temp.splice(visualized.indexOf(queue_id), 1);
            setVisualized(temp);
          } else {
            setVisualized([...visualized, queue_id]);
          }
        }}
      />
    </div>
  );
};
