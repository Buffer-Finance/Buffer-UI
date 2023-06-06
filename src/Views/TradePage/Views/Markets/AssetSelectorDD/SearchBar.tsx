import { SearchIconSVG } from '@Views/TradePage/Components/SearchIconSVG';
import { useState } from 'react';

export const SearchBar: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  return (
    <div className="relative flex flex-row gap-x-4 items-center">
      <input
        value={searchText}
        type="text"
        className={`relative bg-[#1c1c28] pl-6 pr-3 py-4 rounded-[10px] outline-none w-full text-f12 text-1`}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        placeholder="Search"
      />

      <SearchIconSVG className="absolute right-[6px]" />
    </div>
  );
};
