import BufferCheckbox from '@Views/Common/BufferCheckbox';

export const BufferCheckBoxes = ({
  activeTabs,
  tabList,
  onCheckBoxClick,
}: {
  tabList: string[];
  activeTabs: string[];
  onCheckBoxClick: (selectedTab: string) => void;
}) => {
  //   if (tabList.length < 2) return <></>;
  return (
    <div className="flex items-center gap-5 flex-wrap">
      {' '}
      {tabList.map((tab) => {
        const isActive = activeTabs.includes(tab);
        return (
          <div className="flex items-center gap-2" key={tab}>
            <BufferCheckbox
              svgClasses="h-4 w-4"
              checked={isActive}
              onCheckChange={() => onCheckBoxClick(tab)}
            />
            <div
              className={`text-f15 font-medium ${
                isActive ? 'text-1' : 'text-3'
              }`}
            >
              {/* {poolDisplayKeyMapping[tab]} */}
              {tab}
            </div>
          </div>
        );
      })}
    </div>
  );
};
