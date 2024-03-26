import { useCategories } from '@Views/ABTradePage/Hooks/useCategories';
import { categoriesAtom } from '@Views/ABTradePage/atoms';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import { useState } from 'react';

const CategoryTabsBackground = styled.div`
  display: flex;
  width: fit-content;
  overflow-y: hidden;
  gap: 24px;
  .toggle-tab {
    cursor: pointer;
    font-size: 12px;
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

export const CategoryTabs: React.FC = () => {
  const { categories: assetTypes } = useCategories();
  const [activeAsset, setActiveAsset] = useAtom(categoriesAtom);

  return (
    <CategoryTabsBackground className="flex-center ">
      {assetTypes.map((child, idx) => {
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
    </CategoryTabsBackground>
  );
};
