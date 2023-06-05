import { useGlobal } from '@Contexts/Global';
import styled from '@emotion/styled';

const Background = styled.div`
  --border-radius: 1rem;
  display: flex;
  width: 100%;
  border-radius: 5px;
  background-color: #282b39;
  overflow-y: hidden;
  padding: 2px;
  color: #7f87a7;

  .toggle-tab {
    padding: 2px 0;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: 0.2s ease;
    border-radius: 4px;
    flex: 1;
    text-align: center;

    &.active {
      background-color: #141823;
      color: var(--text-1);
    }
    &:hover {
      color: var(--text-1);
    }
  }
`;
interface ITabList {
  tabs: string[];
  activeTab: string;
  setActiveTab: (a: string) => void;
  className?: string;
}
export const BuyTradeTabList: React.FC<ITabList> = ({
  tabs,
  className,
  activeTab,
  setActiveTab,
}) => {
  return (
    <Background className={className}>
      {tabs.map((child, idx) => (
        <div
          key={idx}
          className={`toggle-tab nowrap ${child === activeTab && 'active'}`}
          onClick={() => setActiveTab(child)}
        >
          {child}
        </div>
      ))}
    </Background>
  );
};
