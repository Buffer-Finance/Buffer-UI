import styled from '@emotion/styled';
import React, { useState } from 'react';
import V2BufferInput from '@Views/Common/v2-BufferInput';
import { activeAssetStateAtom, useQTinfo } from '..';
import { getAssetTypes } from './Utils/getAssetTypes';
import { AssetTable } from './AssetTable';
import { AssetTypeSelector } from './AssetTypeSelector';
import { useAtomValue } from 'jotai';

const FavouriteAssetDDStyles = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: fit-content;
  gap: 1.4rem;
  border-radius: 0.4rem;

  .input-full-max {
    max-width: 100%;
  }
`;
export const FavouriteAssetDD: React.FC<{
  className: string;
  setToggle: (state: boolean) => void;
}> = ({ className, setToggle }) => {
  const qtInfo = useQTinfo();
  const [searchText, setSearchText] = useState('');
  const { routerPermission } = useAtomValue(activeAssetStateAtom);

  const assetTypes = getAssetTypes(
    qtInfo.pairs.filter(
      (pair) =>
        routerPermission &&
        routerPermission[pair.pools[0].options_contracts.current]
    )
  );
  const [activeAsset, setActiveAsset] = useState(assetTypes[0]);

  return (
    <>
      <FavouriteAssetDDStyles className={className + ` bg-2`}>
        <V2BufferInput
          onChange={(newValue) => setSearchText(newValue)}
          value={searchText}
          placeholder="Search"
          className="full-width input-full-max"
          isGrey
          unit={
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="31"
                viewBox="0 0 30 31"
                fill="none"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="28.9308"
                  height="30"
                  rx="6.5"
                  fill="#3772FF"
                  stroke="#3772FF"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.8569 7.25048C11.8939 7.37197 10.9547 7.72681 10.1217 8.2839C9.6533 8.59709 8.79692 9.45348 8.48343 9.92218C7.71894 11.0651 7.35584 12.3524 7.41444 13.7122C7.44263 14.3664 7.4866 14.6254 7.67851 15.2672C8.24886 17.1749 9.82523 18.755 11.7714 19.3698C12.8212 19.7015 14.1273 19.7306 15.232 19.4469C15.6713 19.3341 16.3522 19.0426 16.7832 18.7827L17.2305 18.5131L19.7869 21.0646C21.1929 22.468 22.4198 23.6555 22.5133 23.7035C22.8501 23.8764 23.3637 23.7909 23.6722 23.5105C23.954 23.2544 24.0593 22.7155 23.9013 22.3375C23.8569 22.2312 22.9017 21.2397 21.2772 19.6137C19.8724 18.2076 18.7229 17.047 18.7229 17.0345C18.7229 17.0221 18.8305 16.8326 18.9619 16.6133C20.0398 14.8156 20.124 12.5163 19.1807 10.6429C18.6052 9.50013 17.5388 8.43304 16.3996 7.8602C15.3916 7.35326 13.975 7.10946 12.8569 7.25048ZM14.6653 9.41349C16.1952 9.83223 17.3901 11.1054 17.6812 12.6269C17.9477 14.0198 17.5097 15.4191 16.5029 16.391C15.6992 17.1669 14.7426 17.5588 13.6448 17.5621C13.0291 17.5639 12.6392 17.4917 12.0942 17.275C11.5143 17.0443 11.1947 16.8322 10.7216 16.364C10.119 15.7677 9.79224 15.1933 9.58683 14.3691C9.49255 13.991 9.48142 13.8482 9.50349 13.3001C9.53896 12.4186 9.70272 11.8808 10.1474 11.1853C10.7569 10.2317 11.7897 9.54046 12.9031 9.34074C13.2692 9.27509 14.3177 9.31838 14.6653 9.41349Z"
                  fill="white"
                />
              </svg>
            </div>
          }
          hideSearchBar={false}
        />
        <AssetTypeSelector
          assetTypes={assetTypes}
          activeAsset={activeAsset}
          setActiveAsset={(newAsset) => setActiveAsset(newAsset)}
        />
        <div className="full-width">
          <AssetTable
            assetsArray={qtInfo.pairs}
            searchText={searchText}
            activeCategory={activeAsset}
          />
        </div>
      </FavouriteAssetDDStyles>
      {/* <div id="overlay" onClick={handleClickOutside}></div> */}
    </>
  );
};
