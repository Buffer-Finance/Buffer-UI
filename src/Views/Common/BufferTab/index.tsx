import Background from './style';

export interface ITab {
  name: string;
  icon?: JSX.Element;
}

interface IBufferTab {
  value: number;
  handleChange: (event: any, arg: number) => void;
  tablist: ITab[];
  className?: string;
}

const BufferTab: React.FC<IBufferTab> = ({
  value,
  handleChange,
  tablist,
  className,
}) => {
  return (
    <Background className={className + ' text-f15'}>
      <div className="tabs-root flex cursor-pointer">
        {tablist.map((singleTab: ITab, idx) => {
          return (
            <div className="flex items-center root-button">
              <div
                key={singleTab.name}
                onClick={(e) => {
                  handleChange(e, idx);
                }}
                className={`  ${value == idx && 'selected-button'}`}
              >
                {singleTab.name}
              </div>
              {singleTab.icon && singleTab.icon}
            </div>
          );
        })}
      </div>
    </Background>
  );
};

export default BufferTab;
