import styled from "@emotion/styled";

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
}: {
  assetTypes: string[];
  activeAsset: string;
  setActiveAsset: (activeAssetType: string) => void;
}) {
  return (
    <AssetTypeSelectorStyles className="flex-center content-start">
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
              child === activeAsset && "active"
            }`}
            onClick={() => setActiveAsset(child)}
          >
            {child}
          </div>
        );
      })}
    </AssetTypeSelectorStyles>
  );
}
