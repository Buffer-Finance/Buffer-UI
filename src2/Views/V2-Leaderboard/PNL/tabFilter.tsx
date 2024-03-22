import { useGlobal } from "Contexts/Global";
import { useRouter } from "next/router";
import styled from "styled-components";

export const FilterBg = styled.div`
  --border-radius: 1.2rem;
  display: flex;
  width: fit-content;
  border-radius: var(--border-radius);
  background-color: #171722;
  overflow-y: hidden;

  .toggle-tab {
    padding: 0.7rem 1.5rem;
    margin: 0.5rem 0.5rem;
    cursor: pointer;
    border-radius: 1.2rem;
    font-size: 1.4rem;
    font-weight: 500;
    color: #808191;
    transition: 0.5s ease-in-out;
    &.active {
      /* font-weight: 500; */
      background-color: #303044;
      color: #f7f7f7;
    }
    &:hover {
      /* color: var(--v2-text-box); */
    }
  }
`;

interface ITabFilter {
  tabs: string[];
  activeTab: string;
  setActiveTab?: (a: string) => void;
  className?: string;
  noRedirect?: boolean;
}
const TabFilter: React.FC<ITabFilter> = ({
  tabs,
  className,
  activeTab,
  noRedirect,
  setActiveTab,
}) => {
  const { dispatch, state } = useGlobal();
  const router = useRouter();

  const handleChange = (tab: string) => {
    dispatch({
      type: "SET_ACIVE_TAB",
      payload: tab,
    });
    !noRedirect && ((router.query.currentTab = tab), router.push(router));
  };

  return (
    <FilterBg className={className}>
      {tabs.map((child, idx) => (
        <div
          key={idx}
          className={`toggle-tab nowrap ${child === activeTab && "active"}`}
          onClick={() =>
            setActiveTab ? setActiveTab(child) : handleChange(child)
          }
        >
          {child}
        </div>
      ))}
    </FilterBg>
  );
};

export default TabFilter;
