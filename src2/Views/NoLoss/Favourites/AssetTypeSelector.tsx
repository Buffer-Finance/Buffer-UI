import styled from '@emotion/styled';
import { BlueBtn } from '@Views/Common/V2-Button';

const AssetTypeSelectorStyles = styled.div`
  display: flex;
  width: fit-content;
  overflow-y: hidden;
  .toggle-tab {
    margin-left: 1.4rem;
    cursor: pointer;
    font-size: 1.6rem;
    font-weight: 400;
    color: var(--text-6);
    transition: 0.2s ease;
    &.active {
      color: var(--text-1);
    }
    &:hover {
      color: var(--text-1);
    }
  }
`;

export function AssetTypeSelector({
  assetTypes,
  activeAsset,
  setActiveAsset,
  onResetMarket,
}: {
  assetTypes: string[];
  onResetMarket?: () => void;
  activeAsset: string;
  setActiveAsset: (activeAssetType: string) => void;
}) {
  return (
    <div className="flex justify-between w-full items-center">
      <AssetTypeSelectorStyles className="flex-center ">
        {assetTypes.map((child, idx) => {
          // if (child === "favourites")
          //   return (
          //     <IconButton onClick={() => setActiveAsset(child)} className="!pr-1">
          //       <Star active={child === activeAsset} />
          //     </IconButton>
          //   );
          // else
          return (
            <div
              key={idx}
              className={`toggle-tab nowrap capitalize ${
                child === activeAsset && 'active'
              }`}
              onClick={() => setActiveAsset(child)}
            >
              {child}
            </div>
          );
        })}
      </AssetTypeSelectorStyles>
      {onResetMarket ? (
        <BlueBtn
          onClick={onResetMarket}
          className="!w-fit px-4 !py-[0px] !bg-[#333333]"
        >
          Reset Layout
        </BlueBtn>
      ) : null}
    </div>
  );
}
