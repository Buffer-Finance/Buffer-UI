import { searchBarAtom } from '@Views/AboveBelow/atoms';
import { SearchIconSVG } from '@Views/TradePage/Components/SearchIconSVG';
import { useAtom } from 'jotai';

export const SearchBar: React.FC = () => {
  const [searchText, setSearchText] = useAtom(searchBarAtom);
  return (
    <div className="relative flex flex-row gap-x-4 items-center">
      <input
        value={searchText}
        type="text"
        className={`relative bg-[#1c1c28] b1200:bg-[#282B39] pl-6 pr-3 py-4 rounded-[10px] outline-none w-full text-f12 text-1`}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        placeholder="Search"
      />

      <SearchIconSVG className="absolute right-[6px]" />
    </div>
  );
};
